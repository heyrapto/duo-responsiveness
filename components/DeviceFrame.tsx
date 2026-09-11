/**
 * DeviceFrame — renders the physical iPhone Duo shell around the website preview.
 *
 * All dimensions are sourced from lib/devices.ts — nothing is hard-coded here.
 *
 * Single mode:  main screen (iframe) + physical hinge + decorative side panel
 * Extended mode: two screens side-by-side; iframe spans full width; hinge overlaid
 */

import type { ReactNode, CSSProperties } from 'react';
import { DEVICE, type DisplayMode, getDeviceDimensions } from '@/lib/devices';

interface DeviceFrameProps {
  mode: DisplayMode;
  /** The iframe (or error overlay) rendered inside the screen area */
  children: ReactNode;
}

// ─── Shared colour palette ─────────────────────────────────────────────────

const SHELL_BG =
  'linear-gradient(155deg, #2E3B56 0%, #1D2B46 35%, #141D35 70%, #101729 100%)';

const HINGE_BG =
  'linear-gradient(90deg, #060A13 0%, #0D1526 50%, #060A13 100%)';

const HINGE_HIGHLIGHT: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 1,
  height: '100%',
  background:
    'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent 100%)',
};

// ─── Sub-components ────────────────────────────────────────────────────────

/** The physical hinge strip (single mode — between screen and side panel) */
function HingeStrip() {
  return (
    <div
      style={{
        width: DEVICE.hingeWidth,
        height: DEVICE.screenHeight,
        flexShrink: 0,
        background: HINGE_BG,
        position: 'relative',
      }}
    >
      <div style={HINGE_HIGHLIGHT} />
    </div>
  );
}

/** Decorative side action panel visible in single display mode */
function SidePanel() {
  return (
    <div
      style={{
        width: DEVICE.sidePanelWidth,
        height: DEVICE.screenHeight,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #0C1220 0%, #0E1626 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        gap: 20,
        overflow: 'hidden',
      }}
    >
      {/* Camera module */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 38%, #24304A, #080D1A)',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.09), inset 0 2px 6px rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Lens */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 38%, #1A1F30, #04060F)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.14), 0 0 0 1px rgba(0,0,0,0.8)',
          }}
        />
      </div>

      {/* Clock */}
      <span
        style={{
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        9:41
      </span>

      {/* Signal bars (wifi) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {[20, 14, 8].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 2,
              background: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
            }}
          />
        ))}
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }}
        />
      </div>

      {/* Action icon slots */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function DeviceFrame({ mode, children }: DeviceFrameProps) {
  const dims = getDeviceDimensions(mode);
  const d = DEVICE;

  // Inner screen area dimensions (between the bezels)
  const innerWidth = dims.totalWidth - d.bezelSide * 2;

  return (
    <div
      style={{
        position: 'relative',
        width: dims.totalWidth,
        height: dims.totalHeight,
        background: SHELL_BG,
        borderRadius: d.borderRadius,
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.1)',
          'inset 0 -1px 0 rgba(0,0,0,0.45)',
          '0 0 0 1.5px rgba(0,0,0,0.75)',
          '0 50px 120px rgba(0,0,0,0.6)',
          '0 20px 50px rgba(0,0,0,0.4)',
        ].join(', '),
        // Prevent the device from being selectable/draggable
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* ── Left volume buttons ─────────────────────────────────────── */}
      <PhysicalButton
        style={{
          left: -d.volumeButtonWidth,
          top: 130,
          width: d.volumeButtonWidth,
          height: d.volumeButtonHeight,
          borderRadius: '2px 0 0 2px',
          background: 'linear-gradient(90deg, #090D1A 0%, #182036 100%)',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.6)',
        }}
      />
      <PhysicalButton
        style={{
          left: -d.volumeButtonWidth,
          top: 130 + d.volumeButtonHeight + 14,
          width: d.volumeButtonWidth,
          height: d.volumeButtonHeight,
          borderRadius: '2px 0 0 2px',
          background: 'linear-gradient(90deg, #090D1A 0%, #182036 100%)',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.6)',
        }}
      />

      {/* ── Right power button ─────────────────────────────────────── */}
      <PhysicalButton
        style={{
          right: -d.powerButtonWidth,
          top: 170,
          width: d.powerButtonWidth,
          height: d.powerButtonHeight,
          borderRadius: '0 2px 2px 0',
          background: 'linear-gradient(270deg, #090D1A 0%, #182036 100%)',
          boxShadow: '1px 0 3px rgba(0,0,0,0.6)',
        }}
      />

      {/* ── Screen area (clips content to the bezel boundary) ─────── */}
      <div
        style={{
          position: 'absolute',
          top: d.bezelTop,
          left: d.bezelSide,
          width: innerWidth,
          height: d.screenHeight,
          borderRadius: d.innerRadius,
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {mode === 'single' ? (
          <>
            {/* Main screen */}
            <div
              style={{
                width: d.screenWidth,
                height: d.screenHeight,
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {children}
            </div>
            <HingeStrip />
            <SidePanel />
          </>
        ) : (
          /* Extended: iframe spans full combined width, hinge is overlaid */
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}

            {/* Non-interactive hinge overlay — sits on top of iframe */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: d.screenWidth,
                width: d.hingeWidth,
                height: '100%',
                background: HINGE_BG,
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <div style={HINGE_HIGHLIGHT} />
            </div>
          </div>
        )}
      </div>

      {/* ── Dynamic Island ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: d.bezelTop + 12,
          // Centre over the main display in both modes
          left:
            d.bezelSide +
            (mode === 'single'
              ? d.screenWidth / 2 - d.islandWidth / 2
              : (d.screenWidth * 2 + d.hingeWidth) / 2 - d.islandWidth / 2),
          width: d.islandWidth,
          height: d.islandHeight,
          background: '#000',
          borderRadius: d.islandRadius,
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

      {/* ── Bottom home indicator bar ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 5,
          background: 'rgba(255,255,255,0.28)',
          borderRadius: 3,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/** Thin absolutely-positioned element that mimics a physical side button */
function PhysicalButton({ style }: { style: CSSProperties }) {
  return <div style={{ position: 'absolute', ...style }} />;
}
