'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Lightbulb, Zap, Rocket, HandHeart, Trophy } from 'lucide-react';

const statistics = [
  { icon: <Trophy className="w-6 h-6" />, value: '2023', label: 'Founded in', color: '#fbbf24' },
  { icon: <Users className="w-6 h-6" />, value: '2.1K+', label: 'Community Members', color: '#00E5FF' },
  { icon: <HandHeart className="w-6 h-6" />, value: '9', label: 'Social Initiatives', color: '#f472b6' },
  { icon: <Rocket className="w-6 h-6" />, value: '100%', label: 'Student Driven', color: '#4ade80' },
];

const pillars = [
  {
    title: 'Passion',
    icon: <Heart className="w-5 h-5" />,
    color: 'var(--neon-magenta)',
    desc: 'Everything begins with students who care. We transform passion into impactful events, campaigns, and initiatives that inspire change.'
  },
  {
    title: 'Creativity',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'var(--neon-cyan)',
    desc: 'We approach every challenge with fresh ideas, combining innovation and teamwork to create experiences that leave a lasting impression.'
  },
  {
    title: 'Unity',
    icon: <Users className="w-5 h-5" />,
    color: 'var(--neon-violet)',
    desc: 'Real change happens when people work together. We build a community that collaborates, supports one another, and grows together.'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function AboutScene() {
  return (
    <section
      id="about"
      className="relative w-full py-24 px-4 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0020 0%, #010008 100%)' }}
      aria-labelledby="about-heading"
    >
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
          <span className="text-[var(--neon-cyan)] text-xs font-bold uppercase tracking-[0.3em]">About Us</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          id="about-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white text-center uppercase tracking-wider mb-16"
        >
          The Youth Powered{' '}
          <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
            Club
          </span>
        </motion.h2>

        {/* Two column content (Introduction & Manifesto) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-[var(--font-heading-main)] font-bold text-white">The Youth Powered Club</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Since 2023, we&apos;ve brought together students of Chennai Institute of Technology to create meaningful social impact through events, awareness campaigns, and community initiatives. From educational outreach and environmental drives to inclusive programs and volunteer activities, every initiative reflects our commitment to giving back.
            </p>
          </motion.div>

          {/* Manifesto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-violet)]/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-violet)]/10 flex items-center justify-center text-[var(--neon-violet)]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-[var(--font-heading-main)] font-bold text-white">Manifesto</h3>
            </div>
            <p className="text-gray-400 leading-relaxed relative z-10 mb-4">
              We believe in the power of youth to create meaningful change. Every event and initiative we organize channels energy, creativity, and resources directly into social causes that make a lasting impact. Small acts of kindness create extraordinary change.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 relative z-10">
              <span className="text-sm font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Motto: Create & Contribute</span>
            </div>
          </motion.div>
        </div>

        {/* What We Stand For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl font-[var(--font-heading-main)] font-bold text-white uppercase tracking-wider">What We Stand For</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `color-mix(in srgb, ${pillar.color} 15%, transparent)`, color: pillar.color, boxShadow: `0 0 20px color-mix(in srgb, ${pillar.color} 30%, transparent)` }}
              >
                {pillar.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{pillar.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statistics.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${stat.color}15`, color: stat.color, boxShadow: `0 0 20px ${stat.color}30` }}
              >
                {stat.icon}
              </div>
              <span
                className="text-3xl font-[var(--font-heading-main)] font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
