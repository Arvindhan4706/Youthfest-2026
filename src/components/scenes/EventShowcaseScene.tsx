'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import {
  Trophy, Users, Layers, BadgeAlert, ArrowRight,
  Code2, Palette, Gamepad2, Globe, Sparkles
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  desc: string;
  prize: string;
  team: string;
  fee: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
}

interface Track {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
  events: EventItem[];
}

const TRACKS: Track[] = [
  {
    id: 'tech',
    name: 'Technology',
    icon: <Code2 className="w-5 h-5" />,
    color: '#00f0ff',
    tagline: 'Code. Build. Disrupt.',
    events: [
      { id: 'tech-1', title: 'Genesis Hackathon', desc: 'Build a decentralized Web3 solution in 24 hours. The ultimate test of code and creativity.', prize: '₹50,000', team: '2-4 members', fee: '₹300', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80' },
      { id: 'tech-2', title: 'AI Arena', desc: 'Code an autonomous game agent using machine learning algorithms.', prize: '₹30,000', team: 'Solo/Duo', fee: '₹150', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80' },
      { id: 'tech-3', title: 'Cyber Security CTF', desc: 'Jeopardy-style capture the flag — exploit, decode, and hack your way to victory.', prize: '₹20,000', team: 'Solo', fee: 'Free', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
      { id: 'tech-4', title: 'Robo Wars', desc: 'Design and battle your combat robots in the ultimate arena showdown.', prize: '₹25,000', team: '2-3 members', fee: '₹400', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'creative',
    name: 'Creativity',
    icon: <Palette className="w-5 h-5" />,
    color: '#ff006e',
    tagline: 'Express. Perform. Inspire.',
    events: [
      { id: 'cre-1', title: 'Beat Drop Dance', desc: 'High energy crew street dance battle under dynamic lighting and bass drops.', prize: '₹40,000', team: '4-8 members', fee: '₹500', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80' },
      { id: 'cre-2', title: 'Acoustic Soul', desc: 'Showcase your acoustic vocal & instrumental covers on the main stage.', prize: '₹15,000', team: 'Solo/Duo', fee: '₹100', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80' },
      { id: 'cre-3', title: 'Runway Redefined', desc: 'Eco-futuristic fashion design runway contest. Sustainability meets style.', prize: '₹35,000', team: 'Up to 10', fee: '₹600', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: <Gamepad2 className="w-5 h-5" />,
    color: '#fbbf24',
    tagline: 'Play. Compete. Dominate.',
    events: [
      { id: 'game-1', title: 'Valorant Showdown', desc: '5v5 custom lobby tactical shooter tournament on the main stage screen.', prize: '₹25,000', team: '5 members', fee: '₹250', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
      { id: 'game-2', title: 'BGMI Clash', desc: 'Squad battle royale tournament — last team standing claims the crown.', prize: '₹20,000', team: '4 members', fee: '₹200', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80' },
      { id: 'game-3', title: 'FIFA Championship', desc: 'Console 1v1 football tournament — prove you are the ultimate virtual footballer.', prize: '₹10,000', team: 'Solo', fee: '₹100', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: <Globe className="w-5 h-5" />,
    color: '#8b5cf6',
    tagline: 'Debate. Create. Lead.',
    events: [
      { id: 'cult-1', title: 'Model United Nations', desc: 'Diplomatic simulation — represent nations and draft resolutions under pressure.', prize: '₹15,000', team: 'Solo', fee: '₹200', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80' },
      { id: 'cult-2', title: 'Slam Poetry Night', desc: 'Spoken word performances that move hearts and minds. 3 minutes to leave a mark.', prize: '₹10,000', team: 'Solo', fee: 'Free', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80' },
      { id: 'cult-3', title: 'The Great Debate', desc: 'Oxford-style debate championship — sharp arguments, sharper rebuttals.', prize: '₹12,000', team: 'Duo', fee: '₹100', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1431540015159-0f9673883ae8?auto=format&fit=crop&w=600&q=80' },
    ],
  },
];

function EventCard({ event, trackColor }: { event: EventItem; trackColor: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const initiateRegistration = useStore((state) => state.initiateRegistration);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 18);
    setRotateY(x / 18);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-200 ease-out shadow-2xl flex flex-col group cursor-pointer"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${trackColor}10 0%, transparent 50%)` }}
      />

      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span
          className={`absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${difficultyColors[event.difficulty]}`}
        >
          {event.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--neon-cyan)] transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-5">{event.desc}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Trophy className="w-3.5 h-3.5 text-[var(--neon-gold)]" /> {event.prize}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Users className="w-3.5 h-3.5 text-[var(--neon-cyan)]" /> {event.team}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Layers className="w-3.5 h-3.5 text-[var(--neon-lime)]" /> Fee: {event.fee}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <BadgeAlert className="w-3.5 h-3.5 text-[var(--neon-magenta)]" /> {event.difficulty}
          </div>
        </div>

        {/* Register button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            initiateRegistration({
              id: event.id,
              title: event.title,
              category: event.id.split('-')[0],
              fee: event.fee,
              desc: event.desc,
            });
          }}
          className="w-full py-3 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${trackColor}cc, ${trackColor}88)`,
            boxShadow: `0 4px 20px ${trackColor}20`,
          }}
        >
          <span>Register Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function EventShowcaseScene() {
  const [activeTrack, setActiveTrack] = useState(0);
  const track = TRACKS[activeTrack];

  return (
    <section id="events" className="relative py-24 overflow-hidden" style={{ background: '#011213' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-[1px] transition-colors duration-500"
        style={{ background: `linear-gradient(90deg, transparent 10%, ${track.color}40, transparent 90%)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 font-semibold uppercase tracking-widest mb-5"
          >
            <Sparkles className="w-3 h-3 text-[var(--neon-cyan)]" />
            50+ Events Across 4 Tracks
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            EVENT{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              SHOWCASE
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Choose your arena. Technology, Creativity, Gaming or Culture — every track leads to glory.
          </p>
        </div>

        {/* Track tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {TRACKS.map((t, idx) => {
            const isActive = idx === activeTrack;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTrack(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  isActive
                    ? 'text-white shadow-lg scale-[1.02]'
                    : 'text-gray-400 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:text-white'
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${t.color}20, ${t.color}05)`,
                        borderColor: `${t.color}40`,
                        boxShadow: `0 0 20px ${t.color}15`,
                      }
                    : undefined
                }
              >
                <span style={isActive ? { color: t.color } : undefined}>{t.icon}</span>
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Track tagline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <span
              className="text-lg sm:text-xl font-bold tracking-wide"
              style={{ color: track.color }}
            >
              {track.tagline}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Event cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {track.events.map((event) => (
              <EventCard key={event.id} event={event} trackColor={track.color} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
