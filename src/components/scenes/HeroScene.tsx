'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';

// Target date: August 21, 2026
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

// Flip Unit for Countdown
function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div
        className="relative w-12 h-14 sm:w-16 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden"
        style={{ perspective: '400px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 flex items-end justify-center pb-0 bg-white/[0.02] border-b border-black/30">
          <span className="font-[var(--font-heading-main)] font-black text-white leading-none" style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', transform: 'translateY(55%)', letterSpacing: '-0.04em' }}>
            {display}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-start justify-center pt-0 bg-white/[0.01]">
          <span className="font-[var(--font-heading-main)] font-black text-white/80 leading-none" style={{ fontSize: 'clamp(1.25rem, 3vw, 2.25rem)', transform: 'translateY(-45%)', letterSpacing: '-0.04em' }}>
            {display}
          </span>
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50 z-10" />
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl" style={{ boxShadow: 'inset 0 0 20px rgba(56,189,248,0.05)' }} />
      </div>
      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">{label}</span>
    </div>
  );
}

import dynamic from 'next/dynamic';
const ParticleUniverse = dynamic(() => import('../ui/ParticleUniverse'), { ssr: false });

export default function HeroScene() {
  const user = useStore((state) => state.user);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const countdown = useCountdown();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse-tracking for dynamic lighting
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Dynamic light orb position
  const lightX = useTransform(springX, [0, 1], ['10%', '90%']);
  const lightY = useTransform(springY, [0, 1], ['10%', '90%']);
  const lightColor = useTransform(springX, [0, 0.5, 1], [
    'rgba(56,189,248,0.15)',
    'rgba(129,140,248,0.12)',
    'rgba(167,139,250,0.15)',
  ]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/profile');
    } else {
      setAuthOpen(true, 'register');
    }
  };

  // Character-by-character reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.6 }
    }
  };
  const charVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      clipPath: 'inset(100% 0 0 0)',
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      transition: {
        type: 'spring' as const,
        damping: 14,
        stiffness: 90,
      }
    }
  };

  const titleWords = ["YOUTHFEST", "2026"];

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #080025 0%, #020c14 55%, #010008 100%)' }}
      aria-labelledby="hero-heading"
    >
      {/* WebGL Particle Universe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1.0 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <ParticleUniverse />
      </motion.div>

      {/* Dynamic mouse-tracking light orb */}
      <motion.div
        className="absolute z-0 pointer-events-none rounded-full blur-[160px]"
        style={{
          width: 600,
          height: 600,
          left: lightX,
          top: lightY,
          x: '-50%',
          y: '-50%',
          background: lightColor,
        }}
      />

      {/* Static ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--neon-cyan)]/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[var(--neon-violet)]/[0.07] blur-[180px] pointer-events-none" />

      {/* Floating geometric shapes & Featured Event Card */}
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 md:w-20 md:h-20 border border-[var(--neon-cyan)]/20 rounded-lg pointer-events-none"
        animate={{ y: [0, -25, 0], rotate: [0, 45, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      


      <motion.div
        className="absolute bottom-[25%] left-[12%] w-6 h-6 md:w-8 md:h-8 bg-[var(--neon-violet)]/20 rotate-45 pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [45, 90, 45], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 7, delay: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[6%] w-5 h-5 border-2 border-[var(--neon-gold)]/20 pointer-events-none"
        animate={{ y: [0, -18, 0], rotate: [0, -60, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 9, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Scrolling background marquee text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none"
      >
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start pt-12 gap-6 pb-8 opacity-[0.10]">
          <div style={{ animationDuration: '40s' }} className="animate-marquee-reverse flex w-max whitespace-nowrap text-[10vw] font-[var(--font-heading-main)] font-black text-white">
            <span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span>
          </div>
          <div style={{ animationDuration: '50s', WebkitTextStroke: '1px white' }} className="animate-marquee flex w-max whitespace-nowrap text-[10vw] font-[var(--font-heading-main)] font-black text-transparent">
            <span className="pr-16">YUVENZA · CIT</span><span className="pr-16">YUVENZA · CIT</span><span className="pr-16">YUVENZA · CIT</span><span className="pr-16">YUVENZA · CIT</span>
          </div>
          <div style={{ animationDuration: '35s' }} className="animate-marquee-reverse flex w-max whitespace-nowrap text-[10vw] font-[var(--font-heading-main)] font-black text-white">
            <span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span><span className="pr-16">YOUTHFEST 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto text-center flex flex-col items-center px-5 sm:px-8 pt-24 pb-32 sm:pt-28 sm:pb-36 pointer-events-auto">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mb-8 sm:mb-10"
        >
          <Image
            src="/hero-logo.png"
            alt="Yuvenza Event Logo"
            width={300}
            height={112}
            priority
            className="w-[140px] sm:w-[180px] md:w-[240px] object-contain mx-auto"
          />
        </motion.div>



        {/* Main heading — word-by-word clip-path reveal */}
        <div className="mb-4 sm:mb-6 overflow-visible perspective-1000">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {titleWords.map((word, wi) => (
              <div key={wi} className="flex overflow-hidden" style={{ paddingBottom: '0.1em', marginBottom: wi === 0 ? '-0.05em' : 0 }}>
                {word.split('').map((char, ci) => (
                  <motion.span
                    key={ci}
                    variants={charVariants}
                    className="inline-block font-[var(--font-heading-main)] font-black tracking-tight text-white leading-none uppercase"
                    style={{
                      fontSize: 'clamp(3rem, 16vw, 9.5rem)',
                      display: 'inline-block',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
          className="text-base sm:text-xl md:text-2xl font-[var(--font-heading-main)] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] via-white/80 to-[var(--neon-magenta)] mb-8 sm:mb-10 tracking-tight"
        >
          WHAT WE CREATE WE CONTRIBUTE
        </motion.p>

        {/* Date badge */}
        <motion.a
          href="#schedule"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="group relative inline-flex items-center gap-3 px-7 py-3 rounded-full backdrop-blur-md bg-white/[0.04] border border-white/[0.10] mb-10 cursor-pointer transition-colors duration-300 overflow-hidden"
        >
          {/* Shimmer sweep on hover */}
          <motion.div
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
            initial={{ left: '-50%' }}
            whileHover={{ left: '150%', transition: { duration: 0.6, ease: 'linear' } }}
          />
          <Calendar className="relative z-10 w-4 h-4 text-[var(--neon-cyan)]" />
          <span className="relative z-10 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-white/90">
            Aug 21 · CIT Campus, Chennai
          </span>
          <div className="relative z-10 flex items-center justify-center w-2 h-2 ml-1">
            <span className="absolute w-full h-full rounded-full bg-[var(--neon-cyan)] opacity-70 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
          </div>
        </motion.a>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.0, ease: "easeOut" }}
          className="text-sm sm:text-base text-gray-400 font-normal tracking-wide mb-8 w-full max-w-2xl mx-auto leading-[1.85] text-center"
        >
          Yuvenza is the student-driven youth club of Chennai Institute of Technology.{' '}
          <span className="text-white font-semibold">What we create, we contribute.</span> Every event and campaign we organize channels real support back to the community around us.
        </motion.p>

        {/* Hero Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="flex items-center justify-center gap-2 sm:gap-4 mb-10 sm:mb-12"
        >
          <FlipUnit value={countdown.days} label="Days" />
          <span className="text-xl sm:text-2xl text-white/20 font-thin mt-[-15px]">:</span>
          <FlipUnit value={countdown.hours} label="Hours" />
          <span className="text-xl sm:text-2xl text-white/20 font-thin mt-[-15px]">:</span>
          <FlipUnit value={countdown.minutes} label="Minutes" />
          <span className="text-xl sm:text-2xl text-white/20 font-thin mt-[-15px]">:</span>
          <FlipUnit value={countdown.seconds} label="Seconds" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          {!user && (
            <motion.button
              onClick={handleRegisterClick}
              aria-label="Register for the Fest"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative group flex items-center justify-center gap-2 w-full sm:w-auto px-9 min-h-[52px] h-[52px] rounded-[14px] font-bold text-base text-black bg-white overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.25)] animate-glow-pulse-btn"
            >
              {/* Shimmer on button */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              <span className="relative z-10">Register for the Fest</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>
          )}

          <motion.button
            onClick={() => router.push('/work')}
            aria-label="Our Work"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-9 min-h-[52px] h-[52px] rounded-[14px] font-semibold text-base text-white border border-white/20 hover:bg-white/[0.06] hover:border-white/30 backdrop-blur-sm transition-all duration-300"
          >
            Our Work
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator — a shrinking vertical line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <motion.div
          animate={{ height: [28, 16, 28] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] bg-gradient-to-b from-white/50 to-transparent rounded-full"
        />
        <span className="text-[9px] tracking-[0.25em] text-gray-600 uppercase font-mono">Scroll</span>
      </motion.div>
    </section>
  );
}
