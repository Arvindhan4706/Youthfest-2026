'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Award, School } from 'lucide-react';

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
  { value: 5000, suffix: '+', label: 'STUDENTS EXPECTED', icon: Users, color: 'var(--neon-cyan)' },
  { value: 50, suffix: '+', label: 'FLAGSHIP EVENTS', icon: Trophy, color: 'var(--neon-magenta)' },
];

export default function StatsBarScene() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #011213 0%, #05001a 50%, #011213 100%)' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-dense opacity-30 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-0 left-[30%] w-[300px] h-[300px] rounded-full bg-[var(--neon-cyan)]/[0.03] blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 right-[20%] w-[250px] h-[250px] rounded-full bg-[var(--neon-violet)]/[0.04] blur-[80px] pointer-events-none animate-float" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => {
            const { count, ref } = useCountUp(stat.value);
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="group relative p-6 sm:p-8 rounded-2xl glass-strong hover:bg-white/[0.08] transition-all duration-500 text-center cursor-default overflow-hidden"
                style={{ boxShadow: `0 0 30px ${stat.color}08, inset 0 0 30px ${stat.color}04` }}
              >
                {/* Corner accent glow */}
                <div
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: stat.color }}
                />

                <div
                  className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>

                <div className="text-3xl sm:text-4xl font-[var(--font-orbitron)] font-black text-white tabular-nums mb-2">
                  {stat.label.includes('₹') ? '₹' : ''}{count.toLocaleString('en-IN')}{stat.suffix}
                </div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
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
    </section>
  );
}
