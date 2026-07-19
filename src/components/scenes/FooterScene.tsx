'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, SiteSettings } from '@/lib/database';
import { Mail, Phone, MapPin, Zap } from 'lucide-react';

function GithubIcon() {
 return (
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
 <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
 </svg>
 );
}

function TwitterIcon() {
 return (
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
 </svg>
 );
}

function InstagramIcon() {
 return (
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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

 return (
 <footer id="contact" className="relative pt-20 pb-10 px-4 border-t border-white/[0.06] overflow-hidden" >
 {/* Background */}
 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16 relative z-10">
 
 {/* Venue & Info */}
 <div className="flex flex-col gap-6">
 <div className="glass-strong p-8 rounded-3xl">
 <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Event Coordinators</h4>
 <div className="flex flex-col gap-5 text-sm text-gray-300">
  <div className="flex items-start gap-3 hover:text-white transition-colors group">
  <MapPin className="w-5 h-5 mt-0.5 text-[var(--neon-magenta)] group-hover:scale-110 transition-transform shrink-0" /> 
  <span>
  <strong className="block text-white mb-1 font-bold text-base">{settings?.contact_institute || 'Chennai Institute of Technology'}</strong>
  {settings?.contact_address || 'Sarathy Nagar, Kundrathur, Chennai - 600069, Tamil Nadu'}
  </span>
  </div>
  <a href={`mailto:${settings?.contact_email || 'support@youthfest2026.com'}`} className="flex items-center gap-3 hover:text-white transition-colors group mt-2">
  <Mail className="w-5 h-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" /> 
  {settings?.contact_email || 'support@youthfest2026.com'}
  </a>
  <a href={`tel:${settings?.contact_phone || '+91 98765 43210'}`} className="flex items-center gap-3 hover:text-white transition-colors group">
  <Phone className="w-5 h-5 text-[var(--neon-lime)] group-hover:scale-110 transition-transform" /> 
  {settings?.contact_phone || '+91 98765 43210'}
  </a>
  <a href={`https://wa.me/${(settings?.contact_whatsapp || '+919876543210').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
  <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
  WhatsApp Coordinator
  </a>
  </div>
  </div>

  </div>

 {/* Quick Links & Social */}
 <div className="flex flex-col gap-6">
 <div className="glass-strong p-8 rounded-3xl h-full flex flex-col justify-between">
 <div>
 <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Quick Links</h4>
 <div className="flex flex-col gap-4 text-sm text-gray-300">
 <Link href="#hero" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Home</Link>
 <Link href="#schedule" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Schedule</Link>
 <Link href="#events" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Events</Link>
 <Link href="#speakers" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Speakers</Link>
 <Link href="#faq" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">FAQ</Link>
 </div>
 </div>
 
  {/* Social Links */}
  <div className="flex gap-4 sm:gap-3 justify-start mt-8">
  <a href="#" className="p-4 sm:p-3 rounded-2xl sm:rounded-xl glass text-gray-400 hover:text-[var(--neon-cyan)] hover:bg-white/[0.06] transition-all">
  <GithubIcon />
  </a>
  <a href="#" className="p-4 sm:p-3 rounded-2xl sm:rounded-xl glass text-gray-400 hover:text-[var(--neon-cyan)] hover:bg-white/[0.06] transition-all">
  <TwitterIcon />
  </a>
  <a href="#" className="p-4 sm:p-3 rounded-2xl sm:rounded-xl glass text-gray-400 hover:text-[var(--neon-cyan)] hover:bg-white/[0.06] transition-all">
  <InstagramIcon />
  </a>
  </div>
  </div>
  </div>

  </div>

 {/* Copyright */}
 <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 text-center flex flex-col items-center justify-center gap-4 text-xs text-gray-500 select-none relative z-10">
 <p className="flex items-center justify-center gap-2">
 <Zap className="w-3 h-3 text-[var(--neon-cyan)]" />
 © 2026 Yuvenza Club. All rights reserved.
 </p>
 <div className="flex gap-4 justify-center">
 <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
 <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
 </div>
 </div>
 </footer>
 );
}
