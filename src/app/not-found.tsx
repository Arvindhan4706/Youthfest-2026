import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#011213] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--neon-cyan)]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-violet)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center glass-strong p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)] max-w-lg w-full">
        <Zap className="w-16 h-16 text-[var(--neon-cyan)] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        <h1 className="text-8xl font-[var(--font-orbitron)] font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-violet)] to-[var(--neon-magenta)] mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-6">Sector Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-mono">
          The requested trajectory leads to an uncharted sector of the Youthfest 2026 mainframe. Please return to established coordinates.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--neon-cyan)] text-[#011213] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
