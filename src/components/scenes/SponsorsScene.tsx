'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
}

const TITLE_SPONSOR: Sponsor = {
  id: 'ts-1',
  name: 'TechNova Corp',
  logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
};

const GOLD_SPONSORS: Sponsor[] = [
  { id: 'gs-1', name: 'Alpha Systems', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80' },
  { id: 'gs-2', name: 'Beta Innovations', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80' },
  { id: 'gs-3', name: 'Gamma Dynamics', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80' },
  { id: 'gs-4', name: 'Delta Forge', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80' },
  { id: 'gs-5', name: 'Epsilon Tech', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80' },
];

const SILVER_SPONSORS: Sponsor[] = [
  { id: 'ss-1', name: 'Zeta Corp', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
  { id: 'ss-2', name: 'Eta Solutions', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
  { id: 'ss-3', name: 'Theta Labs', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
  { id: 'ss-4', name: 'Iota Secure', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
  { id: 'ss-5', name: 'Kappa Cloud', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
  { id: 'ss-6', name: 'Lambda Data', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80' },
];

const COMMUNITY_PARTNERS: Sponsor[] = [
  { id: 'cp-1', name: 'Developer DAO', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
  { id: 'cp-2', name: 'Design Hub', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
  { id: 'cp-3', name: 'Open Source Initiative', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
  { id: 'cp-4', name: 'Tech Makers', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
  { id: 'cp-5', name: 'Student Code', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
  { id: 'cp-6', name: 'AI Society', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=120&q=80' },
];

function MarqueeRow({ sponsors, direction, speed, title, color }: { sponsors: Sponsor[], direction: 'left' | 'right', speed: number, title: string, color: string }) {
  // Duplicate array to ensure seamless looping
  const marqueeItems = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div className="w-full mb-16 relative">
      <div className="flex items-center gap-4 mb-6 px-4 md:px-12">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/10" />
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color }}>{title}</h3>
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/10" />
      </div>

      <div className="relative w-full overflow-hidden flex items-center h-28 group">
        {/* Left/Right Fade Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#010008] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#010008] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <motion.div
          className="flex whitespace-nowrap gap-8 px-4 w-max"
          animate={{
            x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%']
          }}
          transition={{
            ease: 'linear',
            duration: speed,
            repeat: Infinity,
          }}
          // Optional: Pause on hover
          whileHover={{ animationPlayState: 'paused' }} 
        >
          {marqueeItems.map((sponsor, index) => (
            <div 
              key={`${sponsor.id}-${index}`}
              className="inline-flex shrink-0 items-center justify-center w-48 h-20 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-105 group/card cursor-pointer"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="max-w-[120px] max-h-[40px] object-contain opacity-50 grayscale transition-all duration-300 group-hover/card:opacity-100 group-hover/card:grayscale-0"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function SponsorsScene() {
  return (
    <section id="sponsors" className="relative py-24 overflow-hidden" style={{ background: '#010008' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="relative z-10 mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Our Partners in Chaos
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            PROUD{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              SPONSORS
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Youthfest 2026 is made possible by the generous support of industry leaders who believe in the power of student innovation.
          </p>
        </div>

        {/* Title Sponsor */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-20 px-4"
        >
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-white mb-6">Title Sponsor</h3>
          <div className="relative p-8 rounded-3xl border border-[var(--neon-cyan)]/30 bg-white/[0.02] backdrop-blur-xl group hover:border-[var(--neon-cyan)]/60 transition-colors duration-500 flex flex-col items-center">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-transparent rounded-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[var(--neon-cyan)]/20 blur-[40px] pointer-events-none rounded-full" />
            
            <img 
              src={TITLE_SPONSOR.logo} 
              alt={TITLE_SPONSOR.name} 
              className="relative z-10 max-w-[200px] h-auto object-contain opacity-80 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
            />
          </div>
        </motion.div>

        {/* Marquee Rows */}
        <div className="flex flex-col">
          <MarqueeRow 
            sponsors={GOLD_SPONSORS} 
            direction="left" 
            speed={40} 
            title="Gold Sponsors" 
            color="#ffd700" 
          />
          <MarqueeRow 
            sponsors={SILVER_SPONSORS} 
            direction="right" 
            speed={45} 
            title="Silver Sponsors" 
            color="#c0c0c0" 
          />
          <MarqueeRow 
            sponsors={COMMUNITY_PARTNERS} 
            direction="left" 
            speed={35} 
            title="Community Partners" 
            color="#ff006e" 
          />
        </div>

      </div>
    </section>
  );
}
