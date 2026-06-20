'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { useStore } from '../../lib/useStore';

interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Registration' | 'Events' | 'Logistics';
}

const FAQ_DATA: FAQItem[] = [
  { question: 'Who can participate in Youthfest 2026?', answer: 'Students currently enrolled in any recognized school, college, or university can participate. Please bring a valid student ID for verification on-site.', category: 'General' },
  { question: 'When and where is Youthfest 2026?', answer: 'August 12, 2026 at the Main Campus Arena Center. Gates open at 8:00 AM. Events run through the day with the main stage concert at night.', category: 'General' },
  { question: 'Is there an entry fee?', answer: 'General entry to the festival arena and pro shows requires a Festival Pass. Individual events and competitions have separate registration fees listed on their cards.', category: 'Registration' },
  { question: 'How do I register for events?', answer: 'Click "Register Now" on any event card. Create an account, select your events, and complete payment. You\'ll receive a QR code ticket on your dashboard instantly.', category: 'Registration' },
  { question: 'Can I register for multiple events?', answer: 'Yes! Register for as many events as you want. Just check the schedule to avoid timing conflicts between events.', category: 'Registration' },
  { question: 'Are laptops provided for hackathons?', answer: 'Participants must bring their own laptops and chargers. We provide high-speed campus Wi-Fi, power outlets, and refreshments in the hacking zone.', category: 'Events' },
  { question: 'Is food available on campus?', answer: 'Yes! We\'ll have food courts with diverse cuisines, snack stalls, and beverage counters throughout the venue. A food pass is included with premium registration.', category: 'Logistics' },
  { question: 'Is there parking available?', answer: 'Free parking is available at Gate 2 on a first-come first-served basis. We recommend carpooling or using public transport as spots fill quickly.', category: 'Logistics' },
];

export default function FAQScene() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const addPoints = useStore((state) => state.addPoints);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    addPoints(2, 'Reading FAQ details');
  };

  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const query = search.toLowerCase();
    return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
  });

  const categoryColors: Record<string, string> = {
    General: 'text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 border-[var(--neon-cyan)]/20',
    Registration: 'text-[var(--neon-violet)] bg-[var(--neon-violet)]/10 border-[var(--neon-violet)]/20',
    Events: 'text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10 border-[var(--neon-magenta)]/20',
    Logistics: 'text-[var(--neon-gold)] bg-[var(--neon-gold)]/10 border-[var(--neon-gold)]/20',
  };

  return (
    <section id="faq" className="relative py-24 overflow-hidden" style={{ background: '#011213' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-3"
          >
            <HelpCircle className="w-8 sm:w-10 h-8 sm:h-10 text-[var(--neon-cyan)]" />
            <span>
              FREQUENTLY ASKED{' '}
              <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
                QUESTIONS
              </span>
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Got questions? We&apos;ve got answers. Search or browse through categories.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-cyan)]/40 transition-colors"
          />
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filteredFAQs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  layout
                  className="glass-strong rounded-2xl overflow-hidden transition-colors hover:border-[var(--neon-cyan)]/15"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${categoryColors[faq.category]}`}>
                        {faq.category}
                      </span>
                      <h4 className="text-white text-sm sm:text-base font-bold leading-snug">{faq.question}</h4>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[var(--neon-cyan)] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-white/5 text-gray-400 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-[var(--neon-cyan)] mt-0.5 flex-shrink-0" />
                          <span>{faq.answer}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
