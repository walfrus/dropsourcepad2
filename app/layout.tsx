import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientRoot from '@/components/ClientRoot';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ClientRoot>
          <div className="min-h-screen">
            <main className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
          </div>
        </ClientRoot>
      </body>
    </html>
  );
}