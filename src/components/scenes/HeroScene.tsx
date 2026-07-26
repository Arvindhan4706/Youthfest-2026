'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
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
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
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
      className="flex flex-col items-center gap-1 p-4 rounded-[20px] glass hover:bg-white/[0.06] transition-all duration-300 group cursor-default min-w-[120px]"
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

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/profile');
    } else {
      setAuthOpen(true, 'register');
    }
  };

  const titleText = "YUVENZA";
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
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-x-hidden px-4 section-padding"
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
        <div className="absolute top-0 left-0 w-full flex flex-col overflow-hidden pointer-events-none select-none z-0 h-full sm:h-[120%] justify-between sm:justify-start section-padding sm:py-0 sm:pt-20 opacity-5 sm:opacity-10 space-y-0 sm:space-y-8 translate-y-0 sm:-translate-y-10">
          {/* Line 1 - Scrolling Right (Left to Right) */}
          <div
            style={{ animationDuration: '40s' }}
            className="animate-marquee-reverse flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
          </div>
          {/* Line 2 - Scrolling Left (Right to Left) */}
          <div
            style={{ animationDuration: '45s' }}
            className="animate-marquee flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YUVENZA</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YUVENZA</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YUVENZA</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YUVENZA</span>
            <span className="pr-16 text-transparent" style={{ WebkitTextStroke: '2px white' }}>YUVENZA</span>
          </div>
          {/* Line 3 - Scrolling Right (Left to Right) */}
          <div
            style={{ animationDuration: '35s' }}
            className="animate-marquee-reverse flex whitespace-nowrap text-[12vw] sm:text-[10vw] font-[var(--font-heading-main)] font-black text-white tracking-tighter"
          >
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
            <span className="pr-16">YUVENZA</span>
          </div>
        </div>

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
            <Image src="/yuvenzalogo.png" alt="Youthfest Event Logo" width={300} height={112} priority style={{ height: "auto" }} className="w-[38px] sm:w-[48px] md:w-[60px] object-contain" />
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 w-full max-w-2xl"
        >
          <div className="hidden sm:block h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/40" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-300 whitespace-nowrap">
            The Youth Club · Chennai Institute of Technology
          </span>
          <span className="hidden sm:inline-block text-white/40 font-black text-lg leading-none mt-[-2px]">•</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            Est. 2023
          </span>
          <div className="hidden sm:block h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { staggerChildren: 0.05, delayChildren: 0.2 }
            }
          }}
          initial="hidden"
          animate="visible"
          className="relative mb-4 perspective-1000"
        >
          <h1 id="hero-heading" className="flex justify-center flex-wrap text-[clamp(3.5rem,15vw,8rem)] md:text-8xl lg:text-9xl font-[var(--font-heading-main)] font-bold tracking-tight text-white leading-none z-10 relative px-2 text-center uppercase">
            {titleText.split('').map((char, index) => (
              <motion.span key={index} variants={letterVariants} style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
                {char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg sm:text-2xl md:text-3xl font-[var(--font-heading-main)] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-magenta)] mb-6 text-center"
        >
          Igniting Passion, Creativity & Unity.
        </motion.p>

        {/* Date badge */}
        <motion.a
          href="#schedule"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 mb-8 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20"
        >
          <motion.div 
            variants={{ hover: { x: ["-100%", "200%"] } }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          />
          <Calendar className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          <span className="relative z-10 text-sm sm:text-base font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300">
            Aug 11–13 · CIT Campus, Chennai
          </span>
          <div className="relative z-10 flex items-center justify-center w-2 h-2 ml-2">
            <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-70 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
        </motion.a>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-base sm:text-lg text-gray-400 font-normal tracking-normal mb-8 max-w-3xl leading-relaxed text-center px-4"
        >
          Yuvenza is the student-driven youth club of Chennai Institute of Technology. <span className="text-white font-medium">What we create, we contribute.</span> Every event and campaign we organize channels real support back to the community around us.
        </motion.p>

        {/* HERO FACTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-10 mx-auto px-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
            <span className="text-sm font-medium text-gray-300">8 Events · Open to All Colleges</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-violet)]" />
            <span className="text-sm font-medium text-gray-300">Every Registration Supports Our Social Causes</span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 w-full px-4 md:px-0"
        >
          <button
            onClick={handleRegisterClick}
            aria-label="Register for the Fest"
            className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 h-[48px] rounded-[12px] font-bold text-black bg-white hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Register for the Fest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/events')}
            aria-label="Our Work"
            className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 h-[48px] rounded-[12px] font-semibold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Our Work
          </button>
          <button
            onClick={() => router.push('/#about')}
            aria-label="Join the Club"
            className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 h-[48px] rounded-[12px] font-semibold text-gray-300 hover:text-white transition-all duration-300"
          >
            Join the Club
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
