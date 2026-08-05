'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Heart, Lightbulb, Zap, Target, Eye,
  BookOpen, Megaphone, HandHeart, Star, Leaf, Mic2
} from 'lucide-react';

const values = [
  {
    title: 'Passion',
    icon: <Heart className="w-5 h-5" />,
    color: 'var(--neon-magenta)',
    desc: 'We encourage students to pursue their interests with dedication and enthusiasm, transforming ideas into impactful initiatives.'
  },
  {
    title: 'Creativity',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'var(--neon-cyan)',
    desc: 'Innovation drives everything we do. We constantly explore new ways to engage, inspire, and create meaningful experiences.'
  },
  {
    title: 'Unity',
    icon: <Users className="w-5 h-5" />,
    color: 'var(--neon-violet)',
    desc: 'Together we achieve more. Collaboration, inclusivity, and mutual respect are the foundation of every successful initiative.'
  },
];

const whatWeDo = [
  { icon: <HandHeart className="w-4 h-4" />, label: 'Community Service', color: 'var(--neon-magenta)' },
  { icon: <Mic2 className="w-4 h-4" />, label: 'Cultural Events', color: 'var(--neon-cyan)' },
  { icon: <Megaphone className="w-4 h-4" />, label: 'Social Awareness', color: 'var(--neon-violet)' },
  { icon: <Star className="w-4 h-4" />, label: 'Leadership Programs', color: 'var(--neon-gold)' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'Workshops', color: 'var(--neon-cyan)' },
  { icon: <Users className="w-4 h-4" />, label: 'Student Engagement', color: 'var(--neon-magenta)' },
  { icon: <Leaf className="w-4 h-4" />, label: 'Volunteer Initiatives', color: 'var(--neon-violet)' },
  { icon: <Zap className="w-4 h-4" />, label: 'Fundraising Events', color: 'var(--neon-gold)' },
];

export default function AboutScene() {
  return (
    <section
      id="about"
      className="relative w-full section-padding overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0020 0%, #020008 100%)' }}
      aria-labelledby="about-heading"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/[0.08] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/[0.06] blur-[110px] pointer-events-none" />
      <div className="absolute inset-0 bg-dots opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 container-responsive space-y-24 sm:space-y-32">

        {/* INTRO */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
            <span className="text-[var(--neon-cyan)] text-[10px] font-bold uppercase tracking-[0.3em]">About</span>
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
          </motion.div>

          <motion.h2
            id="about-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[var(--font-heading-main)] font-black text-white text-center uppercase mb-12"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            The Youth Powered{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              Club
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ letterSpacing: '-0.01em' }}>Introduction</h3>
              </div>
              <p className="text-gray-400 leading-[1.85] text-sm sm:text-base">
                Yuvenza is the official youth club of Chennai Institute of Technology, established with the vision of empowering students through leadership, creativity, and meaningful community engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[var(--neon-violet)]/10 flex items-center justify-center text-[var(--neon-violet)]">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ letterSpacing: '-0.01em' }}>Our Story</h3>
              </div>
              <p className="text-gray-400 leading-[1.85] text-sm sm:text-base">
                We believe every student has the potential to inspire change. Through cultural events, awareness campaigns, social initiatives, and collaborative projects, we provide a platform where passion meets purpose.
              </p>
            </motion.div>
          </div>
        </div>

        {/* VISION & MISSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl border border-[var(--neon-cyan)]/15 bg-[var(--neon-cyan)]/[0.02] p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-cyan)]/[0.06] rounded-full blur-3xl" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/40 to-transparent" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>Vision</h3>
            </div>
            <p className="text-gray-300 leading-[1.85] relative z-10 text-sm sm:text-base">
              To inspire students to become socially responsible leaders by creating opportunities for innovation, collaboration, and meaningful impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-2xl border border-[var(--neon-magenta)]/15 bg-[var(--neon-magenta)]/[0.02] p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-magenta)]/[0.06] rounded-full blur-3xl" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-magenta)]/40 to-transparent" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-[var(--neon-magenta)]/10 flex items-center justify-center text-[var(--neon-magenta)]">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>Mission</h3>
            </div>
            <p className="text-gray-300 leading-[1.85] relative z-10 text-sm sm:text-base">
              To organize engaging events and initiatives that encourage creativity, teamwork, leadership, and community service while fostering a culture of unity and social responsibility.
            </p>
          </motion.div>
        </div>

        {/* OUR VALUES */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3
              className="font-[var(--font-heading-main)] font-black text-white uppercase"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              Our Values
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', bounce: 0.35 }}
                whileHover={{ y: -5 }}
                className="p-6 sm:p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <motion.div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: `color-mix(in srgb, ${v.color} 12%, transparent)`,
                    color: v.color,
                    border: `1px solid color-mix(in srgb, ${v.color} 25%, transparent)`,
                  }}
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {v.icon}
                </motion.div>
                <h4 className="text-base font-bold text-white mb-3 uppercase tracking-wider" style={{ letterSpacing: '0.06em' }}>{v.title}</h4>
                <p className="text-gray-400 text-sm leading-[1.85]">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WHAT WE DO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3
              className="font-[var(--font-heading-main)] font-black text-white uppercase mb-8"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.02em' }}
            >
              What We Do
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whatWeDo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group"
                >
                  <span className="group-hover:scale-110 group-hover:rotate-[-8deg] transition-transform duration-300 shrink-0" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span className="text-gray-300 text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-violet)] mb-3">Why We Exist</h4>
              <p className="text-gray-300 leading-[1.85] text-sm sm:text-base">
                We exist to bridge the gap between student talent and community needs by creating opportunities that benefit both students and society.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-magenta)] mb-3">Impact Statement</h4>
              <p className="text-gray-300 leading-[1.85] text-sm sm:text-base">
                Every event we organize is more than just an experience — it is an opportunity to make a meaningful contribution to society.
              </p>
            </div>
          </motion.div>
        </div>



      </div>
    </section>
  );
}
