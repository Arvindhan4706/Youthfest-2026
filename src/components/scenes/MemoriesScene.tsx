'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Play, Expand } from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  title: string;
  year: string;
  desc: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  // 2023
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'Youth Fest \'23 + First Orphanage Visit', year: '2023', desc: 'The flagship cultural fest debuts and immediately extends beyond campus with our first outreach.' },
  
  // 2024
  { id: 2, type: 'image', url: '/memories/yf24.png', title: 'Keerthy Suresh at Youth Fest \'24', year: '2024', desc: 'Actress Keerthy Suresh joins as chief guest. The fest scales to an industry-grade campus profile.' },
  { id: 3, type: 'image', url: '/memories/marathon.png', title: 'Marathon', year: '2024', desc: 'A college marathon event, students running together, energetic, early morning sunlight.' },
  { id: 4, type: 'image', url: '/memories/cancer_panel.png', title: 'Cancer Awareness Day Panel', year: '2024', desc: 'A panel discussion on a stage in a college auditorium, serious but hopeful tone.' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'HIV/AIDS Panel + Christmas Drive', year: '2024', desc: 'A structured awareness panel, followed by a campus-wide Christmas donation drive for orphanage residents.' },
  
  // 2025
  { id: 6, type: 'image', url: '/memories/republic25.png', title: 'Republic Day with the SP', year: '2025', desc: 'The Superintendent of Police joins as chief guest for the formal flag hoisting and parade.' },
  { id: 7, type: 'image', url: '/memories/nyabagam.png', title: 'Nyabagam Varuthe', year: '2025', desc: 'A nostalgic cultural college event, traditional vibes, emotional, memory lane.' },
  { id: 8, type: 'image', url: '/memories/yf25.png', title: 'Youth Fest \'25 — 5,000+ Students', year: '2025', desc: 'Backed by Red Bull, Toni & Guy and the Rotary Club. Blind School visit follows the fest.' },
  { id: 9, type: 'image', url: '/memories/onam25.png', title: 'Onam 25', year: '2025', desc: 'Vibrant Onam celebration in a college, students in traditional kerala attire, flower rangoli.' },
  { id: 10, type: 'image', url: '/memories/christmas25.png', title: 'Christmas 25', year: '2025', desc: 'Festive Christmas celebration on campus, decorated christmas tree, fairy lights.' },
  
  // 2026
  { id: 11, type: 'image', url: '/memories/republic26.png', title: 'Republic Day 2026', year: '2026', desc: 'Majestic Indian Republic day event, students marching, patriotic spirit, large flag.' },
  { id: 12, type: 'image', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', title: 'OnlyFounders Hackathon', year: '2026', desc: 'Inter-collegiate hackathon co-hosted with Yuva Club VIT Chennai — Yuvenza enters tech.' },
];

function MemoryCard({ item, index, openLightbox }: { item: GalleryItem, index: number, openLightbox: (i: number) => void }) {
  return (
    <motion.div
      layoutId={`memories-container-${item.id}`}
      onClick={() => openLightbox(index)}
      className="relative shrink-0 w-[85vw] sm:w-[450px] aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer group snap-center"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-3xl transition-colors duration-300 group-hover:border-[var(--neon-cyan)]/50 z-10 pointer-events-none" />
      
      {item.type === 'video' ? (
        <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" muted loop playsInline preload="none" />
      ) : (
        <Image src={item.url} alt={item.title} fill sizes="(max-width: 640px) 85vw, 450px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      )}
      
      {/* Play Button Overlay for Videos */}
      {item.type === 'video' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all duration-300 z-20">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#010008] via-[#010008]/60 to-transparent p-6 sm:p-8 flex flex-col justify-end z-20">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[var(--neon-cyan)] uppercase mb-2 font-mono block">
            {item.year}
          </span>
          <h4 className="text-white text-xl sm:text-2xl font-black uppercase tracking-wide mb-3">
            {item.title}
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {item.desc}
          </p>
          <div className="flex items-center gap-2 text-xs text-white uppercase font-bold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            <Maximize2 className="w-4 h-4 text-[var(--neon-cyan)]" /> View Memory
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MemoriesScene() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="memories" className="relative py-24 bg-[#010008] overflow-hidden">
      {/* Background styling */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 relative z-10 mb-12 flex flex-col items-center text-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-5 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          >
            The Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            IMPACT{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              OVER TIME
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base">
            From our debut in 2023 to our latest tech and cultural milestones. Swipe through our history.
          </p>
        </div>
      </div>

      {/* The Horizontal Slider */}
      <div className="relative z-20 w-full pl-4 md:pl-[max(1rem,calc((100vw-80rem)/2))] pb-12">
        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pr-8 pb-8 pt-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GALLERY_IMAGES.map((item, index) => (
            <MemoryCard 
              key={item.id} 
              item={item} 
              index={index} 
              openLightbox={openLightbox} 
            />
          ))}
        </div>
        
        {/* Navigation Buttons (All Devices) */}
        <div className="flex justify-center gap-6 mt-8 pr-4 md:pr-0">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white hover:bg-white/10 transition-colors hover:border-[var(--neon-cyan)]/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
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
              className="absolute left-4 sm:left-6 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <motion.div
              layoutId={`memories-container-${GALLERY_IMAGES[lightboxIndex].id}`}
              className="relative max-w-6xl w-full z-10 flex flex-col gap-4 bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {GALLERY_IMAGES[lightboxIndex].type === 'video' ? (
                <video 
                  src={GALLERY_IMAGES[lightboxIndex].url} 
                  controls 
                  autoPlay 
                  className="w-full max-h-[80vh] object-contain bg-black" 
                />
              ) : (
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={GALLERY_IMAGES[lightboxIndex].url}
                    alt={GALLERY_IMAGES[lightboxIndex].title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-left p-6 sm:p-8 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-0 left-0 right-0"
              >
                <span className="text-sm font-bold text-[var(--neon-cyan)] font-mono uppercase tracking-widest drop-shadow-md">
                  {GALLERY_IMAGES[lightboxIndex].year}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-2 uppercase tracking-wide drop-shadow-lg">{GALLERY_IMAGES[lightboxIndex].title}</h3>
                <p className="text-sm sm:text-base text-gray-300 mt-3 max-w-3xl leading-relaxed">{GALLERY_IMAGES[lightboxIndex].desc}</p>
              </motion.div>
            </motion.div>
            
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-6 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
