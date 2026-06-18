'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, School, GraduationCap } from 'lucide-react';

const COLLEGES = [
  'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'SRM Chennai',
  'IIIT Hyderabad', 'DTU Delhi', 'MIT Manipal', 'NSUT Delhi', 'Anna University',
  'Jadavpur University', 'IIT Bombay', 'KIIT Bhubaneswar', 'LPU Punjab',
  'Amity University', 'Christ University', "St. Xavier's Mumbai", 'VJTI Mumbai',
  'IIT Kanpur', 'BHU Varanasi', 'JMI New Delhi', 'Shiv Nadar University',
  'Ashoka University', 'IISC Bangalore', 'IIT Madras', 'LNMIIT Jaipur',
  'Thapar University', 'PEC Chandigarh'
];

export default function CollegeProofScene() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#011213' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 text-xs text-[var(--neon-magenta)] font-semibold uppercase tracking-widest mb-4"
          >
            <School className="w-3 h-3" />
            Participating Colleges
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-[var(--font-orbitron)] text-white uppercase tracking-wider mb-4"
          >
            Is Your College <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)]">In The List?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            Students from 25+ top colleges across 5 states are competing. 
          </motion.p>
        </div>

        {/* Highlight Stats */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          <div className="text-center">
            <div className="text-4xl font-black font-[var(--font-orbitron)] text-white mb-1">25+</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Colleges</div>
          </div>
          <div className="w-px h-12 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-black font-[var(--font-orbitron)] text-[var(--neon-cyan)] mb-1">5</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1 justify-center"><MapPin className="w-3 h-3" /> States</div>
          </div>
          <div className="w-px h-12 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="text-4xl font-black font-[var(--font-orbitron)] text-[var(--neon-magenta)] mb-1">1</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1 justify-center"><GraduationCap className="w-3 h-3" /> Epic Festival</div>
          </div>
        </div>

        {/* Infinite marquee — Row 1 */}
        <div className="relative mb-3 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, #011213, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(-90deg, #011213, transparent)' }} />
          <div className="flex animate-marquee whitespace-nowrap py-2">
            {[...COLLEGES.slice(0, 14), ...COLLEGES.slice(0, 14)].map((college, i) => (
              <span 
                key={`r1-${i}`}
                className="mx-4 text-xl md:text-2xl font-[var(--font-orbitron)] font-bold text-white/20 hover:text-[var(--neon-cyan)] transition-colors duration-300 cursor-default"
              >
                {college}
              </span>
            ))}
          </div>
        </div>

        {/* Infinite marquee — Row 2 (reverse) */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, #011213, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(-90deg, #011213, transparent)' }} />
          <div className="flex animate-marquee-reverse whitespace-nowrap py-2">
            {[...COLLEGES.slice(14), ...COLLEGES.slice(14)].map((college, i) => (
              <span 
                key={`r2-${i}`}
                className="mx-4 text-xl md:text-2xl font-[var(--font-orbitron)] font-bold text-white/20 hover:text-[var(--neon-magenta)] transition-colors duration-300 cursor-default"
              >
                {college}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
