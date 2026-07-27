'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Heart, Lightbulb, Zap, Target, Eye,
  BookOpen, Megaphone, HandHeart, Star, Leaf, Mic2
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

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
    desc: 'Together we achieve more. We believe collaboration, inclusivity, and mutual respect are the foundation of every successful initiative.'
  },
];

const whatWeDo = [
  { icon: <HandHeart className="w-4 h-4" />, label: 'Community Service' },
  { icon: <Mic2 className="w-4 h-4" />, label: 'Cultural Events' },
  { icon: <Megaphone className="w-4 h-4" />, label: 'Social Awareness Campaigns' },
  { icon: <Star className="w-4 h-4" />, label: 'Leadership Programs' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'Workshops' },
  { icon: <Users className="w-4 h-4" />, label: 'Student Engagement Activities' },
  { icon: <Leaf className="w-4 h-4" />, label: 'Volunteer Initiatives' },
  { icon: <Zap className="w-4 h-4" />, label: 'Fundraising Events' },
];

export default function AboutScene() {
  return (
    <section
      id="about"
      className="relative w-full section-padding px-4 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0020 0%, #010008 100%)' }}
      aria-labelledby="about-heading"
    >
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 container-responsive space-y-28">

        {/* ── INTRO ───────────────────────────────────────── */}
        <div>
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
            <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em]">About</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-3"
          >
            Who We Are
          </motion.p>

          <motion.h2
            id="about-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white text-center uppercase tracking-wider mb-12"
          >
            The Youth Powered{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              Club
            </span>
          </motion.h2>

          {/* Introduction + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[20px] bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Introduction</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                Yuvenza is the official youth club of Chennai Institute of Technology, established with the vision of empowering students through leadership, creativity, and meaningful community engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[20px] bg-[var(--neon-violet)]/10 flex items-center justify-center text-[var(--neon-violet)]">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Story</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                We believe that every student has the potential to inspire change. Through cultural events, awareness campaigns, social initiatives, and collaborative projects, we provide a platform where passion meets purpose. Every activity we organize reflects our commitment to building a stronger, more compassionate community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── VISION & MISSION ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[20px] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/[0.03] p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-cyan)]/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-10 h-10 rounded-[20px] bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Vision</h3>
            </div>
            <p className="text-gray-300 leading-relaxed relative z-10">
              To inspire students to become socially responsible leaders by creating opportunities for innovation, collaboration, and meaningful impact.
            </p>
            <div className="mt-6 h-[1px] bg-gradient-to-r from-[var(--neon-cyan)]/40 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-[20px] border border-[var(--neon-magenta)]/20 bg-[var(--neon-magenta)]/[0.03] p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--neon-magenta)]/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-10 h-10 rounded-[20px] bg-[var(--neon-magenta)]/10 flex items-center justify-center text-[var(--neon-magenta)]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Mission</h3>
            </div>
            <p className="text-gray-300 leading-relaxed relative z-10">
              To organize engaging events and initiatives that encourage creativity, teamwork, leadership, and community service while fostering a culture of unity and social responsibility.
            </p>
            <div className="mt-6 h-[1px] bg-gradient-to-r from-[var(--neon-magenta)]/40 to-transparent" />
          </motion.div>
        </div>

        {/* ── OUR VALUES ──────────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider">Our Values</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-8 rounded-[20px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-[20px] flex items-center justify-center mb-6"
                  style={{ background: `color-mix(in srgb, ${v.color} 15%, transparent)`, color: v.color, boxShadow: `0 0 20px color-mix(in srgb, ${v.color} 30%, transparent)` }}
                >
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">{v.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── WHAT WE DO ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-8">What We Do</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whatWeDo.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-center gap-3 px-4 py-3 rounded-[20px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--neon-cyan)]/20 transition-all duration-300 group"
                >
                  <span className="text-[var(--neon-cyan)] group-hover:scale-110 transition-transform shrink-0">{item.icon}</span>
                  <span className="text-gray-300 text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            {/* Why We Exist */}
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--neon-violet)] mb-3">Why We Exist</h4>
              <p className="text-gray-300 leading-relaxed text-sm">
                We exist to bridge the gap between student talent and community needs by creating opportunities that benefit both students and society.
              </p>
            </div>

            {/* Impact Statement */}
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--neon-magenta)] mb-3">Impact Statement</h4>
              <p className="text-gray-300 leading-relaxed text-sm">
                Every event we organize is more than just an experience — it is an opportunity to make a meaningful contribution to society.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── MOTTO & CLOSING ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center relative rounded-[20px] border border-white/10 bg-white/[0.02] p-12 md:p-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 via-transparent to-[var(--neon-violet)]/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/40 to-transparent" />

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--neon-cyan)] mb-6">Core Motto</p>
          <h3 className="text-5xl sm:text-6xl md:text-7xl font-[var(--font-heading-main)] font-black text-white mb-8 uppercase tracking-widest">
            Create &{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              Contribute
            </span>
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            Together, we are building a community where passion inspires action, creativity drives innovation, and unity creates lasting impact.
          </p>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-violet)]/40 to-transparent" />
        </motion.div>

      </div>
    </section>
  );
}
