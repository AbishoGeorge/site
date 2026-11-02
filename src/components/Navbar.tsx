import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';
import Logo from './Logo';

const links = [
  { href: '#top', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#faq', label: 'FAQ' },
];

// Which link each section of the page belongs to. The sections that explain account intelligence count as
// Services; About and the closing call to action highlight nothing.
const sectionLink: Record<string, string> = {
  top: '#top',
  services: '#services',
  industries: '#services',
  'live-accounts': '#services',
  'what-you-get': '#services',
  'use-cases': '#use-cases',
  faq: '#faq',
};
const linkFor = (sectionId: string) => sectionLink[sectionId] ?? '';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState('#top');

  // Highlight the link for the section in the middle of the screen.
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(linkFor(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-4 pr-2 ring-1 transition-all duration-300 sm:pl-5 ${
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
              aria-current={current === l.href ? 'location' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-slate-900 ${
                current === l.href ? 'bg-indigo-50 text-slate-900' : 'text-slate-600'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`#${TOP_ACCOUNTS_HASH}`}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50 hover:ring-indigo-300"
          >
            <Search className="h-4 w-4 text-indigo-600" />
            See my top accounts
          </a>
          <a
            href={demoHref}
            {...demoLinkProps}
            className="group inline-flex items-center gap-2 rounded-full bg-slate-900 py-2 pl-4 pr-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Book a demo
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>

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
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <a
                href={`#${TOP_ACCOUNTS_HASH}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-indigo-200"
              >
                <Search className="h-4 w-4 text-indigo-600" />
                See my top accounts
              </a>
              <a
                href={demoHref}
                {...demoLinkProps}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Book a demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
