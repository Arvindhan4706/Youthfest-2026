'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry here
    console.error('Youthfest 2026 App Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#011213] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center glass-strong p-12 rounded-3xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)] max-w-lg w-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        <h1 className="text-4xl font-[var(--font-orbitron)] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4 uppercase">
          System Failure
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-mono">
          A critical error occurred in the mainframe. Our engineering team has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider rounded-xl hover:bg-red-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Connection
          </button>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 font-bold uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all"
          >
            Return to Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
