'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, IndianRupee, Sparkles } from 'lucide-react';
const FloatingCurrency = () => {
 const particles = useMemo(() => {
 return Array.from({ length: 8 }).map(() => ({
 left: `${Math.random() * 100}%`,
 size: Math.random() * 20 + 10,
 duration: Math.random() * 10 + 10,
 delay: Math.random() * 5,
 opacity: Math.random() * 0.15 + 0.05,
 xTarget: `${Math.random() * 100 - 50}px`
 }));
 }, []);
 return (
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
 {particles.map((p, i) => (
 <motion.div
 key={i}
 className="absolute bottom-[-10%] text-[var(--neon-cyan)] flex items-center justify-center font-bold"
 style={{ left: p.left, fontSize: p.size, opacity: p.opacity }}
 animate={{
 y: ['0vh', '-110vh'],
 x: ['0px', p.xTarget],
 rotate: [0, 360],
 }}
 transition={{
 duration: p.duration,
 delay: p.delay,
 repeat: Infinity,
 ease: 'linear',
 }}
 >
 ₹
 </motion.div>
 ))}
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
 <section id="prizes" className="relative py-32 overflow-hidden" >
 <FloatingCurrency />
 {/* Atmospheric Lighting */}
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
 {/* Podium Layout */}
 <div className="grid grid-cols-2 md:flex md:flex-row items-end justify-center gap-4 md:gap-4 lg:gap-8 h-auto md:h-[500px]">
 {PRIZES.map((prize, idx) => {
 const isCenter = idx === 1;
 return (
 <motion.div
 key={prize.place}
 initial={{ opacity: 0, y: 100 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-50px" }}
 transition={{ duration: 0.8, delay: prize.delay, type: 'spring', bounce: 0.4 }}
 className={`w-full relative flex flex-col items-center justify-end ${
 isCenter ? 'col-span-2 order-first md:order-none z-20 mb-4 md:mb-0' : 'col-span-1 z-10'
 } md:w-1/3`}
 style={{ transform: `scale(${prize.scale})` }}
 >
 {/* The Card */}
 <div 
 className={`w-full relative rounded-t-3xl border-t border-x border-white/10 overflow-hidden flex flex-col items-center pt-8 sm:pt-16 pb-6 sm:pb-12 px-2 sm:px-6 group ${
 isCenter ? 'h-[300px] sm:h-[350px] md:h-[450px]' : 'h-[220px] sm:h-[280px] md:h-[380px]'
 }`}
 style={{ 
 background: `linear-gradient(180deg, ${prize.bgGlow} 0%, rgba(3,0,20,0.8) 100%)`,
 boxShadow: prize.shadowGlow
 }}
 >
 {/* Trophy Icon */}
 <motion.div 
 className="relative mb-4 sm:mb-8 text-center flex justify-center"
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: prize.delay }}
 >
 <Trophy 
 className={`${isCenter ? 'w-20 h-20 sm:w-32 sm:h-32' : 'w-12 h-12 sm:w-24 sm:h-24'} drop-shadow-2xl transition-transform duration-500 group-hover:scale-110`}
 style={{ color: prize.color, filter: `drop-shadow(0 0 20px ${prize.color})` }}
 strokeWidth={1.5}
 />
 {isCenter && (
 <Sparkles className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
 )}
 </motion.div>
 {/* Text Content */}
 <div className="text-center mt-auto w-full">
 <h3 
 className={`font-bold uppercase tracking-widest mb-1 sm:mb-2 ${isCenter ? 'text-base sm:text-lg' : 'text-xs sm:text-lg'}`}
 style={{ color: prize.color }}
 >
 {prize.place}
 </h3>
 <div className={`font-[var(--font-heading-main)] font-black text-white tabular-nums flex items-start justify-center gap-1 ${isCenter ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-4xl md:text-5xl'}`}>
 <span className="text-lg sm:text-2xl mt-0.5 sm:mt-1 text-gray-400">₹</span>
 {prize.amount}
 </div>
 </div>
 {/* Animated Bottom Line */}
 <div 
 className="absolute bottom-0 left-0 w-full h-1"
 style={{ background: prize.color, boxShadow: `0 0 10px ${prize.color}` }}
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
