'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Sparkles } from 'lucide-react';

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
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

function SpotlightCard({ children, glowColor, borderColor, bg, className }: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-3 ${className}`}
      style={{ borderColor, background: bg, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default function PrizePoolScene() {
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const { db } = await import('../../lib/database');
        const data = await db.getSiteSettings();
        setStatsData(data);
      } catch (err) {
        console.error('Failed to load site stats:', err);
      }
    }
    loadStats();
  }, []);

  const firstPrizeRaw = statsData ? statsData.first_prize : 50000;
  const secondPrizeRaw = statsData ? statsData.second_prize : 25000;
  const thirdPrizeRaw = statsData ? statsData.third_prize : 10000;

  const { count: c1, ref: r1 } = useCountUp(firstPrizeRaw);
  const { count: c2, ref: r2 } = useCountUp(secondPrizeRaw);
  const { count: c3, ref: r3 } = useCountUp(thirdPrizeRaw);

  const fmt = (n: number) => n.toLocaleString('en-IN');

  return (
    <section id="prizes" className="relative section-padding overflow-hidden bg-[#020010]">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-dense opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--neon-violet)]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      {/* Holographic scanner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
        <div className="w-full h-[1px] bg-[var(--neon-cyan)] animate-scanline shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
      </div>

      <div className="relative z-10 container-responsive">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/[0.05] text-[10px] text-[var(--neon-cyan)] font-black uppercase tracking-[0.25em] mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Claim Your Glory
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[var(--font-heading-main)] font-black text-white uppercase mb-5 leading-[1.0]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            THE PRIZE{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-violet)] bg-clip-text text-transparent">
              POOL
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-[1.8]">
            Compete against the best and take home massive cash rewards. The stakes have never been higher.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6">

          {/* GOLD — full width, dramatic rotate+scale entrance */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.88, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, type: "spring", bounce: 0.35 }}
          >
            <SpotlightCard
              glowColor="rgba(251,191,36,0.15)"
              borderColor="rgba(251,191,36,0.18)"
              bg="linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(0,0,0,0.85) 100%)"
              className="w-full flex flex-col lg:flex-row overflow-hidden group"
            >
              <Crown className="absolute -right-16 -top-16 w-80 h-80 text-yellow-500/[0.04] -rotate-12 pointer-events-none group-hover:scale-105 group-hover:rotate-0 transition-transform duration-1000" />
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:w-1/2">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">
                      <Crown className="w-3 h-3" /> Top Prize
                    </div>
                  </div>
                  <h3 className="font-[var(--font-heading-main)] font-black text-white uppercase mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
                    1st Prize
                  </h3>
                  <p className="text-yellow-400/80 font-bold uppercase tracking-[0.2em] text-sm">Gold Tier</p>
                </div>
                <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] mt-10 hidden lg:block" />
              </div>
              <div ref={r1} className="p-8 sm:p-12 lg:w-1/2 flex flex-col lg:items-end justify-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-start lg:justify-end gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-bold mt-2 text-yellow-400">₹</span>
                  <span
                    className="font-[var(--font-heading-main)] font-black tracking-tighter"
                    style={{
                      fontSize: 'clamp(3rem, 9vw, 6rem)',
                      background: 'linear-gradient(to bottom, #ffffff, #fbbf24)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {fmt(c1)}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">cash prize guaranteed</p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Silver + Bronze row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Silver */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1, duration: 1.2, type: "spring", bounce: 0.4 }}
              className="h-full"
            >
              <SpotlightCard
                glowColor="rgba(226,232,240,0.1)"
                borderColor="rgba(226,232,240,0.15)"
                bg="linear-gradient(135deg, rgba(226,232,240,0.04) 0%, rgba(0,0,0,0.85) 100%)"
                className="h-full flex flex-col justify-between p-8 sm:p-10 group"
              >
                <Medal className="absolute -right-8 -bottom-8 w-56 h-56 text-slate-400/[0.04] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                <div className="mb-10">
                  <Medal className="w-11 h-11 text-slate-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] mb-6" />
                  <h3 className="font-[var(--font-heading-main)] font-black text-white uppercase mb-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}>2nd Prize</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Silver Tier</p>
                </div>
                <div ref={r2}>
                  <div className="flex items-start gap-1 mb-1">
                    <span className="text-xl font-bold mt-1 text-slate-300">₹</span>
                    <span className="font-[var(--font-heading-main)] font-black tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', background: 'linear-gradient(to bottom, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {fmt(c2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">cash prize</p>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bronze */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.2, duration: 1.2, type: "spring", bounce: 0.4 }}
              className="h-full"
            >
              <SpotlightCard
                glowColor="rgba(249,115,22,0.1)"
                borderColor="rgba(249,115,22,0.18)"
                bg="linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(0,0,0,0.85) 100%)"
                className="h-full flex flex-col justify-between p-8 sm:p-10 group"
              >
                <Medal className="absolute -right-8 -bottom-8 w-56 h-56 text-orange-500/[0.04] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                <div className="mb-10">
                  <Medal className="w-11 h-11 text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)] mb-6" />
                  <h3 className="font-[var(--font-heading-main)] font-black text-white uppercase mb-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}>3rd Prize</h3>
                  <p className="text-orange-500/80 font-bold uppercase tracking-[0.2em] text-xs">Bronze Tier</p>
                </div>
                <div ref={r3}>
                  <div className="flex items-start gap-1 mb-1">
                    <span className="text-xl font-bold mt-1 text-orange-400">₹</span>
                    <span className="font-[var(--font-heading-main)] font-black tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', background: 'linear-gradient(to bottom, #ffffff, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {fmt(c3)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">cash prize</p>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
