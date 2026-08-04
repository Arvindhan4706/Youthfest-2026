'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'First Orphanage Visit', year: '2023', desc: 'Our very first Yuvenza! We kicked things off with a bang and immediately took it beyond campus for our first orphanage outreach.', rotationClass: '-rotate-3', translateClass: 'translate-y-4' },
  { id: 2, type: 'image', url: '/memories/yf24.png', title: 'Keerthy Suresh @ YF24', year: '2024', desc: 'The one and only Keerthy Suresh graced our stage! This was the year Yuvenza truly became massive.', rotationClass: 'rotate-2', translateClass: '-translate-y-2' },
  { id: 3, type: 'image', url: '/memories/marathon.png', title: 'College Marathon', year: '2024', desc: 'Early mornings, crazy energy, and a campus united. Our first marathon was an absolute blast.', rotationClass: '-rotate-6', translateClass: 'translate-y-6' },
  { id: 4, type: 'image', url: '/memories/cancer_panel.png', title: 'Cancer Awareness Panel', year: '2024', desc: 'An eye-opening panel discussion on Cancer Awareness. Some real, heartfelt conversations happened here.', rotationClass: 'rotate-6', translateClass: '-translate-y-4' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'Christmas Drive', year: '2024', desc: 'Spreading smiles! We paired an important HIV/AIDS awareness session with our huge Christmas donation drive.', rotationClass: '-rotate-2', translateClass: 'translate-y-2' },
  { id: 6, type: 'image', url: '/memories/republic25.png', title: 'Republic Day with SP', year: '2025', desc: 'A proud moment as the Superintendent of Police joined us for the official Republic Day flag hoisting.', rotationClass: 'rotate-3', translateClass: '-translate-y-1' },
  { id: 7, type: 'image', url: '/memories/nyabagam.png', title: 'Nyabagam Varuthe', year: '2025', desc: 'Pure nostalgia. Traditional vibes and a trip down memory lane that had everyone a little emotional.', rotationClass: '-rotate-12', translateClass: 'translate-y-8' },
  { id: 8, type: 'image', url: '/memories/yf25.png', title: 'Youth Fest \'25', year: '2025', desc: 'YF25 was insane! 5,000+ students, backed by Red Bull & Toni & Guy. We wrapped up the madness with a heartwarming Blind School visit.', rotationClass: 'rotate-1', translateClass: '-translate-y-3' },
  { id: 9, type: 'image', url: '/memories/onam25.png', title: 'Onam Celebrations', year: '2025', desc: 'Pookalam, traditional mundus, and an unmatched vibe. Onam \'25 was an absolute visual treat on campus!', rotationClass: 'rotate-6', translateClass: '-translate-y-6' },
  { id: 10, type: 'image', url: '/memories/christmas25.png', title: 'Christmas 2025', year: '2025', desc: 'Fairy lights, carols, and a whole lot of joy. We wrapped up 2025 with our beautiful Christmas celebrations.', rotationClass: '-rotate-3', translateClass: 'translate-y-2' },
  { id: 11, type: 'image', url: '/memories/republic26.png', title: 'Republic Day Parade', year: '2026', desc: 'Marching together with pride. Republic Day 2026 was packed with patriotic spirit and energy.', rotationClass: 'rotate-12', translateClass: 'translate-y-5' },
  { id: 12, type: 'image', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', title: 'OnlyFounders Hackathon', year: '2026', desc: 'Our first major tech leap! Yuvenza clubbed with VIT Chennai to host the epic OnlyFounders Hackathon.', rotationClass: '-rotate-2', translateClass: '-translate-y-4' },
];

