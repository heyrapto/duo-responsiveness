/**
 * iPhone Duo — central device configuration.
 *
 * Values derived from the official Apple Store specification page,
 * updated to match the clean minimal aesthetic reference.
 */

export type DisplayMode = 'single' | 'extended';

export const DEVICE = {
  name: 'iPhone Duo',

  // ── Outer / Cover display  (Single mode) ──────────────────────────────────
  outerDisplay: {
    diagonal: 5.4,
    cssWidth: 466,
    cssHeight: 678,
  },

  // ── Inner / Main display  (Extended mode) ─────────────────────────────────
  innerDisplay: {
    diagonal: 7.6,
    cssWidth: 890,
    cssHeight: 626,
  },

  // ── Bezels ────────────────────────────────────────────────────────────────
  // Clean minimal aesthetic: thick black inner bezel, wrapped by a gray border
  bezel: 18, 

  // ── Corner radii ──────────────────────────────────────────────────────────
  // Both modes use heavy, uniform rounding on all four corners.
  outerRadius: 40,
  screenRadius: 22, // 40 - 18
} as const;

export interface DeviceDimensions {
  totalWidth: number;
  totalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

export function getDeviceDimensions(mode: DisplayMode): DeviceDimensions {
  const d = DEVICE;
  const b = d.bezel;

  if (mode === 'single') {
    return {
      totalWidth:  b + d.outerDisplay.cssWidth  + b,
      totalHeight: b + d.outerDisplay.cssHeight + b,
      viewportWidth:  d.outerDisplay.cssWidth,
      viewportHeight: d.outerDisplay.cssHeight,
    };
  }

  return {
    totalWidth:  b + d.innerDisplay.cssWidth  + b,
    totalHeight: b + d.innerDisplay.cssHeight + b,
    viewportWidth:  d.innerDisplay.cssWidth,
    viewportHeight: d.innerDisplay.cssHeight,
  };
}
