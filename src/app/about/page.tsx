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
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--neon-violet)]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--neon-cyan)]/10 rounded-full blur-[100px] pointer-events-none" />


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

