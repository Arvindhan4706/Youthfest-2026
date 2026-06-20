'use client';

import React, { useState } from 'react';
import { useStore } from '../../lib/useStore';
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react';

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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const addToast = useStore((state) => state.addToast);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('Please fill in all fields.');
      return;
    }
    setFormStatus('Thank you! Your message has been sent successfully.');
    setFormData({ name: '', email: '', message: '' });
    addToast('Message sent to organizing committee!', { points: 30 });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterStatus('Please provide an email.');
      return;
    }
    setNewsletterStatus('Subscribed successfully!');
    setNewsletterEmail('');
    addToast('Subscribed to Youthfest Newsletter!', { points: 20 });
  };

  return (
    <footer id="contact" className="relative pt-20 pb-10 px-4 border-t border-white/[0.06] overflow-hidden" style={{ background: '#010008' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--neon-violet)]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start mb-16 relative z-10">
        {/* Contact Form */}
        <div className="lg:col-span-4 glass-strong p-6 sm:p-8 rounded-2xl">
          <h3 className="text-lg font-[var(--font-orbitron)] font-bold text-white mb-6 uppercase tracking-wider">
            Contact <span className="text-[var(--neon-cyan)]">Committee</span>
          </h3>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)]/40 transition-colors"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)]/40 transition-colors"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)]/40 transition-colors h-24 resize-none"
                placeholder="How can we help?"
              />
            </div>

            {formStatus && (
              <p className={`text-xs ${formStatus.includes('success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formStatus}
              </p>
            )}

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Venue & Info */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-strong p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Event Coordinators</h4>
            <div className="flex flex-col gap-4 text-xs text-gray-300">
              <a href="https://maps.google.com/?q=Campus+Arena+Center" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <MapPin className="w-4 h-4 text-[var(--neon-magenta)] group-hover:scale-110 transition-transform" /> 
                Campus Arena Center, Gate 2 (Directions)
              </a>
              <a href="mailto:support@youthfest2026.com" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" /> 
                support@youthfest2026.com (Email)
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-[var(--neon-lime)] group-hover:scale-110 transition-transform" /> 
                +91 98765 43210 (Call Now)
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <svg className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp Coordinator
              </a>
            </div>
          </div>

          {/* Map Mock */}
          <div className="h-44 w-full rounded-2xl overflow-hidden border border-white/[0.08] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10" style={{ background: '#0a0020' }}>
              <MapPin className="w-8 h-8 text-[var(--neon-magenta)] animate-bounce mb-1" />
              <h5 className="font-bold text-white text-xs">Interactive Map</h5>
              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Main Campus Center Arena, 23.0225° N, 72.5714° E</p>
            </div>
            <div className="absolute inset-0 bg-grid-dense opacity-20" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-strong p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <a href="#home" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Home</a>
              <a href="#schedule" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Schedule</a>
              <a href="#events" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Events</a>
              <a href="#speakers" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">Speakers</a>
              <a href="#faq" className="hover:text-[var(--neon-cyan)] hover:translate-x-1 transition-all">FAQ</a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-strong p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Newsletter</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Get event alerts, schedule updates, and surprise artist reveals straight to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)]/40"
              />
              {newsletterStatus && <p className="text-[10px] text-emerald-400">{newsletterStatus}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 justify-center lg:justify-start">
            <a href="#" className="p-3 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <GithubIcon />
            </a>
            <a href="#" className="p-3 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <TwitterIcon />
            </a>
            <a href="#" className="p-3 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 select-none relative z-10">
        <p className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-[var(--neon-cyan)]" />
          © 2026 Yuvenza Club. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
