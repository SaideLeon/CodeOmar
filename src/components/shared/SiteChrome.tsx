'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu } from 'lucide-react';

const navItems = [
  { href: '/', label: '/posts' },
  { href: '/subscribe', label: '/assinar' },
  { href: '/about', label: '/sobre' },
  { href: '/admin', label: '/admin' },
];

export default function SiteChrome() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-lg transition-colors duration-300 dark:border-white/5 dark:bg-[#050505]/80">
        <Link href="/" className="flex cursor-pointer items-center gap-2 font-mono text-xl font-bold tracking-tighter text-gray-900 dark:text-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-black shadow-sm">
            <Cpu size={20} />
          </div>
          <span>
            Code<span className="text-emerald-600 dark:text-emerald-500">Omar</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 font-mono text-sm text-gray-600 dark:text-gray-400 md:flex">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${active ? 'font-medium text-emerald-600 dark:text-emerald-400' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="relative z-10 border-t border-gray-200 bg-white py-12 dark:border-white/5 dark:bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div className="flex items-center gap-2 font-mono text-sm text-gray-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Status do Sistema: Operacional
          </div>
          <div className="text-center font-mono text-sm text-gray-500 md:text-right">
            © 2024 CodeOmar. Todos os processos encerrados com sucesso.
          </div>
        </div>
      </footer>
    </>
  );
}
