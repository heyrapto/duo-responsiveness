import type { Metadata } from 'next';
import { Geist_Mono, Caveat, Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Iphone Duo Preview — iPhone Duo Responsiveness Tester',
  description:
    'Test any website inside a realistic iPhone Duo device frame. Preview in Single or Extended display mode, fully interactive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col bg-zinc-50" style={{ fontFamily: 'var(--font-poppins)' }}>
        {children}
      </body>
    </html>
  );
}
