import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveAccounts from './components/LiveAccounts';
import WhatYouGet from './components/WhatYouGet';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AccountsFlow from './components/accounts/AccountsFlow';
import BookDemo from './components/demo/BookDemo';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <LiveAccounts />
        <WhatYouGet />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <AccountsFlow />
      <BookDemo />
    </MotionConfig>
  );
}
