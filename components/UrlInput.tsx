'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiLoader } from 'react-icons/fi';

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <FiLoader className={`animate-spin text-white ${className}`} aria-hidden />;
}

export default function UrlInput() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preloadUrl, setPreloadUrl] = useState('');
  const pushedRef = useRef(false);
  const router = useRouter();

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized || isLoading) return;
    
    setIsLoading(true);
    setPreloadUrl(normalized);
    pushedRef.current = false;
    
    // Safety fallback: if the site takes too long, just transition anyway
    setTimeout(() => {
      if (!pushedRef.current) {
        pushedRef.current = true;
        router.push(`/test?url=${encodeURIComponent(normalized)}`);
      }
    }, 2500);
  }

  function handlePreloadFinish() {
    if (!pushedRef.current && preloadUrl) {
      pushedRef.current = true;
      router.push(`/test?url=${encodeURIComponent(preloadUrl)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          disabled={isLoading}
          className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-base min-w-0 disabled:opacity-50"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
        />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="relative h-12 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 active:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap w-[160px] shrink-0 flex items-center justify-center gap-2"
        >
          <span>Test Website</span>
          
          {/* Icon Container (Arrow out, Spinner in) */}
          <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
            {/* Arrow (Slides right & fades out) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isLoading ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <FiArrowRight aria-hidden />
            </div>

            {/* Spinner (Fades in & scales up) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] delay-75 ${
                isLoading ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <Spinner className="h-4 w-4" />
            </div>
          </div>
        </button>
      </div>
      
      {/* Hidden iframe to preload the target site before transitioning */}
      {isLoading && preloadUrl && (
        <iframe
          src={preloadUrl}
          style={{ display: 'none' }}
          onLoad={handlePreloadFinish}
          onError={handlePreloadFinish}
        />
      )}
    </form>
  );
}
