import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

interface OverlayShellProps {
  open: boolean;
  /** Closes the panel (Escape and the backdrop also call it). */
  onClose: () => void;
  /** Goes one step back inside the flow; defaults to closing. */
  onBack?: () => void;
  /** Where Back goes, shown next to the arrow, e.g. "Home" or "Change website". */
  backLabel: string;
  label: string;
  /** Optional step trail for multi-step flows. */
  steps?: string[];
  step?: number;
  /** Changing this scrolls the panel back to the top, e.g. when moving between steps or use cases. */
  scrollKey?: string | number;
  /** False when the panel is already open as the page loads (a use case's own page): it shows without rising in. */
  appear?: boolean;
  children: ReactNode;
}

/**
 * A panel that rises over the page under the site's own navbar, so moving into it feels like part of the same
 * site. The page stays visible behind it, dimmed.
 */
export default function OverlayShell({
  open,
  onClose,
  onBack,
  backLabel,
  label,
  steps,
  step = 0,
  scrollKey,
  appear = true,
  children,
}: OverlayShellProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    // Move focus into the panel unless a field inside already took it.
    const raf = requestAnimationFrame(() => {
      if (!panelRef.current?.contains(document.activeElement)) backRef.current?.focus();
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  const progress = steps ? (step + 1) / steps.length : 1;

  return (
    <AnimatePresence initial={appear}>
      {open && (
        <>
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[45] bg-slate-900/25 backdrop-blur-[3px]"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-[76px] z-[46] px-2 pb-2 sm:px-4 sm:pb-4"
          >
            {/* The header stays put and the content gets exactly the space below it, so each step is laid out to
                fit one screen. The content only scrolls on very short screens. */}
            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-[#f7f8fc] shadow-[0_-20px_80px_-30px_rgba(30,27,75,0.45)] ring-1 ring-indigo-100">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70 [background-image:radial-gradient(rgba(99,102,241,0.14)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
              />
              <div className="relative z-10 flex shrink-0 items-center gap-4 px-4 py-2.5 sm:px-6">
                <button
                  ref={backRef}
                  type="button"
                  onClick={onBack ?? onClose}
                  className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                >
                  <span className="relative flex h-11 w-11 items-center justify-center">
                    {/* The ring fills as the visitor moves through the flow. */}
                    <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      <circle cx="22" cy="22" r="20" fill="white" stroke="rgb(224,231,255)" strokeWidth="2.5" />
                      <motion.circle
                        cx="22"
                        cy="22"
                        r="20"
                        fill="none"
                        stroke="url(#back-ring)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={false}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <defs>
                        <linearGradient id="back-ring" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <ArrowLeft className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </span>
                  <span className="whitespace-nowrap">{backLabel}</span>
                </button>

                {steps && (
                  <>
                    <ol className="ml-auto hidden items-center gap-2 text-xs font-medium sm:flex" aria-label="Progress">
                      {steps.map((s, i) => {
                        const state = i < step ? 'done' : i === step ? 'current' : 'next';
                        return (
                          <li key={s} className="flex items-center gap-2">
                            {i > 0 && <span className={`h-px w-6 ${i <= step ? 'bg-indigo-400' : 'bg-slate-200'}`} />}
                            <span
                              aria-current={state === 'current' ? 'step' : undefined}
                              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 transition-colors ${
                                state === 'current'
                                  ? 'bg-slate-900 text-white'
                                  : state === 'done'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-400'
                              }`}
                            >
                              {state === 'done' && <Check className="h-3 w-3" strokeWidth={3} />}
                              {s}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                    {/* Phones: the same progress as dots, with the current step drawn longer. */}
                    <span className="ml-auto flex items-center gap-1.5 sm:hidden" aria-label={`Step ${step + 1} of ${steps.length}`}>
                      {steps.map((s, i) => (
                        <span
                          key={s}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === step ? 'w-6 bg-slate-900' : i < step ? 'w-1.5 bg-indigo-500' : 'w-1.5 bg-slate-300'
                          }`}
                        />
                      ))}
                    </span>
                  </>
                )}
              </div>
              <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
