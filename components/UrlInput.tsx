'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UrlInput() {
  const [url, setUrl] = useState('');
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
    if (!normalized) return;
    router.push(`/test?url=${encodeURIComponent(normalized)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-base min-w-0"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
        />
        <button
          type="submit"
          disabled={!url.trim()}
          className="h-12 px-6 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-700 active:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          Test Website
        </button>
      </div>
    </form>
  );
}
