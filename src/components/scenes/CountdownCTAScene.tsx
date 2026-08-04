'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';

const TARGET_DATE = new Date('2026-08-21T10:00:00+05:30').getTime();

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
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden"
        style={{ perspective: '400px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Top half */}
        <div className="absolute inset-x-0 top-0 h-1/2 flex items-end justify-center pb-0 bg-white/[0.02] border-b border-black/30">
          <span className="font-[var(--font-heading-main)] font-black text-white leading-none" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', transform: 'translateY(55%)', letterSpacing: '-0.04em' }}>
            {display}
          </span>
        </div>
        {/* Bottom half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-start justify-center pt-0 bg-white/[0.01]">
          <span className="font-[var(--font-heading-main)] font-black text-white/80 leading-none" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', transform: 'translateY(-45%)', letterSpacing: '-0.04em' }}>
            {display}
          </span>
        </div>
        {/* Divider line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50 z-10" />
        {/* Side dots */}
        <div className="absolute top-1/2 left-0 w-2 h-2 -translate-y-1/2 rounded-full bg-black/40" />
        <div className="absolute top-1/2 right-0 w-2 h-2 -translate-y-1/2 rounded-full bg-black/40" />
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 20px rgba(56,189,248,0.05)' }} />
      </div>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">{label}</span>
    </div>
  );
}

export default function CountdownCTAScene() {
  const user = useStore((state) => state.user);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const countdown = useCountdown();

  return (
    <section className="relative section-padding overflow-hidden bg-[#04010c]">
      {/* Animated radial gradient background */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 bg-dots opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 container-responsive text-center">
        {/* Urgency badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-magenta)]/25 bg-[var(--neon-magenta)]/[0.06] text-[var(--neon-magenta)] text-xs font-bold uppercase tracking-[0.2em] mb-10"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Let&apos;s Create Change Together</span>
          <span className="w-2 h-2 rounded-full bg-[var(--neon-magenta)]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
        </motion.div>

        {/* Heading — clip-path wipe reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden mb-6"
        >
          <motion.h2
            initial={{ y: 80, clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ y: 0, clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[var(--font-heading-main)] font-black text-white uppercase"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            JOIN THE{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent animate-gradient">
              MOVEMENT
            </span>
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-14 leading-[1.85]"
        >
          Be part of something bigger. Join Yuvenza and help us channel every event into a meaningful social cause.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="flex items-center justify-center gap-3 sm:gap-5 mb-14 flex-wrap"
        >
          <FlipUnit value={countdown.days} label="Days" />
          <span className="text-2xl sm:text-3xl text-white/15 font-thin mt-[-20px]">:</span>
          <FlipUnit value={countdown.hours} label="Hours" />
          <span className="text-2xl sm:text-3xl text-white/15 font-thin mt-[-20px]">:</span>
          <FlipUnit value={countdown.minutes} label="Minutes" />
          <span className="text-2xl sm:text-3xl text-white/15 font-thin mt-[-20px]">:</span>
          <FlipUnit value={countdown.seconds} label="Seconds" />
        </motion.div>

        {/* CTA Button — glow pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              if (user) { router.push('/profile'); } else { setAuthOpen(true, 'register'); }
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="relative group flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-2xl font-bold text-base text-black bg-white mx-auto overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.25)] animate-glow-pulse-btn"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <span className="relative z-10">{user ? 'Go To Dashboard' : 'Register for the Fest'}</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
