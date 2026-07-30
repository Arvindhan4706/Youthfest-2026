'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Sparkles } from 'lucide-react';

function SpotlightCard({ children, glowColor, borderClass, bgClass, className }: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[32px] border ${borderClass} ${bgClass} backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
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

  const firstPrize = statsData ? statsData.first_prize.toLocaleString('en-IN') : '50,000';
  const secondPrize = statsData ? statsData.second_prize.toLocaleString('en-IN') : '25,000';
  const thirdPrize = statsData ? statsData.third_prize.toLocaleString('en-IN') : '10,000';

  return (
    <section id="prizes" className="relative section-padding overflow-hidden bg-[#030014]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-dense opacity-5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--neon-violet)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Holographic scanner line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="w-full h-[1px] bg-[var(--neon-cyan)] animate-scanline shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
      </div>

      <div className="relative z-10 container-responsive">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            Claim Your Glory
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl lg:text-7xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4 leading-tight"
          >
            THE PRIZE{' '}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-violet)] bg-clip-text text-transparent">
                POOL
              </span>
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium tracking-wide">
            Compete against the best and take home massive cash rewards. The stakes have never been higher.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* GOLD - 1st Prize (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          >
            <SpotlightCard
              glowColor="rgba(251, 191, 36, 0.15)"
              borderClass="border-yellow-400/20"
              bgClass="bg-gradient-to-br from-yellow-500/10 to-black/80"
              className="w-full flex flex-col lg:flex-row overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Giant Background Icon */}
              <Crown className="absolute -right-20 -top-20 w-96 h-96 text-yellow-500/5 -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0" />
              
              {/* Left Side: Info */}
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:w-1/2">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[10px] font-black uppercase tracking-widest text-yellow-400">
                      <Crown className="w-3 h-3" /> Top Prize
                    </div>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-wide uppercase">
                    1st Prize
                  </h3>
                  <p className="text-yellow-400 font-bold uppercase tracking-[0.2em] mt-2">
                    Gold Tier
                  </p>
                </div>
                
                <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mt-12 hidden lg:block" />
              </div>

              {/* Right Side: Massive Amount */}
              <div className="p-8 sm:p-12 lg:w-1/2 flex flex-col lg:items-end justify-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/5 bg-white/[0.01]">
                <div className="flex items-start lg:justify-end gap-1 mb-2">
                  <span className="text-4xl font-bold mt-2 text-yellow-400">₹</span>
                  <span
                    className="font-[var(--font-heading-main)] font-black tracking-tighter text-6xl sm:text-8xl"
                    style={{
                      background: `linear-gradient(to bottom, #ffffff, #fbbf24)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {firstPrize}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">cash prize guaranteed</p>
                
                <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mt-8 lg:hidden" />
              </div>
            </SpotlightCard>
          </motion.div>

          {/* BOTTOM ROW (50/50 Split) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SILVER - 2nd Prize */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="h-full"
            >
              <SpotlightCard
                glowColor="rgba(226, 232, 240, 0.1)"
                borderClass="border-slate-300/20"
                bgClass="bg-gradient-to-br from-slate-300/5 to-black/80"
                className="h-full flex flex-col justify-between p-8 sm:p-10 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <Medal className="absolute -right-10 -bottom-10 w-64 h-64 text-slate-400/5 rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                
                <div className="mb-12">
                  <Medal className="w-12 h-12 text-slate-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-6" />
                  <h3 className="text-3xl font-black text-white tracking-wide uppercase">
                    2nd Prize
                  </h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 text-sm">
                    Silver Tier
                  </p>
                </div>
                
                <div>
                  <div className="flex items-start gap-1 mb-1">
                    <span className="text-2xl font-bold mt-1 text-slate-300">₹</span>
                    <span
                      className="font-[var(--font-heading-main)] font-black tracking-tighter text-5xl sm:text-6xl"
                      style={{
                        background: `linear-gradient(to bottom, #ffffff, #e2e8f0)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {secondPrize}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">cash prize</p>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* BRONZE - 3rd Prize */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="h-full"
            >
              <SpotlightCard
                glowColor="rgba(249, 115, 22, 0.1)"
                borderClass="border-orange-500/20"
                bgClass="bg-gradient-to-bl from-orange-500/5 to-black/80"
                className="h-full flex flex-col justify-between p-8 sm:p-10 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <Medal className="absolute -right-10 -bottom-10 w-64 h-64 text-orange-500/5 rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                
                <div className="mb-12">
                  <Medal className="w-12 h-12 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] mb-6" />
                  <h3 className="text-3xl font-black text-white tracking-wide uppercase">
                    3rd Prize
                  </h3>
                  <p className="text-orange-500 font-bold uppercase tracking-[0.2em] mt-1 text-sm">
                    Bronze Tier
                  </p>
                </div>
                
                <div>
                  <div className="flex items-start gap-1 mb-1">
                    <span className="text-2xl font-bold mt-1 text-orange-500">₹</span>
                    <span
                      className="font-[var(--font-heading-main)] font-black tracking-tighter text-5xl sm:text-6xl"
                      style={{
                        background: `linear-gradient(to bottom, #ffffff, #f97316)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {thirdPrize}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">cash prize</p>
                </div>
              </SpotlightCard>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
