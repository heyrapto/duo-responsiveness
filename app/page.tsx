import UrlInput from '@/components/UrlInput';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-white px-6">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg text-center">

        {/* Logo mark */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900"
            aria-hidden
          >
            {/* Two-panel icon representing the dual display */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect
                x="2"
                y="4"
                width="10"
                height="20"
                rx="2.5"
                stroke="white"
                strokeWidth="1.6"
              />
              <rect
                x="16"
                y="4"
                width="10"
                height="20"
                rx="2.5"
                stroke="white"
                strokeWidth="1.6"
              />
              <line
                x1="13"
                y1="9"
                x2="15"
                y2="9"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="14"
                x2="15"
                y2="14"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="19"
                x2="15"
                y2="19"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1
              className="text-4xl font-bold text-zinc-900"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Iphone Duo Preview
            </h1>
            <p
              className="text-zinc-500 text-lg leading-relaxed max-w-sm"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Test any website inside a realistic iPhone Duo device frame.
            </p>
          </div>
        </div>

        {/* URL input + submit */}
        <UrlInput />

        <p className="text-xs text-zinc-400">
          Paste any URL — the site loads inside the device, fully interactive.
        </p>
      </div>
    </div>
  );
}
