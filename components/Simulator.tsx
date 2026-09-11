'use client';

/**
 * Simulator — manages state, auto-scaling, and iframe lifecycle.
 *
 * Scaling strategy:
 *   The device shell is rendered at its natural CSS pixel size (e.g. 502 × 932 px).
 *   A ResizeObserver watches the available container and applies a CSS
 *   transform: scale(n) so the device fits visually.  The iframe inside retains
 *   its full CSS dimensions so the tested website responds to the correct
 *   viewport breakpoints.
 *
 * X-Frame-Options / CSP detection (best-effort):
 *   - After the iframe fires onLoad we attempt to read contentDocument.
 *   - If that throws a SecurityError the frame is cross-origin but loaded fine.
 *   - If we can read contentDocument and the body is empty the frame was likely
 *     blocked; we show an error overlay.
 *   - Cross-origin blocked frames cannot be reliably detected; the user will see
 *     the browser's own blocked-frame message inside the device.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SyntheticEvent,
} from 'react';
import Link from 'next/link';
import DeviceFrame from './DeviceFrame';
import DisplayToggle from './DisplayToggle';
import { type DisplayMode, getDeviceDimensions } from '@/lib/devices';

interface SimulatorProps {
  url: string;
}

export default function Simulator({ url }: SimulatorProps) {
  const [mode, setMode] = useState<DisplayMode>('single');
  const [iframeKey, setIframeKey] = useState(0);
  const [embedError, setEmbedError] = useState(false);
  const [scale, setScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const dims = getDeviceDimensions(mode);

  // ── Auto-scale whenever container size or device dimensions change ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function computeScale() {
      const { width: availW, height: availH } =
        container!.getBoundingClientRect();
      const padding = 48; // breathing room around the device
      const scaleByWidth = (availW - padding) / dims.totalWidth;
      const scaleByHeight = (availH - padding) / dims.totalHeight;
      const next = Math.max(Math.min(scaleByWidth, scaleByHeight, 1), 0.15);
      setScale(next);
    }

    computeScale(); // run immediately so mode switches update scale at once

    const observer = new ResizeObserver(computeScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [dims.totalWidth, dims.totalHeight]);

  // ── Reset error flag whenever the URL or key changes ───────────────
  useEffect(() => {
    setEmbedError(false);
  }, [url, iframeKey]);

  // ── Iframe load handler ────────────────────────────────────────────
  const handleLoad = useCallback((_e: SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Cross-origin frames throw SecurityError here — that means the site
      // loaded successfully (we just can't inspect it).
      const doc = iframe.contentDocument;
      if (doc) {
        // We have same-origin access.  An empty body means the frame was
        // likely blocked or the URL returned an empty response.
        const len = doc.body?.innerHTML?.length ?? 0;
        if (len === 0) {
          setEmbedError(true);
        }
      }
    } catch {
      // SecurityError → cross-origin frame loaded fine.
      setEmbedError(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIframeKey((k) => k + 1);
    setEmbedError(false);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-200 bg-white shrink-0">
        {/* Back to home */}
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
          title="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* URL pill */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-zinc-100">
          <GlobeIcon />
          <span className="text-xs text-zinc-500 truncate font-mono leading-none">
            {url}
          </span>
        </div>

        {/* Display mode toggle */}
        <DisplayToggle mode={mode} onChange={setMode} />

        {/* Refresh */}
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* ── Preview area ─────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-zinc-50"
        style={{
          // Subtle dot grid background
          backgroundImage:
            'radial-gradient(circle, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Device — absolutely centred, scaled to fit */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <DeviceFrame mode={mode}>
            {embedError ? (
              <EmbedErrorOverlay dims={dims} />
            ) : (
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={url}
                onLoad={handleLoad}
                title="Website Preview"
                style={{
                  width: dims.viewportWidth,
                  height: dims.viewportHeight,
                  border: 'none',
                  display: 'block',
                }}
              />
            )}
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}

// ─── Small presentational helpers ─────────────────────────────────────────

function EmbedErrorOverlay({
  dims,
}: {
  dims: ReturnType<typeof getDeviceDimensions>;
}) {
  return (
    <div
      style={{
        width: dims.viewportWidth,
        height: dims.viewportHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f5',
        gap: 14,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 36, lineHeight: 1 }}>🚫</span>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: '#52525b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: 260,
        }}
      >
        This website doesn&apos;t allow embedded previews.
      </p>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 text-zinc-400"
      aria-hidden
    >
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 1C6 1 4 3.5 4 6s2 5 2 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 1c0 0 2 2.5 2 5s-2 5-2 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1.5 4h9M1.5 8h9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M13.5 7.5a6 6 0 1 1-1.757-4.243"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.5 2.5v3h-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
