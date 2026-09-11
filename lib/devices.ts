/**
 * iPhone Duo — central device configuration.
 *
 * All CSS pixel values are declared here so the device simulation can be
 * adjusted from one place without hunting through component files.
 */

export type DisplayMode = 'single' | 'extended';

export const DEVICE = {
  name: 'iPhone Duo',

  // ── Screen viewport (what the embedded website "sees") ──────────────
  screenWidth: 390,  // CSS px – per panel
  screenHeight: 844, // CSS px

  // ── Physical device shell ────────────────────────────────────────────
  bezelTop: 54,       // top bezel height (includes Dynamic Island area)
  bezelBottom: 34,    // bottom bezel (home indicator area)
  bezelSide: 10,      // left and right outer shell width
  hingeWidth: 14,     // physical fold/hinge between the two displays
  borderRadius: 44,   // outer corner radius
  innerRadius: 34,    // inner screen corner radius

  // ── Decorative side action panel (single mode only) ──────────────────
  sidePanelWidth: 74,

  // ── Dynamic Island ───────────────────────────────────────────────────
  islandWidth: 120,
  islandHeight: 36,
  islandRadius: 20,

  // ── Physical buttons (decorative, rendered as CSS shapes) ────────────
  volumeButtonWidth: 4,
  volumeButtonHeight: 46,
  powerButtonWidth: 4,
  powerButtonHeight: 68,
} as const;

export interface DeviceDimensions {
  /** Total pixel width of the outer device shell */
  totalWidth: number;
  /** Total pixel height of the outer device shell */
  totalHeight: number;
  /** Width the embedded website experiences (iframe width) */
  viewportWidth: number;
  /** Height the embedded website experiences (iframe height) */
  viewportHeight: number;
}

/**
 * Returns the outer device shell size and the iframe viewport size for a
 * given display mode.
 *
 * Single  → one screen + decorative side panel
 * Extended → both screens side-by-side; combined viewport width
 */
export function getDeviceDimensions(mode: DisplayMode): DeviceDimensions {
  const d = DEVICE;

  if (mode === 'single') {
    return {
      totalWidth:
        d.bezelSide + d.screenWidth + d.hingeWidth + d.sidePanelWidth + d.bezelSide,
      totalHeight: d.bezelTop + d.screenHeight + d.bezelBottom,
      viewportWidth: d.screenWidth,
      viewportHeight: d.screenHeight,
    };
  }

  // Extended: both screens open, iframe spans the full combined width.
  // The physical hinge is overlaid on top of the iframe so the website
  // still renders at the full 794 px wide viewport.
  return {
    totalWidth:
      d.bezelSide + d.screenWidth + d.hingeWidth + d.screenWidth + d.bezelSide,
    totalHeight: d.bezelTop + d.screenHeight + d.bezelBottom,
    viewportWidth: d.screenWidth * 2 + d.hingeWidth, // 794 px
    viewportHeight: d.screenHeight,
  };
}
