import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { faqs } from '../content/faqs';

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
                  aria-controls={`faq-${i}`}
                >
                  <span className="text-lg font-semibold text-slate-900">{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-indigo-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                {/* Every answer is always in the page, so it can be read without opening it; closed ones fold away. */}
                <motion.div
                  id={`faq-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                  aria-hidden={!isOpen}
                >
                  <p className="max-w-2xl pb-6 leading-relaxed text-slate-600">{f.a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
