'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Zap, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';

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
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
        <span className="relative text-xl sm:text-3xl font-[var(--font-heading-main)] font-bold text-white tabular-nums">
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
      <span className="text-2xl sm:text-3xl font-[var(--font-heading-main)] font-black text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</span>
    </motion.div>
  );
}

import dynamic from 'next/dynamic';
const ParticleUniverse = dynamic(() => import('../ui/ParticleUniverse'), { ssr: false });

export default function HeroScene() {
  const user = useStore((state) => state.user);
  const setAuthOpen = useStore((state) => state.setAuthOpen);
  const router = useRouter();
  const countdown = useCountdown();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Skip parallax on touch/mobile devices to save CPU
    if (window.matchMedia('(hover: none)').matches) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) * 2 - 1);
    mouseY.set((clientY / innerHeight) * 2 - 1);
  };

  const parallaxX1 = useTransform(mouseX, [-1, 1], [-20, 20]);
  const parallaxY1 = useTransform(mouseY, [-1, 1], [-20, 20]);
  const parallaxX2 = useTransform(mouseX, [-1, 1], [30, -30]);
  const parallaxY2 = useTransform(mouseY, [-1, 1], [30, -30]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthOpen(true, 'register');
    }
  };

  const titleText = "YOUTHFEST";
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };
  
  const letterVariants: any = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "backOut" } }
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-x-hidden px-4 py-20"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0030 0%, #011213 50%, #010008 100%)' }}
      aria-labelledby="hero-heading"
    >
      {/* WebGL Particle Universe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1.0 }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <ParticleUniverse />
      </motion.div>
      
      {/* Ambient background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        {/* Infinite scrolling background text - 3 Lines */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between py-24 sm:py-32 overflow-hidden opacity-5 pointer-events-none select-none z-0">
          {/* Line 1 - Scrolling Right (Left to Right) */}
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
          </motion.div>
          {/* Line 2 - Scrolling Left (Right to Left) */}
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
            className="flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YOUTHFEST 2026</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YOUTHFEST 2026</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YOUTHFEST 2026</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YOUTHFEST 2026</span>
          </motion.div>
          {/* Line 3 - Scrolling Right (Left to Right) */}
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
            <span className="pr-16">YOUTHFEST 2026</span>
          </motion.div>
        </div>

        {/* Radial glow spots - Optimized (static scale/opacity, only parallax) */}
        <motion.div 
          style={{ x: parallaxX1, y: parallaxY1 }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[var(--neon-cyan)]/[0.04] blur-[120px] pointer-events-none transform-gpu will-change-transform" 
        />
        <motion.div 
          style={{ x: parallaxX2, y: parallaxY2 }}
          className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-[var(--neon-violet)]/[0.05] blur-[100px] pointer-events-none transform-gpu will-change-transform" 
        />
        <motion.div 
          style={{ x: parallaxX1, y: parallaxY2 }}
          className="absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-[var(--neon-magenta)]/[0.03] blur-[80px] pointer-events-none transform-gpu will-change-transform" 
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center mt-8 sm:mt-16 pointer-events-auto">
        {/* Event Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 relative"
        >
          <div className="relative z-20">
            <Image src="/yuvenzalogo.png" alt="Youthfest Event Logo" width={300} height={112} className="w-[200px] sm:w-[250px] md:w-[300px] h-auto object-contain" />
          </div>
        </motion.div>

        {/* 'Presents' Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-6 flex items-center justify-center gap-4 w-full max-w-md"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/40" />
          <span className="text-sm sm:text-base md:text-lg font-extrabold uppercase tracking-[0.5em] text-gray-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            Presents
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>
        {/* Main title with letter-by-letter reveal */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { staggerChildren: 0.1, delayChildren: 1.0 }
            }
          }}
          initial="hidden"
          animate="visible"
          className="relative mb-4 perspective-1000"
        >
          <h1 id="hero-heading" className="flex justify-center flex-wrap text-[11vw] sm:text-[10vw] md:text-8xl lg:text-9xl font-[var(--font-heading-main)] font-bold tracking-tight text-white leading-none z-10 relative">
            {titleText.split('').map((char, index) => (
              <motion.span key={index} variants={letterVariants} style={{ display: 'inline-block' }}>
                {char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Year */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-6"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl font-[var(--font-heading-main)] font-bold text-gray-200">
            2026
          </span>
        </motion.div>

        {/* Date badge */}
        <motion.a
          href="#schedule"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 mb-8 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20"
        >
          {/* Animated Sweep / Shine effect on hover */}
          <motion.div 
            variants={{
              hover: { x: ["-100%", "200%"] }
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          />
          
          
          <Calendar className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          <span className="relative z-10 text-sm sm:text-base font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300">
            August 12, 2026
          </span>
          
          {/* Status Dot */}
          <div className="relative z-10 flex items-center justify-center w-2 h-2 ml-2">
            <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-70 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
        </motion.a>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="text-base sm:text-lg text-gray-400 font-normal tracking-normal mb-10 max-w-2xl leading-relaxed"
        >
          THE BIGGEST YOUTH FESTIVAL IS HERE — Technology. Creativity. Gaming. Culture.
          <br className="hidden sm:block" />
          <span className="text-white font-medium">Presented by Yuvenza Club. One legendary stage. Infinite glory.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 mb-10 mx-auto px-2"
        >
          <CountdownUnit value={countdown.days} label="Days" />
          <span className="text-xl sm:text-2xl text-gray-500 font-bold mt-[-20px]">:</span>
          <CountdownUnit value={countdown.hours} label="Hours" />
          <span className="text-xl sm:text-2xl text-gray-500 font-bold mt-[-20px]">:</span>
          <CountdownUnit value={countdown.minutes} label="Mins" />
          <span className="text-xl sm:text-2xl text-gray-500 font-bold mt-[-20px]">:</span>
          <CountdownUnit value={countdown.seconds} label="Secs" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full px-4 sm:px-0"
        >
          <button
            onClick={handleRegisterClick}
            aria-label="Register Now"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-black bg-white hover:bg-gray-200 transition-all duration-300"
          >
            Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>


        </motion.div>


      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--neon-cyan)]" />
        </motion.div>
      </motion.div>

    </section>
  );
}
