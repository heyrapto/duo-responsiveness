import Link from 'next/link';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-4xl px-6 py-3 bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-full shadow-sm pointer-events-auto">
        <Link 
          href="/" 
          className="text-zinc-900 font-bold text-xl tracking-tight hover:text-zinc-600 transition-colors"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Iphone Duo Preview
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-zinc-500">Creator:</span>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/heyrapto" 
              target="_blank" 
              rel="noreferrer" 
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <FaGithub className="text-xl" />
            </a>
            <a 
              href="https://x.com/heyrapto" 
              target="_blank" 
              rel="noreferrer" 
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <FaXTwitter className="text-xl" />
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
