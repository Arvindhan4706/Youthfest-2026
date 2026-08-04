'use client';
import React from 'react';
import Image from 'next/image';
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

const PREVIOUS_SPONSORS: Sponsor[] = [
  { id: 'ps-1', name: 'Rotary Club', logo: '/rotary.png' },
  { id: 'ps-2', name: 'Red Bull', logo: '/redbull.jpg' },
  { id: 'ps-3', name: 'Toni & Guy', logo: '/toni.png' },
];
function MarqueeRow({ sponsors, direction, speed, title, color, keepColor = false }: { sponsors: Sponsor[], direction: 'left' | 'right', speed: number, title: string, color: string, keepColor?: boolean }) {
 // Duplicate array to ensure seamless looping
 const marqueeItems = [...sponsors, ...sponsors, ...sponsors];
 return (
 <div className="w-full mb-16 relative">
 <div className="flex items-center gap-4 mb-6 px-4 md:px-12">
 <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/10" />
 <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color }}>{title}</h3>
 <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/10" />
 </div>
 <div className="relative w-full overflow-hidden flex items-center h-28 sm:h-32 group">
 {/* Left/Right Fade Masks */}
 <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#010008] to-transparent z-10 pointer-events-none" />
 <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#010008] to-transparent z-10 pointer-events-none" />
 {/* Scrolling Container */}
 <motion.div
 className="flex whitespace-nowrap gap-4 sm:gap-8 px-4 w-max"
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
  className="inline-flex shrink-0 items-center justify-center w-44 sm:w-56 h-20 sm:h-24 rounded-2xl bg-white/[0.02] border border-white/[0.06] transition-all duration-400 hover:bg-white/[0.07] hover:border-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.08)] group/card cursor-pointer relative"
  aria-label={`Sponsor: ${sponsor.name}`}
  role="img"
  >
  <Image 
  src={sponsor.logo} 
  alt={sponsor.name}
  fill
  sizes="(max-width: 768px) 176px, 224px"
  className={`p-3 sm:p-5 object-contain transition-all duration-400 group-hover/card:opacity-100 group-hover/card:scale-110 ${keepColor ? 'opacity-100' : 'opacity-60 grayscale group-hover/card:grayscale-0'}`}
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
 <section id="sponsors" className="relative section-padding overflow-hidden bg-[#010305]" aria-labelledby="sponsors-heading">
 {/* Background */}
 <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--neon-cyan)]/[0.04] rounded-full blur-[150px] pointer-events-none" />
 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--neon-violet)]/[0.04] rounded-full blur-[150px] pointer-events-none" />
 <div className="relative z-10 container-responsive">
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
  id="sponsors-heading"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.1 }}
  className="font-[var(--font-heading-main)] font-black text-white uppercase mb-4"
  style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
  >
  PROUD{' '}
  <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
  SPONSORS
  </span>
  </motion.h2>
 <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
 Yuvenza is made possible by the generous support of industry leaders who believe in the power of student innovation.
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
 <div className="relative p-8 rounded-[20px] border border-[var(--neon-cyan)]/30 bg-white/[0.02] group hover:border-[var(--neon-cyan)]/60 transition-colors duration-500 flex flex-col items-center min-h-[200px] justify-center">
 {/* Glow effect */}
 <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-transparent rounded-[20px] pointer-events-none" />
 <div className="relative w-[200px] h-[100px]">
   <Image 
   src={TITLE_SPONSOR.logo} 
   alt={TITLE_SPONSOR.name} 
   fill
   sizes="200px"
   className="object-contain opacity-80 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
   />
 </div>
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
 
 {/* Previous Sponsors Section */}
 <div className="mt-20 sm:mt-32 pt-12 sm:pt-20 border-t border-white/10">
   <div className="text-center mb-16 px-4">
     <motion.h3
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       className="text-3xl sm:text-4xl font-[var(--font-heading-main)] font-bold text-white uppercase tracking-wider mb-4"
     >
       PREVIOUS{' '}
       <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
         SPONSORS
       </span>
     </motion.h3>
     <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
       Honoring the partners who supported our journey in previous editions.
     </p>
   </div>
   <MarqueeRow 
     sponsors={PREVIOUS_SPONSORS} 
     direction="right" 
     speed={40} 
     title="Past Partners" 
     color="#888888" 
     keepColor={true}
   />
 </div>
 </div>
 </div>
 </section>
 );
}

