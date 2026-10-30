import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Building2, Landmark, Link2, Mail, Phone, Sparkles, UserPlus } from 'lucide-react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const emailParagraphs = [
  'Hi Megan,',
  'Congrats on the Series C and on joining as VP of Sales. Teams that grow this fast usually find their reps spending more time researching than selling.',
  'We help sales teams focus on accounts that are ready to buy right now. Worth a 15-minute look next week?',
];

/** Types the draft out once it scrolls into view, as if it were being written from the signal. */
function TypedEmail({ paragraphs }: { paragraphs: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const total = paragraphs.reduce((n, p) => n + p.length, 0);
  const [typed, setTyped] = useState(0);
  const shown = reduce ? total : typed;

  useEffect(() => {
    if (!inView || reduce || typed >= total) return;
    const id = window.setTimeout(() => setTyped((t) => Math.min(total, t + 2)), 18);
    return () => window.clearTimeout(id);
  }, [inView, reduce, typed, total]);

  let left = shown;
  return (
    <div ref={ref} className="relative px-4 py-4 text-sm leading-relaxed text-slate-700">
      <div className="sr-only">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {/* Full text reserves the height so the card never grows while typing. */}
      <div aria-hidden="true" className="invisible space-y-3">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 space-y-3 px-4 py-4">
        {paragraphs.map((p, i) => {
          const visible = p.slice(0, Math.max(0, left));
          const typing = left > 0 && left < p.length;
          left -= p.length;
          return (
            <p key={i}>
              {visible}
              {typing && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-indigo-500" />}
            </p>
          );
        })}
      </div>
    </div>
  );
}

const contacts = [
  { name: 'Megan W.', title: 'VP of Sales', email: 'me•••@••••••.com', phone: '+1 512 •••-•186', fit: 'Decision maker' },
  { name: 'Carlos D.', title: 'Director, Revenue Ops', email: 'ca•••@••••••.com', phone: '+1 737 •••-•042', fit: 'Champion' },
  { name: 'Aisha N.', title: 'CFO', email: 'ai•••@••••••.com', phone: '+1 512 •••-•903', fit: 'Budget owner' },
];

export default function WhatYouGet() {
  return (
    <section id="what-you-get" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fade(0)} className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">What you get</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Every account arrives ready to work.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The signal, the people to talk to and a first message, together in one place. No extra research before the
            first touch.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* 1. Signals */}
          <motion.article {...fade(0.05)} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(79,70,229,0.45)]">
            <Step n={1} title="The signal and its proof" />
            <div className="mt-5 flex-1 space-y-2.5">
              {[
                { icon: Landmark, label: 'Funding', text: '$62M Series C closed', src: 'Press release · 12 days ago' },
                { icon: UserPlus, label: 'Leadership change', text: 'New VP of Sales joined', src: 'Company news · 3 weeks ago' },
                { icon: Building2, label: 'Expansion', text: '3 new offices announced', src: 'Local news · 1 month ago' },
              ].map(({ icon: Icon, label, text, src }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-orange-700">{label}</div>
                    <div className="text-sm font-medium text-slate-900">{text}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Link2 className="h-3 w-3" />
                      {src}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          {/* 2. People */}
          <motion.article {...fade(0.15)} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(79,70,229,0.45)]">
            <Step n={2} title="The people to reach out to" />
            <ul className="mt-5 flex-1 space-y-2.5">
              {contacts.map((c) => (
                <li key={c.name} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                      {c.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </span>
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                        {c.name}
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Verified" />
                      </div>
                      <div className="truncate text-xs text-slate-500">{c.title}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-indigo-100">
                      {c.fit}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-[46px] font-mono text-[11.5px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-indigo-500" />
                      {c.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-indigo-500" />
                      {c.phone}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Contact details are shown in full to customers.</p>
          </motion.article>

          {/* 3. Outreach */}
          <motion.article {...fade(0.25)} className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(79,70,229,0.45)]">
            <Step n={3} title="A first message, written from the signal" />
            <div className="mt-5 flex-1 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <div className="space-y-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <div>
                  <span className="text-slate-400">To:</span> <span className="font-medium text-slate-700">Megan W.</span>
                </div>
                <div>
                  <span className="text-slate-400">Subject:</span>{' '}
                  <span className="font-medium text-slate-700">Scaling the team after the Series C</span>
                </div>
              </div>
              <TypedEmail paragraphs={emailParagraphs} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              References the funding and the new role, with sources
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {n}
      </span>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
  );
}
