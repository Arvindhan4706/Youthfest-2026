'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, SiteSettings } from '@/lib/database';
import { Mail, Phone, MapPin, ChevronRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { label: 'About', href: '/#about' },
    { label: 'Events', href: '/events' },
    { label: 'Schedule', href: '/#schedule' },
    { label: 'Register', href: '/#register' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Sponsors', href: '/#sponsors' },
    { label: 'Contact', href: '#contact' },
  ];

  const eventLinks = [
    { label: 'Technical Events', href: '/events' },
    { label: 'Cultural Events', href: '/events' },
    { label: 'Hackathon', href: '/events' },
    { label: 'Workshops', href: '/events' },
    { label: 'Gaming Arena', href: '/events' },
    { label: 'Photography', href: '/events' },
    { label: 'Music & Dance', href: '/events' },
    { label: 'Fun Events', href: '/events' },
  ];

  const participantServices = [
    { label: 'My Profile', href: '/profile' },
    { label: 'Dashboard', href: '/profile' },
    { label: 'My Registrations', href: '/profile' },
    { label: 'My Tickets', href: '/profile' },
    { label: 'Certificates', href: '/profile' },
    { label: 'Payment History', href: '/profile' },
    { label: 'Help Center', href: '/profile' },
  ];

  return (
    <footer id="contact" className="relative pt-24 pb-12 px-4 border-t border-white/[0.06] overflow-hidden bg-[#050010]">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* TOP CTA / NEWSLETTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-16 border-b border-white/10 mb-16">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-2">See You at YouthFest 2026!</h3>
            <p className="text-gray-400 max-w-lg text-sm">Join thousands of students for an unforgettable celebration of innovation, creativity, culture, and community.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/events" className="px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all">Explore Events</Link>
            <Link href="/profile" className="px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">Register Now</Link>
          </div>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div>
              <Link href="/" className="inline-block text-2xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-widest mb-2">
                YouthFest 2026
              </Link>
              <p className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-widest mb-4">Celebrate Talent • Inspire Innovation • Create Memories</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                YouthFest 2026 is the flagship annual festival celebrating innovation, creativity, culture, and collaboration. Bringing together students from across colleges to compete, learn, perform, and create unforgettable experiences.
              </p>
            </div>
            {/* Socials */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--neon-magenta)] hover:shadow-[0_0_15px_rgba(255,0,127,0.5)] transition-all"><InstagramIcon /></a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077B5] hover:shadow-[0_0_15px_rgba(0,119,181,0.5)] transition-all"><LinkedinIcon /></a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] transition-all"><FacebookIcon /></a>
                <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all"><YoutubeIcon /></a>
                <a href="#" aria-label="Twitter/X" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-white/50 border border-transparent transition-all"><TwitterXIcon /></a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10">Events</h4>
            <div className="flex flex-col gap-3">
              {eventLinks.map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-[var(--neon-violet)] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Participant Services */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10">Participant Services</h4>
            <div className="flex flex-col gap-3">
              {participantServices.map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-[var(--neon-magenta)] hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10 mb-6">Contact Us</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--neon-cyan)] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-400 leading-relaxed">
                    <strong className="text-white block">YouthFest Organizing Committee</strong>
                    Chennai Institute of Technology<br/>
                    Sarathy Nagar, Kundrathur, Chennai
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--neon-violet)] shrink-0" />
                  <a href="mailto:support@youthfest.in" className="text-sm text-gray-400 hover:text-white transition-colors">support@youthfest.in</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--neon-magenta)] shrink-0" />
                  <a href="tel:+917339524706" className="text-sm text-gray-400 hover:text-white transition-colors">+91 73395 24706</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-4 border-b border-white/10 mb-4">Stay Updated</h4>
              <p className="text-xs text-gray-400 mb-4">Subscribe to receive the latest announcements and event updates.</p>
              <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                />
                <button type="submit" aria-label="Subscribe to newsletter" className="absolute right-1 w-8 h-8 rounded-full bg-[var(--neon-cyan)] text-black flex items-center justify-center hover:scale-105 transition-transform">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-xs text-gray-500">
          <p>© 2026 YouthFest. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
          <p>Designed and Developed by the <span className="text-[var(--neon-cyan)] font-medium">YouthFest Technical Team</span>.</p>
        </div>
      </div>
    </footer>
  );
}
