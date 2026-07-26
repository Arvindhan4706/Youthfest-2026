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
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-50px" }}
 transition={{ duration: 0.6, delay: idx * 0.1 }}
 className={`group relative p-4 sm:p-6 rounded-[20px] glass-strong hover:bg-white/[0.08] transition-all duration-500 text-center cursor-default overflow-hidden flex flex-col items-center justify-center ${colSpanClass}`}
 style={{ boxShadow: `0 0 30px ${stat.color}08, inset 0 0 30px ${stat.color}04` }}
 >
 <div
 className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity"
 style={{ background: stat.color }}
 />
 <div
 className="mb-4 w-12 h-12 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-110"
 style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
 >
 <Icon className="w-5 h-5" style={{ color: stat.color }} />
 </div>
 <div className="text-3xl font-[var(--font-heading-main)] font-black text-white tabular-nums mb-1 flex justify-center items-end">
 <span>{stat.prefix}</span>
 <span>{count.toLocaleString('en-IN')}</span>
 <span>{stat.suffix}</span>
 </div>
 <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-2">
 {stat.label}
 </div>
 <div
 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-3/4 transition-all duration-500"
 />
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
 <section id="about" className="relative section-padding md:section-padding lg:section-padding overflow-hidden" >
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
 <motion.div
 initial={{ opacity: 0, x: -40 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 className="flex flex-col gap-6"
 >
 <div className="inline-flex items-center gap-3">
  <div className="h-[2px] w-12 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]" />
  <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">About Yuvenza</span>
 </div>
 <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black leading-tight text-white">
 THE YOUTH <br />
 <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">POWERED CLUB</span>
 </h2>
 <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
 Since 2023, we&apos;ve brought together students of Chennai Institute of Technology to create meaningful social impact through events, awareness campaigns, and community initiatives.
 </p>
 <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
 <span className="text-white font-semibold">What we create, we contribute.</span> Every fee channels real support back to the community around us.
 </p>
 </motion.div>
 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
 {STATS.map((stat, idx) => (
 <StatCard key={stat.label} stat={stat} idx={idx} />
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}
