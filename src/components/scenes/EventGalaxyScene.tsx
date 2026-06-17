'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { 
  Sparkles, Trophy, Calendar, MapPin, Users, Coins, 
  Brain, Heart, Gamepad2, Sprout, Activity 
} from 'lucide-react';

interface CategoryNode {
  name: string;
  color: string;
  eventsCount: number;
  previewText: string;
  iconName: 'Brain' | 'Heart' | 'Gamepad2' | 'Sprout' | 'Activity' | 'Sparkles';
}

const CATEGORIES: CategoryNode[] = [
  { name: 'Technical', color: '#14b8a6', eventsCount: 12, previewText: 'Logic riddles, mental focus & software hacks', iconName: 'Brain' },
  { name: 'Cultural', color: '#ff7a7a', eventsCount: 18, previewText: 'Rhythmic movement, acoustic expressions, and art', iconName: 'Heart' },
  { name: 'Gaming', color: '#ffb938', eventsCount: 8, previewText: 'Reflex testing, cognitive speed, and strategy', iconName: 'Gamepad2' },
  { name: 'Workshops', color: '#10b981', eventsCount: 6, previewText: 'Mental growth, mindfulness, and design thinking', iconName: 'Sprout' },
  { name: 'Sports', color: '#f59e0b', eventsCount: 10, previewText: 'Physical endurance, agility, and teamwork', iconName: 'Activity' },
  { name: 'Pro Shows', color: '#8b5cf6', eventsCount: 4, previewText: 'Sonic meditation, rhythm therapy, and celebration', iconName: 'Sparkles' },
];

const DISPLAY_NAMES: Record<string, string> = {
  Technical: 'Mind & Logic',
  Cultural: 'Soul & Expression',
  Gaming: 'Digital Play & Reflex',
  Workshops: 'Growth & Mindfulness',
  Sports: 'Body & Physical Vitality',
  'Pro Shows': 'Community Celebration'
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'Brain': return <Brain className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Gamepad2': return <Gamepad2 className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    default: return <Sparkles className={className} />;
  }
}

// Sample events database
const CATEGORY_EVENTS: Record<string, any[]> = {
  Technical: [
    { id: 'tech-1', title: 'Genesis Hackathon', desc: 'Build a decentralized Web3 solution in 24 hours.', prize: '₹50,000', team: '2-4 members', fee: '₹300', difficulty: 'Hard' },
    { id: 'tech-2', title: 'AI Arena', desc: 'Code an autonomous game agent using machine learning.', prize: '₹30,000', team: 'Solo/Duo', fee: '₹150', difficulty: 'Medium' },
    { id: 'tech-3', title: 'Cyber Security CTF', desc: 'Jeopardy-style capture the flag security challenge.', prize: '₹20,000', team: 'Solo', fee: 'Free', difficulty: 'Hard' },
  ],
  Cultural: [
    { id: 'cult-1', title: 'Beat Drop Street Dance', desc: 'High energy crew street dance face-off.', prize: '₹40,000', team: '4-8 members', fee: '₹500', difficulty: 'Medium' },
    { id: 'cult-2', title: 'Acoustic Soul', desc: 'Showcase your acoustic vocal & instrumental covers.', prize: '₹15,000', team: 'Solo/Duo', fee: '₹100', difficulty: 'Easy' },
    { id: 'cult-3', title: 'Runway Redefined', desc: 'Eco-futuristic fashion design runway contest.', prize: '₹35,000', team: 'Up to 10', fee: '₹600', difficulty: 'Medium' },
  ],
  Gaming: [
    { id: 'game-1', title: 'Valorant Showdown', desc: '5v5 custom lobby tactical search & destroy tournament.', prize: '₹25,000', team: '5 members', fee: '₹250', difficulty: 'Hard' },
    { id: 'game-2', title: 'BGMI Clash', desc: 'Squad battle royale tournament.', prize: '₹20,000', team: '4 members', fee: '₹200', difficulty: 'Medium' },
  ],
  Workshops: [
    { id: 'work-1', title: 'Build Your Own Drone', desc: 'Hands-on hardware assembling and basic flight telemetry.', prize: 'Certificate', team: 'Solo', fee: '₹400', difficulty: 'Easy' },
    { id: 'work-2', title: 'UI/UX Glassmorphism', desc: 'Learn elite interactive design and Figma animations.', prize: 'Certificate', team: 'Solo', fee: 'Free', difficulty: 'Easy' },
  ],
  Sports: [
    { id: 'sport-1', title: 'Futsal League', desc: '5-a-side fast paced tournament.', prize: '₹15,000', team: '5+2 subs', fee: '₹300', difficulty: 'Medium' },
    { id: 'sport-2', title: '3v3 Hoop Shot', desc: 'Half-court rapid basketball tournament.', prize: '₹10,000', team: '3+1 sub', fee: '₹200', difficulty: 'Medium' },
  ],
  'Pro Shows': [
    { id: 'pro-1', title: 'DJ Cosmic Live', desc: 'Premium EDM laser audio visualizer concert.', prize: 'Unforgettable Night', team: 'All Access', fee: 'Included in pass', difficulty: 'Fun' },
    { id: 'pro-2', title: 'Rock Concert: Altar', desc: 'Live indie-rock band headliner show.', prize: 'Unforgettable Night', team: 'All Access', fee: 'Included in pass', difficulty: 'Fun' },
  ],
};

