import { useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Industries from './components/Industries';
import LiveAccounts from './components/LiveAccounts';
import WhatYouGet from './components/WhatYouGet';
import UseCases from './components/usecases/UseCases';
import About from './components/About';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AccountsFlow from './components/accounts/AccountsFlow';
import BookDemo from './components/demo/BookDemo';
import UseCasePage from './components/usecases/UseCasePage';
import { RouteProvider, storyIdFromPath } from './route';

/**
 * The whole site. `path` is given when the page is rendered to HTML at build time; in the browser it comes from
 * the address bar, so both render the same page and React can take over the prerendered HTML.
 */
export default function App({ path }: { path?: string }) {
  const [current, setCurrent] = useState(() => path ?? window.location.pathname);
  const route = useMemo(
    () => ({
      path: current,
      useCase: storyIdFromPath(current),
      go: (to: string) => {
        window.history.replaceState(null, '', to);
        setCurrent(to);
      },
    }),
    [current]
  );
  return (
    <RouteProvider value={route}>
      <MotionConfig reducedMotion="user">
        <Navbar />
        <main className="pt-20">
          <Hero />
          <Services />
          <Industries />
          <LiveAccounts />
          <WhatYouGet />
          <UseCases />
          <About />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <AccountsFlow />
        <BookDemo />
        <UseCasePage />
      </MotionConfig>
    </RouteProvider>
  );
}
