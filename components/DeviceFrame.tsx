/**
 * DeviceFrame — renders the physical iPhone Duo shell.
 *
 * Designed to exactly replicate the clean, minimal aesthetic from the reference:
 *  - Thick outer graphite/gray border
 *  - Thick black inner bezel
 *  - No buttons, nubs, or tabs (pure clean frame)
 *  - Single mode: front camera hole in top right
 *  - Extended mode: subtle vertical hinge crease down the center
 */

import type { ReactNode } from 'react';
import { DEVICE, type DisplayMode, getDeviceDimensions } from '@/lib/devices';

interface DeviceFrameProps {
  mode: DisplayMode;
  children: ReactNode;
}

export default function DeviceFrame({ mode, children }: DeviceFrameProps) {
  const d = DEVICE;
  const dims = getDeviceDimensions(mode);
  const isSingle = mode === 'single';

  return (
    <div
      style={{
        position: 'relative',
        width: dims.totalWidth,
        height: dims.totalHeight,
        // The inner black bezel
        background: '#111112',
        borderRadius: d.outerRadius,
        // The outer graphite/gray metal border + shadow
        boxSizing: 'content-box',
        border: '4px solid #4a4a4d',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4), 0 14px 40px rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}
    >
      {/* ── Single Mode: Front Camera Hole ────────────────────────────────── */}
      {isSingle && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#050505',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05)',
            zIndex: 10,
          }}
        />
      )}

      {/* ── Extended Mode: Vertical Hinge Crease ─────────────────────────── */}
      {!isSingle && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: 2,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Screen ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: d.bezel,
          left: d.bezel,
          width: dims.viewportWidth,
          height: dims.viewportHeight,
          borderRadius: d.screenRadius,
          overflow: 'hidden',
          background: '#000',
          isolation: 'isolate',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
}
