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
    
    // Smooth scrolling is already handled globally by GlobalClientProviders
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



        {/* Event Showcase */}
        <EventShowcaseScene />

        {/* Why Participate & Event Experience */}
        <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl font-black font-[var(--font-heading-main)] text-white uppercase mb-8">Why Participate?</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-[var(--neon-cyan)] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Showcase your talent</h4>
                  <p className="text-gray-400 text-sm">Perform and compete on a massive platform in front of thousands.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--neon-violet)]/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-[var(--neon-violet)] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Win exciting prizes</h4>
                  <p className="text-gray-400 text-sm">Take home a share of our ₹5,00,000+ prize pool and earn certificates.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--neon-magenta)]/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-[var(--neon-magenta)] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Connect and Network</h4>
                  <p className="text-gray-400 text-sm">Meet peers, mentors, and industry experts who share your passion.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--neon-lime)]/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-[var(--neon-lime)] rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Experience the energy</h4>
                  <p className="text-gray-400 text-sm">Immerse yourself in the vibrant, unmatched energy of the YouthFest community.</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-black font-[var(--font-heading-main)] text-white uppercase mb-8">Event Experience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--neon-cyan)]/50 transition-colors">
                <h4 className="text-[var(--neon-cyan)] font-bold mb-2">Competition</h4>
                <p className="text-sm text-gray-400">Push your limits in intense technical and cultural contests.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--neon-violet)]/50 transition-colors">
                <h4 className="text-[var(--neon-violet)] font-bold mb-2">Learning</h4>
                <p className="text-sm text-gray-400">Gain hands-on experience through expert-led workshops.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--neon-magenta)]/50 transition-colors">
                <h4 className="text-[var(--neon-magenta)] font-bold mb-2">Entertainment</h4>
                <p className="text-sm text-gray-400">Enjoy live performances, DJ nights, and interactive stalls.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--neon-lime)]/50 transition-colors">
                <h4 className="text-[var(--neon-lime)] font-bold mb-2">Networking</h4>
                <p className="text-sm text-gray-400">Build connections and friendships that last well beyond the festival.</p>
              </div>
            </div>
          </div>
        </div>

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>

        <BackToTop />
      </main>
    </>
  );
}
