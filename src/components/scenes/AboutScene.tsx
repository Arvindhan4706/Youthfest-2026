'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, School, Mic, BookOpen, Zap, Music } from 'lucide-react';

const highlights = [
  { icon: <Trophy className="w-6 h-6" />, value: '100+', label: 'Events', color: '#fbbf24' },
  { icon: <Users className="w-6 h-6" />, value: '5000+', label: 'Participants', color: '#00E5FF' },
  { icon: <School className="w-6 h-6" />, value: '100+', label: 'Colleges', color: '#a78bfa' },
  { icon: <Mic className="w-6 h-6" />, value: '20+', label: 'Industry Speakers', color: '#f472b6' },
  { icon: <BookOpen className="w-6 h-6" />, value: '15+', label: 'Workshops', color: '#4ade80' },
  { icon: <Zap className="w-6 h-6" />, value: '50+', label: 'Competitions', color: '#fb923c' },
  { icon: <Music className="w-6 h-6" />, value: '10+', label: 'Cultural Shows', color: '#38bdf8' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function AboutScene() {
  return (
    <section
      id="about"
      className="relative w-full py-24 px-4 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0020 0%, #010008 100%)' }}
      aria-labelledby="about-heading"
    >
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
          <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em]">About Us</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          id="about-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white text-center uppercase tracking-wider mb-16"
        >
          Who We{' '}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
            Are
          </span>
        </motion.h2>

        {/* Two column content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-[var(--font-heading-main)] font-bold text-white">Who We Are</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              YouthFest is the flagship annual festival celebrating innovation, creativity, culture, and collaboration.
              Students from various colleges come together to participate in competitions, performances, workshops,
              and networking opportunities. Organized by the <span className="text-white font-medium">Yuvenza Club</span>,
              YouthFest 2026 is set to be our grandest celebration yet.
            </p>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-violet)]/10 flex items-center justify-center text-[var(--neon-violet)]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-[var(--font-heading-main)] font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              To create an inspiring platform where students showcase their talents, develop new skills, and build
              lasting connections through technology, arts, culture, and innovation. We believe every student has a
              unique spark — <span className="text-white font-medium">YouthFest is where it ignites.</span>
            </p>
          </motion.div>
        </div>

        {/* Highlights grid */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-[var(--font-heading-main)] font-bold text-white text-center mb-10"
        >
          Event Highlights
        </motion.h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${h.color}15`, color: h.color, boxShadow: `0 0 20px ${h.color}30` }}
              >
                {h.icon}
              </div>
              <span
                className="text-3xl font-[var(--font-heading-main)] font-black"
                style={{ color: h.color }}
              >
                {h.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold text-center">{h.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
