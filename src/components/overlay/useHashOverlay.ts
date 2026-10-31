import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A panel that opens when the URL hash matches, so any link can open it and the browser's Back button closes it.
 * Pass a string for an exact hash, or a pattern to match a family of hashes (its first capture group is returned).
 */
export function useHashOverlay(hash: string | RegExp) {
  const [open, setOpen] = useState(false);
  const [param, setParam] = useState('');
  const [openCount, setOpenCount] = useState(0);
  const openedInPage = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => {
    const sync = (fromEvent: boolean) => {
      const current = window.location.hash.slice(1);
      const m = typeof hash === 'string' ? (current === hash ? [current] : null) : hash.exec(current);
      const isOpen = !!m;
      if (isOpen && !isOpenRef.current) setOpenCount((n) => n + 1);
      isOpenRef.current = isOpen;
      setOpen(isOpen);
      if (m) {
        setParam(m[1] ?? m[0]);
        openedInPage.current = openedInPage.current || fromEvent;
      } else {
        openedInPage.current = false;
      }
    };
    sync(false);
    const onHash = () => sync(true);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [hash]);

  const close = useCallback(() => {
    if (openedInPage.current) {
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      isOpenRef.current = false;
      setOpen(false);
    }
  }, []);

  /** `openCount` changes every time the panel opens, so callers can reset their state on each visit. */
  return { open, close, openCount, param };
}
