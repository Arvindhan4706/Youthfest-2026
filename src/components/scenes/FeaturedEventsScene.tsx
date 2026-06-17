'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { Trophy, Users, BadgeAlert, Layers, ArrowRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  category: string;
  prize: string;
  teamSize: string;
  fee: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  desc: string;
}

const FEATURED_EVENTS: EventCardProps[] = [
  {
    title: 'Genesis Hackathon',
    category: 'Technical',
    prize: '₹50,000 Pool',
    teamSize: '2-4 members',
    fee: '₹300',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    desc: 'The flagship Web3 hackathon where code meets decentralized solutions under high pressure.',
  },
  {
    title: 'Valorant Arena',
    category: 'Gaming',
    prize: '₹25,000 Pool',
    teamSize: '5 members',
    fee: '₹250',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    desc: 'Battle it out in custom server environments on the main stage screen for ultimate e-sports glory.',
  },
  {
    title: 'Beat Drop Dance',
    category: 'Cultural',
    prize: '₹40,000 Pool',
    teamSize: '4-8 members',
    fee: '₹500',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    desc: 'Unleash your crew energy. Street, hip-hop, contemporary styles allowed under dynamic lighting.',
  },
];

function FeaturedCard({ event }: { event: EventCardProps }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const initiateRegistration = useStore((state) => state.initiateRegistration);
  
  // Custom 3D tilt coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth scaling rotation limits
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-200 ease-out shadow-2xl flex flex-col group cursor-pointer"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      
      {/* Dynamic Hover Neon Border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card Image banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 text-[10px] font-extrabold tracking-widest uppercase bg-purple-600/90 text-white px-2.5 py-1 rounded-full border border-purple-400/30 shadow-md">
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            {event.desc}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>{event.prize}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>{event.teamSize}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fee: {event.fee}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <BadgeAlert className="w-3.5 h-3.5 text-pink-400" />
            <span>Level: {event.difficulty}</span>
          </div>
        </div>

        {/* Register CTA with magnetic style */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            initiateRegistration({
              id: event.title.toLowerCase().replace(/\s+/g, '-'),
              title: event.title,
              category: event.category,
              fee: event.fee,
              desc: event.desc
            });
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-lg shadow-purple-500/20"
        >
          <span>Register Spot</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

export default function FeaturedEventsScene() {
  return (
    <section id="featured" className="relative py-24 bg-[#011213] px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4">
            FEATURED <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">EXPERIENCES</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Ignite your passion and claim glory in our high stakes signature challenges. Unforgettable rewards await.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_EVENTS.map((event, idx) => (
            <FeaturedCard key={idx} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
}
export type { EventCardProps };
