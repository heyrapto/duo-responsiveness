'use client';

import type { DisplayMode } from '@/lib/devices';

interface DisplayToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  disabled?: boolean;
}

export default function DisplayToggle({ mode, onChange, disabled }: DisplayToggleProps) {
  return (
    <div
      className={`flex items-center bg-zinc-100 rounded-lg p-1 gap-0.5 transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
      title={mode === 'single' ? 'Switch to Extended Display' : 'Switch to Single Display'}
    >
      {/* Single display — portrait phone icon */}
      <button
        type="button"
        onClick={() => onChange('single')}
        disabled={disabled}
        aria-label="Single Display"
        title="Single Display (5.4&quot; cover screen)"
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          mode === 'single'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <SingleIcon />
      </button>

      {/* Extended display — two panels landscape icon */}
      <button
        type="button"
        onClick={() => onChange('extended')}
        disabled={disabled}
        aria-label="Extended Display"
        title="Extended Display (7.6&quot; inner screen)"
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          mode === 'extended'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <ExtendedIcon />
      </button>
    </div>
  );
}

/** Portrait phone — represents the closed / single display */
function SingleIcon() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
      <rect
        x="1"
        y="1"
        width="12"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Home indicator */}
      <line
        x1="4.5"
        y1="16.5"
        x2="9.5"
        y2="16.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Dynamic island */}
      <rect
        x="4.5"
        y="3.2"
        width="5"
        height="1.6"
        rx="0.8"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

/** Two panels open like a book — represents the inner / extended display */
function ExtendedIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      {/* Left panel */}
      <rect
        x="0.75"
        y="0.75"
        width="9.5"
        height="14.5"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Right panel */}
      <rect
        x="11.75"
        y="0.75"
        width="9.5"
        height="14.5"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
