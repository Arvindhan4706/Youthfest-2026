'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Calendar, ChevronDown } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';
import AuthModal from '../AuthModal';

// Target date: August 12, 2026
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

function useCountUp(target: number, duration: number = 2000, startOnMount: boolean = false) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startOnMount);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
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
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl glass neon-border flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon-cyan)]/5 to-transparent" />
        <span className="relative text-2xl sm:text-3xl font-[var(--font-orbitron)] font-black text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">{label}</span>
    </div>
  );
}

function StatBadge({
  value,
  suffix,
  label,
  icon,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center gap-1 p-4 rounded-2xl glass hover:bg-white/[0.06] transition-all duration-300 group cursor-default min-w-[120px]"
    >
      <div className="text-[var(--neon-cyan)] mb-1 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-2xl sm:text-3xl font-[var(--font-orbitron)] font-black text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</span>
    </motion.div>
  );
}

// Particle field for background
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? 'var(--neon-cyan)' : i % 3 === 1 ? 'var(--neon-violet)' : 'var(--neon-magenta)',
            opacity: Math.random() * 0.5 + 0.1,
            animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroScene() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const countdown = useCountdown();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-20"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0030 0%, #011213 50%, #010008 100%)' }}
    >
      {/* Ambient background elements */}
      <ParticleField />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Radial glow spots */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[var(--neon-cyan)]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[var(--neon-violet)]/[0.05] blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-[var(--neon-magenta)]/[0.03] blur-[80px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center mt-16">
        {/* Date badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-border bg-white/[0.03] mb-8 animate-breathe"
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
            August 12, 2026
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
        </motion.div>

        {/* Main title with glitch effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mb-4"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-[var(--font-orbitron)] font-black tracking-tight text-white leading-none">
            YUVENZA
          </h1>
          {/* Glitch layers */}
          <h1
            className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl font-[var(--font-orbitron)] font-black tracking-tight text-[var(--neon-cyan)] leading-none opacity-70 pointer-events-none"
            style={{ animation: 'glitch-1 4s ease-in-out infinite' }}
            aria-hidden="true"
          >
            YUVENZA
          </h1>
          <h1
            className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl font-[var(--font-orbitron)] font-black tracking-tight text-[var(--neon-magenta)] leading-none opacity-70 pointer-events-none"
            style={{ animation: 'glitch-2 4s ease-in-out infinite' }}
            aria-hidden="true"
          >
            YUVENZA
          </h1>
        </motion.div>

        {/* Year with neon glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-[var(--font-orbitron)] font-black bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent animate-gradient">
            2026
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-base sm:text-xl text-gray-400 font-light tracking-wide mb-10 max-w-2xl leading-relaxed"
        >
          THE BIGGEST YOUTH FESTIVAL IS HERE — Technology. Creativity. Gaming. Culture.
          <br className="hidden sm:block" />
          <span className="text-white font-medium">One legendary stage. Infinite glory.</span>
        </motion.p>

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center gap-3 sm:gap-5 mb-12"
        >
          <CountdownUnit value={countdown.days} label="Days" />
          <span className="text-2xl text-[var(--neon-cyan)] font-bold mt-[-20px] animate-pulse">:</span>
          <CountdownUnit value={countdown.hours} label="Hours" />
          <span className="text-2xl text-[var(--neon-cyan)] font-bold mt-[-20px] animate-pulse">:</span>
          <CountdownUnit value={countdown.minutes} label="Mins" />
          <span className="text-2xl text-[var(--neon-cyan)] font-bold mt-[-20px] animate-pulse">:</span>
          <CountdownUnit value={countdown.seconds} label="Secs" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button
            onClick={handleRegisterClick}
            className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] animate-gradient" />
            <div className="absolute inset-[1px] rounded-[15px] bg-[#011213]/80 group-hover:bg-transparent transition-all duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Register Now — Spots Filling Fast 🔥 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <a
            href="#trailer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-md"
          >
            <Play className="w-4 h-4 text-[var(--neon-magenta)]" />
            Watch Trailer
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl"
        >
          <StatBadge value={5000} suffix="+" label="Students" icon={<Zap className="w-5 h-5" />} delay={1.5} />
          <StatBadge value={50} suffix="+" label="Events" icon={<Zap className="w-5 h-5" />} delay={1.6} />
          <StatBadge value={200000} suffix="+" label="Prize Pool" icon={<Zap className="w-5 h-5" />} delay={1.7} />
          <StatBadge value={25} suffix="+" label="Colleges" icon={<Zap className="w-5 h-5" />} delay={1.8} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--neon-cyan)]" />
        </motion.div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
}
