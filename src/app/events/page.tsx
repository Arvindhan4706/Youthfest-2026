'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import ToastContainer from '../../components/ToastContainer';
import LazyScene from '../../components/LazyScene';

// Dynamic imports of components
const AuthModal = dynamic(() => import('../../components/AuthModal'), { ssr: false });
const PaymentModal = dynamic(() => import('../../components/PaymentModal'), { ssr: false });
const EventShowcaseScene = dynamic(() => import('../../components/scenes/EventShowcaseScene'), { ssr: false });
const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });

import { useStore } from '../../lib/useStore';

export default function EventsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const isSecretMode = useStore((state) => state.isSecretMode);
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
    // Initialise Lenis smooth scroll
    let lenis: any = null;
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({ autoRaf: true });
      } catch (err) {
        console.warn('Lenis failed to initialise:', err);
      }
    };
    initLenis();
    
    return () => {
      try { lenis?.destroy(); } catch (_) {}
    };
  }, [hasMounted]);

  if (!hasMounted) return null;

  return (
    <>
      <main className={`relative w-full min-h-screen pb-16 md:pb-0 transition-colors duration-1000 ${
        isSecretMode ? 'bg-black text-[var(--neon-cyan)] font-[var(--font-heading-main)] ' : 'bg-black text-white'
      }`}>
        {/* Global Navigation Header */}
        <Navbar />

        {/* Dynamic Toast notifications overlay */}
        <ToastContainer />

        {/* Modals */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
        <PaymentModal />

        {/* Add top padding for fixed navbar */}
        <div className="pt-24 sm:pt-32" />

        <EventShowcaseScene />

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>

        <BackToTop />
      </main>
    </>
  );
}
