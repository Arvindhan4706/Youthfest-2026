'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, IndianRupee, School, Briefcase } from 'lucide-react';

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

const STATS = [
  { value: 5000, suffix: '+', prefix: '', label: 'Participants', icon: Users, color: 'var(--neon-cyan)' },
  { value: 50, suffix: '+', prefix: '', label: 'Events', icon: Trophy, color: 'var(--neon-magenta)' },
  { value: 2, suffix: 'L+', prefix: '₹', label: 'Prize Pool', icon: IndianRupee, color: 'var(--neon-violet)' },
  { value: 100, suffix: '+', prefix: '', label: 'Colleges', icon: School, color: 'var(--neon-cyan)' },
  { value: 10, suffix: '+', prefix: '', label: 'Workshops', icon: Briefcase, color: 'var(--neon-magenta)' },
];

export default function StatsBarScene() {
  return (
    <section id="about" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #010008 0%, #05001a 50%, #011213 100%)' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--neon-cyan)]/[0.03] blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--neon-violet)]/[0.04] blur-[100px] pointer-events-none animate-float" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Description */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">About The Event</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-orbitron)] font-black leading-tight text-white">
              THE ULTIMATE <br />
              <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">CONVERGENCE</span>
            </h2>
            
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Youthfest 2026 is the pinnacle of technology, culture, and innovation. Hosted by Yuvenza Club, we bring together the brightest minds across the nation for three days of intense competition, collaborative workshops, and unforgettable experiences.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Step into the future, showcase your talent, and claim your glory on the most prestigious stage of the year.
            </p>
            
          </motion.div>

          {/* Right Column: Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {STATS.map((stat, idx) => {
              const { count, ref } = useCountUp(stat.value);
              const Icon = stat.icon;
              
              // Make Prize Pool span 2 columns on small screens to align nicely if it's odd length, or just keep it dynamic
              const colSpanClass = stat.label === 'Prize Pool' ? 'col-span-2 md:col-span-1' : 'col-span-1';

              return (
                <motion.div
                  key={stat.label}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`group relative p-6 rounded-2xl glass-strong hover:bg-white/[0.08] transition-all duration-500 text-center cursor-default overflow-hidden flex flex-col items-center justify-center ${colSpanClass}`}
                  style={{ boxShadow: `0 0 30px ${stat.color}08, inset 0 0 30px ${stat.color}04` }}
                >
                  {/* Corner accent glow */}
                  <div
                    className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: stat.color }}
                  />

                  <div
                    className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>

                  <div className="text-3xl font-[var(--font-orbitron)] font-black text-white tabular-nums mb-1 flex justify-center items-end">
                    <span>{stat.prefix}</span>
                    <span>{count.toLocaleString('en-IN')}</span>
                    <span>{stat.suffix}</span>
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-2">
                    {stat.label}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-3/4 transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                  />
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
