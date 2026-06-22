'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const leaders = [
  { id: 1, name: 'Pravin Raj', role: 'President', desc: 'Guiding the overarching vision and strategic execution of the club.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: '', role: 'Vice President', desc: 'Assisting the President in overseeing daily operations and initiatives.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Roshan', role: 'Secretary', desc: 'Managing communications, records, and internal coordination.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Sai Sudar', role: 'Joint Secretary', desc: 'Supporting administrative workflows and executive decision-making.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Jesi Anumitha Solomon', role: 'HR (Human Resources)', desc: 'Fostering talent, team well-being, and organizational culture.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: 'Arvindhan', role: 'Promotion Head', desc: 'Spearheading marketing campaigns and brand awareness strategies.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: 'Ankith', role: 'Marketing Strategist', desc: 'Developing data-driven strategies to maximize event outreach.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: 'Jotheeswaran', role: 'Sponsorship', desc: 'Securing vital partnerships and managing sponsor relations.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop' },
  { id: 9, name: 'Dhurairaj', role: 'Creative Head', desc: 'Directing the visual identity and artistic direction of the festival.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop' },
  { id: 10, name: 'Linkeshan', role: 'Events Head', desc: 'Orchestrating the core lineup and technical execution of all events.', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop' },
  { id: 11, name: 'Dinagar', role: 'Event Manager', desc: 'Ensuring seamless on-ground operations and logistical success.', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop' },
  { id: 12, name: 'Santhosh', role: 'Social Media', desc: 'Curating engaging content and managing digital community interactions.', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop' },
  { id: 13, name: 'Keerthana', role: 'Content Head', desc: 'Crafting compelling narratives and overseeing written communications.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?q=80&w=600&auto=format&fit=crop' },
  { id: 14, name: 'Muthu Meena', role: 'Outreach Head', desc: 'Expanding the club’s network and driving campus-wide engagement.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
  { id: 15, name: 'Venkat', role: 'PR Head', desc: 'Managing public relations and maintaining the club’s stellar reputation.', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=600&auto=format&fit=crop' },
];

export default function LeadersScene() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="leaders" className="relative py-24 min-h-screen flex items-center justify-center bg-[#011213] overflow-hidden">
      {/* Background ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-cyan)]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-violet)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-[var(--font-orbitron)] font-black text-white mb-4 uppercase tracking-tight">
            Club <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)]">Leaders</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The visionaries and creative minds behind Yuvenza Club and Youthfest 2026.
          </p>
        </motion.div>

        {/* Increased columns from 3 to 5 to reduce card sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl glass p-3 border border-white/5 hover:border-[var(--neon-cyan)]/30 transition-all duration-500 bg-white/[0.02] h-full flex flex-col">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011213] via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  <img
                    src={leader.image}
                    alt={leader.name || leader.role}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                
                <div className="text-center relative z-20 flex-grow flex flex-col justify-start">
                  <h3 className="text-[13px] sm:text-sm font-bold text-white font-[var(--font-orbitron)] tracking-wide mb-1 group-hover:text-[var(--neon-cyan)] transition-colors leading-tight">
                    {leader.name || leader.role}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[var(--neon-violet)] uppercase tracking-widest font-bold mb-2">
                    {leader.role}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-snug line-clamp-3">
                    {leader.desc}
                  </p>
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute -inset-px rounded-2xl border border-transparent group-hover:border-[var(--neon-cyan)]/50 transition-colors duration-500 pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_rgba(0,240,255,0)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-shadow duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
