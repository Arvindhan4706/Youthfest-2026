'use client';

import React from 'react';

/**
 * LightParticles — CSS-only particle effect that replaces the heavy Three.js WebGL canvas.
 * The original WebGL implementation (5000 particles + Three.js + React Three Fiber)
 * was consuming 200–400MB of GPU/CPU memory, causing out-of-memory crashes on iOS and low-RAM devices.
 * This version uses pure CSS animations with zero JS overhead.
 */
export default function ParticleUniverse() {
  // Fixed seed particle positions for SSR consistency
  const particles = [
    { x: 15, y: 20, size: 2, dur: 8, delay: 0, color: '#00E5FF' },
    { x: 85, y: 15, size: 1.5, dur: 12, delay: 2, color: '#6C63FF' },
    { x: 45, y: 80, size: 2.5, dur: 10, delay: 1, color: '#8B5CF6' },
    { x: 72, y: 55, size: 1, dur: 14, delay: 3, color: '#00E5FF' },
    { x: 28, y: 65, size: 2, dur: 9, delay: 0.5, color: '#6C63FF' },
    { x: 60, y: 30, size: 1.5, dur: 11, delay: 4, color: '#00E5FF' },
    { x: 10, y: 50, size: 1, dur: 13, delay: 1.5, color: '#8B5CF6' },
    { x: 90, y: 70, size: 2, dur: 7, delay: 2.5, color: '#6C63FF' },
    { x: 35, y: 40, size: 1.5, dur: 16, delay: 0.8, color: '#00E5FF' },
    { x: 75, y: 85, size: 1, dur: 10, delay: 3.5, color: '#8B5CF6' },
    { x: 55, y: 10, size: 2, dur: 12, delay: 1.2, color: '#6C63FF' },
    { x: 20, y: 90, size: 1.5, dur: 8, delay: 4.5, color: '#00E5FF' },
    { x: 50, y: 50, size: 3, dur: 18, delay: 0.3, color: '#8B5CF6' },
    { x: 80, y: 35, size: 1, dur: 9, delay: 5, color: '#00E5FF' },
    { x: 5, y: 75, size: 2, dur: 11, delay: 2.2, color: '#6C63FF' },
    { x: 95, y: 25, size: 1.5, dur: 14, delay: 1.8, color: '#8B5CF6' },
    { x: 40, y: 60, size: 1, dur: 7, delay: 3.8, color: '#00E5FF' },
    { x: 65, y: 45, size: 2.5, dur: 15, delay: 0.6, color: '#6C63FF' },
    { x: 25, y: 15, size: 1, dur: 10, delay: 4.2, color: '#8B5CF6' },
    { x: 70, y: 75, size: 2, dur: 13, delay: 1.4, color: '#00E5FF' },
    { x: 38, y: 28, size: 1.5, dur: 11, delay: 2.8, color: '#6C63FF' },
    { x: 82, y: 60, size: 1, dur: 8, delay: 0.2, color: '#8B5CF6' },
    { x: 12, y: 38, size: 2, dur: 16, delay: 5.5, color: '#00E5FF' },
    { x: 58, y: 88, size: 1.5, dur: 9, delay: 3.2, color: '#6C63FF' },
    { x: 92, y: 48, size: 1, dur: 12, delay: 1.6, color: '#8B5CF6' },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-70">
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
        }
        @keyframes particle-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
      `}</style>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-twinkle ${p.dur}s ${p.delay}s ease-in-out infinite, particle-float ${p.dur * 1.3}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
