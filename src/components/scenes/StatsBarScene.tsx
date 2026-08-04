'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, School, Briefcase } from 'lucide-react';

function useCountUp(target: number, duration: number = 2200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return { count, ref };
}

import { db, SiteSettings } from '@/lib/database';

function StatCard({ stat, idx }: { stat: any, idx: number }) {
  const { count, ref } = useCountUp(stat.value);
  const Icon = stat.icon;
  const colSpanClass = stat.label === 'Prize Pool' ? 'col-span-2 md:col-span-1' : 'col-span-1';
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: idx * 0.12, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className={`group relative p-5 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-colors duration-500 text-center cursor-default overflow-hidden flex flex-col items-center justify-center ${colSpanClass}`}
      style={{ boxShadow: `0 0 40px ${stat.color}06, inset 0 1px 0 rgba(255,255,255,0.05)` }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: stat.color }}
      />
      {/* Bottom gradient line on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
      />
      <div
        className="mb-4 w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
        style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: stat.color }} />
      </div>
      <div className="text-3xl sm:text-4xl font-[var(--font-heading-main)] font-black text-white tabular-nums mb-1 flex justify-center items-end tracking-tight">
        <span>{stat.prefix}</span>
        <span>{count.toLocaleString('en-IN')}</span>
        <span>{stat.suffix}</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500 font-semibold mt-1.5">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function StatsBarScene() {
  const [statsData, setStatsData] = useState<SiteSettings | null>(null);
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await db.getSiteSettings();
        setStatsData(data);
      } catch (err) {
        console.error('Failed to load site stats:', err);
      }
    }
    loadStats();
  }, []);

  const STATS = statsData ? [
    { value: statsData.participants, suffix: '+', prefix: '', label: 'Community Members', icon: Users, color: 'var(--neon-cyan)' },
    { value: statsData.events, suffix: '', prefix: '', label: 'Social Initiatives', icon: Trophy, color: 'var(--neon-magenta)' },
    { value: statsData.colleges, suffix: '+', prefix: '', label: 'Colleges', icon: School, color: 'var(--neon-violet)' },
    { value: statsData.workshops, suffix: '', prefix: '', label: 'Events This Fest', icon: Briefcase, color: 'var(--neon-cyan)' },
  ] : [
    { value: 2100, suffix: '+', prefix: '', label: 'Community Members', icon: Users, color: 'var(--neon-cyan)' },
    { value: 9, suffix: '', prefix: '', label: 'Social Initiatives', icon: Trophy, color: 'var(--neon-magenta)' },
    { value: 50, suffix: '+', prefix: '', label: 'Colleges Represented', icon: School, color: 'var(--neon-violet)' },
    { value: 8, suffix: '', prefix: '', label: 'Events This Fest', icon: Briefcase, color: 'var(--neon-cyan)' },
  ];

  return (
    <section id="about" className="relative section-padding overflow-hidden bg-[#060310]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-dots opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--neon-violet)]/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--neon-cyan)]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container-responsive">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left column — text slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-7"
          >
            <div className="inline-flex items-center gap-3">
              <div className="h-[2px] w-10 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--neon-cyan)]">About Yuvenza</span>
            </div>
            <h2 className="font-[var(--font-heading-main)] font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em' }}>
              THE YOUTH<br />
              <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
                POWERED CLUB
              </span>
            </h2>
            <p className="text-gray-400 leading-[1.85] text-base sm:text-lg max-w-lg">
              Since 2023, we&apos;ve brought together students of Chennai Institute of Technology to create meaningful social impact through events, awareness campaigns, and community initiatives.
            </p>
            <p className="text-gray-400 leading-[1.85] text-base sm:text-lg max-w-lg">
              <span className="text-white font-semibold">What we create, we contribute.</span> Every fee channels real support back to the community around us.
            </p>
          </motion.div>

          {/* Right column — stat cards stagger in */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {STATS.map((stat, idx) => (
              <StatCard key={stat.label} stat={stat} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
