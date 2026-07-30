'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../lib/useStore';
import { db } from '../lib/database';
import { useRouter, usePathname } from 'next/navigation';
import { User, Menu, X, Bell, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Center navigation links ───────────────────────────────────────────────────
const navLinks = [
  { href: '/',        label: 'Home',     sectionId: '#hero',  desc: 'Discover Yuvenza' },
  { href: '/work',    label: 'Work',     desc: 'Explore our initiatives and achievements' },
  { href: '/events',  label: 'Events',   desc: 'Browse competitions, workshops, and performances' },
  { href: '#',        label: 'Register', action: 'register',  desc: 'Sign up for your favorite events' },
  { href: '/about',   label: 'About',    desc: 'Learn about Yuvenza and our mission' },
];

// ── Active section tracker ────────────────────────────────────────────────────
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState('#hero');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );
    sectionIds.forEach((id) => {
      if (!id) return;
      const el = document.getElementById(id.replace('#', ''));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);
  return activeId;
}

// ── Lamp indicator (active link underline glow) ───────────────────────────────
function LampIndicator() {
  return (
    <motion.div
      layoutId="lamp"
      className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
      initial={false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--neon-cyan)] rounded-t-full">
        <div className="absolute w-12 h-6 bg-[var(--neon-cyan)]/20 rounded-full blur-md -top-2 -left-2" />
        <div className="absolute w-8 h-6 bg-[var(--neon-cyan)]/20 rounded-full blur-md -top-1" />
        <div className="absolute w-4 h-4 bg-[var(--neon-cyan)]/20 rounded-full blur-sm top-0 left-2" />
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const user      = useStore((s) => s.user);
  const setUser   = useStore((s) => s.setUser);
  const messages  = useStore((s) => s.messages);
  const setAuthOpen = useStore((s) => s.setAuthOpen);
  const router    = useRouter();
  const pathname  = usePathname();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const lastScrollY = useRef(0);

  const sectionIds = navLinks.map((l) => l.sectionId).filter(Boolean) as string[];
  const activeSection = useActiveSection(sectionIds);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      
      // Prevent small pixel jitters (like iOS scroll bounce) from rapidly toggling the navbar
      if (Math.abs(y - lastScrollY.current) > 10) {
        setHidden(y > lastScrollY.current && y > 100);
        if (y < lastScrollY.current || y <= 100) setHidden(false);
        lastScrollY.current = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const close = () => setNotifOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [notifOpen]);

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (link.action === 'register') {
      e.preventDefault();
      setAuthOpen(true, 'register');
    }
    setMobileOpen(false);
  };

  const isLinkActive = (link: typeof navLinks[0]) =>
    link.sectionId
      ? activeSection === link.sectionId && pathname === '/'
      : pathname === link.href && link.href !== '#';

  const unreadCount = messages.length;

  return (
    <>
      {/* Invisible hover strip — reveals navbar when cursor hits top */}
      <div
        className="fixed top-0 left-0 w-full h-12 z-[60]"
        onMouseEnter={() => setHidden(false)}
      />

      {/* ── Main navbar ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed left-1/2 -translate-x-1/2 w-[88%] max-w-6xl z-50 rounded-2xl transition-all duration-500 ${
          hidden ? '-top-32 opacity-0' : 'top-4 opacity-100'
        } ${
          scrolled || mobileOpen
            ? 'bg-[#030014]/85 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl'
        }`}
      >
        <div className="px-6 h-[64px] md:h-[72px] flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/admin" aria-label="Admin Portal" className="group" title="Admin Portal">
              <Image
                src="/eventlogo.png"
                alt="Yuvenza Logo"
                width={36}
                height={36}
                priority
                className="w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <Link href="/" aria-label="Yuvenza Home" className="group flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[7px] uppercase tracking-[0.2em] text-gray-400 font-bold leading-none mb-0.5">
                  Yuvenza Presents
                </span>
                <span className="font-[var(--font-heading-main)] font-extrabold text-lg leading-none tracking-wider bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
                  YOUTHFEST
                </span>
              </div>
              <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
                2026
              </span>
            </Link>
          </div>

          {/* ── Desktop Center Nav ── */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center" role="menubar">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  role="menuitem"
                  aria-current={active ? 'page' : undefined}
                  title={link.desc}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`relative px-4 py-2 rounded-full transition-colors duration-200 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] ${
                    active ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && <LampIndicator />}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Right Side ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">

            {user ? (
              <>
                {/* Notifications bell */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setNotifOpen((v) => !v); }}
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                    className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--neon-cyan)] ring-2 ring-[#030014]" />
                    )}
                  </button>

                  {/* Notification dropdown */}
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#030014]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                          <span className="text-xs font-bold text-white uppercase tracking-widest">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--neon-cyan)] text-black font-bold">{unreadCount} new</span>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {messages.length === 0 ? (
                            <p className="text-gray-500 text-xs text-center py-8">No notifications yet</p>
                          ) : (
                            messages.slice(0, 5).map((msg) => (
                              <div key={msg.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <p className="text-white text-xs font-semibold truncate">{msg.subject}</p>
                                <p className="text-gray-500 text-[10px] mt-0.5">{msg.eventTitle}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="px-4 py-3">
                          <button
                            onClick={() => { router.push('/profile'); setNotifOpen(false); }}
                            className="text-[var(--neon-cyan)] text-xs font-semibold hover:underline flex items-center gap-1"
                          >
                            View all in inbox <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile avatar button */}
                <button
                  onClick={() => router.push('/profile')}
                  title={`${user.name || 'Profile'} — Manage registrations, tickets, and account`}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 min-h-[44px]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black text-xs flex-shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm font-semibold text-white max-w-[100px] truncate">{user.name?.split(' ')[0] || 'Profile'}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => { setUser(null); router.push('/'); }}
                  title="Sign out"
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true, 'login')}
                  className="px-5 py-2 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-300 min-h-[38px] flex items-center"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthOpen(true, 'register')}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-[var(--neon-cyan)] text-black hover:opacity-80 transition-all duration-300 min-h-[38px] flex items-center shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#030014]/97 backdrop-blur-2xl md:hidden flex flex-col pt-28 px-6 pb-8 overflow-y-auto" data-lenis-prevent="true"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Nav links */}
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const active = isLinkActive(link);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className={`flex items-center justify-between py-4 border-b border-white/5 transition-colors group ${
                        active ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className={`text-2xl font-[var(--font-heading-main)] font-black uppercase tracking-wide ${active ? 'text-white' : ''}`}>
                          {link.label}
                          {active && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] ml-2 mb-1" />
                          )}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                );
              })}

              {/* Profile link (only when logged in) */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                >
                  <button
                    onClick={() => { router.push('/profile'); setMobileOpen(false); }}
                    className="w-full flex items-center justify-between py-4 border-b border-white/5 text-gray-400 hover:text-white group transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-2xl font-[var(--font-heading-main)] font-black uppercase tracking-wide">Profile</p>
                      <p className="text-xs text-gray-600 mt-0.5">Manage registrations, tickets, and account</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </motion.div>
              )}
            </nav>

            {/* Mobile auth actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-auto pt-8 flex flex-col gap-3"
            >
              {!user ? (
                <>
                  <button
                    onClick={() => { setAuthOpen(true, 'register'); setMobileOpen(false); }}
                    className="w-full py-4 rounded-2xl text-base font-bold bg-[var(--neon-cyan)] text-black min-h-[52px] tracking-wide"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => { setAuthOpen(true, 'login'); setMobileOpen(false); }}
                    className="w-full py-4 rounded-2xl text-base font-bold border border-white/20 text-white hover:bg-white/10 min-h-[52px] tracking-wide transition-colors"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  {/* Logged-in user card */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black">
                      {user.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.name || 'User'}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setUser(null); setMobileOpen(false); router.push('/'); }}
                    className="w-full py-4 rounded-2xl text-base font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 min-h-[52px] tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
