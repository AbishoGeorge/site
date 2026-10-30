import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListVsEvidence from './components/ListVsEvidence';
import HowItWorks from './components/HowItWorks';
import SignalLibrary from './components/SignalLibrary';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <ListVsEvidence />
        <HowItWorks />
        <SignalLibrary />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </MotionConfig>
  );
}
