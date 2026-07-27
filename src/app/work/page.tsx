'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import ToastContainer from '../../components/ToastContainer';
import LazyScene from '../../components/LazyScene';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import Link from 'next/link';

const MemoriesScene = dynamic(() => import('../../components/scenes/MemoriesScene'), { ssr: false });
const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });

// --- DATA ---
const WHAT_WE_DO = [
  {
    title: 'Event Planning',
    desc: 'Designing and organizing technical, cultural, and entertainment events that inspire creativity and participation.',
    color: 'var(--neon-cyan)',
  },
  {
    title: 'Creative Production',
    desc: 'Building immersive stage experiences, branding, decorations, digital content, and promotional campaigns that define the Yuvenza identity.',
    color: 'var(--neon-violet)',
  },
  {
    title: 'Technical Excellence',
    desc: 'Managing registrations, schedules, websites, QR check-ins, live updates, and technology infrastructure that powers the entire festival.',
    color: 'var(--neon-magenta)',
  },
  {
    title: 'Community Outreach',
    desc: 'Channeling a portion of every registration fee into charitable drives, orphanage visits, and community welfare programs.',
    color: 'var(--neon-lime)',
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Vision & Planning',
    desc: 'Every Yuvenza begins months in advance. The core committee comes together to set the theme, goals, and structure for the upcoming edition.',
    color: 'var(--neon-cyan)',
  },
  {
    number: '02',
    title: 'Team Formation',
    desc: 'We recruit and train passionate student volunteers across departments — creative, technical, logistics, outreach, and more.',
    color: 'var(--neon-violet)',
  },
  {
    number: '03',
    title: 'Content Creation',
    desc: 'Our teams craft every event, branding asset, social media campaign, and on-ground experience from scratch.',
    color: 'var(--neon-magenta)',
  },
  {
    number: '04',
    title: 'Execution & Impact',
    desc: 'We bring it all together on the big days — managing thousands of participants with precision, energy, and heart.',
    color: 'var(--neon-lime)',
  },
];

const IMPACT_STATS = [
  { value: '3', label: 'Editions Completed', suffix: '' },
  { value: '15,000', label: 'Lives Touched', suffix: '+' },
  { value: '100', label: 'Student Volunteers', suffix: '+' },
  { value: '50', label: 'Events Organized', suffix: '+' },
  { value: '₹5L', label: 'Prize Pool', suffix: '+' },
  { value: '20', label: 'Colleges Represented', suffix: '+' },
];

// --- PAGE COMPONENT ---
export default function WorkPage() {
  const isSecretMode = useStore((state) => state.isSecretMode);

  return (
    <>
      <main className={`relative w-full min-h-screen bg-black text-white overflow-x-hidden ${isSecretMode ? 'font-[var(--font-heading-main)]' : ''}`}>
        <Navbar />
        <ToastContainer />

        {/* Top padding for fixed navbar */}
        <div className="pt-28 sm:pt-36" />

        {/* ── HERO ── */}
        <section className="relative container-responsive pb-24 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6"
          >
            Behind the Festival
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-6"
          >
            The Journey{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              Behind Yuvenza
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Every unforgettable experience begins with months of planning, creativity, collaboration, and dedication. Yuvenza is more than a festival — it's a celebration built by passionate students working together to create memories that last a lifetime.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            From brainstorming ideas and designing experiences to organizing competitions and managing thousands of participants, every aspect of Yuvenza reflects innovation, teamwork, and excellence. Our work is driven by students who transform ideas into reality.
          </motion.p>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="relative py-24 bg-[#030010]">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-violet)]/30 bg-[var(--neon-violet)]/5 text-xs text-[var(--neon-violet)] font-semibold uppercase tracking-widest mb-4">
                Our Core Work
              </div>
              <h2 className="text-4xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider">What We Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {WHAT_WE_DO.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-3 h-3 rounded-full mb-6" style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}` }} />
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--neon-cyan)] transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMPACT STATS ── */}
        <section className="py-24">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 text-xs text-[var(--neon-magenta)] font-semibold uppercase tracking-widest mb-4">
                Our Impact
              </div>
              <h2 className="text-4xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4">Numbers That Matter</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Every statistic here represents real students, real moments, and real impact generated through years of passionate community work.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {IMPACT_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center hover:border-[var(--neon-cyan)]/30 transition-all duration-300"
                >
                  <div className="text-4xl lg:text-5xl font-[var(--font-heading-main)] font-black bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR PROCESS ── */}
        <section className="py-24 bg-[#030010]">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-lime)]/30 bg-[var(--neon-lime)]/5 text-xs text-[var(--neon-lime)] font-semibold uppercase tracking-widest mb-4">
                How We Work
              </div>
              <h2 className="text-4xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider">Our Process</h2>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-violet)] to-transparent opacity-20 hidden sm:block" />
              <div className="space-y-12">
                {PROCESS_STEPS.map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-1 p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                      <div className="text-sm font-mono font-bold mb-2" style={{ color: step.color }}>{step.number}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center font-black font-mono text-lg z-10 bg-black" style={{ borderColor: step.color, color: step.color }}>
                      {step.number}
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MEMORIES / GALLERY ── */}
        <MemoriesScene />

        {/* ── CALL TO ACTION ── */}
        <section className="py-24 text-center px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-[var(--font-heading-main)] font-black text-white uppercase mb-6">Be Part of the Story</h2>
            <p className="text-gray-400 mb-10">Yuvenza is your chance to be in the room where it happens. Compete, create, connect, and leave your mark on something that matters.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Explore Events
              </Link>
              <Link href="/" className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>
        <BackToTop />
      </main>
    </>
  );
}
