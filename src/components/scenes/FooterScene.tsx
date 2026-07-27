'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, SiteSettings } from '@/lib/database';
import { Mail, Phone, MapPin, ChevronRight, Send } from 'lucide-react';
import { motion, Variants } from 'framer-motion';


function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function FooterScene() {

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await db.getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings for footer', err);
      }
    };
    fetchSettings();
  }, []);

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Schedule', href: '/#schedule' },
    { label: 'Register', href: '/#register' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Sponsors', href: '/#sponsors' },
    { label: 'Contact', href: '#contact' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <footer id="contact" className="relative pt-[64px] pb-[64px] lg:pt-[100px] lg:pb-[80px] border-t border-white/[0.08] overflow-hidden bg-[#030008]">
      {/* Dynamic Background glows */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--neon-violet)]/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--neon-cyan)]/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* TOP CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 mb-16 border-b border-white/10 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-3xl -z-10" />
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-[var(--font-heading-main)] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--neon-cyan)] to-[var(--neon-violet)] uppercase tracking-wider mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              See You at YouthFest 2026!
            </h3>
            <p className="text-gray-400 max-w-lg text-sm leading-relaxed">Join thousands of students for an unforgettable celebration of innovation, creativity, culture, and community.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            <Link href="/events" className="group flex items-center justify-center px-8 h-[52px] rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all overflow-hidden relative">
              <span className="relative z-10">Explore Events</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)]/20 to-[var(--neon-violet)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link href="/profile" className="flex items-center justify-center px-8 h-[52px] rounded-full bg-white text-black hover:scale-105 font-bold transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Register Now
            </Link>
          </div>
        </motion.div>

        {/* MAIN FOOTER GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-20"
        >
          
          {/* Brand Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
            <div>
              <Link href="/" className="inline-block text-3xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-widest mb-1 hover:text-[var(--neon-cyan)] transition-colors">
                YouthFest 2026
              </Link>
              <div className="h-1 w-20 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] rounded-full mb-4" />
              <p className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-widest mb-4">Celebrate Talent • Inspire Innovation • Create Memories</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                YouthFest 2026 is the flagship annual festival celebrating innovation, creativity, culture, and collaboration. Bringing together students from across colleges to create unforgettable experiences.
              </p>
            </div>
            {/* Socials */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--neon-magenta)] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,0,127,0.3)] transition-all duration-300"><InstagramIcon /></a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077B5] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,119,181,0.3)] transition-all duration-300"><LinkedinIcon /></a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(24,119,242,0.3)] transition-all duration-300"><FacebookIcon /></a>
                <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,0,0,0.3)] transition-all duration-300"><YoutubeIcon /></a>
                <a href="#" aria-label="Twitter/X" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] border border-transparent hover:border-white/20 transition-all duration-300"><TwitterXIcon /></a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-3 group">
                  <ChevronRight className="w-4 h-4 text-[var(--neon-cyan)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-violet)] animate-pulse" />
                Contact Us
              </h4>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--neon-cyan)]/20 transition-colors">
                    <MapPin className="w-5 h-5 text-[var(--neon-cyan)]" />
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed pt-1">
                    <strong className="text-white block mb-1">YouthFest Organizing Committee</strong>
                    Chennai Institute of Technology<br/>
                    Sarathy Nagar, Kundrathur, Chennai
                  </p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--neon-violet)]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[var(--neon-violet)]" />
                  </div>
                  <a href="mailto:support@youthfest.in" className="text-sm text-gray-400 hover:text-white transition-colors">support@youthfest.in</a>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--neon-magenta)]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[var(--neon-magenta)]" />
                  </div>
                  <a href="tel:+917339524706" className="text-sm text-gray-400 hover:text-white transition-colors">+91 73395 24706</a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM LEGAL BAR */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center items-center pt-6 border-t border-white/10"
        >
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">© 2026 YouthFest. All Rights Reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}

