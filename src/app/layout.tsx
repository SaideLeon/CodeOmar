import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeOmar - Dev Blog',
  description:
    'A high-performance, dark-mode blog for software engineers featuring neon aesthetics, deep-dive technical content, and AI-powered insights.',

  icons: {
    icon: '/favicon.svg',        // favicon padrão
    shortcut: '/favicon.svg',   // compatibilidade
    apple: '/apple-icon.png',   // opcional (iOS)
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

      <body className="bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-[#e5e5e5] transition-colors duration-300 font-sans">
        {children}
      </body>
    </html>
  );
    }
