'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Yuvenza transformed our enthusiasm into purpose. Every event we organize contributes to a meaningful cause.',
    author: 'The Core Team',
    color: '#00f0ff',
  },
  {
    id: 't-2',
    quote: 'Igniting passion, creativity, and unity is more than our slogan — it\'s the spirit that drives every initiative we undertake.',
    author: 'Our Volunteers',
    color: '#ff006e',
  },
  {
    id: 't-3',
    quote: 'What we create, we contribute. Every member proudly carries this vision into every campaign and event.',
    author: 'The Council',
    color: '#a855f7',
  },
];

export default function SpeakersScene() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="relative section-padding md:section-padding lg:section-padding overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="relative z-10 container-responsive">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 font-semibold uppercase tracking-widest mb-5"
          >
            In Their Words
          </motion.div>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            WHAT THEY{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              SAY
            </span>
          </motion.h2>
        </div>

        {/* Testimonial Cards */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 md:p-14 relative overflow-hidden"
              style={{ boxShadow: `0 0 40px ${TESTIMONIALS[active].color}10` }}
            >
              {/* Top colour bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(to right, ${TESTIMONIALS[active].color}00, ${TESTIMONIALS[active].color}, ${TESTIMONIALS[active].color}00)` }}
              />
              {/* Quote icon */}
              <Quote
                className="absolute top-8 right-8 w-12 h-12 opacity-10"
                style={{ color: TESTIMONIALS[active].color }}
              />
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light italic mb-8">
                &ldquo;{TESTIMONIALS[active].quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-[2px] rounded-full"
                  style={{ background: TESTIMONIALS[active].color }}
                />
                <span className="font-bold text-sm uppercase tracking-widest" style={{ color: TESTIMONIALS[active].color }}>
                  {TESTIMONIALS[active].author}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              aria-label={`Testimonial from ${t.author}`}
              className="transition-all duration-300"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: active === i ? 28 : 10,
                  height: 10,
                  background: active === i ? t.color : 'rgba(255,255,255,0.2)',
                  boxShadow: active === i ? `0 0 10px ${t.color}` : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

