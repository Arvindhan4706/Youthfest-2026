'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only run this once per session so it doesn't annoy the user on refresh.
    const hasLoaded = sessionStorage.getItem('hasLoadedBefore');
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    const duration = 1800; // 1.8s
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    // Use easing function for progress to make it look natural (fast start, slow end)
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const timer = setInterval(() => {
      currentStep++;
      const rawProgress = currentStep / steps;
      const easedProgress = easeOutQuart(rawProgress);
      const newProgress = Math.min(Math.round(easedProgress * 100), 100);
      
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('hasLoadedBefore', 'true');
        }, 300); // short pause at 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Prevent scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0 }}
          exit={{ 
            y: '-100vh', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[99999] bg-[#020008] flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Logo or Main Text */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white font-[var(--font-heading-main)] text-5xl md:text-7xl font-black tracking-tighter mb-12"
          >
            YOUTH<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]">FEST</span>
          </motion.div>

          {/* Progress Container */}
          <div className="w-64 md:w-80 h-[1px] bg-white/10 rounded-full overflow-hidden relative mb-6">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Glow effect on the progress bar */}
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white opacity-50 blur-[2px]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Percentage */}
          <motion.div 
            className="font-mono text-sm tracking-[0.3em] text-gray-500 uppercase flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span>Loading Experience</span>
            <span className="text-white font-bold">{String(progress).padStart(3, '0')}%</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
