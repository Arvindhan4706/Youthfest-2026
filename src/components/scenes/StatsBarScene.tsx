'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function StatsBarScene() {
  return (
    <section id="about" className="relative section-padding overflow-hidden bg-[#060310]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-dots opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--neon-violet)]/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--neon-cyan)]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container-responsive">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left column — text slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-7"
          >
            <div className="inline-flex items-center gap-3">
              <div className="h-[2px] w-10 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--neon-cyan)]">About Yuvenza</span>
            </div>
            <h2 className="font-[var(--font-heading-main)] font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em' }}>
              THE YOUTH<br />
              <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
                POWERED CLUB
              </span>
            </h2>
            <p className="text-gray-400 leading-[1.85] text-base sm:text-lg max-w-lg">
              Since 2023, we&apos;ve brought together students of Chennai Institute of Technology to create meaningful social impact through events, awareness campaigns, and community initiatives.
            </p>
            <p className="text-gray-400 leading-[1.85] text-base sm:text-lg max-w-lg">
              <span className="text-white font-semibold">What we create, we contribute.</span> Every fee channels real support back to the community around us.
            </p>
          </motion.div>

          {/* Right column — event logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative"
          >
            {/* Decorative glow behind the logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 blur-[60px] rounded-full pointer-events-none" />
            
            <motion.div 
              className="relative w-full max-w-[550px] aspect-square"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
            >
              <Image 
                src="/eventlogo.png" 
                alt="Event Logo" 
                fill 
                className="object-contain drop-shadow-2xl" 
                sizes="(max-width: 768px) 100vw, 550px"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
