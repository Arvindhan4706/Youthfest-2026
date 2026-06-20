'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, ImageIcon, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  year: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', title: 'Cosmic Concert Night', year: 'Youthfest 25', desc: 'DJ lasers cutting through an audience of 5,000 students. Absolute chaos.' },
  { id: 2, url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', title: 'Genesis Hackathon', year: 'Youthfest 25', desc: 'Teams pushing code at 3AM. 200+ developers competing for glory.' },
  { id: 3, url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', title: 'Beat Drop Dance Battle', year: 'Youthfest 24', desc: 'Crews from 15 colleges battled it out under strobes and bass.' },
  { id: 4, url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', title: 'Robo Wars Arena', year: 'Youthfest 24', desc: 'Sparks flying, metal clashing — the arena went absolutely wild.' },
  { id: 5, url: 'https://images.unsplash.com/photo-1478416452197-66ef05e17349?auto=format&fit=crop&w=800&q=80', title: 'VR Experience Zone', year: 'Youthfest 25', desc: 'Queues wrapped the building. Everyone wanted to try the VR sandbox.' },
  { id: 6, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', title: 'Main Stage Headliner', year: 'Youthfest 24', desc: 'The crowd when the headliner dropped the first beat. Legendary.' },
];

const HIGHLIGHTS = [
  '10,000+ Social Media Impressions',
  'Trending #1 on Campus',
  '3 News Channel Features',
  '15+ College Delegations',
  '98% Would Return Next Year',
  '4,500+ Registrations Last Year',
];

export default function MemoriesScene() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1));
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="memories" className="relative py-24 overflow-hidden" style={{ background: '#011213' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 font-semibold uppercase tracking-widest mb-5"
          >
            <ImageIcon className="w-3 h-3 text-[var(--neon-violet)]" />
            Past Editions Gallery
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            PREVIOUS{' '}
            <span className="bg-gradient-to-r from-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              EDITIONS
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Moments that broke the internet. See why thousands keep coming back.
          </p>
        </div>

        {/* Auto-scrolling highlights marquee */}
        <div className="relative mb-14 overflow-hidden py-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...HIGHLIGHTS, ...HIGHLIGHTS].map((h, i) => (
              <span key={i} className="mx-6 text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[var(--neon-cyan)]" />
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative rounded-2xl border border-white/[0.08] overflow-hidden bg-black/40 group cursor-pointer shadow-xl hover:border-[var(--neon-violet)]/30 transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <img src={img.url} alt={img.title} className="w-full object-cover max-h-[450px]" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold tracking-widest text-[var(--neon-cyan)] uppercase mb-1 font-mono">
                  {img.year}
                </span>
                <h4 className="text-white text-base font-bold mb-1">{img.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">{img.desc}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-mono font-bold">
                  <Maximize2 className="w-3.5 h-3.5 text-[var(--neon-violet)]" /> Click to Expand
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={closeLightbox} />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl w-full z-10 flex flex-col gap-4"
            >
              <img
                src={GALLERY_IMAGES[lightboxIndex].url}
                alt={GALLERY_IMAGES[lightboxIndex].title}
                className="w-full max-h-[75vh] object-contain rounded-xl border border-white/10"
              />
              <div className="text-left px-4 sm:px-2">
                <span className="text-xs font-bold text-[var(--neon-cyan)] font-mono uppercase">
                  {GALLERY_IMAGES[lightboxIndex].year}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{GALLERY_IMAGES[lightboxIndex].title}</h3>
                <p className="text-sm text-gray-400 mt-1.5">{GALLERY_IMAGES[lightboxIndex].desc}</p>
              </div>
            </motion.div>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
