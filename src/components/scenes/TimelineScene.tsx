'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, MapPin, Zap, Flag, PartyPopper } from 'lucide-react';

const SCHEDULE = [
  {
    day: 'Day 1',
    date: 'March 15, 2026',
    title: 'The Inception',
    events: [
      { time: '09:00 AM', title: 'Opening Ceremony', venue: 'Main Auditorium', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '11:00 AM', title: 'Genesis Hackathon Begins', venue: 'Innovation Center', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '02:00 PM', title: 'Speaker Series: Future Tech', venue: 'Seminar Hall A', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-violet)' },
      { time: '06:00 PM', title: 'Acoustic Soul', venue: 'Open Air Theatre', icon: <PartyPopper className="w-4 h-4" />, color: 'var(--neon-lime)' },
    ]
  },
  {
    day: 'Day 2',
    date: 'March 16, 2026',
    title: 'The Core',
    events: [
      { time: '09:00 AM', title: 'Treasure Hunt', venue: 'Campus Wide', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '11:00 AM', title: 'Genesis Hackathon Submissions', venue: 'Innovation Center', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '03:00 PM', title: 'Valorant Showdown Finals', venue: 'E-Sports Arena', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-violet)' },
      { time: '07:00 PM', title: 'Beat Drop Dance Battle', venue: 'Main Stage', icon: <PartyPopper className="w-4 h-4" />, color: 'var(--neon-lime)' },
    ]
  },
  {
    day: 'Day 3',
    date: 'March 17, 2026',
    title: 'The Climax',
    events: [
      { time: '10:00 AM', title: 'FinTech Sprint', venue: 'Business Center', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '02:00 PM', title: 'Robo Wars Finals', venue: 'Main Ground Arena', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '05:00 PM', title: 'Closing Ceremony & Awards', venue: 'Main Auditorium', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-violet)' },
      { time: '08:00 PM', title: 'EDM Night: DJ Snake', venue: 'Main Stage', icon: <PartyPopper className="w-4 h-4" />, color: 'var(--neon-lime)' },
    ]
  }
];

export default function TimelineScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="schedule" className="relative py-24 overflow-hidden" style={{ background: '#010008' }}>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--neon-violet)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--neon-cyan)]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-violet)]/30 bg-[var(--neon-violet)]/5 text-xs text-[var(--neon-violet)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            <Clock className="w-3.5 h-3.5" />
            3 Days of Chaos
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-4"
          >
            EVENT{' '}
            <span className="bg-gradient-to-r from-[var(--neon-violet)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
              TIMELINE
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Mark your calendars. This is the exact blueprint of when and where history will be made.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pt-10 pb-20">
          {/* Static Background Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 rounded-full" />
          
          {/* Animated Glowing Progress Line */}
          <motion.div 
            className="absolute left-[20px] md:left-1/2 top-0 w-[4px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] -translate-x-1/2 rounded-full shadow-[0_0_15px_var(--neon-cyan)] z-0"
            style={{ height: lineHeight, opacity: glowOpacity }}
          />

          <div className="flex flex-col gap-16 md:gap-24 relative z-10">
            {SCHEDULE.map((dayData, dayIdx) => (
              <div key={dayData.day} className="relative">
                {/* Day Header */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="sticky top-24 z-20 mx-auto w-max bg-[#030014] border border-white/20 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] mb-10 flex flex-col items-center"
                >
                  <span className="text-[var(--neon-cyan)] font-bold text-lg">{dayData.day}</span>
                  <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">{dayData.date}</span>
                </motion.div>

                {/* Events for the Day */}
                <div className="flex flex-col gap-8 md:gap-12">
                  {dayData.events.map((event, eventIdx) => {
                    const isLeft = eventIdx % 2 === 0;

                    return (
                      <div key={event.title} className="relative flex items-center md:justify-center w-full group">
                        
                        {/* Center Node / Dot */}
                        <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#030014] bg-white transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_15px_white] z-20" />

                        {/* Content Card Wrapper */}
                        <motion.div
                          initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
                          whileInView={{ opacity: 1, x: 0, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`w-full pl-[50px] md:pl-0 md:w-1/2 flex ${isLeft ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}
                        >
                          {/* The Card */}
                          <div 
                            className="w-full max-w-md p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 relative overflow-hidden"
                            style={{ boxShadow: `inset 0 0 20px ${event.color}05` }}
                          >
                            {/* Hover accent line */}
                            <div 
                              className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ background: `linear-gradient(90deg, transparent, ${event.color}, transparent)` }}
                            />

                            <div className="flex items-center gap-3 mb-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10"
                                style={{ color: event.color }}
                              >
                                {event.icon}
                              </div>
                              <span className="text-sm font-bold text-white tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/5">
                                {event.time}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--neon-cyan)] transition-colors">
                              {event.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              {event.venue}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
