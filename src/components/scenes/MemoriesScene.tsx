'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  year: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', title: 'Cosmic Concert Night', year: 'Yuvenza 25', desc: 'DJ lasers cutting through an audience of 5,000 students.' },
  { id: 2, url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', title: 'Genesis Hackathon Team', year: 'Yuvenza 25', desc: 'Developers configuring smart contract pipelines in the midnight coding lab.' },
  { id: 3, url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', title: 'Beat Drop Dance Battle', year: 'Yuvenza 24', desc: 'Breakdancing crew executing gravity-defying freeze poses.' },
  { id: 4, url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', title: 'Robotics Arena teleoperation', year: 'Yuvenza 24', desc: 'Autonomous rover navigating through obstacle runs.' },
  { id: 5, url: 'https://images.unsplash.com/photo-1478416452197-66ef05e17349?auto=format&fit=crop&w=800&q=80', title: 'Virtual Reality Sandbox', year: 'Yuvenza 25', desc: 'Students exploring 3D virtual painting environments.' },
  { id: 6, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', title: 'Main Concert Stage', year: 'Yuvenza 24', desc: 'Rock vocal headliner lighting up the night sky.' }
];

export default function MemoriesScene() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

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
    <section id="memories" className="relative py-24 bg-[#011213] px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4">
            MEMORIES OF <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PAST EDITIONS</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            A retrospective look at the glowing history, legendary code sprints, and energetic crowds of Yuvenza.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid relative rounded-2xl border border-white/10 overflow-hidden bg-black/40 group cursor-pointer shadow-xl hover:border-purple-500/40 transition-colors"
              whileHover={{ scale: 1.015 }}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full object-cover max-h-[450px]"
              />

              {/* Hover Details Panel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1 font-mono">
                  {img.year}
                </span>
                <h4 className="text-white text-base font-bold mb-1">{img.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">{img.desc}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-mono font-bold">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400" /> Click to Expand
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close trigger overlay */}
            <div className="absolute inset-0" onClick={closeLightbox} />

            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Button */}
            <button 
              onClick={prevImage}
              className="absolute left-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Lightbox content card */}
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
              <div className="text-left px-2">
                <span className="text-xs font-bold text-purple-400 font-mono uppercase">{GALLERY_IMAGES[lightboxIndex].year}</span>
                <h3 className="text-xl font-bold text-white mt-1">{GALLERY_IMAGES[lightboxIndex].title}</h3>
                <p className="text-sm text-gray-400 mt-1.5">{GALLERY_IMAGES[lightboxIndex].desc}</p>
              </div>
            </motion.div>

            {/* Right Button */}
            <button 
              onClick={nextImage}
              className="absolute right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
