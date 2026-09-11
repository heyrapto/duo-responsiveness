'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { normalizeUrl } from '@/lib/url';

export default function UrlInput() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preloadUrl, setPreloadUrl] = useState('');
  const pushedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  function pushToTest(targetUrl: string) {
    if (pushedRef.current) return;
    pushedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    router.push(`/test?url=${encodeURIComponent(targetUrl)}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized || isLoading) return;
    
    setIsLoading(true);
    setPreloadUrl(normalized);
    pushedRef.current = false;
    
    timeoutRef.current = setTimeout(() => pushToTest(normalized), 2500);
  }

  function handlePreloadFinish() {
    if (!pushedRef.current && preloadUrl) {
      pushToTest(preloadUrl);
    }
  }

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex gap-2 w-full">
        <input
          aria-label="Website URL"
          type="text"
          value={url.toLowerCase()}
          onChange={(e) => setUrl(e.target.value.toLowerCase())}
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
          className="relative h-12 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 active:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap w-40 shrink-0 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          <span>Test Website</span>
          
          <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                isLoading ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <FiArrowRight aria-hidden />
            </div>

            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out delay-75 ${
                isLoading ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <FiLoader className="animate-spin text-white h-4 w-4" aria-hidden />
            </div>
          </div>
        </button>
      </div>
      
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
