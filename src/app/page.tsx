'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import LazyScene from '../components/LazyScene';

// Dynamic imports of scenes for performance optimization and SSR safety
const HeroScene = dynamic(() => import('../components/scenes/HeroScene'), { ssr: false });
const StatsBarScene = dynamic(() => import('../components/scenes/StatsBarScene'), { ssr: false });
const PrizePoolScene = dynamic(() => import('../components/scenes/PrizePoolScene'), { ssr: false });
const MemoriesScene = dynamic(() => import('../components/scenes/MemoriesScene'), { ssr: false });
const SpeakersScene = dynamic(() => import('../components/scenes/SpeakersScene'), { ssr: false });
const CommitteeScene = dynamic(() => import('../components/scenes/CommitteeScene'), { ssr: false });
const SponsorsScene = dynamic(() => import('../components/scenes/SponsorsScene'), { ssr: false });
const CountdownCTAScene = dynamic(() => import('../components/scenes/CountdownCTAScene'), { ssr: false });
const FooterScene = dynamic(() => import('../components/scenes/FooterScene'), { ssr: false });
const BackToTop = dynamic(() => import('../components/BackToTop'), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="relative w-full min-h-screen pb-16 md:pb-0 transition-colors duration-1000 bg-black text-white">
        {/* Hero loads immediately — it's above the fold */}
        <HeroScene />
        
        {/* All sections below hero are lazy-mounted to save iOS memory */}
        <LazyScene placeholderHeight={600}>
          <StatsBarScene />
        </LazyScene>

        {/* MemoriesScene has video — load late */}
        <LazyScene placeholderHeight={600} rootMargin="200px">
          <MemoriesScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <SpeakersScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <CommitteeScene />
        </LazyScene>

        <LazyScene placeholderHeight={600}>
          <PrizePoolScene />
        </LazyScene>

        <LazyScene placeholderHeight={400}>
          <SponsorsScene />
        </LazyScene>

        <LazyScene placeholderHeight={500}>
          <CountdownCTAScene />
        </LazyScene>



        <LazyScene placeholderHeight={500}>
          <FooterScene />
        </LazyScene>

        <BackToTop />
      </main>
    </>
  );
}

