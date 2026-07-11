'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket, AlertTriangle } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';

const TARGET_DATE = new Date('2026-08-12T10:00:00+05:30').getTime();

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, TARGET_DATE - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden" style={{ perspective: '400px' }}>
        <div className="absolute inset-0 glass-strong" style={{ boxShadow: '0 0 30px rgba(0,240,255,0.08)' }} />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/[0.03] border-b border-white/[0.06] flex items-end justify-center pb-0">
          <span className="text-xl sm:text-3xl md:text-5xl font-[var(--font-orbitron)] font-black text-white leading-none translate-y-[55%]">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/[0.01] flex items-start justify-center pt-0">
          <span className="text-xl sm:text-3xl md:text-5xl font-[var(--font-orbitron)] font-black text-white/90 leading-none -translate-y-[45%]">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/40 z-10" />
        <div className="absolute top-1/2 left-0 w-2 h-2 -translate-y-1/2 rounded-full bg-black/30" />
        <div className="absolute top-1/2 right-0 w-2 h-2 -translate-y-1/2 rounded-full bg-black/30" />
      </div>
      <span className="mt-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{label}</span>
    </div>
  );
}

export default function CountdownCTAScene() {
  const user = useStore((state) => state.user);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const countdown = useCountdown();

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #011213 0%, #0a0025 50%, #011213 100%)' }}>
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="w-full h-[2px] bg-[var(--neon-cyan)]" style={{ animation: 'scanline 4s linear infinite' }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[var(--neon-cyan)]/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full bg-[var(--neon-magenta)]/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/[0.08] text-[var(--neon-magenta)] text-xs font-bold uppercase tracking-widest mb-8"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Registration Closing Soon</span>
          <span className="w-2 h-2 rounded-full bg-[var(--neon-magenta)]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl md:text-6xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-5"
        >
          DON&apos;T MISS{' '}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent animate-gradient">
            OUT
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-12"
        >
          The biggest youth festival of the year is just days away. Secure your spot now — once they&apos;re gone, they&apos;re gone.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 sm:gap-4 mb-14 flex-wrap"
        >
          <FlipUnit value={countdown.days} label="Days" />
          <span className="text-3xl text-[var(--neon-cyan)]/50 font-bold mt-[-24px]">:</span>
          <FlipUnit value={countdown.hours} label="Hours" />
          <span className="text-3xl text-[var(--neon-cyan)]/50 font-bold mt-[-24px]">:</span>
          <FlipUnit value={countdown.minutes} label="Minutes" />
          <span className="text-3xl text-[var(--neon-cyan)]/50 font-bold mt-[-24px]">:</span>
          <FlipUnit value={countdown.seconds} label="Seconds" />
        </motion.div>


        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center mt-6"
        >
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              if (user) {
                router.push('/dashboard');
              } else {
                setAuthOpen(true, 'register'); 
              }
            }}
            className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-white text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:shadow-[0_0_60px_rgba(0,240,255,0.6)] mx-auto animate-breathe"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] animate-gradient" />
            <div className="absolute inset-[2px] rounded-[14px] bg-[#010008]/80 group-hover:bg-transparent transition-all duration-300" />
            <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              <Ticket className="w-6 h-6 text-[var(--neon-gold)] group-hover:rotate-12 transition-transform" />
              {user ? 'Go To Dashboard' : 'Claim Your Ticket Now'}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
