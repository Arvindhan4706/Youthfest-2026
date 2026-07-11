'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';
import { useStore } from '../../lib/useStore';

interface Caption {
  time: number;
  text: string;
}

const TRAILER_CAPTIONS: Caption[] = [
  { time: 0, text: '5000 students. One legendary night.' },
  { time: 3, text: 'Technology. Creativity. Gaming. Culture.' },
  { time: 6, text: 'The ultimate showcase of talent.' },
  { time: 10, text: 'The biggest stage awaits.' },
  { time: 14, text: 'YOUTHFEST 2026. Are you in?' },
];

export default function TrailerScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCaption, setActiveCaption] = useState('');

  const addPoints = useStore((state) => state.addPoints);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = videoWrapperRef.current;
    const video = videoRef.current;

    if (!container || !wrapper || !video) return;

    // Intersection observer for play/pause
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    if (wrapper) {
      observer.observe(wrapper);
    }

    // Track captions
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentCaption = TRAILER_CAPTIONS.reduce((acc, cap) => {
        if (currentTime >= cap.time) return cap.text;
        return acc;
      }, '');
      setActiveCaption(currentCaption);

      if (currentTime > 5 && currentTime < 5.2) {
        addPoints(5, 'Watching official event trailer');
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (wrapper) observer.unobserve(wrapper);
    };
  }, [addPoints]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      id="trailer"
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-12 px-4"
      style={{ background: '#010008' }}
    >
      <div className="w-full flex flex-col items-center justify-center max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
            <Film className="w-3 h-3 text-[var(--neon-magenta)]" />
            Official Festival Trailer
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-[var(--font-orbitron)] uppercase tracking-wide">
            Witness The <span className="text-[var(--neon-cyan)]">Glory</span>
          </h2>
        </div>

        {/* Square Video Container - scaled to fit viewport height and reduced size */}
        <div className="w-full max-w-[85vw] md:max-w-[65vw] lg:w-[45vh] lg:max-w-[500px] aspect-square border border-white/10 p-1 bg-black rounded-[20px] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div
            ref={videoWrapperRef}
            className="relative w-full h-full rounded-[16px] overflow-hidden z-10 flex items-center justify-center bg-[#010008]"
            style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.15), 0 0 80px rgba(0, 240, 255, 0.1)' }}
          >
            {/* Edge fade overlay to seamlessly blend video edges into background */}
            <div className="absolute inset-0 z-15 pointer-events-none rounded-[16px] shadow-[inset_0_0_80px_40px_#010008]" />

            <video
              ref={videoRef}
              src="/trailer.mp4"
              className="w-full h-full object-contain"
              loop
              muted={isMuted}
              playsInline
            />

            {/* Synced captions */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center w-[90%] z-20 pointer-events-none">
              <p
                className="text-white text-sm sm:text-base font-[var(--font-orbitron)] font-bold tracking-wide uppercase min-h-[24px]"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,240,255,0.4)' }}
              >
                {activeCaption}
              </p>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
