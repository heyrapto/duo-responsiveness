'use client';

import type { DisplayMode } from '@/lib/devices';
import { FiColumns, FiSmartphone } from 'react-icons/fi';

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
        <FiSmartphone aria-hidden />
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
        <FiColumns aria-hidden />
      </button>
    </div>
  );
}

