import UrlInput from '@/components/UrlInput';
import Footer from '@/components/Footer';
import { FiColumns } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 min-h-screen">
        <div className="flex flex-col items-center gap-8 w-full max-w-lg text-center">

          {/* Logo mark */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 shadow-sm"
              aria-hidden
            >
              {/* Two-panel icon representing the dual display */}
              <FiColumns className="h-7 w-7 text-white" aria-hidden />
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
      <Footer />
    </div>
  );
}
