'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { User, Menu, X, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#events', label: 'Events' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#sponsors', label: 'Sponsors' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState('#hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id.replace('#', ''));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

export default function Navbar() {
  const user = useStore((state) => state.user);
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const activeSection = useActiveSection(navLinks.map(l => l.href));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthOpen(true);
    }
  };

  const handleRegisterCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthOpen(true);
    }
    setMobileOpen(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only close mobile menu. Let Next.js and Lenis handle the actual #id scroll natively.
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-white/[0.02] backdrop-blur-md border border-white/[0.05]'
        }`}
      >
        <div className="px-5 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5" onClick={(e) => handleSmoothScroll(e, '#hero')}>
            <div className="relative flex items-center justify-center">
              <Image src="/eventlogo.png" alt="Youthfest Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] uppercase tracking-[0.2em] text-gray-400 font-bold leading-none mb-0.5">Yuvenza Presents</span>
              <span className="font-[var(--font-orbitron)] font-extrabold text-lg leading-none tracking-wider bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
                YOUTHFEST
              </span>
            </div>
            <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
              2026
            </span>
          </Link>

          {/* Desktop Navigation Links (Tubelight Effect) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className={`relative px-4 py-2 rounded-full transition-colors duration-200 text-sm font-semibold ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--neon-cyan)] rounded-t-full">
                        <div className="absolute w-12 h-6 bg-[var(--neon-cyan)]/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-[var(--neon-cyan)]/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-[var(--neon-cyan)]/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side: CTA + User */}
          <div className="flex items-center gap-2.5">
            {/* Admin Secret Portal */}
            <Link 
              href="/admin" 
              className="hidden sm:flex p-2 rounded-xl text-white/20 hover:bg-white/5 hover:text-[var(--neon-cyan)] transition-all duration-300"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Register CTA */}
            <button
              onClick={handleRegisterCTA}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-[1.02]"
            >
              <Zap className="w-3 h-3" />
              Register
            </button>

            {/* User Icon */}
            <button
              onClick={handleUserClick}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
              title={user ? 'User Dashboard' : 'Login / Register'}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 px-5 pb-4 pt-2 flex flex-col gap-1 overflow-hidden bg-black/40 backdrop-blur-2xl rounded-b-2xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className={`text-sm py-3 px-4 rounded-xl transition-all flex items-center ${
                    activeSection === link.href 
                      ? 'bg-white/10 text-white font-semibold shadow-[inset_2px_0_0_var(--neon-cyan)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleRegisterCTA}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                <Zap className="w-3.5 h-3.5" />
                Register Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
