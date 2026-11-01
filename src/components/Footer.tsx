import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';
import Logo from './Logo';

const columns = [
  {
    title: 'Explore',
    links: [
      { href: '#top', label: 'Home' },
      { href: '#use-cases', label: 'Use cases' },
      { href: '#about', label: 'About' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { href: `#${TOP_ACCOUNTS_HASH}`, label: 'See my top accounts' },
      { href: demoHref, label: 'Book a demo' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:px-8">
        <div className="text-white">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Evidence-backed accounts, the people to reach and the reason to reach them now.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-semibold text-white">Get in touch</h3>
          <a href={`mailto:${brand.email}`} className="mt-4 block text-sm transition-colors hover:text-white">
            {brand.email}
          </a>
          <a
            href={demoHref}
            {...demoLinkProps}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
          >
            Book a demo
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
          <span>
            © {brand.year} {brand.name}. All rights reserved.
          </span>
          <a href="#top" className="group flex items-center gap-1.5 transition-colors hover:text-white">
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
