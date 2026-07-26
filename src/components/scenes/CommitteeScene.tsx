'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink, MessageSquare, Sparkles, Navigation } from 'lucide-react';
import { db, SiteSettings } from '@/lib/database';

interface CommitteeMember {
  name: string;
  role: string;
  department: string;
  contact: string;
  whatsapp: string;
  avatar: string;
  tag: string;
}

const STUDENT_LEADS: CommitteeMember[] = [
  {
    name: 'Arvindhan S.',
    role: 'Student Festival Chair',
    department: 'Computer Science Dept.',
    contact: '+91 98765 43210',
    whatsapp: 'https://wa.me/919876543210?text=Hi%20Arvindhan,%20I%20have%20a%20query%20regarding%20Youthfest%202026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tag: 'Overall Head',
  },
  {
    name: 'Meera Rajesh',
    role: 'Cultural Events Head',
    department: 'Media & Arts Dept.',
    contact: '+91 98765 43211',
    whatsapp: 'https://wa.me/919876543211?text=Hi%20Meera,%20I%20have%20a%20query%20regarding%20Cultural%20events',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    tag: 'Culturals',
  },
  {
    name: 'Rohan Verma',
    role: 'Tech & Hackathon Coordinator',
    department: 'Information Technology',
    contact: '+91 98765 43212',
    whatsapp: 'https://wa.me/919876543212?text=Hi%20Rohan,%20I%20have%20a%20query%20regarding%20Hackathon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tag: 'Technical',
  },
  {
    name: 'Ananya Sharma',
    role: 'Hospitality & Logistics Lead',
    department: 'Management Studies',
    contact: '+91 98765 43213',
    whatsapp: 'https://wa.me/919876543213?text=Hi%20Ananya,%20I%20have%20a%20query%20regarding%20Accommodation',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    tag: 'Logistics',
  },
];

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
    <section id="committee" className="relative section-padding md:section-padding lg:section-padding overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[var(--neon-violet)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <ShieldCheck className="w-4 h-4" />
            Organizing Committee
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            FESTIVAL{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              COMMITTEE & DESK
            </span>
          </motion.h2>

          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Get in touch directly with our student leads and organizing desk for assistance.
          </p>
        </div>

        {/* Student Leads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STUDENT_LEADS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="h-full flex flex-col justify-between p-6 rounded-[20px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-[var(--neon-cyan)]/40 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] group relative overflow-hidden"
            >
              {/* Corner Tag */}
              <div className="flex justify-between items-start mb-5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--neon-cyan)]">
                  {member.tag}
                </span>
                <Sparkles className="w-4 h-4 text-white/20 group-hover:text-[var(--neon-cyan)] transition-colors" />
              </div>

              {/* Profile Card Header */}
              <div className="flex flex-col items-start gap-4 mb-6">
                <div className="relative">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-[20px] object-cover border border-white/20 shadow-lg group-hover:scale-105 group-hover:border-[var(--neon-cyan)]/50 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#030014] rounded-full" title="Active Lead" />
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[var(--neon-cyan)] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-400 mt-1">{member.role}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{member.department}</p>
                </div>
              </div>

              {/* Contact Actions Footer */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <a
                  href={`tel:${member.contact}`}
                  className="flex items-center gap-2.5 text-xs text-gray-300 hover:text-white font-mono transition-colors p-2 rounded-[20px] hover:bg-white/5"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                  <span>{member.contact}</span>
                </a>

                <a
                  href={member.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[20px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group/btn"
                >
                  <MessageSquare className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Location & Support Mail Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campus Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-[20px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-500 hover:-translate-y-1 flex flex-col sm:flex-row items-start gap-6 group"
          >
            <div className="w-14 h-14 rounded-[20px] bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
              <MapPin className="w-7 h-7" />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 block mb-1">
                  VENUE & ADDRESS
                </span>
                <h4 className="text-white font-bold text-lg mb-1">{instituteName}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{instituteAddress}</p>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(instituteName + ' ' + instituteAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-300 hover:text-white transition-colors group/link"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
              </a>
            </div>
          </motion.div>

          {/* Support Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[20px] bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-1 flex flex-col sm:flex-row items-start gap-6 group"
          >
            <div className="w-14 h-14 rounded-[20px] bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
              <Mail className="w-7 h-7" />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 block mb-1">
                  OFFICIAL CONTACT MAIL
                </span>
                <h4 className="text-white font-bold text-lg mb-1">Official Support Mail</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  For contingent registration, sponsorships, and festival queries.
                </p>
              </div>

              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-300 hover:text-white transition-colors group/link"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{contactEmail}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
