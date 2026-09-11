import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Duo Preview — iPhone Duo Responsiveness Tester',
  description:
    'Test any website inside a realistic iPhone Duo device frame. Preview in Single or Extended display mode, fully interactive.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* min-h-full + flex col lets pages use flex-1 to fill the viewport */}
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