export default function EventGalaxyScene() {
  const [selectedCat, setSelectedCat] = useState<CategoryNode | null>(null);
  const initiateRegistration = useStore((state) => state.initiateRegistration);
  const addPoints = useStore((state) => state.addPoints);

  const handleSelect = (category: CategoryNode) => {
    setSelectedCat(category);
    addPoints(20, `Inspecting ${category.name} wellness zone`);
  };

  return (
    <section id="galaxy" className="relative min-h-screen w-full flex flex-col justify-center bg-[#011213] py-20 px-4 overflow-hidden border-t border-white/5">
      
      {/* Background Neon Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4">
          EXPLORE THE <span className="bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">WELLNESS SPHERE</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Explore the dimensions of active mind, creative expression, and physical health. Select a zone to load events.
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
        
        {/* Left Side: Interactive 2D Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full items-start">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat?.name === cat.name;
            return (
              <motion.div
                key={cat.name}
                onClick={() => handleSelect(cat)}
                whileHover={{ scale: 1.015, y: -2 }}
                className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] shadow-lg relative overflow-hidden group ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500/40 shadow-[0_0_25px_rgba(20,185,129,0.15)]'
                    : 'bg-white/5 border-white/5 hover:border-teal-500/25 hover:bg-white/10'
                }`}
              >
                {/* Decorative background glow */}
                <div 
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-15 transition-all group-hover:scale-125"
                  style={{ backgroundColor: cat.color }}
                />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div 
                    className="p-2.5 rounded-xl border transition-all"
                    style={{ 
                      borderColor: `${cat.color}30`, 
                      backgroundColor: `${cat.color}15`,
                      color: cat.color 
                    }}
                  >
                    <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full">
                    {cat.eventsCount} Modules
                  </span>
                </div>

                <div>
                  <h4 className="text-white font-bold text-sm mb-1 tracking-wide group-hover:text-teal-300 transition-colors">
                    {DISPLAY_NAMES[cat.name] || cat.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                    {cat.previewText}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Informative Panels */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedCat ? (
              <motion.div
                key={selectedCat.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col h-full justify-between shadow-2xl relative overflow-hidden group"
              >
                {/* Visual Accent */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-40 transition-colors"
                  style={{ backgroundColor: selectedCat.color }}
                />

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-[0_0_10px_current]" 
                      style={{ backgroundColor: selectedCat.color, color: selectedCat.color }}
                    />
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
                      {DISPLAY_NAMES[selectedCat.name] || selectedCat.name}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {selectedCat.previewText}
                  </p>

                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    Available Modules
                  </h4>

                  {/* List of sub-events */}
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1.5 scrollbar-thin scrollbar-thumb-white/10">
                    {CATEGORY_EVENTS[selectedCat.name]?.map((event) => (
                      <div 
                        key={event.id}
                        className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h5 className="font-bold text-white text-sm">{event.title}</h5>
                            <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/80 font-mono">
                              {event.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{event.desc}</p>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium border-t border-white/5 pt-2">
                          <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-400" /> {event.prize}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" /> {event.team}</span>
                          <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-emerald-400" /> {event.fee}</span>
                        </div>

                        <button 
                          onClick={() => initiateRegistration({
                            id: event.id,
                            title: event.title,
                            category: selectedCat.name,
                            fee: event.fee,
                            desc: event.desc
                          })}
                          className="w-full py-2 bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs rounded-lg transition-all duration-200"
                        >
                          Register
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCat(null)}
                  className="mt-6 text-xs text-center text-gray-400 hover:text-white transition-colors"
                >
                  ← Go back to overview
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center flex flex-col items-center justify-center h-full shadow-2xl min-h-[350px]"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Wellness Dimension</h3>
                <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                  Click on one of the active wellness dimension zones on the left to reveal corresponding modules, criteria, and registrations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
