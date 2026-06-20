'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

interface Guest {
  id: string;
  name: string;
  title: string;
  industry: string;
  bio: string;
  color: string;
  image: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const CHIEF_GUESTS: Guest[] = [
  {
    id: 'cg-1',
    name: 'Thalapathy Vijay',
    title: 'Superstar & Philanthropist',
    industry: 'Tamil Cinema',
    bio: 'One of the highest-paid actors in India, known for his massive fan following and blockbuster hits. Making a very special appearance at Youthfest 2026.',
    color: '#00f0ff',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', // Using generic placeholder
    socials: { twitter: '#', instagram: '#' }
  },
  {
    id: 'cg-2',
    name: 'Suriya Sivakumar',
    title: 'Actor & Producer',
    industry: 'Guest of Honor',
    bio: 'Acclaimed actor and founder of Agaram Foundation. An inspiration to millions of students across Tamil Nadu.',
    color: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', // Using generic placeholder
    socials: { twitter: '#', instagram: '#' }
  },
  {
    id: 'cg-3',
    name: 'Sivakarthikeyan',
    title: 'Actor & Entertainer',
    industry: 'Youth Icon',
    bio: 'From television anchor to leading star, his journey is a testament to hard work. Join us as he shares his inspiring story.',
    color: '#ff006e',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', // Using generic placeholder
    socials: { twitter: '#', instagram: '#' }
  },
];

function GuestCard({ guest, index }: { guest: Guest; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group rounded-2xl glass-strong p-6 text-center hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden"
      style={{ boxShadow: hovered ? `0 0 40px ${guest.color}15` : undefined }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity"
        style={{ background: guest.color }}
      />

      {/* Avatar circle */}
      <div className="mx-auto mb-5 relative w-24 h-24">
        <div
          className="w-full h-full rounded-full overflow-hidden transition-all duration-300"
          style={{
            border: `2px solid ${guest.color}40`,
            boxShadow: hovered ? `0 0 30px ${guest.color}30` : `0 0 15px ${guest.color}10`,
          }}
        >
          <img src={guest.image} alt={guest.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Online dot */}
        <div
          className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#011213]"
          style={{ background: guest.color }}
        />
      </div>

      <h3 className="text-white font-bold text-lg mb-1">{guest.name}</h3>
      <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-widest">{guest.industry}</p>
      <p className="text-sm font-semibold mb-4" style={{ color: guest.color }}>{guest.title}</p>

      {/* Bio and Socials (visible on hover) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <p className="text-[12px] text-gray-300 leading-relaxed mb-4">{guest.bio}</p>
            <div className="flex gap-4 mb-2">
              {guest.socials.twitter && (
                <a href={guest.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {guest.socials.instagram && (
                <a href={guest.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {guest.socials.linkedin && (
                <a href={guest.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-2/3 transition-all duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${guest.color}, transparent)` }}
      />
    </motion.div>
  );
}

export default function SpeakersScene() {
  return (
    <section id="speakers" className="relative py-24 overflow-hidden" style={{ background: '#011213' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--neon-violet)]/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 font-semibold uppercase tracking-widest mb-5"
          >
            <Star className="w-3 h-3 text-[var(--neon-gold)]" />
            Star-Studded Appearances
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            CHIEF{' '}
            <span className="bg-gradient-to-r from-[var(--neon-gold)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              GUESTS
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Experience the electrifying presence of Tamil Cinema's biggest superstars lighting up the main stage at Youthfest 2026.
          </p>
        </div>

        {/* Guests grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CHIEF_GUESTS.map((guest, idx) => (
            <GuestCard key={guest.id} guest={guest} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
