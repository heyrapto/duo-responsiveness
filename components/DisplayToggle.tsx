'use client';

import type { DisplayMode } from '@/lib/devices';

interface DisplayToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

const OPTIONS: { value: DisplayMode; label: string }[] = [
  { value: 'single', label: 'Single Display' },
  { value: 'extended', label: 'Extended Display' },
];

export default function DisplayToggle({ mode, onChange }: DisplayToggleProps) {
  return (
    <div className="flex items-center bg-zinc-100 rounded-lg p-1 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            mode === opt.value
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
