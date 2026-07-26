'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../lib/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { User, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home', sectionId: '#hero' },
  { href: '/events', label: 'Events' },
  { href: '/#committee', label: 'Team', sectionId: '#committee' },
  { href: '/#sponsors', label: 'Sponsors', sectionId: '#sponsors' },
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
      if (!id) return;
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
  const setUser = useStore((state) => state.setUser);
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  
  const activeSection = useActiveSection(navLinks.map(l => l.sectionId).filter(Boolean) as string[]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      // Hide if scrolling down past 100px
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } 
      // Show if scrolling up or at the very top
      else if (currentScrollY < lastScrollY.current || currentScrollY <= 100) {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only close mobile menu. Let Next.js and Lenis handle the actual #id scroll natively.
    setMobileOpen(false);
  };

  return (
    <>
      {/* Invisible hover area at top of screen to reveal navbar */}
      <div 
        className="fixed top-0 left-0 w-full h-12 z-[60]" 
        onMouseEnter={() => setHidden(false)} 
      />

      <nav
        className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl transition-all duration-500 backdrop-blur-xl ${
          hidden ? '-top-32 opacity-0' : 'top-4 opacity-100'
        } ${
          scrolled || mobileOpen
            ? 'bg-[#030014]/80 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-white/[0.02] border border-white/[0.05]'
        }`}
      >
        <div className="px-5 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5" onClick={(e) => handleSmoothScroll(e, '#hero')}>
            <div className="relative flex items-center justify-center">
              <Image src="/eventlogo.png" alt="Youthfest Logo" width={32} height={32} priority loading="eager" className="w-8 h-8 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] uppercase tracking-[0.2em] text-gray-400 font-bold leading-none mb-0.5">Yuvenza Presents</span>
              <span className="font-[var(--font-heading-main)] font-extrabold text-lg leading-none tracking-wider bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
                YOUTHFEST
              </span>
            </div>
            <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
              2026
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.sectionId 
                ? activeSection === link.sectionId && pathname === '/'
                : pathname === link.href;
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
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
          <div className="flex items-center gap-2">
            {/* Admin Secret Portal */}
            <Link 
              href="/admin" 
              className="flex p-2 rounded-xl text-white/20 hover:bg-white/5 hover:text-[var(--neon-cyan)] transition-all duration-300 min-w-[44px] min-h-[44px] items-center justify-center md:min-w-0 md:min-h-0"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5 md:w-4 md:h-4" />
            </Link>

            {/* Auth CTA */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setAuthOpen(true, 'register')}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[var(--neon-cyan)] text-black hover:opacity-80 transition-all duration-300 min-h-[44px] flex items-center justify-center"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setAuthOpen(true, 'login')}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300 min-h-[44px] flex items-center justify-center"
                >
                  Log In
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300 min-h-[44px]"
                  title="User Dashboard"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => setUser(null)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-300 min-h-[44px]"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#030014]/95 backdrop-blur-xl md:hidden pt-28 px-6 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => {
                const isActive = link.sectionId 
                  ? activeSection === link.sectionId && pathname === '/'
                  : pathname === link.href;
                return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={`block py-3 text-4xl sm:text-5xl font-[var(--font-heading-main)] font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] translate-x-4' 
                        : 'text-gray-500 hover:text-white hover:translate-x-2'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-[var(--neon-cyan)] to-[var(--neon-magenta)] rounded-full shadow-[0_0_15px_var(--neon-cyan)]" />
                    )}
                    {link.label}
                  </Link>
                </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4"
              >
                {!user ? (
                  <>
                    <button
                      onClick={() => { setAuthOpen(true, 'register'); setMobileOpen(false); }}
                      className="w-full py-4 rounded-full text-base font-semibold bg-[var(--neon-cyan)] text-black min-h-[44px]"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => { setAuthOpen(true, 'login'); setMobileOpen(false); }}
                      className="w-full py-4 rounded-full text-base font-semibold bg-[var(--neon-cyan)] text-black min-h-[44px]"
                    >
                      Log In
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => { router.push('/profile'); setMobileOpen(false); }}
                      className="w-full py-4 rounded-full text-base font-semibold bg-[var(--neon-cyan)] text-black min-h-[44px] flex justify-center items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Go to Profile
                    </button>
                    <button
                      onClick={() => { setUser(null); setMobileOpen(false); }}
                      className="w-full py-4 rounded-full text-base font-semibold border border-white/20 text-white hover:bg-white/10 min-h-[44px] flex justify-center items-center gap-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
