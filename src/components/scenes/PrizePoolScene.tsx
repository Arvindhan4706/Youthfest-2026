'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Medal, IndianRupee } from 'lucide-react';

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

  const prizes = statsData ? [
    {
      place: '2nd Prize',
      amount: statsData.second_prize.toLocaleString('en-IN'),
      icon: <Medal className="w-12 h-12 text-slate-300 mb-4" />,
      colorClass: 'from-slate-200 to-slate-400',
      borderClass: 'border-slate-400/20',
      bgClass: 'bg-slate-500/5',
      featured: false,
    },
    {
      place: '1st Prize',
      amount: statsData.first_prize.toLocaleString('en-IN'),
      icon: <Trophy className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />,
      colorClass: 'from-yellow-200 to-yellow-500',
      borderClass: 'border-yellow-500/30',
      bgClass: 'bg-yellow-500/10',
      featured: true,
    },
    {
      place: '3rd Prize',
      amount: statsData.third_prize.toLocaleString('en-IN'),
      icon: <Medal className="w-12 h-12 text-amber-600 mb-4" />,
      colorClass: 'from-amber-500 to-amber-700',
      borderClass: 'border-amber-600/20',
      bgClass: 'bg-amber-600/5',
      featured: false,
    },
  ] : [
    {
      place: '2nd Prize',
      amount: '25,000',
      icon: <Medal className="w-12 h-12 text-slate-300 mb-4" />,
      colorClass: 'from-slate-200 to-slate-400',
      borderClass: 'border-slate-400/20',
      bgClass: 'bg-slate-500/5',
      featured: false,
    },
    {
      place: '1st Prize',
      amount: '50,000',
      icon: <Trophy className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />,
      colorClass: 'from-yellow-200 to-yellow-500',
      borderClass: 'border-yellow-500/30',
      bgClass: 'bg-yellow-500/10',
      featured: true,
    },
    {
      place: '3rd Prize',
      amount: '10,000',
      icon: <Medal className="w-12 h-12 text-amber-600 mb-4" />,
      colorClass: 'from-amber-500 to-amber-700',
      borderClass: 'border-amber-600/20',
      bgClass: 'bg-amber-600/5',
      featured: false,
    },
  ];

  return (
    <section id="prizes" className="relative py-24 sm:py-32 overflow-hidden bg-black">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[var(--neon-violet)]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            Claim Your Glory
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
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

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
          {prizes.map((prize, idx) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className={`relative group rounded-2xl border ${prize.borderClass} ${prize.bgClass} backdrop-blur-sm overflow-hidden flex flex-col items-center p-8 transition-all duration-300 hover:scale-105 hover:bg-white/5 ${
                prize.featured ? 'md:-translate-y-8 md:p-12 md:hover:scale-110 shadow-2xl shadow-yellow-500/10' : ''
              }`}
            >
              {/* Highlight gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {prize.icon}
                <span className={`text-sm font-semibold uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r ${prize.colorClass}`}>
                  {prize.place}
                </span>
                <div className="flex items-start justify-center gap-1">
                  <span className="text-2xl font-medium text-gray-400 mt-1">₹</span>
                  <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                    {prize.amount}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
