'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import LazyScene from '../../components/LazyScene';
import { Heart, Lightbulb, Users, Zap, Target, Eye, ArrowRight, Sparkles } from 'lucide-react';

const FooterScene = dynamic(() => import('../../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../../components/BackToTop'), { ssr: false });

const values = [
  { title: 'Passion', icon: <Heart className="w-6 h-6" />, color: 'var(--neon-magenta)', desc: 'We want you to chase what you love. Bring the energy, and we\'ll help you turn those wild ideas into real, impactful initiatives.' },
  { title: 'Creativity', icon: <Lightbulb className="w-6 h-6" />, color: 'var(--neon-cyan)', desc: 'Boring just isn\'t in our vocabulary. We are constantly brainstorming new ways to engage, inspire, and create experiences you won\'t forget.' },
  { title: 'Unity', icon: <Users className="w-6 h-6" />, color: 'var(--neon-violet)', desc: 'We\'re in this together. No matter who you are or what you do, inclusivity and mutual respect are the bedrock of everything we build.' },
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
          <div className="container-responsive">
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
             {/* Zig-Zag Section 1: Who We Are */}
             <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
               <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="flex-1 rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                     <Users className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-bold text-white">Who We Are</h3>
                 </div>
                 <p className="text-gray-400 leading-relaxed">
                   We are Yuvenza, the official youth club of Chennai Institute of Technology. We started with a simple idea: to empower our peers through leadership, crazy creative ideas, and actually making a difference in our community.
                 </p>
               </motion.div>
               
               <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="flex-1 w-full relative">
                 <div className="w-full aspect-video md:aspect-[4/3] rounded-[20px] overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(0,240,255,0.1)] rotate-[-2deg] hover:rotate-0 transition-transform duration-500 relative z-0">
                   <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Students collaborating" fill className="object-cover" />
                 </div>
               </motion.div>
             </div>

             {/* Zig-Zag Section 2: Our Story */}
             <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-20">
               <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="flex-1 w-full relative">
                 <div className="w-full aspect-video md:aspect-[4/3] rounded-[20px] overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(138,43,226,0.1)] rotate-[2deg] hover:rotate-0 transition-transform duration-500 relative z-0">
                   <Image src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80" alt="Students celebrating" fill className="object-cover" />
                 </div>
               </motion.div>

               <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="flex-1 rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
                     <Zap className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-bold text-white">Our Story</h3>
                 </div>
                 <p className="text-gray-400 leading-relaxed">
                   We believe every student has the potential to shake things up. Whether it's through massive cultural fests, social awareness drives, or just getting together to build something cool, we created this platform to let your passion find its purpose.
                 </p>
               </motion.div>
             </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-0 mt-10">
               <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="relative rounded-[20px] border border-[var(--neon-cyan)]/30 bg-[#050015] p-8 overflow-hidden max-w-lg z-10 md:-mr-6 md:mt-12 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-cyan)]/10 rounded-full blur-3xl" />
                 <div className="flex items-center gap-3 mb-5 relative z-10">
                   <div className="w-10 h-10 rounded-[12px] bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]"><Eye className="w-5 h-5" /></div>
                   <h3 className="text-lg font-bold text-white uppercase tracking-wider">Vision</h3>
                 </div>
                 <p className="text-gray-300 leading-relaxed relative z-10">To spark that fire in students, helping them become leaders who don't just innovate and collaborate, but actually leave a lasting, positive mark on the world.</p>
                 <div className="mt-6 h-px bg-gradient-to-r from-[var(--neon-cyan)]/40 to-transparent" />
               </motion.div>
               <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                 className="relative rounded-[20px] border border-[var(--neon-magenta)]/30 bg-[#100015] p-8 overflow-hidden max-w-lg z-20 md:-ml-6 md:-mt-12 rotate-[2deg] hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-magenta)]/10 rounded-full blur-3xl" />
                 <div className="flex items-center gap-3 mb-5 relative z-10">
                   <div className="w-10 h-10 rounded-[12px] bg-[var(--neon-magenta)]/10 flex items-center justify-center text-[var(--neon-magenta)]"><Target className="w-5 h-5" /></div>
                   <h3 className="text-lg font-bold text-white uppercase tracking-wider">Mission</h3>
                 </div>
                 <p className="text-gray-300 leading-relaxed relative z-10">To host epic events and initiatives that bring out the best in creativity, teamwork, and leadership, while keeping our community tightly knit and socially aware.</p>
                 <div className="mt-6 h-px bg-gradient-to-r from-[var(--neon-magenta)]/40 to-transparent" />
               </motion.div>
             </div>
          </div>
        </section>

        {/* ── OUR VALUES ── */}
        <section className="section-padding px-4 bg-black">
          <div className="container-responsive">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-white font-[var(--font-heading-main)] font-black uppercase tracking-wider">
                Our <span className="bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-violet)] bg-clip-text text-transparent">Values</span>
              </h2>
            </motion.div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-12">
               {values.map((v, i) => (
                 <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                   className={`group p-8 rounded-[20px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${i === 1 ? 'md:translate-y-12' : ''}`}>
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
