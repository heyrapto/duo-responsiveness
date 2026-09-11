'use client';

/**
 * Simulator — manages display mode, auto-scaling, iframe lifecycle,
 * and the premium flip-open / fold-closed transition animation.
 *
 * ─── Animation design ──────────────────────────────────────────────────────
 *
 *   0 ms  → Phase "in": device tilts (rotateY ±16°), glass overlay fades in.
 *  280 ms → Mode switch (hidden by glass): layout changes, rotation mirror-jumps,
 *            hinge gleam fires.
 *  290 ms → Phase "out": glass lifts, tilt settles, new orientation revealed.
 *  680 ms → Idle.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SyntheticEvent,
  type SubmitEvent,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiArrowLeft, FiGlobe, FiLoader, FiRefreshCw, FiX } from 'react-icons/fi';
import DeviceFrame from './DeviceFrame';
import DisplayToggle from './DisplayToggle';
import { type DisplayMode, getDeviceDimensions } from '@/lib/devices';
import { checkEmbeddable } from '@/app/actions';

interface SimulatorProps {
  url: string;
}

interface AnimValues {
  rotation: number;
  rotDuration: number;
  glassOpacity: number;
  glassDuration: number;
  scaleFactor: number;
  scaleDuration: number;
  showGleam: boolean;
}

const ANIM_IDLE: AnimValues = {
  rotation: 0,
  rotDuration: 0,
  glassOpacity: 0,
  glassDuration: 0,
  scaleFactor: 1,
  scaleDuration: 0,
  showGleam: false,
};

/** Strip protocol + trailing slash for clean display */
function displayUrl(raw: string): string {
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Ensure the URL has a protocol prefix */
function normalizeUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export default function Simulator({ url }: SimulatorProps) {
  const router = useRouter();

  const [mode, setMode] = useState<DisplayMode>('single');
  const [iframeKey, setIframeKey] = useState(0);
  const [embedError, setEmbedError] = useState(false);
  const [showLoadError, setShowLoadError] = useState(false);
  const [autoScale, setAutoScale] = useState(1);
  const [anim, setAnim] = useState<AnimValues>(ANIM_IDLE);
  const [isUrlLoading, setIsUrlLoading] = useState(true);

  // ── Editable URL bar state ───────────────────────────────────────────────
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(displayUrl(url));
  const urlInputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const animatingRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastSuccessfulUrlRef = useRef<string | null>(null);

  const dims = getDeviceDimensions(mode);

  // Focus the URL input when entering edit mode
  useEffect(() => {
    if (editingUrl) {
      urlInputRef.current?.select();
    }
  }, [editingUrl]);

  // Keep urlDraft in sync when the url prop changes (e.g. after router.push)
  useEffect(() => {
    setUrlDraft(displayUrl(url));
  }, [url]);

  // ── Auto-scale ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function compute() {
      const { width: w, height: h } = el!.getBoundingClientRect();
      const pad = 48;
      const sw = (w - pad) / dims.totalWidth;
      const sh = (h - pad) / dims.totalHeight;
      setAutoScale(Math.max(Math.min(sw, sh, 1), 0.12));
    }

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dims.totalWidth, dims.totalHeight]);

  // ── Reset error and trigger loading on URL / key change ────────────────
  useEffect(() => {
    setEmbedError(false);
    setIsUrlLoading(true);
    let active = true;

    checkEmbeddable(url).then((canEmbed) => {
      if (!active) return;
      if (!canEmbed) {
        handleEmbedFailure();
      }
    });

    return () => {
      active = false;
    };
  }, [url, iframeKey]);

  // ── Iframe load handler ──────────────────────────────────────────────────
  const handleEmbedFailure = useCallback(() => {
    if (showLoadError) return;
    setIsUrlLoading(false);
    setEmbedError(true);
    setShowLoadError(true);
  }, [showLoadError]);

  const handleLoad = useCallback(() => {
    if (embedError) return; // already failed the server check
    setIsUrlLoading(false);
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (doc) {
        const len = doc.body?.innerHTML?.length ?? 0;
        if (len === 0) {
          handleEmbedFailure();
          return;
        }
      }
    } catch {
      // SecurityError → cross-origin, loaded fine
    }
    lastSuccessfulUrlRef.current = url;
    sessionStorage.setItem('duo-last-successful-url', url);
  }, [handleEmbedFailure, url, embedError]);

  // ── Refresh ──────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIframeKey((k) => k + 1);
    setEmbedError(false);
    setIsUrlLoading(true);
  }, []);

  // ── URL bar submission ───────────────────────────────────────────────────
  function submitUrl(raw: string) {
    setEditingUrl(false);
    const normalized = normalizeUrl(raw);
    if (!normalized || normalized === url) return;
    
    // Instantly show the loader before Next.js begins the router transition
    setIsUrlLoading(true);
    router.push(`/test?url=${encodeURIComponent(normalized)}`);
  }

  function handleUrlSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    submitUrl(urlDraft);
  }

  function handleUrlKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setEditingUrl(false);
      setUrlDraft(displayUrl(url));
    }
  }

  // ── Flip animation ───────────────────────────────────────────────────────
  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function handleModeChange(nextMode: DisplayMode) {
    if (nextMode === mode || animatingRef.current) return;
    animatingRef.current = true;
    clearTimers();

    const dir = nextMode === 'extended' ? -1 : 1;

    setAnim({
      rotation: dir * -16,
      rotDuration: 280,
      glassOpacity: 1,
      glassDuration: 220,
      scaleFactor: 0.97,
      scaleDuration: 280,
      showGleam: false,
    });

    timersRef.current.push(
      setTimeout(() => {
        setMode(nextMode);
        setAnim((prev) => ({
          ...prev,
          rotation: dir * 16,
          rotDuration: 0,
          showGleam: true,
        }));
      }, 280),
    );

    timersRef.current.push(
      setTimeout(() => {
        setAnim({
          rotation: 0,
          rotDuration: 390,
          glassOpacity: 0,
          glassDuration: 360,
          scaleFactor: 1,
          scaleDuration: 390,
          showGleam: false,
        });
      }, 290),
    );

    timersRef.current.push(
      setTimeout(() => {
        setAnim(ANIM_IDLE);
        animatingRef.current = false;
      }, 680),
    );
  }

  useEffect(() => () => clearTimers(), []);

  const isAnimating = anim.glassOpacity > 0 || anim.rotation !== 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 bg-white shrink-0">

        {/* Back */}
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Back to home"
        >
          <BackIcon />
        </Link>

        {/* Editable URL bar */}
        <div className="flex-1 min-w-0">
          {editingUrl ? (
            <form onSubmit={handleUrlSubmit} className="w-full">
              <input
                ref={urlInputRef}
                type="text"
                value={urlDraft.toLowerCase()}
                onChange={(e) => setUrlDraft(e.target.value.toLowerCase())}
                onBlur={() => submitUrl(urlDraft)}
                onKeyDown={handleUrlKeyDown}
                placeholder="example.com"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full h-8 px-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUrlDraft(displayUrl(url).toLowerCase());
                setEditingUrl(true);
              }}
              className="flex items-center gap-1.5 w-full h-8 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors text-left group"
              title="Click to change URL"
            >
              <GlobeIcon />
              <span className="text-xs text-zinc-600 truncate font-mono leading-none group-hover:text-zinc-900 transition-colors">
                {displayUrl(url).toLowerCase()}
              </span>
            </button>
          )}
        </div>

        {/* Display mode toggle */}
        <DisplayToggle
          mode={mode}
          onChange={handleModeChange}
          disabled={isAnimating}
        />

        {/* Refresh */}
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* ── Preview area ──────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 overflow-hidden bg-zinc-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Outer wrapper: centres + auto-scales */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${autoScale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Inner wrapper: animation transforms */}
          <div
            style={{
              transform: `perspective(1400px) rotateY(${anim.rotation}deg) scale(${anim.scaleFactor})`,
              transition: `transform ${anim.rotDuration}ms cubic-bezier(0.4, 0, 0.6, 1)`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            <DeviceFrame mode={mode}>
              {embedError ? (
                <div
                  style={{
                    width: dims.viewportWidth,
                    height: dims.viewportHeight,
                    background: '#f4f4f5',
                  }}
                />
              ) : (
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={url}
                  onLoad={handleLoad}
                  onError={handleEmbedFailure}
                  title="Website Preview"
                  style={{
                    width: dims.viewportWidth,
                    height: dims.viewportHeight,
                    border: 'none',
                    display: 'block',
                    // Force the embedded site to render in light mode,
                    // regardless of the OS color-scheme preference.
                    colorScheme: 'light',
                  }}
                />
              )}

              {/* Frosted-glass overlay during the flip animation */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(160,185,255,0.18) 0%, rgba(255,255,255,0.42) 50%, rgba(160,185,255,0.18) 100%)',
                  backdropFilter: `blur(${anim.glassOpacity * 22}px) brightness(${1 + anim.glassOpacity * 0.12})`,
                  opacity: anim.glassOpacity,
                  transition: `opacity ${anim.glassDuration}ms ease, backdrop-filter ${anim.glassDuration}ms ease`,
                  pointerEvents: 'none',
                  zIndex: 50,
                  borderRadius: 'inherit',
                }}
              />

              {/* Loading overlay for the website */}
              {isUrlLoading && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'inherit',
                  }}
                >
                  <FiLoader className="animate-spin h-8 w-8 text-zinc-800" aria-hidden />
                </div>
              )}

              {/* Hinge gleam flash at the moment the mode switches */}
              {anim.showGleam && (
                <div
                  aria-hidden
                  className="hinge-gleam"
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 3,
                    background:
                      'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 60,
                  }}
                />
              )}
            </DeviceFrame>
          </div>
        </div>
      </div>

      {showLoadError && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="load-error-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/35 px-6 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLoadError(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Dismiss error"
            >
              <FiX aria-hidden />
            </button>
            <FiAlertTriangle className="mx-auto mb-4 h-9 w-9 text-amber-500" aria-hidden />
            <h2 id="load-error-title" className="text-base font-semibold text-zinc-900 mb-6">
              This website doesn&apos;t allow embedded previews.
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowLoadError(false);
                setEditingUrl(true);
              }}
              className="w-full h-11 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
            >
              Try another one
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BackIcon() {
  return <FiArrowLeft aria-hidden />;
}

function GlobeIcon() {
  return <FiGlobe className="shrink-0 text-zinc-400" aria-hidden />;
}

function RefreshIcon() {
  return <FiRefreshCw aria-hidden />;
}
