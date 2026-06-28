'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, IndianRupee, Sparkles } from 'lucide-react';

// Floating Currency Background Component
const FloatingCurrency = () => {
  const particles = useMemo(() => Array.from({ length: 20 }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.15 + 0.05;

        return (
          <motion.div
            key={i}
            className="absolute bottom-[-10%] text-[var(--neon-cyan)] flex items-center justify-center font-bold"
            style={{ left, fontSize: size, opacity }}
            animate={{
              y: ['0vh', '-110vh'],
              x: ['0px', `${Math.random() * 100 - 50}px`],
              rotate: [0, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ₹
          </motion.div>
        );
      })}
    </div>
  );
};

export default function PrizePoolScene() {
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const { db } = await import('@/lib/database');
        const data = await db.getSiteSettings();
        setStatsData(data);
      } catch (err) {
        console.error('Failed to load site stats:', err);
      }
    }
    loadStats();
  }, []);

  const PRIZES = statsData ? [
    {
      place: '2nd Prize',
      amount: statsData.second_prize.toLocaleString('en-IN'),
      color: '#c0c0c0', // Silver
      bgGlow: 'rgba(192, 192, 192, 0.15)',
      shadowGlow: '0 0 40px rgba(192, 192, 192, 0.4)',
      delay: 0.2,
      scale: 0.9,
    },
    {
      place: '1st Prize',
      amount: statsData.first_prize.toLocaleString('en-IN'),
      color: '#ffd700', // Gold
      bgGlow: 'rgba(255, 215, 0, 0.15)',
      shadowGlow: '0 0 60px rgba(255, 215, 0, 0.5)',
      delay: 0,
      scale: 1.1,
    },
    {
      place: '3rd Prize',
      amount: statsData.third_prize.toLocaleString('en-IN'),
      color: '#cd7f32', // Bronze
      bgGlow: 'rgba(205, 127, 50, 0.15)',
      shadowGlow: '0 0 40px rgba(205, 127, 50, 0.4)',
      delay: 0.4,
      scale: 0.85,
    },
  ] : [
    {
      place: '2nd Prize',
      amount: '25,000',
      color: '#c0c0c0', // Silver
      bgGlow: 'rgba(192, 192, 192, 0.15)',
      shadowGlow: '0 0 40px rgba(192, 192, 192, 0.4)',
      delay: 0.2,
      scale: 0.9,
    },
    {
      place: '1st Prize',
      amount: '50,000',
      color: '#ffd700', // Gold
      bgGlow: 'rgba(255, 215, 0, 0.15)',
      shadowGlow: '0 0 60px rgba(255, 215, 0, 0.5)',
      delay: 0,
      scale: 1.1,
    },
    {
      place: '3rd Prize',
      amount: '10,000',
      color: '#cd7f32', // Bronze
      bgGlow: 'rgba(205, 127, 50, 0.15)',
      shadowGlow: '0 0 40px rgba(205, 127, 50, 0.4)',
      delay: 0.4,
      scale: 0.85,
    },
  ];

  return (
    <section id="prizes" className="relative py-32 overflow-hidden" style={{ background: '#010008' }}>
      <FloatingCurrency />

      {/* Atmospheric Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--neon-cyan)]/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            Claim Your Glory
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            THE PRIZE{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              POOL
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Compete against the best and take home massive cash rewards. The stakes have never been higher.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-8 items-end h-auto md:h-[500px]">
          {PRIZES.map((prize, idx) => {
            const isCenter = idx === 1;

            return (
              <motion.div
                key={prize.place}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: prize.delay, type: 'spring', bounce: 0.4 }}
                className={`w-full max-w-sm md:w-1/3 relative flex flex-col items-center justify-end ${isCenter ? 'order-first md:order-none z-20 mb-8 md:mb-0' : 'z-10'}`}
                style={{ transform: `scale(${prize.scale})` }}
              >
                {/* Glowing Aura behind trophy */}
                <div 
                  className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[50px] opacity-60 pointer-events-none animate-pulse"
                  style={{ background: prize.color }}
                />

                {/* The Card */}
                <div 
                  className="w-full relative rounded-t-3xl border-t border-x border-white/10 overflow-hidden flex flex-col items-center pt-16 pb-12 px-6 group backdrop-blur-md"
                  style={{ 
                    background: `linear-gradient(180deg, ${prize.bgGlow} 0%, rgba(3,0,20,0.8) 100%)`,
                    boxShadow: prize.shadowGlow,
                    height: isCenter ? '450px' : '380px'
                  }}
                >
                  {/* Trophy Icon */}
                  <motion.div 
                    className="relative mb-8 text-center flex justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: prize.delay }}
                  >
                    <Trophy 
                      className={`${isCenter ? 'w-32 h-32' : 'w-24 h-24'} drop-shadow-2xl transition-transform duration-500 group-hover:scale-110`}
                      style={{ color: prize.color, filter: `drop-shadow(0 0 20px ${prize.color})` }}
                      strokeWidth={1.5}
                    />
                    {isCenter && (
                      <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-white animate-pulse" />
                    )}
                  </motion.div>

                  {/* Text Content */}
                  <div className="text-center mt-auto w-full">
                    <h3 
                      className="text-lg font-bold uppercase tracking-widest mb-2"
                      style={{ color: prize.color }}
                    >
                      {prize.place}
                    </h3>
                    <div className="text-4xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white tabular-nums flex items-start justify-center gap-1">
                      <span className="text-2xl mt-1 text-gray-400">₹</span>
                      {prize.amount}
                    </div>
                  </div>

                  {/* Animated Bottom Line */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${prize.color}, transparent)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
