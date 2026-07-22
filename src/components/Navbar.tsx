'use client';
import React, { useState, useEffect, useRef } from 'react';
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
 const [hidden, setHidden] = useState(false);
 const lastScrollY = useRef(0);
 const activeSection = useActiveSection(navLinks.map(l => l.href));
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
 const handleUserClick = (e: React.MouseEvent) => {
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
 {/* Replay Intro Button */}
 <button 
 onClick={() => {
   sessionStorage.removeItem('hasSeenIntro');
   localStorage.removeItem('y26_has_seen_intro');
   window.location.href = '/?replay=true';
 }}
 className="flex items-center gap-1 p-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-[var(--neon-cyan)] transition-all duration-300 text-xs font-mono"
 title="Replay Image Flash Intro"
 >
 <Zap className="w-4 h-4 text-[var(--neon-cyan)] animate-pulse" />
 <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-wider">Replay Intro</span>
 </button>
 {/* Admin Secret Portal */}
 <Link 
 href="/admin" 
 className="flex p-2 rounded-xl text-white/20 hover:bg-white/5 hover:text-[var(--neon-cyan)] transition-all duration-300"
 title="Admin Portal"
 >
 <ShieldCheck className="w-4 h-4" />
 </Link>
 {/* Auth CTA */}
 {!user ? (
 <div className="hidden sm:flex items-center gap-2">
 <button
 onClick={() => setAuthOpen(true, 'register')}
 className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300"
 >
 Sign In
 </button>
 <button
 onClick={() => setAuthOpen(true, 'login')}
 className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300"
 >
 Log In
 </button>
 </div>
 ) : (
 <button
 onClick={() => router.push('/dashboard')}
 className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-200 transition-all duration-300"
 title="User Dashboard"
 >
 <User className="w-3.5 h-3.5" />
 Dashboard
 </button>
 )}
 </div>
 </div>
 </nav>
 <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
 </>
 );
}
