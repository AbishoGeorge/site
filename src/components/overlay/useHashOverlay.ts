import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A full-screen page that opens when the URL hash matches, so any link can open it and the browser's Back
 * button closes it.
 */
export function useHashOverlay(hash: string) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const openedInPage = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => {
    const sync = (fromEvent: boolean) => {
      const isOpen = window.location.hash === `#${hash}`;
      if (isOpen && !isOpenRef.current) setOpenCount((n) => n + 1);
      isOpenRef.current = isOpen;
      setOpen(isOpen);
      if (isOpen) openedInPage.current = fromEvent;
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

  /** `openCount` changes every time the page opens, so callers can reset their state on each visit. */
  return { open, close, openCount };
}
