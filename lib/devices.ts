import type { DeviceDimensions, DisplayMode } from './types';

export type { DeviceDimensions, DisplayMode } from './types';

export const DEVICE = {
  name: 'iPhone Duo',

  outerDisplay: {
    diagonal: 5.4,
    cssWidth: 466,
    cssHeight: 678,
  },

  innerDisplay: {
    diagonal: 7.6,
    cssWidth: 890,
    cssHeight: 626,
  },

  bezel: 18, 

  outerRadius: 40,
  screenRadius: 22,
} as const;

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
