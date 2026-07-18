'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';
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
  { id: 1, type: 'image', url: '/memories/yf24.png', title: 'Youthfest 2024', year: '2024', desc: 'A massive, vibrant youth festival, neon lights, energetic crowd, concert atmosphere.' },
  { id: 2, type: 'image', url: '/memories/marathon.png', title: 'Marathon', year: '2024', desc: 'A college marathon event, students running together, energetic, early morning sunlight.' },
  { id: 3, type: 'image', url: '/memories/cancer_panel.png', title: 'Cancer Awareness Day Panel', year: '2024', desc: 'A panel discussion on a stage in a college auditorium, serious but hopeful tone.' },
  { id: 4, type: 'image', url: '/memories/republic25.png', title: 'Republic Day 2025', year: '2025', desc: 'Indian Republic day celebration in a college, tricolor flags, patriotic atmosphere.' },
  { id: 5, type: 'image', url: '/memories/nyabagam.png', title: 'Nyabagam Varuthe', year: '2025', desc: 'A nostalgic cultural college event, traditional vibes, emotional, memory lane.' },
  { id: 6, type: 'image', url: '/memories/yf25.png', title: 'Youthfest\'25', year: '2025', desc: 'Futuristic youth festival, cyberpunk neon aesthetic, glowing stage, massive energetic crowd.' },
  { id: 7, type: 'image', url: '/memories/onam25.png', title: 'Onam 25', year: '2025', desc: 'Vibrant Onam celebration in a college, students in traditional kerala attire, flower rangoli.' },
  { id: 8, type: 'image', url: '/memories/christmas25.png', title: 'Christmas 25', year: '2025', desc: 'Festive Christmas celebration on campus, decorated christmas tree, fairy lights.' },
  { id: 9, type: 'image', url: '/memories/republic26.png', title: 'Republic Day 2026', year: '2026', desc: 'Majestic Indian Republic day event, students marching, patriotic spirit, large flag.' },
];
const HIGHLIGHTS = [
 "10,000+ Social Media Impressions",
 "Trending #1 on Campus",
 "3 News Channel Features",
 "15+ College Delegations",
 "98% Would Return Next Year",
 "4,500+ Registrations Last Year"
];
function SpringImage({ 
 item, 
 idx, 
 total,
 scrollYProgress,
 openLightbox 
}: { 
 item: GalleryItem, 
 idx: number, 
 total: number,
 scrollYProgress: MotionValue<number>,
 openLightbox: (i: number) => void 
}) {
  const [radius, setRadius] = useState(750);
  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? Math.min(window.innerWidth * 0.6, 300) : 750);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const angleDeg = idx * 72; // 5 items per coil
  const verticalStep = typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 450;
  const y = idx * verticalStep;
 // Calculate how close this item is to being the "active" center item
 const centerProgress = 0.1 + (idx / (total - 1 || 1)) * 0.8;
 const distance = useTransform(scrollYProgress, (p) => p - centerProgress);
 // Cinematic depth of field with a softer "plateau" for smoother scrolling
 const opacity = useTransform(distance, [-0.25, -0.06, -0.02, 0.02, 0.06, 0.25], [0, 0.6, 1, 1, 0.6, 0]);
 const scale = useTransform(distance, [-0.2, -0.02, 0.02, 0.2], [0.5, 1.4, 1.4, 0.5]);
 const blur = useTransform(distance, [-0.2, -0.06, -0.02, 0.02, 0.06, 0.2], ["blur(8px)", "blur(2px)", "blur(0px)", "blur(0px)", "blur(2px)", "blur(8px)"]);
 // Dynamic glow that stays activated during the softer plateau
 const boxShadow = useTransform(
 distance,
 [-0.1, -0.02, 0.02, 0.1],
 [
 "0px 0px 0px rgba(0,240,255,0)",
 "0px 0px 80px rgba(0,240,255,0.5)",
 "0px 0px 80px rgba(0,240,255,0.5)",
 "0px 0px 0px rgba(0,240,255,0)"
 ]
 );
 // Dynamic border glow that stays activated during the softer plateau
 const borderColor = useTransform(
 distance,
 [-0.1, -0.02, 0.02, 0.1],
 [
 "rgba(255,255,255,0.05)",
 "rgba(0,240,255,0.8)",
 "rgba(0,240,255,0.8)",
 "rgba(255,255,255,0.05)"
 ]
 );
 return (
 <div 
 className="absolute top-1/2 left-1/2 pointer-events-none"
 style={{
 transform: `translate(-50%, -50%) rotateY(${angleDeg}deg) translateZ(${radius}px) translateY(${y}px)`,
 transformStyle: 'preserve-3d'
 }}
 >
 <motion.div 
 className="w-[75vw] sm:w-[500px] pointer-events-auto" 
 style={{ scale, opacity, filter: blur, transformStyle: 'preserve-3d' }}
 >
 <motion.div
 layoutId={`memories-container-${item.id}`}
 onClick={() => openLightbox(idx)}
 className="relative w-full rounded-2xl overflow-hidden bg-black/80 cursor-pointer transition-colors duration-500"
 style={{ boxShadow, borderColor, borderWidth: '1px' }}
 whileHover="hover"
 >
 {item.type === 'video' ? (
 <video src={item.url} className="w-full h-auto aspect-video object-cover" muted loop playsInline preload="none" />
 ) : (
 <img src={item.url} alt={item.title} className="w-full h-auto aspect-video object-cover" />
 )}
 {/* Play Button Overlay for Videos */}
 {item.type === 'video' && (
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-[var(--neon-violet)]/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
 <Play className="w-6 h-6 text-white ml-1 drop-shadow-md" fill="white" />
 <div className="absolute inset-0 rounded-full border border-[var(--neon-violet)] animate-ping opacity-20" />
 </div>
 )}
 {/* Hover overlay */}
 <motion.div 
 className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-6 flex flex-col justify-end"
 initial={{ opacity: 0 }}
 variants={{ hover: { opacity: 1 } }}
 transition={{ duration: 0.3 }}
 >
 <motion.span 
 variants={{ hover: { x: 0, opacity: 1 } }}
 initial={{ x: -20, opacity: 0 }}
 transition={{ duration: 0.3, delay: 0.05 }}
 className="text-[10px] font-bold tracking-widest text-[var(--neon-cyan)] uppercase mb-2 font-mono"
 >
 {item.year}
 </motion.span>
 <motion.h4 
 variants={{ hover: { x: 0, opacity: 1 } }}
 initial={{ x: -20, opacity: 0 }}
 transition={{ duration: 0.3, delay: 0.1 }}
 className="text-white text-lg sm:text-xl font-black uppercase tracking-wide mb-2"
 >
 {item.title}
 </motion.h4>
 <motion.p 
 variants={{ hover: { y: 0, opacity: 1 } }}
 initial={{ y: 20, opacity: 0 }}
 transition={{ duration: 0.3, delay: 0.15 }}
 className="text-xs text-gray-300 leading-relaxed mb-4"
 >
 {item.desc}
 </motion.p>
 <motion.div 
 variants={{ hover: { scale: 1, opacity: 1 } }}
 initial={{ scale: 0.9, opacity: 0 }}
 transition={{ duration: 0.3, delay: 0.2 }}
 className="flex items-center gap-2 text-[10px] text-white uppercase font-mono font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10"
 >
 <Maximize2 className="w-3.5 h-3.5 text-[var(--neon-cyan)]" /> Expand
 </motion.div>
 </motion.div>
 </motion.div>
 </motion.div>
 </div>
 );
}
export default function MemoriesScene() {
  const [config, setConfig] = useState({ verticalStep: 450 });
  
  useEffect(() => {
    const handleResize = () => {
      setConfig({
        verticalStep: window.innerWidth < 768 ? 350 : 450
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const total = GALLERY_IMAGES.length;
  const scrollMap = [];
  const yMap = [];
  const rotateMap = [];
  
  const startScroll = 0.1;
  const endScroll = 0.9;
  const stepSize = (endScroll - startScroll) / (total - 1 || 1); 
  const pauseDelta = stepSize * 0.12; 
  
  for (let i = 0; i < total; i++) {
    const center = startScroll + i * stepSize;
    scrollMap.push(center - pauseDelta);
    yMap.push(-i * config.verticalStep);
    rotateMap.push(-i * 72);
    
    scrollMap.push(center + pauseDelta);
    yMap.push(-i * config.verticalStep);
    rotateMap.push(-i * 72);
  }
 // Map the stepped arrays to the master container
 const springY = useTransform(scrollYProgress, scrollMap, yMap);
 const springRotateY = useTransform(scrollYProgress, scrollMap, rotateMap);
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
 <section id="memories" className="relative py-24" >
 {/* Background */}
 <div className="max-w-6xl mx-auto px-4 relative z-10">
 {/* Header */}
 <div className="text-center mb-16">
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
 </div>
 {/* Spring Helix Timeline Layout (Sticky Scroll) - Full screen width */}
 <div ref={targetRef} className="relative h-[500vh] w-full z-20">
 <div className="sticky top-0 h-screen w-full">
 {/* Overflow hidden MUST be inside the sticky container, NOT outside it, or sticky breaks! */}
 <div className="absolute inset-0 overflow-hidden">
 <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
 <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
 <span className="text-[var(--neon-cyan)] font-mono text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-3 block animate-pulse drop-shadow-md">
 ↓ Scroll down to descend the helix ↓
 </span>
 </div>
 {/* Subtle radial background glow */}
 {/* Tilted Camera wrapper to look down into the spiral! */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-10deg)' }}>
 <motion.div 
 style={{ y: springY, rotateY: springRotateY, z: -500, transformStyle: 'preserve-3d' }}
 className="absolute inset-0 flex items-center justify-center"
 >
 {GALLERY_IMAGES.map((item, idx) => (
 <SpringImage
 key={item.id}
 item={item}
 idx={idx}
 total={GALLERY_IMAGES.length}
 scrollYProgress={scrollYProgress}
 openLightbox={openLightbox}
 />
 ))}
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 </div>
 {/* Lightbox */}
 <AnimatePresence>
 {lightboxIndex !== null && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
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
 layoutId={`memories-container-${GALLERY_IMAGES[lightboxIndex].id}`}
 className="relative max-w-5xl w-full z-10 flex flex-col gap-4 bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
 >
 {GALLERY_IMAGES[lightboxIndex].type === 'video' ? (
 <video 
 src={GALLERY_IMAGES[lightboxIndex].url} 
 controls 
 autoPlay 
 className="w-full max-h-[80vh] object-contain bg-black" 
 />
 ) : (
 <img
 src={GALLERY_IMAGES[lightboxIndex].url}
 alt={GALLERY_IMAGES[lightboxIndex].title}
 className="w-full max-h-[80vh] object-contain"
 />
 )}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-left p-6 bg-black/80 absolute bottom-0 left-0 right-0 border-t border-white/10"
 >
 <span className="text-xs font-bold text-[var(--neon-cyan)] font-mono uppercase tracking-widest">
 {GALLERY_IMAGES[lightboxIndex].year}
 </span>
 <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-wide">{GALLERY_IMAGES[lightboxIndex].title}</h3>
 <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">{GALLERY_IMAGES[lightboxIndex].desc}</p>
 </motion.div>
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
