import type { Metadata } from 'next';
import SiteChrome from '@/components/shared/SiteChrome';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeOmar - Dev Blog',
  description:
    'A high-performance, dark-mode blog for software engineers featuring neon aesthetics, deep-dive technical content, and AI-powered insights.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-gray-50 font-sans text-gray-900 transition-colors duration-300 dark:bg-[#050505] dark:text-[#e5e5e5]">
        <div className="min-h-screen">
          <SiteChrome />
          <main className="pt-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
