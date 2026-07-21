'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
const Twitter = ({ className }: { className?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Instagram = ({ className }: { className?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = ({ className }: { className?: string }) => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
interface Guest {
 id: string;
 name: string;
 title: string;
 industry: string;
 bio: string;
 color: string;
 image: string;
 socials: {
 twitter?: string;
 instagram?: string;
 linkedin?: string;
 };
}
const CHIEF_GUESTS: Guest[] = [
 {
 id: 'cg-1',
 name: 'Thalapathy Vijay',
 title: 'Superstar & Philanthropist',
 industry: 'Tamil Cinema',
 bio: 'One of the highest-paid actors in India, known for his massive fan following and blockbuster hits. Making a very special appearance at Youthfest 2026.',
 color: '#00f0ff',
 image: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Nadigar_Sangam_Protest.jpg',
 socials: { twitter: '#', instagram: '#' }
 },
 {
 id: 'cg-2',
 name: 'Suriya Sivakumar',
 title: 'Actor & Producer',
 industry: 'Guest of Honor',
 bio: 'Acclaimed actor and founder of Agaram Foundation. An inspiration to millions of students across Tamil Nadu.',
 color: '#fbbf24',
 image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Suriya_at_the_28th_Critics_Choice_Awards.jpg',
 socials: { twitter: '#', instagram: '#' }
 },
 {
 id: 'cg-3',
 name: 'Sivakarthikeyan',
 title: 'Actor & Entertainer',
 industry: 'Youth Icon',
 bio: 'From television anchor to leading star, his journey is a testament to hard work. Join us as he shares his inspiring story.',
 color: '#ff006e',
 image: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Sivakarthikeyan_at_Maan_Karate_Success_Meet_%28cropped%29.jpg',
 socials: { twitter: '#', instagram: '#' }
 },
];
function GuestCard({ guest, index }: { guest: Guest; index: number }) {
 const [hovered, setHovered] = useState(false);
 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: index * 0.15 }}
 onMouseEnter={() => setHovered(true)}
 onMouseLeave={() => setHovered(false)}
 className="relative group rounded-3xl glass-strong p-6 text-center hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden"
 style={{ boxShadow: hovered ? `0 0 40px ${guest.color}15` : undefined }}
 >
 {/* Corner glow */}
 <div
 className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20 sm:opacity-0 group-hover:opacity-30 transition-opacity"
 style={{ background: guest.color }}
 />
 {/* Avatar circle */}
 <div className="mx-auto mb-5 relative w-24 h-24 sm:w-28 sm:h-28">
 <div
 className="relative w-full h-full rounded-full overflow-hidden transition-all duration-300"
 style={{
 border: `2px solid ${guest.color}40`,
 boxShadow: hovered ? `0 0 30px ${guest.color}30` : `0 0 15px ${guest.color}10`,
 }}
 >
 <Image src={guest.image} alt={guest.name} fill sizes="(max-width: 640px) 96px, 112px" className="object-cover opacity-100 sm:opacity-80 group-hover:opacity-100 transition-opacity" />
 </div>
 {/* Online dot */}
 <div
 className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#000000]"
 style={{ background: guest.color }}
 />
 </div>
 <h3 className="text-white font-bold text-lg sm:text-xl mb-1">{guest.name}</h3>
 <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-widest">{guest.industry}</p>
 <p className="text-sm font-semibold mb-4 sm:mb-2" style={{ color: guest.color }}>{guest.title}</p>
 {/* Bio and Socials (Always visible on mobile, hover on desktop) */}
 <div className="max-h-[500px] sm:max-h-0 sm:group-hover:max-h-[500px] sm:opacity-0 sm:group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-in-out">
 <div className="pt-2 sm:pt-4 border-t border-white/10 mt-2">
 <p className="text-sm text-gray-400 leading-relaxed mb-4">
 {guest.bio}
 </p>
 <div className="flex items-center justify-center gap-4">
 {guest.socials.twitter && (
 <a href={guest.socials.twitter} aria-label={`${guest.name} on Twitter`} className="text-gray-500 hover:text-[var(--neon-cyan)] transition-colors">
 <Twitter className="w-5 h-5" />
 </a>
 )}
 {guest.socials.instagram && (
 <a href={guest.socials.instagram} aria-label={`${guest.name} on Instagram`} className="text-gray-500 hover:text-[var(--neon-magenta)] transition-colors">
 <Instagram className="w-5 h-5" />
 </a>
 )}
 {guest.socials.linkedin && (
 <a href={guest.socials.linkedin} aria-label={`${guest.name} on LinkedIn`} className="text-gray-500 hover:text-[var(--neon-violet)] transition-colors">
 <Linkedin className="w-5 h-5" />
 </a>
 )}
 </div>
 </div>
 </div>
 {/* Bottom accent */}
 <div
 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-2/3 transition-all duration-500"
 />
 </motion.div>
 );
}
export default function SpeakersScene() {
 return (
 <section id="speakers" className="relative py-24 overflow-hidden" aria-labelledby="speakers-heading">
 {/* Background */}
 <div className="relative z-10 max-w-6xl mx-auto px-4">
 {/* Header */}
 <div className="text-center mb-14">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 font-semibold uppercase tracking-widest mb-5"
 >
 Star-Studded Appearances
 </motion.div>
 <motion.h2
 id="speakers-heading"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-3xl sm:text-5xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
 >
 CHIEF{' '}
 <span className="bg-gradient-to-r from-[var(--neon-gold)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
 GUESTS
 </span>
 </motion.h2>
 <p className="text-gray-400 text-sm max-w-lg mx-auto">
 Experience the electrifying presence of Tamil Cinema's biggest superstars lighting up the main stage at Youthfest 2026.
 </p>
 </div>
 {/* Guests grid */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
 {CHIEF_GUESTS.map((guest, idx) => (
 <GuestCard key={guest.id} guest={guest} index={idx} />
 ))}
 </div>
 </div>
 </section>
 );
}
