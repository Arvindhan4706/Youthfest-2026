'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';
import dynamic from 'next/dynamic';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { useStore } from '../lib/useStore';
import { usePathname } from 'next/navigation';

const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });
const PaymentModal = dynamic(() => import('./PaymentModal'), { ssr: false });

export default function GlobalClientProviders({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  const hideNavbarRoutes = ['/profile', '/admin', '/scanner'];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => pathname?.startsWith(route));
  
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  
  // Register Konami Easter Egg Code listener
  useKonamiCode();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    
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
  }, [hasMounted]);

  const isSecretMode = useStore((state) => state.isSecretMode);

  return (
    <div className={`transition-colors duration-1000 ${isSecretMode ? 'bg-black text-[var(--neon-cyan)] font-[var(--font-heading-main)]' : ''}`}>
      {shouldShowNavbar && <Navbar />}
      <ToastContainer />
      {hasMounted && <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />}
      {hasMounted && <PaymentModal />}
      {children}
    </div>
  );
}

