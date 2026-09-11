/**
 * DeviceFrame — renders the physical iPhone Duo shell.
 *
 * Geometry derived from the official Apple Store reference diagram:
 *
 *  Single (5.4" outer cover display, portrait):
 *    · Thin ~10 px bezel, ALL FOUR corners rounded equally (~18 px)
 *    · Small connector bracket tabs at the four corners (top/bottom edges)
 *    · Two hinge nubs protruding from the right edge near top-right and bottom-right
 *    · Frame colour: graphite (not pure black) — matches premium titanium finish
 *    · No Dynamic Island (outer cover display)
 *
 *  Extended (7.6" inner main display, landscape):
 *    · Thin ~10 px bezel, all corners uniformly rounded
 *    · Volume buttons top-right, side button + camera control on right edge
 *    · Same graphite finish
 *
 *  NOTE: This component renders a SINGLE DOM tree so the `children` (iframe)
 *  are never unmounted when switching modes, preventing the website from reloading!
 */

import type { CSSProperties, ReactNode } from 'react';
import { DEVICE, type DisplayMode, getDeviceDimensions } from '@/lib/devices';

interface DeviceFrameProps {
  mode: DisplayMode;
  children: ReactNode;
}

// ─── Shared visual tokens ──────────────────────────────────────────────────

// Graphite / titanium — rich dark with slight warmth, not pure black
const SHELL =
  'linear-gradient(155deg, #3c3c3e 0%, #2c2c2e 30%, #1e1e20 60%, #141416 100%)';

const SHELL_SHADOW = [
  'inset 0 1px 0 rgba(255,255,255,0.10)',
  'inset 0 -1px 0 rgba(0,0,0,0.55)',
  '0 0 0 1px rgba(0,0,0,0.8)',
  '0 40px 100px rgba(0,0,0,0.55)',
  '0 14px 40px rgba(0,0,0,0.35)',
].join(', ');

// Buttons / nubs are slightly lighter graphite to look like separate metal pieces
const GRAPHITE_ELEMENT =
  'linear-gradient(135deg, #3a3a3c 0%, #2c2c2e 50%, #242426 100%)';

function Btn({ style, hidden }: { style: CSSProperties; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div
      style={{
        position: 'absolute',
        background: GRAPHITE_ELEMENT,
        ...style,
      }}
    />
  );
}

// ─── Public component ──────────────────────────────────────────────────────

export default function DeviceFrame({ mode, children }: DeviceFrameProps) {
  const d = DEVICE;
  const dims = getDeviceDimensions(mode);
  const r = 18; // corner radius — ALL four corners rounded equally in both modes
  const isSingle = mode === 'single';

  return (
    <div
      style={{
        position: 'relative',
        width: dims.totalWidth,
        height: dims.totalHeight,
        background: SHELL,
        borderRadius: r,
        boxShadow: SHELL_SHADOW,
        flexShrink: 0,
        // userSelect removed to prevent issues with child interactions
      }}
    >
      {/* ── Single Mode Buttons & Nubs ──────────────────────────────── */}
      
      {/* Left: Volume Up */}
      <Btn
        hidden={!isSingle}
        style={{
          left: -4,
          top: 120,
          width: 4,
          height: 44,
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 4px rgba(0,0,0,0.5)',
        }}
      />
      {/* Left: Volume Down */}
      <Btn
        hidden={!isSingle}
        style={{
          left: -4,
          top: 120 + 44 + 12,
          width: 4,
          height: 44,
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 4px rgba(0,0,0,0.5)',
        }}
      />

      {/* Corner bracket tabs — top edge */}
      <Btn
        hidden={!isSingle}
        style={{
          top: -1,
          left: r - 4,
          width: 20,
          height: 4,
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 -1px 3px rgba(0,0,0,0.4)',
        }}
      />
      <Btn
        hidden={!isSingle}
        style={{
          top: -1,
          right: r - 4,
          width: 20,
          height: 4,
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 -1px 3px rgba(0,0,0,0.4)',
        }}
      />

      {/* Corner bracket tabs — bottom edge */}
      <Btn
        hidden={!isSingle}
        style={{
          bottom: -1,
          left: r - 4,
          width: 20,
          height: 4,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
      <Btn
        hidden={!isSingle}
        style={{
          bottom: -1,
          right: r - 4,
          width: 20,
          height: 4,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />

      {/* Right-edge hinge nubs */}
      <Btn
        hidden={!isSingle}
        style={{
          right: -6,
          top: r + 4,
          width: 6,
          height: 28,
          borderRadius: '0 3px 3px 0',
          boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        }}
      />
      <Btn
        hidden={!isSingle}
        style={{
          right: -6,
          bottom: r + 4,
          width: 6,
          height: 28,
          borderRadius: '0 3px 3px 0',
          boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        }}
      />

      {/* ── Extended Mode Buttons ────────────────────────────────────── */}
      
      {/* Top-edge: Volume Up */}
      <Btn
        hidden={isSingle}
        style={{
          top: -4,
          right: 160,
          width: 44,
          height: 4,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 -1px 4px rgba(0,0,0,0.5)',
        }}
      />
      {/* Top-edge: Volume Down */}
      <Btn
        hidden={isSingle}
        style={{
          top: -4,
          right: 160 - 44 - 12,
          width: 44,
          height: 4,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 -1px 4px rgba(0,0,0,0.5)',
        }}
      />

      {/* Right edge: Side button */}
      <Btn
        hidden={isSingle}
        style={{
          right: -4,
          top: 110,
          width: 4,
          height: 60,
          borderRadius: '0 2px 2px 0',
          boxShadow: '1px 0 4px rgba(0,0,0,0.5)',
        }}
      />
      {/* Right edge: Camera Control */}
      <Btn
        hidden={isSingle}
        style={{
          right: -4,
          top: 110 + 60 + 16,
          width: 4,
          height: 40,
          borderRadius: '0 2px 2px 0',
          boxShadow: '1px 0 4px rgba(0,0,0,0.5)',
        }}
      />

      {/* ── Screen ───────────────────────────────────────────────────── */}
      {/* 
        This is the most critical part: the screen container stays in the exact 
        same React tree position so the iframe inside `children` never unmounts. 
      */}
      <div
        style={{
          position: 'absolute',
          top: d.bezel,
          left: d.bezel,
          width: dims.viewportWidth,
          height: dims.viewportHeight,
          borderRadius: r - d.bezel, // inner radius = outer minus bezel = 8px
          overflow: 'hidden',
          background: '#000',
          isolation: 'isolate',
          // Ensure scrolling on iOS/mobile devices works smoothly inside iframes
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
}
