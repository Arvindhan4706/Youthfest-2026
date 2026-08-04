'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Yuvenza transformed our enthusiasm into purpose. Every event we organize contributes to a meaningful cause.',
    author: 'The Core Team',
    role: 'Festival Organizers',
    color: '#38bdf8',
  },
  {
    id: 't-2',
    quote: 'Igniting passion, creativity, and unity is more than our slogan — it\'s the spirit that drives every initiative we undertake.',
    author: 'Our Volunteers',
    role: '200+ Strong',
    color: '#a78bfa',
  },
  {
    id: 't-3',
    quote: 'What we create, we contribute. Every member proudly carries this vision into every campaign and event.',
    author: 'The Council',
    role: 'Student Leadership',
    color: '#818cf8',
  },
];

// 3D tilt testimonial card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springRY = useSpring(rotateY, { stiffness: 150, damping: 18 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -5);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 5);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: 'preserve-3d',
        boxShadow: `0 0 60px ${testimonial.color}12`,
      }}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-8 sm:p-12 md:p-14 relative overflow-hidden"
    >
      {/* Color bar top */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(to right, transparent, ${testimonial.color}, transparent)` }}
      />
      {/* Glow blob behind card */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-10"
        style={{ background: testimonial.color }}
      />
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 opacity-[0.06]" style={{ color: testimonial.color }} />

      <p className="text-lg sm:text-xl md:text-2xl text-white/85 leading-[1.85] font-light italic mb-10" style={{ letterSpacing: '-0.01em' }}>
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4">
        {/* Author dot accent */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${testimonial.color}20`, border: `1px solid ${testimonial.color}40` }}>
          <span className="text-base font-black" style={{ color: testimonial.color }}>
            {testimonial.author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-[0.15em]" style={{ color: testimonial.color }}>
            {testimonial.author}
          </p>
          <p className="text-xs text-gray-500 tracking-wider mt-0.5">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SpeakersScene() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };
  const prev = () => goTo(active === 0 ? TESTIMONIALS.length - 1 : active - 1);
  const next = () => goTo(active === TESTIMONIALS.length - 1 ? 0 : active + 1);

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.96, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.96, filter: 'blur(4px)' }),
  };

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden bg-[#07020d]" aria-labelledby="testimonials-heading">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-950/20 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 container-responsive">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-7"
          >
            In Their Words
          </motion.div>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[var(--font-heading-main)] font-black text-white uppercase"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            WHAT THEY{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              SAY
            </span>
          </motion.h2>
        </div>

        {/* Testimonial Card — directional cross-fade + slide */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <TestimonialCard testimonial={TESTIMONIALS[active]} />
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute -left-4 sm:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:-translate-x-1"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 sm:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => goTo(i)}
              aria-label={`Testimonial from ${t.author}`}
              className="transition-all duration-300"
            >
              <motion.span
                animate={{
                  width: active === i ? 28 : 8,
                  opacity: active === i ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="block rounded-full h-2"
                style={{
                  background: active === i ? t.color : 'rgba(255,255,255,0.3)',
                  boxShadow: active === i ? `0 0 12px ${t.color}` : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
