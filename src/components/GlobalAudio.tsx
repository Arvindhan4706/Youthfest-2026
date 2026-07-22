'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '../lib/useStore';

export default function GlobalAudio() {
  const isMuted = useStore((state) => state.isMuted);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/intro-bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4; // Slightly lower volume for continuous BGM
    }

    if (!isMuted) {
      audioRef.current.play().catch(err => {
        console.warn("Global audio blocked:", err);
      });
    } else {
      audioRef.current.pause();
    }
    
    // Cleanup on unmount
    return () => {
      // Don't actually destroy on re-render, only on full unmount if needed
    };
  }, [isMuted]);

  return null;
}
