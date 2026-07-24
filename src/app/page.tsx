'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import ToastContainer from '../components/ToastContainer';
import LazyScene from '../components/LazyScene';

// Dynamic imports of scenes for performance optimization and SSR safety
const ImageFlashIntro = dynamic(() => import('../components/ImageFlashIntro'), { ssr: false });
const AuthModal = dynamic(() => import('../components/AuthModal'), { ssr: false });
const PaymentModal = dynamic(() => import('../components/PaymentModal'), { ssr: false });
const HeroScene = dynamic(() => import('../components/scenes/HeroScene'), { ssr: false });
const StatsBarScene = dynamic(() => import('../components/scenes/StatsBarScene'), { ssr: false });
const EventShowcaseScene = dynamic(() => import('../components/scenes/EventShowcaseScene'), { ssr: false });
const TimelineScene = dynamic(() => import('../components/scenes/TimelineScene'), { ssr: false });
const PrizePoolScene = dynamic(() => import('../components/scenes/PrizePoolScene'), { ssr: false });
const MemoriesScene = dynamic(() => import('../components/scenes/MemoriesScene'), { ssr: false });
const SpeakersScene = dynamic(() => import('../components/scenes/SpeakersScene'), { ssr: false });
const CommitteeScene = dynamic(() => import('../components/scenes/CommitteeScene'), { ssr: false });
const SponsorsScene = dynamic(() => import('../components/scenes/SponsorsScene'), { ssr: false });
const FAQScene = dynamic(() => import('../components/scenes/FAQScene'), { ssr: false });
const CountdownCTAScene = dynamic(() => import('../components/scenes/CountdownCTAScene'), { ssr: false });
const FooterScene = dynamic(() => import('../components/scenes/FooterScene'), { ssr: false });

import { useKonamiCode } from '../hooks/useKonamiCode';
import { useStore } from '../lib/useStore';
import { useDevice } from '../hooks/useDevice';

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
    if (typeof window !== 'undefined') {
      // Clear any legacy permanent localStorage flag so closing & reopening the site always plays intro
      localStorage.removeItem('y26_has_seen_intro');

      const searchParams = new URLSearchParams(window.location.search);
      const isReplay = searchParams.get('replay') === 'true' || searchParams.get('intro') === 'true';

      if (isReplay) {
        sessionStorage.removeItem('hasSeenIntro');
        setShowFlashIntro(true);
        return;
      }

      // If user has already seen intro in current tab session (page refresh or navigation), skip it.
      // Closing the browser/tab clears sessionStorage, so re-opening the site will always play the intro.
      if (sessionStorage.getItem('hasSeenIntro') === 'true') {
        setShowFlashIntro(false);
      } else {
        setShowFlashIntro(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMounted || showFlashIntro) return;
    
    // Initialise Lenis smooth scroll — wrapped in try/catch for iOS Safari safety
    let lenis: any = null;
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({ autoRaf: true });
      } catch (err) {
        console.warn('Lenis failed to initialise (likely iOS):', err);
      }
    };
    initLenis();
    
    return () => {
      try { lenis?.destroy(); } catch (_) {}
    };
  }, [showFlashIntro, hasMounted]);

  if (!hasMounted) return null;

  return (
    <>
      {/* Image Flash Intro overlay - rendered on top, unmounts when complete */}
      {showFlashIntro && (
        <ImageFlashIntro onComplete={() => {
          setShowFlashIntro(false);
          sessionStorage.setItem('hasSeenIntro', 'true');
          addToast('Welcome to YOUTHFEST 2026!');
        }} />
      )}

      {/* Main content renders in the background to initialize WebGL without transition lag */}
      <main className={`relative w-full min-h-screen pb-16 md:pb-0 transition-colors duration-1000 ${
        isSecretMode ? 'bg-black text-[var(--neon-cyan)] font-[var(--font-heading-main)] ' : 'bg-black text-white'
      }`}>
        {/* Global Navigation Header */}
        <Navbar />
        <MobileBottomNav />

        {/* Dynamic Toast notifications overlay */}
        <ToastContainer />

        {/* Modals */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
        <PaymentModal />
        
        {/* Hero loads immediately — it's above the fold */}
        <HeroScene />
        
        {/* All sections below hero are lazy-mounted to save iOS memory */}
        <LazyScene placeholderHeight={600}>
          <StatsBarScene />
        </LazyScene>

        <LazyScene placeholderHeight={700}>
          <EventShowcaseScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <TimelineScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <PrizePoolScene />
        </LazyScene>

        {/* MemoriesScene has video — load late */}
        <LazyScene placeholderHeight={600} rootMargin="200px">
          <MemoriesScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <SpeakersScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <CommitteeScene />
        </LazyScene>

        <LazyScene placeholderHeight={400}>
          <SponsorsScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <FAQScene />
        </LazyScene>

        <LazyScene placeholderHeight={500}>
          <CountdownCTAScene />
        </LazyScene>

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>
      </main>
    </>
  );
}
