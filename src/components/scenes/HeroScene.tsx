'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { useRouter } from 'next/navigation';
import AuthModal from '../AuthModal';

export default function HeroScene() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#011213] py-20 px-4">
      
      {/* Background Banner Image with soft dark teal overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url("/yuvenza_wellness_hero.png")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#011213]/40 via-[#011213]/90 to-[#011213] z-0 pointer-events-none" />

      {/* Main Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mt-12">
        
        {/* Left Column: Heading and CTAs */}
        <div className="lg:col-span-7 text-left flex flex-col items-start">
          
          {/* Wellness Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(20,185,129,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Yuvenza Club's Wellness & Youth Festival</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-6"
          >
            YUVENZA <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(20,185,129,0.3)]">
              2026
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-xl font-light text-gray-300 tracking-wide mb-10 max-w-xl leading-relaxed"
          >
            Elevate your Mind. Revitalize your Body. Empower your Soul. Connect with active living workshops, mental health hackathons, and sports challenges.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="/dashboard"
              onClick={handleRegisterClick}
              className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href="#galaxy"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors backdrop-blur-md"
            >
              Explore Zones
            </a>

            <a
              href="#trailer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-4 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Play className="w-4 h-4 text-teal-400" /> Watch Trailer
            </a>
          </motion.div>

        </div>

        {/* Right Column: Premium Showcase Image Frame */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full aspect-[4/3] max-w-md rounded-3xl overflow-hidden border border-teal-500/20 bg-white/5 p-2.5 backdrop-blur-md shadow-[0_0_50px_rgba(20,185,129,0.12)] group"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img 
                src="/yuvenza_wellness_hero.png" 
                alt="Yuvenza Wellness Festival"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#011213]/85 via-[#011213]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30 backdrop-blur-md">
                  Active Youth
                </span>
                <span className="text-[9px] text-gray-300 font-mono">Wellness Campaign</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Downward Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
        <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Scroll to enter</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-6 bg-gradient-to-b from-teal-400 to-transparent rounded-full"
        />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

    </section>
  );
}
