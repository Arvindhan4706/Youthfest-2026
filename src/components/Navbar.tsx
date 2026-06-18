'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { User, Menu, X, Zap } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const user = useStore((state) => state.user);
  const isAuthOpen = useStore((state) => state.isAuthOpen);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#events', label: 'Events' },
    { href: '#prizes', label: 'Prizes' },
    { href: '#trailer', label: 'Trailer' },
    { href: '#speakers', label: 'Speakers' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
            : 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]'
        }`}
      >
        <div className="px-5 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-[var(--font-orbitron)] font-extrabold text-lg tracking-wider bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              YUVENZA
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
              2026
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: CTA + User */}
          <div className="flex items-center gap-2.5">
            {/* Register CTA */}
            <button
              onClick={handleRegisterCTA}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-[1.02]"
            >
              <Zap className="w-3 h-3" />
              Register Now
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
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-5 pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-400 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleRegisterCTA}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white"
            >
              <Zap className="w-3.5 h-3.5" />
              Register Now
            </button>
          </div>
        )}
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
