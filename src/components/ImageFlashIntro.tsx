'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLASH_IMAGES = [
  '/flash-crowd.png',
  '/flash-wellness.png',
  '/flash-colors.png',
  '/flash-stage.png',
  '/flash-energy.png',
];

const YOUTHFEST_LETTERS = ['Y', 'O', 'U', 'T', 'H', 'F', 'E', 'S', 'T'];

// Timeline phases
// Phase 1: Rapid image flashes (dark, chaotic)
// Phase 2: Images flash + letters start revealing one by one
// Phase 3: Full name revealed with dramatic hold + zoom
// Phase 4: Final cinematic fade out

export default function ImageFlashIntro({ onComplete }: { onComplete: () => void }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [flashCount, setFlashCount] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [phase, setPhase] = useState<'chaos' | 'reveal' | 'hold' | 'finale'>('reveal');
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const hasCompleted = useRef(false);

  // Phase 1: Chaos — rapid image flashes
  const CHAOS_FLASHES = 6;
  // Phase 2: Reveal — one letter per flash burst (7 letters, ~2-3 flashes each)
  const FLASHES_PER_LETTER = 3;
  const REVEAL_FLASHES = YOUTHFEST_LETTERS.length * FLASHES_PER_LETTER;

  const getInterval = useCallback((count: number, currentPhase: string) => {
    if (currentPhase === 'chaos') {
      // Start at 150ms, accelerate to 80ms
      const t = count / CHAOS_FLASHES;
      return 150 - t * 70;
    }
    if (currentPhase === 'reveal') {
      // Each letter reveal: fast flash then brief pause
      const withinLetter = count % FLASHES_PER_LETTER;
      if (withinLetter === FLASHES_PER_LETTER - 1) return 400; // pause after letter appears
      return 90; // rapid flashes between
    }
    return 100;
  }, [CHAOS_FLASHES, FLASHES_PER_LETTER]);

  // Random glitch offset
  useEffect(() => {
    if (phase === 'chaos' || phase === 'reveal') {
      const interval = setInterval(() => {
        setGlitchOffset({
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 6,
        });
      }, 80);
      return () => clearInterval(interval);
    } else {
      setGlitchOffset({ x: 0, y: 0 });
    }
  }, [phase]);

  // Main timeline driver
  useEffect(() => {
    if (phase === 'hold' || phase === 'finale') return;

    const timeout = setTimeout(() => {
      if (phase === 'chaos') {
        if (flashCount >= CHAOS_FLASHES) {
          setPhase('reveal');
          setFlashCount(0);
          return;
        }
      }

      if (phase === 'reveal') {
        if (flashCount >= REVEAL_FLASHES) {
          setPhase('hold');
          return;
        }
        // Reveal a new letter at the start of each letter-group
        if (flashCount % FLASHES_PER_LETTER === 0) {
          const letterIndex = Math.floor(flashCount / FLASHES_PER_LETTER);
          setRevealedLetters(letterIndex + 1);
          // White flash on letter reveal
          setShowWhiteFlash(true);
          setTimeout(() => setShowWhiteFlash(false), 80);
        }
      }

      // Cycle images
      setCurrentImgIndex((prev) => (prev + 1) % FLASH_IMAGES.length);
      setFlashCount((prev) => prev + 1);
    }, getInterval(flashCount, phase));

    return () => clearTimeout(timeout);
  }, [phase, flashCount, getInterval, CHAOS_FLASHES, REVEAL_FLASHES, FLASHES_PER_LETTER]);

  // Hold phase: dramatic pause on full name then finale
  useEffect(() => {
    if (phase !== 'hold') return;
    const timer = setTimeout(() => {
      setPhase('finale');
    }, 1800);
    return () => clearTimeout(timer);
  }, [phase]);

  // Finale: fade out and complete
  useEffect(() => {
    if (phase !== 'finale' || hasCompleted.current) return;
    hasCompleted.current = true;
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const getRandomTransform = () => ({
    scale: 1.05 + Math.random() * 0.5,
    rotate: (Math.random() - 0.5) * 12,
    x: `${(Math.random() - 0.5) * 8}%`,
    y: `${(Math.random() - 0.5) * 8}%`,
  });

  const transform = getRandomTransform();
  const isFlashing = phase === 'chaos' || phase === 'reveal';

  return (
    <div className="fixed inset-0 z-[99999] bg-black overflow-hidden select-none">
      {/* === BACKGROUND IMAGE FLASHES === */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`img-${currentImgIndex}-${flashCount}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'finale' ? 0 : phase === 'hold' ? 0.3 : 0.7,
            scale: phase === 'hold' ? 1.2 : transform.scale,
            rotate: phase === 'hold' ? 0 : transform.rotate,
            x: phase === 'hold' ? '0%' : transform.x,
            y: phase === 'hold' ? '0%' : transform.y,
          }}
          transition={{
            duration: phase === 'hold' ? 1.8 : phase === 'finale' ? 1.0 : 0.05,
            ease: phase === 'hold' ? 'easeOut' : 'linear',
          }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FLASH_IMAGES[currentImgIndex]}
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: `contrast(${phase === 'hold' ? 1.2 : 1.3 + Math.random() * 0.3}) saturate(${phase === 'hold' ? 0.8 : 1.3}) brightness(${phase === 'hold' ? 0.4 : 0.8 + Math.random() * 0.3})`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* === GLITCH RGB SPLIT OVERLAY === */}
      {isFlashing && (
        <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ opacity: 0.15 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FLASH_IMAGES[currentImgIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
              filter: 'hue-rotate(120deg)',
              opacity: 0.6,
            }}
          />
        </div>
      )}

      {/* === SCAN LINES === */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          )`,
          opacity: phase === 'hold' ? 0.3 : 0.8,
        }}
      />

      {/* === VIGNETTE === */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${phase === 'hold' ? 0.85 : 0.6}) 100%)`,
        }}
      />

      {/* === TEAL/AMBER COLOR FLASH OVERLAY === */}
      {isFlashing && flashCount % 4 === 0 && (
        <motion.div
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: flashCount % 8 === 0
              ? 'radial-gradient(ellipse at center, rgba(20,185,129,0.4) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(245,158,11,0.35) 0%, transparent 70%)',
          }}
        />
      )}

      {/* === WHITE STROBE FLASH (on letter reveal) === */}
      <AnimatePresence>
        {showWhiteFlash && (
          <motion.div
            key="white-flash"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* === YOUTHFEST CINEMATIC NAME REVEAL === */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${isFlashing ? glitchOffset.x * 0.5 : 0}px, ${isFlashing ? glitchOffset.y * 0.5 : 0}px)`,
        }}
      >
        {/* Yuvenza Presents Label */}
        {revealedLetters > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0.8, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 flex items-center justify-center gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/60" />
            <span className="text-sm sm:text-base md:text-xl font-extrabold uppercase tracking-[0.6em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              Yuvenza Presents
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/60" />
          </motion.div>
        )}

        {/* Letter row */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
          {YOUTHFEST_LETTERS.map((letter, i) => {
            const isRevealed = i < revealedLetters;
            const isLatest = i === revealedLetters - 1;
            
            return (
              <motion.span
                key={`letter-${i}`}
                initial={{ opacity: 0, y: 60, scale: 0.3, rotateX: -90 }}
                animate={
                  isRevealed
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: phase === 'hold' ? 1 : isLatest ? 1.15 : 1,
                        rotateX: 0,
                      }
                    : { opacity: 0, y: 60, scale: 0.3, rotateX: -90 }
                }
                transition={{
                  duration: isLatest ? 0.3 : 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.05em] text-white relative"
                style={{
                  textShadow: isRevealed
                    ? phase === 'hold'
                      ? '0 0 60px rgba(20,185,129,0.7), 0 0 120px rgba(20,185,129,0.3), 0 2px 4px rgba(0,0,0,0.8)'
                      : isLatest
                        ? '0 0 80px rgba(20,185,129,1), 0 0 160px rgba(20,185,129,0.5), 0 0 30px rgba(255,255,255,0.6)'
                        : '0 0 40px rgba(20,185,129,0.5), 0 0 80px rgba(20,185,129,0.2), 0 2px 4px rgba(0,0,0,0.8)'
                    : 'none',
                  fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                  letterSpacing: phase === 'hold' ? '0.15em' : '0.05em',
                  WebkitTextStroke: isRevealed ? '1px rgba(20,185,129,0.3)' : 'none',
                }}
              >
                {letter}
                {/* Glow pulse on latest letter */}
                {isLatest && isRevealed && phase === 'reveal' && (
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center text-teal-400 blur-sm"
                    style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                  >
                    {letter}
                  </motion.span>
                )}
              </motion.span>
            );
          })}
        </div>

        {/* Subtitle — appears during hold phase */}
        <AnimatePresence>
          {(phase === 'hold' || phase === 'finale') && (
            <motion.div
              initial={{ opacity: 0, y: 20, letterSpacing: '0.5em' }}
              animate={{
                opacity: phase === 'finale' ? 0 : 0.8,
                y: 0,
                letterSpacing: '0.4em',
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-gray-300 uppercase tracking-[0.4em] font-light"
            >
              THE BIGGEST YOUTH FESTIVAL • 2026
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative line under text — hold phase */}
        <AnimatePresence>
          {(phase === 'hold' || phase === 'finale') && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'finale' ? 0 : 1,
                opacity: phase === 'finale' ? 0 : 0.6,
              }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 h-[1px] w-32 sm:w-48 md:w-64 origin-center"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(20,185,129,0.8), rgba(245,158,11,0.6), transparent)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* === CHAOS PHASE — Intermittent darkness === */}
      {phase === 'chaos' && flashCount % 3 === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      )}

      {/* === FINALE FADE === */}
      {phase === 'finale' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeIn' }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#011213' }}
        />
      )}
    </div>
  );
}
