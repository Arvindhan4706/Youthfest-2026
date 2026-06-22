'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, MapPin, Zap, Flag, PartyPopper } from 'lucide-react';

const SCHEDULE = [
  {
    day: 'The Main Event',
    date: 'August 12, 2026',
    title: 'Youthfest 2026 Agenda',
    events: [
      { time: '09:00 AM', title: 'Opening Ceremony', venue: 'Main Auditorium', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '09:00 AM', title: 'Treasure Hunt', venue: 'Campus Wide', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '10:00 AM', title: 'FinTech Sprint', venue: 'Business Center', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-violet)' },
      { time: '11:00 AM', title: 'Genesis Hackathon Begins', venue: 'Innovation Center', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-lime)' },
      { time: '11:00 AM', title: 'Genesis Hackathon Submissions', venue: 'Innovation Center', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '02:00 PM', title: 'Speaker Series: Future Tech', venue: 'Seminar Hall A', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '02:00 PM', title: 'Robo Wars Finals', venue: 'Main Ground Arena', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-violet)' },
      { time: '03:00 PM', title: 'Valorant Showdown Finals', venue: 'E-Sports Arena', icon: <PartyPopper className="w-4 h-4" />, color: 'var(--neon-lime)' },
      { time: '05:00 PM', title: 'Closing Ceremony & Awards', venue: 'Main Auditorium', icon: <Flag className="w-4 h-4" />, color: 'var(--neon-cyan)' },
      { time: '06:00 PM', title: 'Acoustic Soul', venue: 'Open Air Theatre', icon: <Clock className="w-4 h-4" />, color: 'var(--neon-magenta)' },
      { time: '07:00 PM', title: 'Beat Drop Dance Battle', venue: 'Main Stage', icon: <Zap className="w-4 h-4" />, color: 'var(--neon-violet)' },
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
            1 Epic Day of Chaos
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
        <div className="relative pt-10 pb-20 max-w-4xl mx-auto">
          {/* Static Background Line */}
          <div className="absolute left-[30px] sm:left-[60px] top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 rounded-full" />
          
          {/* Animated Glowing Progress Line */}
          <motion.div 
            className="absolute left-[30px] sm:left-[60px] top-0 w-[4px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] -translate-x-1/2 rounded-full shadow-[0_0_15px_var(--neon-cyan)] z-0"
            style={{ height: lineHeight, opacity: glowOpacity }}
          />

          <div className="flex flex-col gap-10 sm:gap-14 relative z-10">
            {SCHEDULE.map((dayData, dayIdx) => (
              <div key={dayData.day} className="relative">
                {/* Day Header */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="sticky top-24 z-20 ml-[70px] sm:ml-[110px] w-max bg-[#030014] border border-white/20 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] mb-12 flex flex-col items-start"
                >
                  <span className="text-[var(--neon-cyan)] font-bold text-lg">{dayData.day}</span>
                  <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">{dayData.date}</span>
                </motion.div>

                {/* Events for the Day */}
                <div className="flex flex-col gap-8 sm:gap-10">
                  {dayData.events.map((event, eventIdx) => {
                    return (
                      <div key={eventIdx} className="relative flex items-center w-full group">
                        
                        {/* Center Node / Dot */}
                        <div className="absolute left-[30px] sm:left-[60px] -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#030014] bg-white transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_15px_white] z-20" />

                        {/* Content Card Wrapper */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full pl-[70px] sm:pl-[110px] flex justify-start"
                        >
                          {/* The Card */}
                          <div 
                            className="w-full p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-2xl relative overflow-hidden group-hover:-translate-y-1"
                            style={{ boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 20px ${event.color}05` }}
                          >
                            {/* Hover accent line */}
                            <div 
                              className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `linear-gradient(180deg, transparent, ${event.color}, transparent)` }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner"
                                  style={{ color: event.color }}
                                >
                                  {event.icon}
                                </div>
                                <span className="text-sm sm:text-base font-bold text-white tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/5 shadow-sm">
                                  {event.time}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 transition-colors duration-300" style={{ textShadow: `0 0 20px ${event.color}00` }}>
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
