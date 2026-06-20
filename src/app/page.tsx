'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ImageFlashIntro from '../components/ImageFlashIntro';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';
import PaymentModal from '../components/PaymentModal';

// Dynamic imports of scenes for performance optimization and SSR safety
const HeroScene = dynamic(() => import('../components/scenes/HeroScene'), { ssr: false });
const StatsBarScene = dynamic(() => import('../components/scenes/StatsBarScene'), { ssr: false });
const EventShowcaseScene = dynamic(() => import('../components/scenes/EventShowcaseScene'), { ssr: false });
const TrailerScene = dynamic(() => import('../components/scenes/TrailerScene'), { ssr: false });
const MemoriesScene = dynamic(() => import('../components/scenes/MemoriesScene'), { ssr: false });
const SpeakersScene = dynamic(() => import('../components/scenes/SpeakersScene'), { ssr: false });
const CountdownCTAScene = dynamic(() => import('../components/scenes/CountdownCTAScene'), { ssr: false });
const FAQScene = dynamic(() => import('../components/scenes/FAQScene'), { ssr: false });
const FooterScene = dynamic(() => import('../components/scenes/FooterScene'), { ssr: false });

import { useKonamiCode } from '../hooks/useKonamiCode';
import { useStore } from '../lib/useStore';
import Lenis from 'lenis';

export default function Home() {
  const [showFlashIntro, setShowFlashIntro] = useState(true);
  const isSecretMode = useStore((state) => state.isSecretMode);
  const addToast = useStore((state) => state.addToast);
  
  // Register Konami Easter Egg Code listener
  useKonamiCode();

  useEffect(() => {
    if (showFlashIntro) return;
    
    // Welcome toast after intro completes
    addToast('Welcome to YUVENZA 2026!', { points: 50 });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [showFlashIntro, addToast]);

  // Image Flash Intro with cinematic YUVENZA reveal
  if (showFlashIntro) {
    return <ImageFlashIntro onComplete={() => setShowFlashIntro(false)} />;
  }

  return (
    <main className={`relative w-full min-h-screen overflow-x-hidden transition-colors duration-1000 ${
      isSecretMode ? 'bg-[#011213] text-[var(--neon-cyan)] font-[var(--font-orbitron)] shadow-[inset_0_0_100px_rgba(0,240,255,0.3)]' : 'bg-[#011213] text-white'
    }`}>
      
      {/* Global Navigation Header */}
      <Navbar />

      {/* Dynamic Toast notifications overlay */}
      <ToastContainer />

      {/* Payment Checkout Modal overlay */}
      <PaymentModal />

      {/* Visual sections */}
      <HeroScene />
      <StatsBarScene />
      <EventShowcaseScene />
      <TrailerScene />
      <MemoriesScene />
      <SpeakersScene />
      <CountdownCTAScene />
      <FAQScene />
      <FooterScene />
      
    </main>
  );
}
