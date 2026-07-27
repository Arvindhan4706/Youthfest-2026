'use client';
import React from 'react';
import Navbar from '../../components/Navbar';
import FooterScene from '../../components/scenes/FooterScene';

export default function HelpSupportPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <Navbar />
      <div className="container-responsive pt-32 pb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-black font-[var(--font-heading-main)] text-[var(--neon-cyan)] uppercase tracking-wider mb-6">
          Help & Support
        </h1>
        <p className="text-gray-400 text-lg">
          This page is currently under construction. Please check back later.
        </p>
      </div>
      <FooterScene />
    </main>
  );
}
