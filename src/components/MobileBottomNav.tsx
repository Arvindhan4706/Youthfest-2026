'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Calendar, LayoutGrid, User } from 'lucide-react';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const [activeSection, setActiveSection] = useState('#hero');
  const user = useStore((state) => state.user);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();

  // Track active section for mobile highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );
    const sections = ['#hero', '#events', '#schedule', '#sponsors', '#faq', '#contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id.replace('#', ''));
      if (element) {
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, []);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthOpen(true, 'login');
    }
  };

  const navItems = [
    { id: '#hero', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: '#events', icon: <LayoutGrid className="w-5 h-5" />, label: 'Events' },
    { id: '#schedule', icon: <Calendar className="w-5 h-5" />, label: 'Schedule' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden pb-safe pt-2 bg-black/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all duration-300 ${
                isActive ? 'text-[var(--neon-cyan)] scale-110' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium tracking-wide">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-3 w-10 h-1 bg-[var(--neon-cyan)] rounded-b-md shadow-[0_2px_10px_var(--neon-cyan)]"
                />
              )}
            </a>
          );
        })}
        {/* Profile/Auth Button */}
        <button
          onClick={handleUserClick}
          className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all duration-300 ${
            user ? 'text-[var(--neon-magenta)]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-wide">{user ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </div>
  );
}
