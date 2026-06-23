'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import {
  Trophy, Users, Layers, BadgeAlert, ArrowRight,
  Code2, Palette, Gamepad2, Globe, Sparkles, BookOpen, Cpu, Search, Filter,
  X, Calendar, MapPin, ScrollText, Timer, Ticket
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  desc: string;
  team: string;
  fee: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  date: string;
  venue: string;
  rules: string[];
}

interface Track {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
  events: EventItem[];
}

const defaultRules = [
  "All participants must carry their valid college ID cards.",
  "Decisions made by the judges will be final and binding.",
  "Any form of indiscipline or rule violation will lead to immediate disqualification."
];

const TRACKS: Track[] = [
  {
    id: 'technical',
    name: 'Technical',
    icon: <Code2 className="w-5 h-5" />,
    color: '#00f0ff',
    tagline: 'Code. Build. Disrupt.',
    events: [
      { id: 'tech-1', title: 'AI Arena', desc: 'Code an autonomous game agent using machine learning algorithms.', team: 'Solo/Duo', fee: '₹150', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80', date: 'Day 1 - 10:00 AM', venue: 'CS Lab 304', rules: ["Use of pre-trained models from the internet is strictly prohibited unless specified.", ...defaultRules] },
      { id: 'tech-2', title: 'Cyber Security CTF', desc: 'Jeopardy-style capture the flag — exploit, decode, and hack your way to victory.', team: 'Solo', fee: 'Free', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80', date: 'Day 2 - 11:00 AM', venue: 'Server Room Alpha', rules: ["DDoS attacks on the CTF server will lead to disqualification.", ...defaultRules] },
      { id: 'tech-3', title: 'Robo Wars', desc: 'Design and battle your combat robots in the ultimate arena showdown.', team: 'Squad', fee: '₹400', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', date: 'Day 3 - 2:00 PM', venue: 'Main Ground Arena', rules: ["Weight limit of the bot must not exceed 15kg.", ...defaultRules] },
    ],
  },
  {
    id: 'non-technical',
    name: 'Non Technical',
    icon: <Users className="w-5 h-5" />,
    color: '#facc15',
    tagline: 'Lead. Manage. Excel.',
    events: [
      { id: 'ntech-1', title: 'B-Plan Pitch', desc: 'Pitch your startup idea to a panel of expert investors.', team: 'Solo/Duo', fee: '₹200', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80', date: 'Day 1 - 1:00 PM', venue: 'Seminar Hall B', rules: ["Presentations must not exceed 10 minutes.", ...defaultRules] },
      { id: 'ntech-2', title: 'Treasure Hunt', desc: 'Solve riddles and race across the campus to find the hidden treasure.', team: 'Squad', fee: '₹100', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=600&q=80', date: 'Day 2 - 9:00 AM', venue: 'Campus Wide', rules: ["Teams must stick together at all times.", ...defaultRules] },
    ],
  },
  {
    id: 'workshops',
    name: 'Workshops',
    icon: <BookOpen className="w-5 h-5" />,
    color: '#10b981',
    tagline: 'Learn. Apply. Master.',
    events: [
      { id: 'work-1', title: 'Web3 & Blockchain', desc: 'Hands-on workshop on building your first smart contract.', team: 'Solo', fee: '₹300', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1639762681485-074b7f4fc431?auto=format&fit=crop&w=600&q=80', date: 'Day 1 - 3:00 PM', venue: 'Tech Hub', rules: ["Bring your own laptop with Node.js installed.", ...defaultRules] },
      { id: 'work-2', title: 'UI/UX Design', desc: 'Master Figma and design principles in this intensive 4-hour workshop.', team: 'Solo', fee: '₹250', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80', date: 'Day 2 - 2:00 PM', venue: 'Design Studio', rules: ["No prior design experience is required.", ...defaultRules] },
    ],
  },
  {
    id: 'hackathons',
    name: 'Hackathons',
    icon: <Cpu className="w-5 h-5" />,
    color: '#ff006e',
    tagline: 'Think. Hack. Innovate.',
    events: [
      { id: 'hack-1', title: 'Genesis Hackathon', desc: '24 Hours Coding Challenge. Build solutions for a better tomorrow.', team: 'Squad', fee: '₹500', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80', date: 'Day 1 & 2 (24 Hours)', venue: 'Innovation Center', rules: ["Code must be written entirely during the hackathon.", "Teams must submit their GitHub repositories before the deadline.", ...defaultRules] },
      { id: 'hack-2', title: 'FinTech Sprint', desc: '12 Hours to revolutionize finance with code.', team: 'Solo/Duo', fee: '₹300', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', date: 'Day 3 - 8:00 AM', venue: 'Business Center', rules: ["APIs provided by sponsors must be integrated into the solution.", ...defaultRules] },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: <Gamepad2 className="w-5 h-5" />,
    color: '#8b5cf6',
    tagline: 'Play. Compete. Dominate.',
    events: [
      { id: 'game-1', title: 'Valorant Showdown', desc: '5v5 custom lobby tactical shooter tournament on the main stage screen.', team: 'Squad', fee: '₹250', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', date: 'Day 1 & 2', venue: 'E-Sports Arena', rules: ["Use of any third-party software or macros will result in a permanent ban.", ...defaultRules] },
      { id: 'game-2', title: 'BGMI Clash', desc: 'Squad battle royale tournament — last team standing claims the crown.', team: 'Squad', fee: '₹200', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80', date: 'Day 2', venue: 'E-Sports Arena', rules: ["Emulators are strictly prohibited. Mobile devices only.", ...defaultRules] },
      { id: 'game-3', title: 'FIFA Championship', desc: 'Console 1v1 football tournament — prove you are the ultimate virtual footballer.', team: 'Solo', fee: '₹100', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=600&q=80', date: 'Day 3', venue: 'Gaming Lounge', rules: ["Standard tournament rules. 6-minute halves.", ...defaultRules] },
    ],
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: <Palette className="w-5 h-5" />,
    color: '#ff6b00',
    tagline: 'Express. Perform. Inspire.',
    events: [
      { id: 'cult-1', title: 'Beat Drop Dance', desc: 'High energy crew street dance battle under dynamic lighting and bass drops.', team: 'Squad', fee: '₹500', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80', date: 'Day 2 - 6:00 PM', venue: 'Main Stage', rules: ["Performance track must not exceed 5 minutes.", ...defaultRules] },
      { id: 'cult-2', title: 'Acoustic Soul', desc: 'Showcase your acoustic vocal & instrumental covers on the main stage.', team: 'Solo/Duo', fee: '₹100', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80', date: 'Day 1 - 5:00 PM', venue: 'Open Air Theatre', rules: ["Backing tracks are not allowed. Live instruments only.", ...defaultRules] },
    ],
  },
];

function EventCard({ event, trackColor, onClick }: { event: EventItem; trackColor: string; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 20);
    setRotateY(x / 20);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  };

  // Generate random countdown and seats left based on event ID for demo purposes
  const generateRandomStats = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const days = Math.abs(hash % 10) + 1;
    const hours = Math.abs((hash * 3) % 24);
    const seats = Math.abs(hash % 50) + 5;
    return { days, hours, seats };
  };

  const { days, hours, seats } = useMemo(() => generateRandomStats(event.id), [event.id]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative w-full rounded-2xl border border-white/[0.08] bg-[#05001a]/40 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-out shadow-2xl flex flex-col group cursor-pointer hover:border-transparent hover:scale-[1.02] hover:z-10"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      {/* Animated Glowing Border via pseudo-element */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ 
          boxShadow: `0 0 20px ${trackColor}40, inset 0 0 20px ${trackColor}20`,
          border: `1px solid ${trackColor}`
        }}
      />

      {/* Hover glow background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${trackColor}15 0%, transparent 70%)` }}
      />

      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010008] via-black/20 to-transparent" />
        <span
          className={`absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${difficultyColors[event.difficulty]} transition-all duration-300 group-hover:scale-105`}
        >
          {event.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-5 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">{event.desc}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-white/5 pt-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Users className="w-3.5 h-3.5 text-[var(--neon-cyan)]" /> {event.team}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Ticket className="w-3.5 h-3.5 text-[var(--neon-magenta)]" /> Seats: <span className="text-white font-bold">{seats} Left</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 col-span-2">
            <Timer className="w-3.5 h-3.5 text-[var(--neon-lime)] animate-pulse" /> 
            Starts in: <span className="text-white font-mono font-bold tracking-widest">{String(days).padStart(2, '0')}d {String(hours).padStart(2, '0')}h</span>
          </div>
        </div>

        {/* Register button (now just acts as a cue to open modal) */}
        <button
          className="relative w-full py-3 rounded-xl font-bold text-xs text-white transition-all duration-300 flex items-center justify-center gap-1.5 overflow-hidden group/btn"
          style={{
            background: `linear-gradient(135deg, ${trackColor}cc, ${trackColor}88)`,
            boxShadow: `0 4px 20px ${trackColor}30`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">View Details</span>
          <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}

function EventDetailDrawer({ event, trackColor, onClose }: { event: EventItem; trackColor: string; onClose: () => void }) {
  const initiateRegistration = useStore((state) => state.initiateRegistration);

  // Prevent scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg h-full bg-[#030014] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Header Image */}
        <div className="relative h-64 w-full shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/50 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <span 
              className="inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full mb-2"
              style={{ backgroundColor: `${trackColor}20`, color: trackColor, border: `1px solid ${trackColor}40` }}
            >
              {event.difficulty} Difficulty
            </span>
            <h2 className="text-3xl font-[var(--font-orbitron)] font-black text-white">{event.title}</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <p className="text-gray-300 text-sm leading-relaxed mb-8">{event.desc}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[var(--neon-cyan)] mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Date & Time</span>
              </div>
              <div className="text-sm text-white font-medium">{event.date}</div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[var(--neon-magenta)] mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Venue</span>
              </div>
              <div className="text-sm text-white font-medium">{event.venue}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[var(--neon-lime)] mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Registration Fee</span>
              </div>
              <div className="text-sm text-white font-medium">{event.fee}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[var(--neon-violet)] mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Team Size</span>
              </div>
              <div className="text-sm text-white font-medium">{event.team}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-white mb-4">
              <ScrollText className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold">Rules & Regulations</h3>
            </div>
            <ul className="space-y-3">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                  <span className="text-[var(--neon-cyan)] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t border-white/10 bg-[#030014] shrink-0">
          <button
            onClick={() => {
              onClose();
              initiateRegistration({
                id: event.id,
                title: event.title,
                category: event.id.split('-')[0],
                fee: event.fee,
                desc: event.desc,
              });
            }}
            className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${trackColor}, ${trackColor}aa)`,
            }}
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function EventShowcaseScene() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [teamSizeFilter, setTeamSizeFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  const track = TRACKS[activeTrack];

  // Derive Team Sizes based on data
  const uniqueTeamSizes = useMemo(() => {
    const sizes = new Set<string>();
    TRACKS.forEach(t => t.events.forEach(e => sizes.add(e.team)));
    return ['All', ...Array.from(sizes)];
  }, []);

  const filteredEvents = useMemo(() => {
    return track.events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || event.difficulty === difficultyFilter;
      const matchesTeamSize = teamSizeFilter === 'All' || event.team === teamSizeFilter;
      
      return matchesSearch && matchesDifficulty && matchesTeamSize;
    });
  }, [track, searchQuery, difficultyFilter, teamSizeFilter]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEvent) {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  return (
    <section id="events" className="relative py-24 overflow-hidden" style={{ background: '#010008' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-[1px] transition-colors duration-500"
        style={{ background: `linear-gradient(90deg, transparent 10%, ${track.color}60, transparent 90%)` }}
      />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--neon-cyan)]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Discover Your Arena
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            EVENT{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              CATEGORIES
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Choose your path to glory. From intensive 24-hour hackathons to high-energy cultural showcases, we have something for everyone.
          </p>
        </div>

        {/* Track tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {TRACKS.map((t, idx) => {
            const isActive = idx === activeTrack;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTrack(idx);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105 z-10'
                    : 'text-gray-400 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:text-white hover:scale-105'
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${t.color}20, ${t.color}05)`,
                        borderColor: `${t.color}60`,
                        boxShadow: `0 0 25px ${t.color}20`,
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

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/10 rounded-2xl p-4 mb-10 backdrop-blur-md"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--neon-cyan)]/50 focus:ring-1 focus:ring-[var(--neon-cyan)]/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-1/2 md:w-auto">
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full md:w-40 bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-gray-300 appearance-none focus:outline-none focus:border-[var(--neon-magenta)]/50 transition-all cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
            
            <div className="relative w-1/2 md:w-auto">
              <select 
                value={teamSizeFilter}
                onChange={(e) => setTeamSizeFilter(e.target.value)}
                className="w-full md:w-40 bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-gray-300 appearance-none focus:outline-none focus:border-[var(--neon-violet)]/50 transition-all cursor-pointer"
              >
                {uniqueTeamSizes.map(size => (
                  <option key={size} value={size}>{size === 'All' ? 'All Team Sizes' : size}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </motion.div>

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
          {filteredEvents.length > 0 ? (
            <motion.div
              key={`${track.id}-grid`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  trackColor={track.color} 
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Search className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-xl text-white font-bold mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query to find what you're looking for.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Drawer Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailDrawer 
            event={selectedEvent} 
            trackColor={TRACKS.find(t => t.events.some(e => e.id === selectedEvent.id))?.color || '#00f0ff'}
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
