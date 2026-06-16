'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { ShieldAlert, Award, Info } from 'lucide-react';

const SponsorCube3D = dynamic(() => import('./SponsorCube3D'), { ssr: false });
import { SponsorNode } from './SponsorCube3D';

export default function SponsorsScene() {
  const [activeSponsor, setActiveSponsor] = useState<SponsorNode | null>(null);
  const addPoints = useStore((state) => state.addPoints);

  const handleHover = (sponsor: SponsorNode | null) => {
    setActiveSponsor(sponsor);
    if (sponsor) {
      addPoints(5, `Learning about partner: ${sponsor.name}`);
    }
  };

  return (
    <section id="sponsors" className="relative py-24 bg-[#070024] px-4 border-t border-white/5 overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mb-4">
            OUR BRAND <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PARTNERS</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Interactive Sponsor Cubes. Hover over the spinning 3D blocks to reveal sponsorship tiers and collaborative details.
          </p>
        </div>

        {/* Main interactive area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-[500px]">
          
          {/* Left: 3D Cubes */}
          <div className="lg:col-span-8 h-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <SponsorCube3D onHoverSponsor={handleHover} />
          </div>

          {/* Right: Info card overlay */}
          <div className="lg:col-span-4 h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeSponsor ? (
                <motion.div
                  key={activeSponsor.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative"
                >
                  <div className="absolute top-4 right-4 text-purple-400">
                    <Info className="w-5 h-5 animate-pulse" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 px-2.5 py-1 rounded bg-emerald-400/10 border border-emerald-400/20">
                    {activeSponsor.tier}
                  </span>

                  <h3 className="text-3xl font-black text-white mt-4 mb-2 tracking-wide">
                    {activeSponsor.name}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeSponsor.description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center flex flex-col items-center justify-center h-full"
                >
                  <div className="bg-purple-500/10 p-3 rounded-full border border-purple-500/20 text-purple-400 mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Hover Sponsor Cubes</h4>
                  <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                    Interact directly with the 3D rotating items on the left to learn more about the companies supporting Yuvenza 2026.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
