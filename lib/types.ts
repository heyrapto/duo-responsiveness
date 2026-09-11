import type { ReactNode } from 'react';

export type DisplayMode = 'single' | 'extended';

export interface DeviceDimensions {
  totalWidth: number;
  totalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface DeviceFrameProps {
  mode: DisplayMode;
  children: ReactNode;
}

export interface DisplayToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  disabled?: boolean;
}

export interface SimulatorProps {
  url: string;
}

export interface AnimValues {
  rotation: number;
  rotDuration: number;
  glassOpacity: number;
  glassDuration: number;
  scaleFactor: number;
  scaleDuration: number;
  showGleam: boolean;
}
