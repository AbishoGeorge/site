import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatYouGet from './components/WhatYouGet';
import HowItWorks from './components/HowItWorks';
import SignalLibrary from './components/SignalLibrary';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AccountsFlow from './components/accounts/AccountsFlow';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <WhatYouGet />
        <HowItWorks />
        <SignalLibrary />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <AccountsFlow />
    </MotionConfig>
  );
}
