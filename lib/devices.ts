/**
 * iPhone Duo — central device configuration.
 *
 * Values derived from the official Apple Store specification page.
 * See docs/iphone-duo-specs.md for full detail.
 *
 * CSS viewport dimensions use the standard 3× Retina scale factor.
 */

export type DisplayMode = 'single' | 'extended';

export const DEVICE = {
  name: 'iPhone Duo',

  // ── Outer / Cover display  (Single mode — device closed, portrait) ─────
  outerDisplay: {
    diagonal: 5.4,
    physicalWidth: 1398,
    physicalHeight: 2034,
    ppi: 460,
    scaleFactor: 3,
    cssWidth: 466,   // 1398 ÷ 3
    cssHeight: 678,  // 2034 ÷ 3
    type: 'Super Retina XDR OLED',
  },

  // ── Inner / Main display  (Extended mode — device open, landscape) ─────
  innerDisplay: {
    diagonal: 7.6,
    physicalWidth: 1878,
    physicalHeight: 2670,
    ppi: 430,
    scaleFactor: 3,
    cssWidth: 890,   // 2670 ÷ 3  (portrait height → landscape width)
    cssHeight: 626,  // 1878 ÷ 3  (portrait width → landscape height)
    type: 'Super Retina XDR OLED folding, Nano-texture, Wide-angle OLEDs',
  },

  // ── Bezels ────────────────────────────────────────────────────────────
  // Both modes use thin, uniform bezels matching the reference diagrams.
  // The single mode has NO thick top bezel — the outer cover display has no
  // Dynamic Island or notch; it uses the same thin bezel on all four sides.
  bezel: 10, // px — uniform for all sides and both modes

  // ── Corner radii ─────────────────────────────────────────────────────
  // Single (portrait, outer cover display):
  //   Left side corners are rounded; right side is near-square — that's the
  //   fold/hinge edge that connects to the inner display when open.
  singleRadius: {
    topLeft: 18,
    topRight: 6,
    bottomRight: 6,
    bottomLeft: 18,
  },
  // Screen inner radii match (outer radius - bezel)
  singleScreenRadius: {
    topLeft: 10,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 10,
  },

  // Extended (landscape, inner display):
  //   All corners uniformly rounded since both halves unfold symmetrically.
  extendedRadius: 18,
  extendedScreenRadius: 10,

  // ── Hinge joint nubs (single mode, right side) ────────────────────────
  // Small rectangular protrusions on the right edge of the cover display
  // showing where the fold mechanism connects.
  hingeJoint: {
    width: 4,
    height: 14,
    insetFromCorner: 18, // distance from the right-side corner
  },

  // ── Physical buttons ─────────────────────────────────────────────────
  btn: {
    volumeW: 4,
    volumeH: 44,
    sideW: 4,
    sideH: 60,
    cameraControlW: 4,
    cameraControlH: 40,
    // Extended mode top-edge volume buttons
    volumeTopW: 44,
    volumeTopH: 4,
  },
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
