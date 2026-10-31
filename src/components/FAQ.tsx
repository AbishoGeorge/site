import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'How is this different from a lead database?',
    a: 'A database gives you every company that matches a filter. We give you the few that are showing buying signals right now, with the source and date for each signal, so your team knows why to reach out and what to say.',
  },
  {
    q: 'Which industries do you work with?',
    a: 'We work with B2B teams selling into cybersecurity, software, IT services, logistics, fintech, HR and staffing, healthcare and manufacturing. The signals we watch are tuned to each market, so a security vendor and a logistics vendor get very different lists.',
  },
  {
    q: 'Where do the signals come from?',
    a: 'Public sources: job postings, funding and grant announcements, company news, regulatory filings, earnings calls, tenders and leadership changes. Every signal on an account links back to where it was found.',
  },
  {
    q: 'How do you decide an account is ready to buy?',
    a: 'We start from the triggers that came before your past deals. Accounts are scored on how well they fit your ideal customer and on how many independent signals point to a buying window.',
  },
  {
    q: 'How often are accounts refreshed?',
    a: 'Signals are monitored continuously. New accounts and changes to existing ones reach you on the schedule you choose.',
  },
  {
    q: 'What do I get from the free preview?',
    a: "Enter your website and you'll see how your top 10 accounts will look. Leave your details and we research the full list for your company and send it to you, with the people to contact.",
  },
  {
    q: 'How do accounts reach my team?',
    a: 'In your CRM, in your inbox, or as a shared list. Each account comes with its evidence, suggested contacts and a first outreach draft based on the signal.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-slate-200 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Questions teams ask first.</h2>
          <p className="mt-4 text-lg text-slate-500">
            Anything else? <a href="#contact" className="font-medium text-indigo-600 hover:underline">Get in touch</a>.
          </p>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-slate-900">{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-indigo-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-slate-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
