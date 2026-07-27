'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LazyScene from '../../components/LazyScene';
import { Heart, Lightbulb, Users, Zap, Target, Eye, ArrowRight, Sparkles } from 'lucide-react';

const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });

const values = [
  { title: 'Passion', icon: <Heart className="w-6 h-6" />, color: 'var(--neon-magenta)', desc: 'We encourage students to pursue their interests with dedication and enthusiasm, transforming ideas into impactful initiatives.' },
  { title: 'Creativity', icon: <Lightbulb className="w-6 h-6" />, color: 'var(--neon-cyan)', desc: 'Innovation drives everything we do. We constantly explore new ways to engage, inspire, and create meaningful experiences.' },
  { title: 'Unity', icon: <Users className="w-6 h-6" />, color: 'var(--neon-violet)', desc: 'Together we achieve more. We believe collaboration, inclusivity, and mutual respect are the foundation of every success.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const } }),
};

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

          <div className="relative z-10 max-w-5xl mx-auto text-center pt-28">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'backOut' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-3.5 h-3.5" /> About Yuvenza
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--neon-cyan)] mb-6">
              Core Motto
            </motion.p>

            <div className="overflow-hidden mb-6">
              {['CREATE &', 'CONTRIBUTE'].map((word, wi) => (
                <motion.h1 key={word}
                  initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 + wi * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[clamp(3rem,12vw,8rem)] font-[var(--font-heading-main)] font-black leading-none uppercase tracking-tight">
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

        {/* ── WHO WE ARE ── */}
        <section className="section-padding px-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0020 0%, #010008 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
                <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em]">Who We Are</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
              </div>
              <h2 className="text-white font-[var(--font-heading-main)] font-black uppercase tracking-wider">
                The Youth Powered <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">Club</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { title: 'Introduction', icon: <Users className="w-5 h-5" />, color: 'var(--neon-cyan)', text: 'Yuvenza is the official youth club of Chennai Institute of Technology, established with the vision of empowering students through leadership, creativity, and meaningful community engagement.' },
                { title: 'Our Story', icon: <Zap className="w-5 h-5" />, color: 'var(--neon-violet)', text: 'We believe every student has the potential to inspire change. Through cultural events, awareness campaigns, social initiatives, and collaborative projects, we provide a platform where passion meets purpose.' },
              ].map((card, i) => (
                <motion.div key={card.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: `color-mix(in srgb, ${card.color} 15%, transparent)`, color: card.color }}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">{card.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="relative rounded-[20px] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/[0.03] p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-cyan)]/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-10 h-10 rounded-[12px] bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]"><Eye className="w-5 h-5" /></div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Vision</h3>
                </div>
                <p className="text-gray-300 leading-relaxed relative z-10">To inspire students to become socially responsible leaders by creating opportunities for innovation, collaboration, and meaningful impact.</p>
                <div className="mt-6 h-px bg-gradient-to-r from-[var(--neon-cyan)]/40 to-transparent" />
              </motion.div>
              <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="relative rounded-[20px] border border-[var(--neon-magenta)]/20 bg-[var(--neon-magenta)]/[0.03] p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-magenta)]/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-10 h-10 rounded-[12px] bg-[var(--neon-magenta)]/10 flex items-center justify-center text-[var(--neon-magenta)]"><Target className="w-5 h-5" /></div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Mission</h3>
                </div>
                <p className="text-gray-300 leading-relaxed relative z-10">To organize engaging events and initiatives that encourage creativity, teamwork, leadership, and community service while fostering unity and social responsibility.</p>
                <div className="mt-6 h-px bg-gradient-to-r from-[var(--neon-magenta)]/40 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── OUR VALUES ── */}
        <section className="section-padding px-4 bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-white font-[var(--font-heading-main)] font-black uppercase tracking-wider">
                Our <span className="bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-violet)] bg-clip-text text-transparent">Values</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="group p-8 rounded-[20px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ background: `color-mix(in srgb, ${v.color} 15%, transparent)`, color: v.color, boxShadow: `0 0 20px color-mix(in srgb, ${v.color} 30%, transparent)` }}>
                    {v.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">{v.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>
        <BackToTop />
      </main>
    </>
  );
}
