'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Zap, Star } from 'lucide-react';

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

  const prizes = [
    {
      rank: '2nd',
      place: '2nd Prize',
      amount: statsData ? statsData.second_prize.toLocaleString('en-IN') : '25,000',
      icon: <Medal className="w-8 h-8" />,
      color: '#a0aec0',
      glow: 'rgba(160,174,192,0.3)',
      border: 'border-slate-400/25',
      bg: 'bg-slate-400/5',
      label: 'Silver',
      delay: 0.1,
    },
    {
      rank: '1st',
      place: '1st Prize',
      amount: statsData ? statsData.first_prize.toLocaleString('en-IN') : '50,000',
      icon: <Trophy className="w-10 h-10" />,
      color: '#f6c90e',
      glow: 'rgba(246,201,14,0.35)',
      border: 'border-yellow-400/40',
      bg: 'bg-yellow-400/10',
      label: 'Gold',
      featured: true,
      delay: 0,
    },
    {
      rank: '3rd',
      place: '3rd Prize',
      amount: statsData ? statsData.third_prize.toLocaleString('en-IN') : '10,000',
      icon: <Medal className="w-8 h-8" />,
      color: '#cd7c2f',
      glow: 'rgba(205,124,47,0.3)',
      border: 'border-amber-600/25',
      bg: 'bg-amber-600/5',
      label: 'Bronze',
      delay: 0.2,
    },
  ];

  // Reorder: 2nd, 1st, 3rd (podium style)
  const podiumOrder = [prizes[0], prizes[1], prizes[2]];

  return (
    <section id="prizes" className="relative py-24 overflow-hidden bg-[#010008]">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[var(--neon-violet)]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--neon-cyan)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* Header — same as EventShowcaseScene */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Zap className="w-3 h-3" />
            Claim Your Glory
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            THE PRIZE{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              POOL
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Compete against the best and take home massive cash rewards. The stakes have never been higher.
          </p>
        </div>

        {/* Prize Cards — same card style as EventShowcaseScene */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-4xl mx-auto">
          {podiumOrder.map((prize, idx) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: prize.delay, duration: 0.55 }}
              className={`group relative rounded-2xl border ${prize.border} ${prize.bg} backdrop-blur-sm overflow-hidden flex flex-col w-full md:w-72 transition-all duration-300`}
              style={prize.featured ? { boxShadow: `0 0 40px ${prize.glow}` } : undefined}
            >
              {/* Top color bar — same as EventCard difficulty badge */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(to right, ${prize.color}00, ${prize.color}, ${prize.color}00)` }}
              />

              {/* Featured crown badge */}
              {prize.featured && (
                <div
                  className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: `${prize.color}20`, color: prize.color, border: `1px solid ${prize.color}40` }}
                >
                  <Crown className="w-3 h-3" />
                  Top Prize
                </div>
              )}

              {/* Card Content */}
              <div className={`flex flex-col items-center text-center p-8 ${prize.featured ? 'md:pt-12 md:pb-12' : ''}`}>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${prize.color}15`, color: prize.color, boxShadow: `0 0 20px ${prize.glow}` }}
                >
                  {prize.icon}
                </div>

                {/* Rank label — same as track name tabs */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-widest mb-4 border"
                  style={{
                    background: `${prize.color}10`,
                    color: prize.color,
                    borderColor: `${prize.color}30`,
                  }}
                >
                  <Star className="w-3 h-3" fill="currentColor" />
                  {prize.label}
                </div>

                {/* Place */}
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">{prize.place}</p>

                {/* Amount */}
                <div className="flex items-start justify-center gap-1 mb-2">
                  <span className="text-xl font-medium mt-1" style={{ color: prize.color }}>₹</span>
                  <span
                    className="font-black tracking-tight"
                    style={{
                      fontSize: prize.featured ? '3.5rem' : '2.75rem',
                      lineHeight: 1,
                      color: prize.color,
                      textShadow: `0 0 30px ${prize.glow}`,
                    }}
                  >
                    {prize.amount}
                  </span>
                </div>

                <p className="text-gray-500 text-xs">cash prize</p>
              </div>

              {/* Hover glow overlay — same as EventCard */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${prize.glow.replace('0.3', '0.06')}, transparent 70%)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom bar — same as EventShowcaseScene track tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex items-center justify-center gap-3 flex-wrap"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-gray-400">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Total Prize Pool: <span className="text-white font-bold ml-1">₹{statsData ? (statsData.first_prize + statsData.second_prize + statsData.third_prize).toLocaleString('en-IN') : '85,000'}+</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
