import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

interface OverlayShellProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

/** Full-screen page over the site, with a clear way back. */
export default function OverlayShell({ open, onClose, label, children }: OverlayShellProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    // Move focus into the page unless a field inside already took it.
    const raf = requestAnimationFrame(() => {
      if (!dialogRef.current?.contains(document.activeElement)) backRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-[#f7f8fc]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 opacity-70 [background-image:radial-gradient(rgba(99,102,241,0.14)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          />
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
              <button
                ref={backRef}
                type="button"
                onClick={onClose}
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 py-2 pl-3 pr-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to site
              </button>
              <span className="text-slate-900">
                <Logo />
              </span>
            </div>
          </header>
          <div className="relative">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
