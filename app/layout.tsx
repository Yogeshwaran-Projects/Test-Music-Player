import { AudioProvider } from './contexts/AudioContext';
import './globals.css';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'NextJS Music Player',
  description: 'A music player that continues playing in the background',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#000000', // Move themeColor here
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="NextJS Music Player" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Music Player" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}