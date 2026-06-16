'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../lib/useStore';

gsap.registerPlugin(ScrollTrigger);

interface Caption {
  time: number;
  text: string;
}

const TRAILER_CAPTIONS: Caption[] = [
  { time: 0, text: 'In a world of infinite possibilities...' },
  { time: 3, text: 'Culture collides with digital innovation.' },
  { time: 6, text: 'Step beyond the boundaries of your reality.' },
  { time: 10, text: 'Dream. Create. Celebrate.' },
  { time: 14, text: 'YUVENZA 2026. Are you ready?' },
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

    // Pin section and scale video from initial card size to full width
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        onEnter: () => {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        },
        onLeave: () => {
          video.pause();
          setIsPlaying(false);
        },
        onEnterBack: () => {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        },
        onLeaveBack: () => {
          video.pause();
          setIsPlaying(false);
        }
      }
    });

    tl.fromTo(wrapper, 
      { width: '60%', borderRadius: '24px', scale: 0.9 },
      { width: '100%', borderRadius: '0px', scale: 1, ease: 'none' }
    );

    // Track captions based on current video time
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentCaption = TRAILER_CAPTIONS.reduce((acc, cap) => {
        if (currentTime >= cap.time) {
          return cap.text;
        }
        return acc;
      }, '');
      setActiveCaption(currentCaption);

      if (currentTime > 5 && currentTime < 5.2) {
        addPoints(5, 'Watching signature event trailer');
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
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
      ref={containerRef}
      id="trailer" 
      className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center border-t border-white/5"
    >
      {/* Background Dim & Blur Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none z-0" />

      {/* Video Container Wrapper */}
      <div 
        ref={videoWrapperRef}
        className="relative aspect-video max-h-[85vh] overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.2)] z-10 flex items-center justify-center bg-zinc-950"
      >
        <video
          ref={videoRef}
          src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-4413-large.mp4"
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />

        {/* Cinematic Black Bars (Letterbox) */}
        <div className="absolute top-0 left-0 w-full h-[8%] bg-black z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[8%] bg-black z-20 pointer-events-none" />

        {/* Synced Subtitles Overlay */}
        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center w-[85%] z-20 pointer-events-none">
          <p className="text-white text-base sm:text-xl font-bold tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] min-h-[30px]">
            {activeCaption}
          </p>
        </div>

        {/* Video Player Controls */}
        <div className="absolute bottom-[12%] right-6 z-30 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
      
    </section>
  );
}
