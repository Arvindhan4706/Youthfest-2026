'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, ArrowLeft, Loader2, Focus } from 'lucide-react';
import gsap from 'gsap';

interface ScanResult {
  status: 'idle' | 'scanning' | 'success' | 'error';
  message: string;
  ticketData?: {
    email: string;
    event: string;
  };
}

export default function ScannerPortal() {
  const [inputBuffer, setInputBuffer] = useState('');
  const [scanState, setScanState] = useState<ScanResult>({ status: 'idle', message: 'Awaiting Scanner Input...' });
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the hidden input focused so handheld scanners always type into it
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusInterval);
  }, []);

  const processScan = async (payload: string) => {
    setScanState({ status: 'scanning', message: 'Verifying Signature...' });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Decode Payload: It should be "email|eventTitle" from the QR Code
      if (!payload.includes('|')) {
        throw new Error('Invalid QR Signature Format.');
      }

      const [email, event] = payload.split('|');

      if (!email || !event) {
        throw new Error('Corrupted Ticket Data.');
      }

      // Success!
      setScanState({
        status: 'success',
        message: 'ATTENDANCE MARKED',
        ticketData: { email, event }
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setScanState({ status: 'idle', message: 'Awaiting Next Scan...' });
      }, 3000);

    } catch (err: any) {
      setScanState({
        status: 'error',
        message: err.message || 'TICKET REJECTED'
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setScanState({ status: 'idle', message: 'Awaiting Next Scan...' });
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputBuffer.trim().length > 0) {
        processScan(inputBuffer.trim());
      }
      setInputBuffer('');
    }
  };

  // Flash UI based on status
  useEffect(() => {
    if (scanState.status === 'success') {
      gsap.fromTo('.scanner-bg', 
        { backgroundColor: 'rgba(34,197,94,0.3)' }, 
        { backgroundColor: '#011213', duration: 1.5 }
      );
    } else if (scanState.status === 'error') {
      gsap.fromTo('.scanner-bg', 
        { backgroundColor: 'rgba(239,68,68,0.3)' }, 
        { backgroundColor: '#011213', duration: 1.5 }
      );
    }
  }, [scanState.status]);

  return (
    <main className="scanner-bg min-h-screen bg-[#011213] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Tech Grids */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hidden input to capture hardware scanner keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={inputBuffer}
        onChange={(e) => setInputBuffer(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute -top-[1000px] opacity-0"
        autoFocus
      />

      <div className="absolute top-8 left-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Exit Terminal
        </Link>
      </div>

      <div className="w-full max-w-2xl text-center z-10">
        <div className="mb-12">
          <h1 className="text-4xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            Organizer Terminal
          </h1>
          <p className="text-[var(--neon-cyan)] font-mono text-xs tracking-widest uppercase font-bold">
            Secure Entry Validation Node
          </p>
        </div>

        {/* Central Scanner Visual */}
        <div className="relative w-72 h-72 mx-auto mb-12">
          <AnimatePresence mode="wait">
            
            {scanState.status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 border-2 border-dashed border-[var(--neon-cyan)]/50 rounded-3xl flex flex-col items-center justify-center bg-[var(--neon-cyan)]/5 backdrop-blur-sm"
              >
                <ScanLine className="w-16 h-16 text-[var(--neon-cyan)] mb-4 animate-pulse" />
                <div className="w-full h-1 bg-[var(--neon-cyan)]/50 absolute top-0 left-0 animate-[scan_2s_ease-in-out_infinite]" />
              </motion.div>
            )}

            {scanState.status === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 border-2 border-[var(--neon-violet)] rounded-3xl flex flex-col items-center justify-center bg-[var(--neon-violet)]/10 backdrop-blur-sm shadow-[0_0_50px_rgba(139,92,246,0.3)]"
              >
                <Loader2 className="w-16 h-16 text-[var(--neon-violet)] animate-spin mb-4" />
              </motion.div>
            )}

            {scanState.status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 border-4 border-green-500 rounded-3xl flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm shadow-[0_0_50px_rgba(34,197,94,0.4)]"
              >
                <CheckCircle2 className="w-20 h-20 text-green-400 mb-4" />
              </motion.div>
            )}

            {scanState.status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 border-4 border-red-500 rounded-3xl flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm shadow-[0_0_50px_rgba(239,68,68,0.4)]"
              >
                <XCircle className="w-20 h-20 text-red-400 mb-4" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Status Message */}
        <div className="min-h-[100px]">
          <motion.h2 
            key={scanState.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-bold uppercase tracking-wider mb-2 font-[var(--font-orbitron)] ${
              scanState.status === 'success' ? 'text-green-400' : 
              scanState.status === 'error' ? 'text-red-400' : 
              'text-white'
            }`}
          >
            {scanState.message}
          </motion.h2>

          {scanState.status === 'success' && scanState.ticketData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-mono text-sm"
            >
              <p className="mb-1 text-[var(--neon-cyan)]">{scanState.ticketData.event}</p>
              <p>{scanState.ticketData.email}</p>
            </motion.div>
          )}

          {scanState.status === 'idle' && (
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2">
              <Focus className="w-4 h-4" /> Target scanner at QR Code
            </p>
          )}
        </div>

        {/* Manual Fallback Input (For Desktop Demo) */}
        <div className="mt-16 pt-8 border-t border-white/10 max-w-sm mx-auto">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">Manual Override</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Paste Ticket Payload here..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  processScan(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(280px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
