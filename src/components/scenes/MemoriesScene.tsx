'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, ImageIcon, Sparkles, Play, Expand } from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  title: string;
  year: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', title: 'Cosmic Concert Night', year: 'Youthfest 25', desc: 'DJ lasers cutting through an audience of 5,000 students. Absolute chaos.' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', title: 'Genesis Hackathon', year: 'Youthfest 25', desc: 'Teams pushing code at 3AM. 200+ developers competing for glory.' },
  { id: 3, type: 'video', url: 'https://cdn.pixabay.com/vimeo/143526543/concert-1065.mp4?width=1280&hash=85061f0084478f24b2bb08a1d7fce531fc4ef166', title: 'EDM Closing Set', year: 'Youthfest 24', desc: 'The insane energy during the final drop of the festival.' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', title: 'Robo Wars Arena', year: 'Youthfest 24', desc: 'Sparks flying, metal clashing — the arena went absolutely wild.' },
  { id: 5, type: 'video', url: 'https://cdn.pixabay.com/vimeo/328236166/lights-22736.mp4?width=1280&hash=8dfaf38c5f5ad2732c2538f9b964d39c091bc860', title: 'Laser Show Finale', year: 'Youthfest 25', desc: 'The moment the entire campus was lit up with our custom laser rig.' },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', title: 'Main Stage Headliner', year: 'Youthfest 24', desc: 'The crowd when the headliner dropped the first beat. Legendary.' },
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
  const lightboxRef = useRef<HTMLDivElement>(null);

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

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && lightboxRef.current) {
      await lightboxRef.current.requestFullscreen().catch((err) => console.error(err));
    } else if (document.fullscreenElement) {
      await document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen();
        closeLightbox();
      }
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
          {GALLERY_IMAGES.map((item, idx) => (
            <motion.div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative rounded-2xl border border-white/[0.08] overflow-hidden bg-black/40 group cursor-pointer shadow-xl hover:border-[var(--neon-violet)]/30 transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              {item.type === 'video' ? (
                <video src={item.url} className="w-full object-cover max-h-[450px]" muted loop autoPlay playsInline />
              ) : (
                <img src={item.url} alt={item.title} className="w-full object-cover max-h-[450px]" />
              )}
              
              {/* Play Button Overlay for Videos */}
              {item.type === 'video' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white ml-1" fill="white" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold tracking-widest text-[var(--neon-cyan)] uppercase mb-1 font-mono">
                  {item.year}
                </span>
                <h4 className="text-white text-base font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">{item.desc}</p>
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
            ref={lightboxRef}
          >
            <div className="absolute inset-0" onClick={closeLightbox} />
            
            {/* Controls */}
            <div className="absolute top-6 right-6 flex gap-4 z-20">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                title="Toggle Fullscreen"
              >
                <Expand className="w-5 h-5" />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={prevImage}
              className="absolute left-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl w-full z-10 flex flex-col gap-4"
            >
              {GALLERY_IMAGES[lightboxIndex].type === 'video' ? (
                <video 
                  src={GALLERY_IMAGES[lightboxIndex].url} 
                  controls 
                  autoPlay 
                  className="w-full max-h-[80vh] object-contain rounded-xl border border-white/10 bg-black" 
                />
              ) : (
                <img
                  src={GALLERY_IMAGES[lightboxIndex].url}
                  alt={GALLERY_IMAGES[lightboxIndex].title}
                  className="w-full max-h-[80vh] object-contain rounded-xl border border-white/10"
                />
              )}
              
              <div className="text-left px-2">
                <span className="text-xs font-bold text-[var(--neon-cyan)] font-mono uppercase">
                  {GALLERY_IMAGES[lightboxIndex].year}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{GALLERY_IMAGES[lightboxIndex].title}</h3>
                <p className="text-sm text-gray-400 mt-1.5">{GALLERY_IMAGES[lightboxIndex].desc}</p>
              </div>
            </motion.div>

            <button
              onClick={nextImage}
              className="absolute right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
