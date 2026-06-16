'use client';

import React, { useState } from 'react';
import { useStore } from '../../lib/useStore';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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
    // Success mock
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
    addToast('Subscribed to Yuvenza Newsletter!', { points: 20 });
  };

  return (
    <footer id="contact" className="relative bg-black pt-20 pb-10 px-4 border-t border-white/10 overflow-hidden">
      
      {/* Outer Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Contact Form */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Contact Committee</h3>
          
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
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
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Map Embed and Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Location details */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Venue Coordinates</h4>
            <div className="flex flex-col gap-3.5 text-xs text-gray-300">
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500" /> Campus Arena Center, Gate 2
              </span>
              <span className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400" /> support@yuvenzaclubs.com
              </span>
              <span className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400" /> +91 98765 43210
              </span>
            </div>
          </div>

          {/* Map Image Mock */}
          <div className="h-44 w-full rounded-3xl overflow-hidden border border-white/10 relative">
            <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-4 text-center z-10">
              <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-1" />
              <h5 className="font-bold text-white text-xs">interactive map</h5>
              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Main Campus Center Arena, 23.0225° N, 72.5714° E</p>
            </div>
            {/* Ambient grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

        </div>

        {/* Committee / Newsletter */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Newsletter Signup */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Newsletter</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">Subscribe for event alerts, schedule shifts, and special guest reveals.</p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
              />
              {newsletterStatus && <p className="text-[10px] text-emerald-400">{newsletterStatus}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-white text-black hover:bg-purple-500 hover:text-white font-bold text-xs rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 justify-center lg:justify-start">
            <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <GithubIcon />
            </a>
            <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <TwitterIcon />
            </a>
            <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <InstagramIcon />
            </a>
          </div>

        </div>

      </div>

      {/* Copywright Info */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 select-none">
        <p>© 2026 Yuvenza Club Organizing Committee. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        </div>
      </div>

    </footer>
  );
}