// 3D Tilt card component
function MemoryCard({ item, index, openLightbox }: { item: GalleryItem, index: number, openLightbox: (i: number) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -8);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layoutId={`memories-container-${item.id}`}
      onClick={() => openLightbox(index)}
      className={`relative flex-shrink-0 w-[220px] sm:w-[260px] bg-white p-2.5 pb-14 sm:pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.7)] cursor-pointer ${item.rotationClass} ${item.translateClass}`}
      initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)', y: 40 }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", bounce: 0.45, duration: 1.1, delay: index * 0.08 }}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
      whileHover={{ scale: 1.18, zIndex: 50, rotate: 0, transition: { duration: 0.25 } }}
    >
      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
        {item.type === 'video' ? (
          <video src={item.url} className="w-full h-full object-cover grayscale-[15%] contrast-110 transition-all duration-500 group-hover:grayscale-0" muted loop playsInline preload="none" />
        ) : (
          <Image src={item.url} alt={item.title} fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover grayscale-[15%] contrast-110" />
        )}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/50">
              <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Expand className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 text-center">
        <h4 className="text-black font-black text-xs sm:text-sm tracking-tight font-sans leading-tight">
          {item.title}
        </h4>
        <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase mt-0.5 block">
          {item.year}
        </span>
      </div>
      {/* Tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-yellow-100/30 backdrop-blur-sm border border-white/20 rotate-1 opacity-60 z-20 pointer-events-none" />
    </motion.div>
  );
}

export default function MemoriesScene() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null && prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0));

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
      if (e.key === 'Escape') { if (document.fullscreenElement) document.exitFullscreen(); closeLightbox(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Drag-to-scroll on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section id="memories" className="relative section-padding bg-[#030009] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[var(--neon-cyan)]/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[var(--neon-violet)]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="container-responsive relative z-10 mb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/[0.05] text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-[0.2em] mb-7"
        >
          Behind the Festival
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[var(--font-heading-main)] font-black text-white uppercase mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          The Journey{' '}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
            Behind Yuvenza
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm sm:text-base max-w-xl leading-[1.85] mb-8"
        >
          Every unforgettable experience begins with months of planning, creativity, and dedication.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] text-white text-sm font-semibold hover:bg-white/[0.07] hover:border-white/30 transition-all duration-300 group"
          >
            View Full Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Floating Polaroids — drag-to-scroll wrapper */}
      <div
        ref={scrollRef}
        className="relative z-20 w-full overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-center gap-10 sm:gap-14 px-8 sm:px-16 pb-12" style={{ minWidth: 'max-content' }}>
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
            className="fixed inset-0 z-[9999] bg-black/96 flex items-center justify-center p-4 backdrop-blur-sm"
            ref={lightboxRef}
          >
            <div className="absolute inset-0" onClick={closeLightbox} />
            <div className="absolute top-5 right-5 flex gap-3 z-20">
              <button onClick={toggleFullscreen} className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.12] transition-all">
                <Expand className="w-4 h-4" />
              </button>
              <button onClick={closeLightbox} className="p-2 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <button onClick={prevImage} className="absolute left-4 sm:left-5 p-3 rounded-full bg-white/[0.08] border border-white/15 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:flex">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.div
              layoutId={`memories-container-${GALLERY_IMAGES[lightboxIndex].id}`}
              className="relative max-w-5xl w-full z-10 rounded-2xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_80px_rgba(0,0,0,0.9)]"
            >
              {GALLERY_IMAGES[lightboxIndex].type === 'video' ? (
                <video src={GALLERY_IMAGES[lightboxIndex].url} controls autoPlay className="w-full max-h-[80vh] object-contain bg-black" />
              ) : (
                <div className="relative w-full h-[75vh]">
                  <Image src={GALLERY_IMAGES[lightboxIndex].url} alt={GALLERY_IMAGES[lightboxIndex].title} fill sizes="100vw" className="object-contain" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-left p-5 sm:p-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent absolute bottom-0 left-0 right-0"
              >
                <span className="text-xs font-bold text-[var(--neon-cyan)] font-mono uppercase tracking-[0.2em]">
                  {GALLERY_IMAGES[lightboxIndex].year}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">{GALLERY_IMAGES[lightboxIndex].title}</h3>
                <p className="text-sm text-gray-300 mt-2 max-w-3xl leading-relaxed">{GALLERY_IMAGES[lightboxIndex].desc}</p>
              </motion.div>
            </motion.div>
            <button onClick={nextImage} className="absolute right-4 sm:right-5 p-3 rounded-full bg-white/[0.08] border border-white/15 text-white hover:bg-white hover:text-black transition-all z-10 hidden sm:flex">
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
