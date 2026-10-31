import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaseStudies from './components/cases/CaseStudies';
import LiveAccounts from './components/LiveAccounts';
import WhatYouGet from './components/WhatYouGet';
import About from './components/About';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AccountsFlow from './components/accounts/AccountsFlow';
import BookDemo from './components/demo/BookDemo';
import CaseStudyPage from './components/cases/CaseStudyPage';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <CaseStudies />
        <LiveAccounts />
        <WhatYouGet />
        <About />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <AccountsFlow />
      <BookDemo />
      <CaseStudyPage />
    </MotionConfig>
  );
}
