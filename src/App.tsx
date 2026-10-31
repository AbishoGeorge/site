import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-20">
        <Hero />
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
  );
}
