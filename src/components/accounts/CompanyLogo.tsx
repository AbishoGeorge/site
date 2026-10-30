import { useState } from 'react';
import { companyName } from './domain';

/** The company's site icon, with a lettered tile if it cannot be loaded. */
export default function CompanyLogo({ domain, className = '' }: { domain: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const letter = companyName(domain).charAt(0) || '?';

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-white ${className}`}>
      {failed ? (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-bold text-white">
          {letter}
        </span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
          alt=""
          className="h-3/5 w-3/5 object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
