'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { useStore } from '../../lib/useStore';

interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Registration' | 'Events';
}

const FAQ_DATA: FAQItem[] = [
  { question: 'Who can participate in Yuvenza 2026?', answer: 'Students currently enrolled in any recognized high school, college, or university can participate. Please bring a valid student ID for verification on-site.', category: 'General' },
  { question: 'Is there an entry fee to visit the campus?', answer: 'Entry to the festival arena and pro shows requires a General Entry Pass. Sub-events and contests have specific registration fees listed under their cards.', category: 'General' },
  { question: 'How do I obtain my registration ticket?', answer: 'Once registered, navigate to your User Dashboard. A custom QR Code ticket is generated automatically which you can download or screenshot.', category: 'Registration' },
  { question: 'Can I register for multiple technical and cultural events?', answer: 'Yes! Make sure to verify event schedule times in the Timeline section to avoid overlaps between day events.', category: 'Registration' },
  { question: 'What is the prize structure for competitions?', answer: 'Signature events feature individual cash prize pools of up to ₹50,000. Gold, silver, and certification badges are awarded on completion.', category: 'Events' },
  { question: 'Are laptops provided for the Hackathon?', answer: 'Participants must bring their own laptops and chargers. High-speed campus Wi-Fi and power nodes will be provided in the hacking zones.', category: 'Events' }
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

  return (
    <section id="faq" className="relative py-24 bg-[#070024] px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 sm:w-12 h-8 sm:h-12 text-purple-400" />
            <span>FREQUENTLY ASKED <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">QUESTIONS</span></span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Got questions? We have answers. Search through categories to get instant support details.
          </p>
        </div>

        {/* Live Search Box */}
        <div className="relative mb-12 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {filteredFAQs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  layout
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg transition-colors hover:border-purple-500/20"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                        {faq.category}
                      </span>
                      <h4 className="text-white text-sm sm:text-base font-bold leading-snug">{faq.question}</h4>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
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
                          <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
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
