'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { Heart } from 'lucide-react';

export default function LoadingScene({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Syncing timelines...');
  const addToast = useStore((state) => state.addToast);

  useEffect(() => {
    const intervals = [
      { max: 25, stage: 'Cultivating wellness modules...' },
      { max: 50, stage: 'Blossoming core energy...' },
      { max: 80, stage: 'Igniting youth vitality...' },
      { max: 100, stage: 'Aligning the growth pathway...' },
    ];

    let currentInterval = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            addToast('Welcome to Youthfest 2026!', { points: 50 });
            onComplete();
          }, 500);
          return 100;
        }
        
        // Dynamic step sizes
        const step = Math.floor(Math.random() * 8) + 2;
        const nextProgress = Math.min(prev + step, 100);

        // Update stages
        const matched = intervals.find((i) => nextProgress <= i.max);
        if (matched) {
          setStage(matched.stage);
        }

        return nextProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);



  return (
    <div className="fixed inset-0 z-[9999] bg-[#03001e] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.26),rgba(255,255,255,0))]" />
      
      {/* Particle animation */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] animate-[pulse_3s_infinite]" />

      <AnimatePresence mode="wait">
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center px-4 max-w-lg w-full"
          >
            {/* Morphing Festival Symbol */}
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-16 h-16 rounded-xl border border-teal-500/20 bg-teal-500/5 flex items-center justify-center mb-8 relative shadow-[0_0_20px_rgba(20,185,129,0.4)]"
            >
              <Heart className="w-8 h-8 text-teal-400" />
            </motion.div>

            {/* Glowing Festival Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[0.2em] mb-2 uppercase">
              Yuvenza&apos;s Youthfest <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-500 bg-clip-text text-transparent">2026</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-12">Youth & Wellness Festival</p>

            {/* Progress Bar Container */}
            <div className="w-full bg-white/5 border border-white/10 h-1.5 rounded-full mb-4 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center w-full text-xs text-gray-500">
              <span className="font-mono tracking-widest">{stage}</span>
              <span className="font-mono font-bold text-gray-400">{progress}%</span>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
