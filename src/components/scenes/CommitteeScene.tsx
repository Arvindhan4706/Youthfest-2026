'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink, MessageSquare, Sparkles, Navigation, AtSign } from 'lucide-react';
import { db, SiteSettings } from '@/lib/database';

interface CommitteeMember {
  name: string;
  role: string;
  department: string;
  contact: string;
  whatsapp: string;
  avatar: string;
  tag: string;
  color: string;
}

const STUDENT_LEADS: CommitteeMember[] = [
  {
    name: 'Pravin Raj',
    role: 'President',
    department: 'Overall Head',
    contact: '+91 9566003608',
    whatsapp: 'https://wa.me/919566003608?text=Hi%20Pravin,%20I%20have%20a%20query%20regarding%20Yuvenza%202026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tag: 'President',
    color: 'var(--neon-cyan)',
  },
  {
    name: 'Jesi',
    role: 'HR & Culturals',
    department: 'Culturals',
    contact: '+91 9500129400',
    whatsapp: 'https://wa.me/919500129400?text=Hi%20Jesi,%20I%20have%20a%20query%20regarding%20Culturals',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    tag: 'Culturals',
    color: 'var(--neon-magenta)',
  },
  {
    name: 'Roshan',
    role: 'Workshop Lead',
    department: 'Technical',
    contact: '+91 7339175315',
    whatsapp: 'https://wa.me/917339175315?text=Hi%20Roshan,%20I%20have%20a%20query%20regarding%20Workshops',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tag: 'Technical',
    color: 'var(--neon-violet)',
  },
  {
    name: 'Arvindhan',
    role: 'Technical Team',
    department: 'Technical',
    contact: '+91 7339524706',
    whatsapp: 'https://wa.me/917339524706?text=Hi%20Arvindhan,%20I%20have%20a%20query%20regarding%20Yuvenza%202026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    tag: 'Technical',
    color: '#4ade80',
  },
];

// Tilt card with gradient border
function MemberCard({ member, idx }: { member: CommitteeMember; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 160, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 160, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -6);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 6);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: idx * 0.12, duration: 0.7, type: "spring", bounce: 0.35 }}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: 'preserve-3d',
      }}
      className="h-full group relative"
    >
      {/* Gradient border glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${member.color}50, transparent 60%, ${member.color}30)` }}
      />
      <div className="relative h-full flex flex-col justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] group-hover:border-transparent group-hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
        {/* Corner Tag */}
        <div className="flex justify-between items-start mb-5">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]" style={{ color: member.color }}>
            {member.tag}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-white/10 group-hover:text-white/40 transition-colors" />
        </div>

        {/* Profile */}
        <div className="flex flex-col items-start gap-4 mb-6">

          <div>
            <h3 className="text-white font-bold text-base leading-tight group-hover:text-[var(--neon-cyan)] transition-colors" style={{ letterSpacing: '-0.01em' }}>
              {member.name}
            </h3>
            <p className="text-xs font-semibold mt-1" style={{ color: member.color }}>{member.role}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{member.department}</p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
          <a
            href={`tel:${member.contact}`}
            className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white font-mono transition-colors p-2 rounded-xl hover:bg-white/[0.04]"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500/[0.08] border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <span>{member.contact}</span>
          </a>
          <a
            href={member.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all duration-300 group/btn"
          >
            <MessageSquare className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommitteeScene() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await db.getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings for committee scene', err);
      }
    };
    fetchSettings();
  }, []);

  const instituteName = settings?.contact_institute || 'Chennai Institute of Technology';
  const instituteAddress = settings?.contact_address || 'Sarathy Nagar, Kundrathur, Chennai - 600069, Tamil Nadu';
  const contactEmail = settings?.contact_email || 'yuvenza@citchennai.net';

  return (
    <section id="committee" className="relative section-padding overflow-hidden bg-[#020a0c]">
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--neon-cyan)]/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--neon-violet)]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-responsive relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/[0.04] text-[10px] text-[var(--neon-cyan)] font-semibold uppercase tracking-[0.2em] mb-7"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> The Squad
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[var(--font-heading-main)] font-black text-white uppercase mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            MEET THE{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              CREW
            </span>
          </motion.h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-[1.8]">
            Got questions? Reach out to our student leads directly — we&apos;re here to help with anything you need.
          </p>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14">
          {STUDENT_LEADS.map((member, idx) => (
            <MemberCard key={member.name} member={member} idx={idx} />
          ))}
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-teal-500/30 transition-all duration-400 hover:-translate-y-1 flex sm:flex-row flex-col items-start gap-5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/[0.08] border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-110 group-hover:bg-teal-500/15 transition-all duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-teal-400 block mb-1">WHERE IT'S HAPPENING</span>
                <h4 className="text-white font-bold text-sm sm:text-base mb-1 leading-tight" style={{ letterSpacing: '-0.01em' }}>{instituteName}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{instituteAddress}</p>
              </div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(instituteName + ' ' + instituteAddress)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400 hover:text-white transition-colors group/link">
                <Navigation className="w-3 h-3" /><span>Open in Google Maps</span><ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
              </a>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-purple-500/30 transition-all duration-400 hover:-translate-y-1 flex sm:flex-row flex-col items-start gap-5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/[0.08] border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 group-hover:bg-purple-500/15 transition-all duration-300">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-purple-400 block mb-1">DROP US A MAIL</span>
                <h4 className="text-white font-bold text-sm sm:text-base mb-1" style={{ letterSpacing: '-0.01em' }}>Need more info?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">For bulk registrations, sponsorships, or any queries.</p>
              </div>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 hover:text-white transition-colors group/link">
                <Mail className="w-3 h-3" /><span>{contactEmail}</span><ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-all" />
              </a>
            </div>
          </motion.div>

          {/* Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-pink-500/30 transition-all duration-400 hover:-translate-y-1 flex sm:flex-row flex-col items-start gap-5 group md:col-span-2 lg:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/[0.08] border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-110 group-hover:bg-pink-500/15 transition-all duration-300">
              <AtSign className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-pink-400 block mb-1">STAY CONNECTED</span>
                <h4 className="text-white font-bold text-sm sm:text-base mb-1" style={{ letterSpacing: '-0.01em' }}>Follow us on Insta</h4>
                <p className="text-xs text-gray-500 leading-relaxed">All the latest updates and behind-the-scenes action.</p>
              </div>
              <a href="https://instagram.com/yuvenza_cit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-pink-400 hover:text-white transition-colors group/link">
                <AtSign className="w-3 h-3" /><span>@yuvenza_cit</span><ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-all" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
