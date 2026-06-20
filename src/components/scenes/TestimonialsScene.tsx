'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  college: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    quote: "Best fest ever! The energy, the crowd, the sheer scale of the events was mind-blowing. The hackathon pushed me to my absolute limits.",
    name: "Arjun Mehta",
    college: "IIT Madras",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 't-2',
    quote: "I've been to a dozen college fests, but Youthfest is on another level. The EDM night was legendary. I'm definitely coming back next year.",
    name: "Priya Sharma",
    college: "SRM Institute of Science and Technology",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 't-3',
    quote: "The networking opportunities were incredible. I met so many like-minded developers and even scored an internship interview during the tech summit.",
    name: "Rahul Verma",
    college: "VIT Vellore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 't-4',
    quote: "As a dancer, the stage setup and lighting for the choreography competition was a dream come true. The vibe was just electric from start to finish.",
    name: "Anjali Desai",
    college: "Delhi University",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  }
];

export default function TestimonialsScene() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
      };
    }
  };

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden" style={{ background: '#010508' }}>
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--neon-violet)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--neon-cyan)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/5 text-xs text-[var(--neon-magenta)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(255,0,110,0.2)]"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Voices of the Crowd
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            STUDENT{' '}
            <span className="bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-gold)] bg-clip-text text-transparent">
              STORIES
            </span>
          </motion.h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center">
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="absolute w-full px-4 sm:px-12"
            >
              <div className="relative glass-strong rounded-[2rem] p-8 sm:p-12 border border-white/10 shadow-2xl flex flex-col items-center text-center">
                <Quote className="w-16 h-16 text-[var(--neon-violet)]/30 mb-6 absolute top-8 left-8" />
                <Quote className="w-16 h-16 text-[var(--neon-violet)]/30 mb-6 absolute bottom-8 right-8 rotate-180" />
                
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-relaxed mb-10 max-w-2xl relative z-10">
                  "{TESTIMONIALS[currentIndex].quote}"
                </p>
                
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <img 
                    src={TESTIMONIALS[currentIndex].avatar} 
                    alt={TESTIMONIALS[currentIndex].name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--neon-cyan)]/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg tracking-wide">{TESTIMONIALS[currentIndex].name}</h4>
                    <p className="text-[var(--neon-cyan)] text-sm font-semibold uppercase tracking-wider">{TESTIMONIALS[currentIndex].college}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 sm:-left-6 p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-[var(--neon-violet)] hover:text-white transition-all z-20 backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 sm:-right-6 p-3 rounded-full bg-black/50 border border-white/10 text-white hover:bg-[var(--neon-violet)] hover:text-white transition-all z-20 backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[var(--neon-cyan)] scale-125 shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
