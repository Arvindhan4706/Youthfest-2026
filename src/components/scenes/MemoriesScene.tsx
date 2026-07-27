'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Expand, ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  title: string;
  year: string;
  desc: string;
  rotationClass: string;
  translateClass: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  // 2023
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'First Orphanage Visit', year: '2023', desc: 'Our very first Yuvenza! We kicked things off with a bang and immediately took it beyond campus for our first orphanage outreach.', rotationClass: '-rotate-3', translateClass: 'translate-y-4' },
  
  // 2024
  { id: 2, type: 'image', url: '/memories/yf24.png', title: 'Keerthy Suresh @ YF24', year: '2024', desc: 'The one and only Keerthy Suresh graced our stage! This was the year Yuvenza truly became massive.', rotationClass: 'rotate-2', translateClass: '-translate-y-2' },
  { id: 3, type: 'image', url: '/memories/marathon.png', title: 'College Marathon', year: '2024', desc: 'Early mornings, crazy energy, and a campus united. Our first marathon was an absolute blast.', rotationClass: '-rotate-6', translateClass: 'translate-y-6' },
  { id: 4, type: 'image', url: '/memories/cancer_panel.png', title: 'Cancer Awareness Panel', year: '2024', desc: 'An eye-opening panel discussion on Cancer Awareness. Some real, heartfelt conversations happened here.', rotationClass: 'rotate-6', translateClass: '-translate-y-4' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'Christmas Drive', year: '2024', desc: 'Spreading smiles! We paired an important HIV/AIDS awareness session with our huge Christmas donation drive.', rotationClass: '-rotate-2', translateClass: 'translate-y-2' },
  
  // 2025
  { id: 6, type: 'image', url: '/memories/republic25.png', title: 'Republic Day with SP', year: '2025', desc: 'A proud moment as the Superintendent of Police joined us for the official Republic Day flag hoisting.', rotationClass: 'rotate-3', translateClass: '-translate-y-1' },
  { id: 7, type: 'image', url: '/memories/nyabagam.png', title: 'Nyabagam Varuthe', year: '2025', desc: 'Pure nostalgia. Traditional vibes and a trip down memory lane that had everyone a little emotional.', rotationClass: '-rotate-12', translateClass: 'translate-y-8' },
  { id: 8, type: 'image', url: '/memories/yf25.png', title: 'Youth Fest \'25', year: '2025', desc: 'YF25 was insane! 5,000+ students, backed by Red Bull & Toni & Guy. We wrapped up the madness with a heartwarming Blind School visit.', rotationClass: 'rotate-1', translateClass: '-translate-y-3' },
  { id: 9, type: 'image', url: '/memories/onam25.png', title: 'Onam Celebrations', year: '2025', desc: 'Pookalam, traditional mundus, and an unmatched vibe. Onam \'25 was an absolute visual treat on campus!', rotationClass: 'rotate-6', translateClass: '-translate-y-6' },
  { id: 10, type: 'image', url: '/memories/christmas25.png', title: 'Christmas 2025', year: '2025', desc: 'Fairy lights, carols, and a whole lot of joy. We wrapped up 2025 with our beautiful Christmas celebrations.', rotationClass: '-rotate-3', translateClass: 'translate-y-2' },
  
  // 2026
  { id: 11, type: 'image', url: '/memories/republic26.png', title: 'Republic Day Parade', year: '2026', desc: 'Marching together with pride. Republic Day 2026 was packed with patriotic spirit and energy.', rotationClass: 'rotate-12', translateClass: 'translate-y-5' },
  { id: 12, type: 'image', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', title: 'OnlyFounders Hackathon', year: '2026', desc: 'Our first major tech leap! Yuvenza clubbed with VIT Chennai to host the epic OnlyFounders Hackathon.', rotationClass: '-rotate-2', translateClass: '-translate-y-4' },
];

function MemoryCard({ item, index, openLightbox }: { item: GalleryItem, index: number, openLightbox: (i: number) => void }) {
  return (
    <motion.div
      layoutId={`memories-container-${item.id}`}
      onClick={() => openLightbox(index)}
      className={`relative flex-shrink-0 w-[240px] sm:w-[280px] bg-white p-3 pb-16 sm:pb-20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer origin-center transition-all duration-300 hover:!rotate-0 hover:scale-[1.15] hover:z-50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] group ${item.rotationClass} ${item.translateClass}`}
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
    >
      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden border border-gray-200 shadow-inner">
        {item.type === 'video' ? (
          <video src={item.url} className="w-full h-full object-cover grayscale-[20%] contrast-125 transition-all duration-500 group-hover:grayscale-0" muted loop playsInline preload="none" />
        ) : (
          <Image src={item.url} alt={item.title} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover grayscale-[20%] contrast-125 transition-all duration-500 group-hover:grayscale-0" />
        )}
        
        {/* Play Button Overlay for Videos */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/50">
              <Play className="w-5 h-5 text-white ml-1" fill="white" />
            </div>
          </div>
        )}
      </div>

      {/* Polaroid Text Area */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 text-center">
        <h4 className="text-black font-black text-sm sm:text-base tracking-tight font-sans leading-tight">
          {item.title}
        </h4>
        <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mt-1 block">
          {item.year}
        </span>
      </div>
      
      {/* Tape Effect (optional subtle detail) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/20 backdrop-blur-sm border border-white/30 rotate-2 opacity-50 z-20 pointer-events-none" />
    </motion.div>
  );
}

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
    <section id="memories" className="relative section-padding md:section-padding lg:section-padding bg-[#010008] overflow-hidden">
      {/* Background styling - corkboard or dark texture vibe */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-responsive relative z-10 mb-16 flex flex-col items-center text-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-5 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          >
            Behind the Festival
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            The Journey{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              Behind Yuvenza
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mb-8">
            Every unforgettable experience begins with months of planning, creativity, collaboration, and dedication. From brainstorming ideas to managing thousands of participants — this is our story.
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-all group"
          >
            View Full Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Floating Polaroids Container */}
      <div className="relative z-20 w-full container-responsive pb-20">
        {/* Flex layout that scatters them */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-14">
          {GALLERY_IMAGES.map((item, index) => (
            <MemoryCard 
              key={item.id} 
              item={item} 
              index={index} 
              openLightbox={openLightbox} 
            />
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
              className="relative max-w-6xl w-full z-10 flex flex-col gap-4 bg-[#050505] rounded-[20px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
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
