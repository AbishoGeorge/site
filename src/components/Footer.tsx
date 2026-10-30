import { brand } from '../brand';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="text-slate-900">
          <Logo />
          <p className="mt-2 text-sm text-gray-500">Evidence-backed accounts, ready to work.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-500 sm:items-end">
          <a href={`mailto:${brand.email}`} className="hover:text-slate-900">
            {brand.email}
          </a>
          <span>
            © {brand.year} {brand.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
