'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScene from '../components/scenes/LoadingScene';
import Navbar from '../components/Navbar';

import ToastContainer from '../components/ToastContainer';

// Dynamic imports of scenes for performance optimization and SSR safety
const HeroScene = dynamic(() => import('../components/scenes/HeroScene'), { ssr: false });
const EventGalaxyScene = dynamic(() => import('../components/scenes/EventGalaxyScene'), { ssr: false });

const FeaturedEventsScene = dynamic(() => import('../components/scenes/FeaturedEventsScene'), { ssr: false });
const AIExplorerScene = dynamic(() => import('../components/scenes/AIExplorerScene'), { ssr: false });
const TrailerScene = dynamic(() => import('../components/scenes/TrailerScene'), { ssr: false });
const MemoriesScene = dynamic(() => import('../components/scenes/MemoriesScene'), { ssr: false });
const SponsorsScene = dynamic(() => import('../components/scenes/SponsorsScene'), { ssr: false });

const FAQScene = dynamic(() => import('../components/scenes/FAQScene'), { ssr: false });
const FooterScene = dynamic(() => import('../components/scenes/FooterScene'), { ssr: false });

import { useKonamiCode } from '../hooks/useKonamiCode';
import { useStore } from '../lib/useStore';
import Lenis from 'lenis';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const isSecretMode = useStore((state) => state.isSecretMode);
  
  // Register Konami Easter Egg Code listener
  useKonamiCode();

  useEffect(() => {
    if (isLoading) return;
    
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
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScene onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className={`relative w-full min-h-screen overflow-x-hidden transition-colors duration-1000 ${
      isSecretMode ? 'bg-[#000000] text-teal-400 font-mono shadow-[inset_0_0_100px_rgba(20,185,129,0.3)]' : 'bg-[#011213] text-white'
    }`}>
      


      {/* Global Navigation Header */}
      <Navbar />

      {/* Dynamic Toast notifications overlay */}
      <ToastContainer />

      {/* Visual sections */}
      <HeroScene />
      <EventGalaxyScene />

      <FeaturedEventsScene />
      <AIExplorerScene />
      <TrailerScene />
      <MemoriesScene />
      <SponsorsScene />

      <FAQScene />
      <FooterScene />
      
    </main>
  );
}
