'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import LazyScene from '../../components/LazyScene';
import { Sparkles, ArrowRight } from 'lucide-react';
import AboutScene from '../../components/scenes/AboutScene';

const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });



export default function AboutPage() {
  return (
    <>
      <main className="relative w-full min-h-screen bg-black text-white overflow-x-hidden">

        {/* ── HERO / MOTTO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, #0d0035 0%, #010010 60%, #000000 100%)' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--neon-violet)]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--neon-cyan)]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Floating Images for a human scrapbook feel */}
          <motion.div initial={{ opacity: 0, x: -50, y: 50, rotate: -15 }} animate={{ opacity: 1, x: 0, y: 0, rotate: -6 }} transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute top-[20%] left-[5%] hidden lg:block w-48 h-56 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-0 hover:z-20 hover:scale-105 transition-transform">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80" alt="Students" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50, y: -50, rotate: 15 }} animate={{ opacity: 1, x: 0, y: 0, rotate: 8 }} transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute top-[15%] right-[8%] hidden lg:block w-56 h-48 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-0 hover:z-20 hover:scale-105 transition-transform">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" alt="Concert" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute bottom-[20%] left-[12%] hidden lg:block w-64 h-40 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-0 hover:z-20 hover:scale-105 transition-transform">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=400&q=80" alt="Collaboration" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50, y: 50, rotate: 20 }} animate={{ opacity: 1, x: 0, y: 0, rotate: 12 }} transition={{ duration: 1.2, delay: 0.8 }}
            className="absolute bottom-[25%] right-[10%] hidden lg:block w-48 h-64 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-0 hover:z-20 hover:scale-105 transition-transform">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=400&q=80" alt="Event" fill className="object-cover" />
            </div>
          </motion.div>

          <div className="relative z-10 container-responsive text-center pt-28">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'backOut' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-3.5 h-3.5" /> About Yuvenza
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--neon-cyan)] mb-6">
              Core Motto
            </motion.p>

            <div className="overflow-hidden mb-6">
              {['WHAT WE CREATE', 'WE CONTRIBUTE'].map((word, wi) => (
                <motion.h1 key={word}
                  initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 + wi * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[clamp(2.5rem,10vw,6rem)] font-[var(--font-heading-main)] font-black leading-none uppercase tracking-tight">
                  {wi === 0
                    ? <span className="text-white">{word}</span>
                    : <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">{word}</span>}
                </motion.h1>
              ))}
            </div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Together, we are building a community where{' '}
              <span className="text-[var(--neon-cyan)] font-semibold">passion inspires action</span>,{' '}
              <span className="text-[var(--neon-violet)] font-semibold">creativity drives innovation</span>, and{' '}
              <span className="text-[var(--neon-magenta)] font-semibold">unity creates lasting impact</span>.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/events" className="flex items-center justify-center gap-2 px-8 h-[48px] rounded-[12px] bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/" className="flex items-center justify-center gap-2 px-8 h-[48px] rounded-[12px] border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                Back to Home
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-600">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <div className="w-px h-8 bg-gradient-to-b from-[var(--neon-cyan)] to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        <AboutScene />

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>
        <BackToTop />
      </main>
    </>
  );
}

