'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import ToastContainer from '../components/ToastContainer';

// Dynamic imports of scenes for performance optimization and SSR safety
const ImageFlashIntro = dynamic(() => import('../components/ImageFlashIntro'), { ssr: false });
const AuthModal = dynamic(() => import('../components/AuthModal'), { ssr: false });
const PaymentModal = dynamic(() => import('../components/PaymentModal'), { ssr: false });
const HeroScene = dynamic(() => import('../components/scenes/HeroScene'), { ssr: false });
const StatsBarScene = dynamic(() => import('../components/scenes/StatsBarScene'), { ssr: false });
const EventShowcaseScene = dynamic(() => import('../components/scenes/EventShowcaseScene'), { ssr: false });
const TimelineScene = dynamic(() => import('../components/scenes/TimelineScene'), { ssr: false });
const PrizePoolScene = dynamic(() => import('../components/scenes/PrizePoolScene'), { ssr: false });
const TrailerScene = dynamic(() => import('../components/scenes/TrailerScene'), { ssr: false });
const MemoriesScene = dynamic(() => import('../components/scenes/MemoriesScene'), { ssr: false });
const TestimonialsScene = dynamic(() => import('../components/scenes/TestimonialsScene'), { ssr: false });
const SpeakersScene = dynamic(() => import('../components/scenes/SpeakersScene'), { ssr: false });
const LeadersScene = dynamic(() => import('../components/scenes/LeadersScene'), { ssr: false });
const SponsorsScene = dynamic(() => import('../components/scenes/SponsorsScene'), { ssr: false });
const CountdownCTAScene = dynamic(() => import('../components/scenes/CountdownCTAScene'), { ssr: false });
const FAQScene = dynamic(() => import('../components/scenes/FAQScene'), { ssr: false });
const FooterScene = dynamic(() => import('../components/scenes/FooterScene'), { ssr: false });

import { useKonamiCode } from '../hooks/useKonamiCode';
import { useStore } from '../lib/useStore';
import Lenis from 'lenis';

export default function Home() {
  const [showFlashIntro, setShowFlashIntro] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const isSecretMode = useStore((state) => state.isSecretMode);
  const addToast = useStore((state) => state.addToast);
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  
  // Register Konami Easter Egg Code listener
  useKonamiCode();

  useEffect(() => {
    setHasMounted(true);
    if (sessionStorage.getItem('hasSeenIntro')) {
      setShowFlashIntro(false);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted || showFlashIntro) return;
    
    // Only show the toast if we actually just finished the intro (not if we skipped it via session)
    if (!sessionStorage.getItem('hasSeenIntro')) {
      addToast('Welcome to YOUTHFEST 2026!', { points: 50 });
      sessionStorage.setItem('hasSeenIntro', 'true');
    }

    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [showFlashIntro, hasMounted, addToast]);

  if (!hasMounted) return null;

  // Image Flash Intro with cinematic YOUTHFEST reveal
  if (showFlashIntro) {
    return <ImageFlashIntro onComplete={() => {
      setShowFlashIntro(false);
      sessionStorage.setItem('hasSeenIntro', 'true');
      addToast('Welcome to YOUTHFEST 2026!', { points: 50 });
    }} />;
  }

  return (
    <main className={`relative w-full min-h-screen overflow-x-hidden transition-colors duration-1000 ${
      isSecretMode ? 'bg-[#011213] text-[var(--neon-cyan)] font-[var(--font-orbitron)] shadow-[inset_0_0_100px_rgba(0,240,255,0.3)]' : 'bg-[#011213] text-white'
    }`}>
      
      {/* Global Navigation Header */}
      <Navbar />

      {/* Dynamic Toast notifications overlay */}
      <ToastContainer />

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      <PaymentModal />

      {/* Visual sections */}
      <HeroScene />
      <StatsBarScene />
      <EventShowcaseScene />
      <TimelineScene />
      <PrizePoolScene />
      <TrailerScene />
      <MemoriesScene />
      <TestimonialsScene />
      <SpeakersScene />
      <SponsorsScene />
      <LeadersScene />
      <CountdownCTAScene />
      <FAQScene />
      <FooterScene />
      
    </main>
  );
}
