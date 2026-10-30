import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';
import Logo from './Logo';

const links = [
  { href: '#why', label: 'Why us' },
  { href: '#what-you-get', label: 'What you get' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#signals', label: 'Signals' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-4 pr-2 ring-1 transition-all duration-300 sm:pl-5 ${
          scrolled || open
            ? 'bg-white/80 shadow-lg shadow-indigo-900/5 ring-indigo-100 backdrop-blur-xl'
            : 'bg-white/60 ring-white/80 backdrop-blur-md'
        }`}
      >
        <a href="#top" className="text-slate-900" aria-label={`${brand.name} home`}>
          <Logo />
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={demoHref}
          {...demoLinkProps}
          className="group hidden items-center gap-2 rounded-full bg-slate-900 py-2 pl-4 pr-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 lg:inline-flex"
        >
          Book a demo
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </a>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-full p-2.5 hover:bg-indigo-50 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl bg-white/95 p-3 shadow-xl shadow-indigo-900/10 ring-1 ring-indigo-100 backdrop-blur-xl lg:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50"
              >
                {l.label}
              </a>
            ))}
            <a
              href={demoHref}
              {...demoLinkProps}
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Book a demo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
