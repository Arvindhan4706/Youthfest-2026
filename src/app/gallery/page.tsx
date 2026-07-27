'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import LazyScene from '../../components/LazyScene';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  year: string;
  desc: string;
}

const GALLERY: GalleryItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80', title: 'First Orphanage Visit', year: '2023', desc: 'Our very first Yuvenza! We kicked things off with an orphanage outreach beyond campus.' },
  { id: 2, url: '/memories/yf24.png', title: 'Keerthy Suresh @ YF24', year: '2024', desc: 'The one and only Keerthy Suresh graced our stage — the year Yuvenza truly became massive.' },
  { id: 3, url: '/memories/marathon.png', title: 'College Marathon', year: '2024', desc: 'Early mornings, crazy energy, and a campus united. Our first marathon was an absolute blast.' },
  { id: 4, url: '/memories/cancer_panel.png', title: 'Cancer Awareness Panel', year: '2024', desc: 'An eye-opening panel discussion with real, heartfelt conversations.' },
  { id: 5, url: '/memories/republic25.png', title: 'Republic Day with SP', year: '2025', desc: 'A proud moment — the Superintendent of Police joined us for Republic Day flag hoisting.' },
  { id: 6, url: '/memories/nyabagam.png', title: 'Nyabagam Varuthe', year: '2025', desc: 'Pure nostalgia. Traditional vibes that had everyone a little emotional.' },
  { id: 7, url: '/memories/yf25.png', title: 'Youth Fest \'25', year: '2025', desc: '5,000+ students, backed by Red Bull & Toni & Guy. Wrapped with a heartwarming Blind School visit.' },
  { id: 8, url: '/memories/onam25.png', title: 'Onam Celebrations', year: '2025', desc: 'Pookalam, traditional mundus, and an unmatched vibe — a visual treat on campus.' },
  { id: 9, url: '/memories/christmas25.png', title: 'Christmas 2025', year: '2025', desc: 'Fairy lights, carols, and a whole lot of joy. A beautiful end to 2025.' },
  { id: 10, url: '/memories/republic26.png', title: 'Republic Day Parade', year: '2026', desc: 'Marching together with pride. Republic Day 2026 packed with patriotic spirit.' },
  { id: 11, url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', title: 'OnlyFounders Hackathon', year: '2026', desc: 'Yuvenza clubbed with VIT Chennai to host the epic OnlyFounders Hackathon.' },
];

const years = ['All', '2023', '2024', '2025', '2026'];

export default function GalleryPage() {
  const [activeYear, setActiveYear] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeYear === 'All' ? GALLERY : GALLERY.filter(g => g.year === activeYear);
  const currentIdx = lightbox !== null ? filtered.findIndex(g => g.id === lightbox) : -1;

  const prev = () => { if (currentIdx > 0) setLightbox(filtered[currentIdx - 1].id); };
  const next = () => { if (currentIdx < filtered.length - 1) setLightbox(filtered[currentIdx + 1].id); };
  const current = lightbox !== null ? filtered.find(g => g.id === lightbox) : null;

  return (
    <>
      <main className="relative w-full min-h-screen bg-black text-white overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative pt-36 pb-20 px-4 text-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, #0a0030 0%, #010010 60%, #000000 100%)' }}>
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--neon-violet)]/10 rounded-full blur-[100px]" />

          <div className="relative z-10 container-responsive">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em] mb-8">
              <Images className="w-3.5 h-3.5" /> Our Gallery
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="font-[var(--font-heading-main)] font-black uppercase tracking-tight text-white mb-4">
              Moments That{' '}
              <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">Matter</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-400 text-lg max-w-xl mx-auto">
              Three years of memories, milestones, and meaningful impact — captured one frame at a time.
            </motion.p>
          </div>
        </section>

        {/* ── FILTER TABS ── */}
        <section className="px-4 py-8 sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="container-responsive flex items-center justify-center gap-2 flex-wrap">
            {years.map(y => (
              <button key={y} onClick={() => setActiveYear(y)}
                className={`px-5 h-10 rounded-[12px] text-sm font-bold transition-all duration-300 ${activeYear === y
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'border border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}>
                {y}
              </button>
            ))}
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="section-padding px-4">
          <div className="container-responsive">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => setLightbox(item.id)}
                    className="group relative rounded-[20px] overflow-hidden border border-white/10 cursor-pointer hover:border-[var(--neon-cyan)]/40 transition-all duration-300 aspect-[4/3]">
                    <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-wider mb-1">{item.year}</span>
                      <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                      <p className="text-gray-300 text-xs mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-xs text-gray-400 font-bold">{item.year}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── LIGHTBOX ── */}
        <AnimatePresence>
          {lightbox !== null && current && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}>
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                className="relative max-w-4xl w-full rounded-[20px] overflow-hidden bg-[#0a0a0a] border border-white/10"
                onClick={e => e.stopPropagation()}>
                <div className="relative aspect-video w-full">
                  <Image src={current.url} alt={current.title} fill className="object-cover" unoptimized />
                </div>
                <div className="p-6">
                  <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-wider">{current.year}</span>
                  <h3 className="text-white font-bold text-xl mt-1">{current.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{current.desc}</p>
                </div>
                <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-[12px] bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                {currentIdx > 0 && <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[12px] bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></button>}
                {currentIdx < filtered.length - 1 && <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[12px] bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></button>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>
        <BackToTop />
      </main>
    </>
  );
}
