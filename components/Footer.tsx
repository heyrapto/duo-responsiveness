import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { HiArrowUpRight } from 'react-icons/hi2';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-16 md:gap-12">
        
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-zinc-800 font-semibold text-lg pb-4 border-b border-zinc-200/70">
            <MdOutlineEmail className="text-zinc-400 text-xl" />
            Contact
          </div>
          
          <p className="text-zinc-600 text-sm leading-relaxed">
            Thank you for your interest in my work. Follow me to support the project, ask questions, share suggestions, or get news and updates.
          </p>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-200 overflow-hidden shrink-0 shadow-inner">
              <Image src="/me.webp" alt="Caleb Kalejaiye" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-base flex flex-wrap items-center gap-2">
                Caleb Kalejaiye
                <a href="mailto:kalejaiyecaleb@gmail.com" className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors flex items-center gap-1">
                  Available for work
                  <HiArrowUpRight className="text-xs" />
                </a>
              </h3>
              <p className="text-sm text-zinc-500 mt-0.5">Software engineer</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <a href="https://github.com/heyrapto" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              <FaGithub className="text-lg" /> github.com/heyrapto
            </a>
            <a href="https://x.com/heyrapto" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              <FaXTwitter className="text-lg" /> x.com/heyrapto
            </a>
            <a href="https://www.linkedin.com/in/caleb-kalejaiye-5a0730403/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              <FaLinkedin className="text-lg" /> linkedin.com/in/caleb-kalejaiye
            </a>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-zinc-800 font-semibold text-lg pb-4 border-b border-zinc-200/70">
            <IoInformationCircleOutline className="text-zinc-400 text-xl" />
            About
          </div>
          
          <p className="text-zinc-600 text-sm leading-relaxed">
            A tool for previewing websites inside the iPhone Duo frame — both the outer display and the unfolded inner one. Free to use, no sign-up, and every page is processed in your own browser, never uploaded to a server.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400 pt-8">
            <span>Everything runs in your browser.</span>
            <a href="#" className="hover:text-zinc-700 transition-colors">Privacy notice</a>
            <a href="#" className="hover:text-zinc-700 transition-colors">Cookie settings</a>
          </div>
        </div>

      </div>

      <div className="w-full bg-black text-zinc-400 py-5 px-6 text-xs text-center flex flex-col md:flex-row items-center justify-center gap-2">
        <span>version 1.0.0 10/09/2026</span>
        <span className="hidden md:inline">·</span>
        <span>© {new Date().getFullYear()} Caleb Kalejaiye · Built by <a href="https://github.com/heyrapto" className="text-zinc-300 hover:text-white transition-colors">Rapto</a> · All rights reserved.</span>
      </div>
    </footer>
  );
}
