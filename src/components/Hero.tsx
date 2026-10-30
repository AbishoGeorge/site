import { motion } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import SignalGlobe from './globe/SignalGlobe';
import { demoHref, demoLinkProps } from '../brand';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';

const headline = ["Know who's", 'ready to buy.', 'And exactly why.'];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section id="top" className="scroll-mt-20 px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="relative isolate mx-auto flex max-w-[1600px] flex-col overflow-hidden rounded-[28px] bg-[#f4f5ff] ring-1 ring-indigo-100 xl:block xl:h-[clamp(700px,calc(100svh-104px),860px)]">
        {/* Slowly drifting light behind the globe. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[55%] top-[10%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-indigo-300/80 to-transparent animate-[drift-a_22s_ease-in-out_infinite]" />
          <div className="absolute right-[-10%] top-[-20%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-violet-300/75 to-transparent animate-[drift-b_26s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-25%] left-[30%] h-[55%] w-[45%] rounded-full bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-orange-200/80 to-transparent animate-[drift-c_30s_ease-in-out_infinite]" />
          <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(99,102,241,0.16)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_25%_40%,black,transparent_65%)]" />
        </div>

        {/* Globe stage: full-bleed behind the copy on wide screens, its own block below the copy otherwise. */}
        <div className="relative order-2 h-[600px] sm:h-[700px] xl:absolute xl:inset-0 xl:h-auto">
          <SignalGlobe />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[50%] bg-[linear-gradient(to_right,#f4f5ff_0%,rgba(244,245,255,0.88)_45%,transparent_100%)] xl:block" />

        <div className="relative z-10 order-1 px-6 pt-14 sm:px-10 sm:pt-20 xl:flex xl:h-full xl:max-w-[700px] xl:flex-col xl:justify-center xl:px-16 xl:pb-10 xl:pt-0">
          <h1 className="text-[2.35rem] font-bold leading-[1.04] tracking-[-0.035em] text-slate-900 min-[400px]:text-[2.6rem] sm:text-6xl xl:text-[4.25rem]">
            {headline.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`block w-fit ${
                  i === headline.length - 1
                    ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text pb-[0.06em] text-transparent'
                    : ''
                }`}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.div {...fadeUp(0.45)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={demoHref}
              {...demoLinkProps}
              className="group inline-flex items-center justify-between gap-4 rounded-full bg-slate-900 py-1.5 pl-6 pr-1.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Book a demo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href={`#${TOP_ACCOUNTS_HASH}`}
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-6 py-3.5 font-semibold text-slate-800 shadow-sm ring-1 ring-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <Search className="h-4 w-4 text-indigo-600" />
              See my top accounts
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
