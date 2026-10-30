import { brand, demoHref, demoLinkProps } from '../brand';
import Logo from './Logo';

const columns = [
  {
    title: 'Product',
    links: [
      { href: '#what-you-get', label: 'What you get' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#signals', label: 'Signal library' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#top-accounts', label: 'See my top accounts' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-gradient-to-b from-white to-indigo-50/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div className="text-slate-900">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            Evidence-backed accounts, the people to reach and the reason to reach them now.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold text-slate-900">{c.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {c.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-slate-900">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <a href={`mailto:${brand.email}`} className="mt-3 block text-sm text-slate-500 hover:text-slate-900">
            {brand.email}
          </a>
          <a
            href={demoHref}
            {...demoLinkProps}
            className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Book a demo
          </a>
        </div>
      </div>
      <div className="border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {brand.year} {brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
