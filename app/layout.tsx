import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Song Sketchpad',
  description: 'A clean, Notion-like dark workspace to capture song ideas daily',
  keywords: ['music', 'songwriting', 'lyrics', 'audio', 'metronome', 'tuner'],
  authors: [{ name: 'Daily Song Sketchpad' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0b1220',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}