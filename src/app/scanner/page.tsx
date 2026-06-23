'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, CheckCircle2, XCircle, ArrowLeft, Loader2, Focus, Camera } from 'lucide-react';
import gsap from 'gsap';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScanResult {
  status: 'idle' | 'scanning' | 'success' | 'warning' | 'error';
  message: string;
  ticketData?: {
    email: string;
    event: string;
    department?: string;
    time?: string;
  };
}

export default function ScannerPortal() {
  const [inputBuffer, setInputBuffer] = useState('');
  const [scanState, setScanState] = useState<ScanResult>({ status: 'idle', message: 'Awaiting Scanner Input...' });
  const [useCamera, setUseCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the hidden input focused so handheld scanners always type into it (when not using camera)
  useEffect(() => {
    if (useCamera) return;
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusInterval);
  }, [useCamera]);

  useEffect(() => {
    if (!useCamera) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      false
    );

    let isScanning = false;

    scanner.render(
      async (decodedText) => {
        if (isScanning || scanState.status !== 'idle') return;
        isScanning = true;
        scanner.pause(true); // Pause scanning while processing

        await processScan(decodedText);
        
        // Wait a bit before resuming to allow the success/error message to show
        setTimeout(() => {
          isScanning = false;
          if (scanner.getState() === 2) { // 2 = SCANNING state
             scanner.resume();
          }
        }, 3000);
      },
      (error) => {
        // Ignore normal scan errors (empty frame etc)
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [useCamera, scanState.status]);

  const processScan = async (payload: string) => {
    setScanState({ status: 'scanning', message: 'Verifying Signature...' });
    
    try {
      // Decode Payload: It should be "email|eventTitle" from the QR Code
      if (!payload.includes('|')) {
        throw new Error('Invalid QR Signature Format.');
      }

      const [email, event] = payload.split('|');

      if (!email || !event) {
        throw new Error('Corrupted Ticket Data.');
      }

      // Verify against Supabase DB
      const { db } = await import('@/lib/database');
      const visitor = await db.verifyTicket(email, event);

      // Success!
      setScanState({
        status: 'success',
        message: 'ATTENDANCE MARKED',
        ticketData: { 
          email: visitor.name || email, 
          event,
          department: visitor.department || 'N/A',
          time: new Date().toLocaleTimeString()
        }
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setScanState({ status: 'idle', message: 'Awaiting Next Scan...' });
      }, 3000);

    } catch (err: any) {
      const isDuplicate = err.message?.includes('ALREADY ENTERED');
      
      setScanState({
        status: isDuplicate ? 'warning' : 'error',
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
    } else if (scanState.status === 'warning') {
      gsap.fromTo('.scanner-bg', 
        { backgroundColor: 'rgba(234,179,8,0.3)' }, 
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
      {!useCamera && (
        <input
          ref={inputRef}
          type="text"
          value={inputBuffer}
          onChange={(e) => setInputBuffer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute -top-[1000px] opacity-0"
          autoFocus
        />
      )}

      <div className="absolute top-8 left-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Exit Terminal
        </Link>
      </div>

      <div className="absolute top-8 right-8">
        <button 
          onClick={() => setUseCamera(!useCamera)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${useCamera ? 'bg-[var(--neon-cyan)] text-[#011213] border-[var(--neon-cyan)]' : 'bg-white/5 text-gray-400 border-white/10 hover:border-[var(--neon-cyan)] hover:text-white'}`}
        >
          {useCamera ? <ScanLine className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {useCamera ? 'Use USB Scanner' : 'Use Camera'}
        </button>
      </div>

      <div className="w-full max-w-2xl text-center z-10 mt-12">
        <div className="mb-8">
          <h1 className="text-4xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            Organizer Terminal
          </h1>
          <p className="text-[var(--neon-cyan)] font-mono text-xs tracking-widest uppercase font-bold">
            Secure Entry Validation Node
          </p>
        </div>

        {/* Central Scanner Visual */}
        <div className="relative mx-auto mb-12 flex items-center justify-center min-h-[300px]">
          {useCamera ? (
            <div className={`w-full max-w-[400px] overflow-hidden rounded-3xl border-2 transition-colors ${
              scanState.status === 'success' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]' :
              scanState.status === 'error' ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' :
              scanState.status === 'warning' ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.4)]' :
              'border-[var(--neon-cyan)]/50'
            }`}>
              <div id="qr-reader" className="w-full bg-black"></div>
            </div>
          ) : (
            <div className="relative w-72 h-72">
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

                {scanState.status === 'warning' && (
                  <motion.div
                    key="warning"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 border-4 border-yellow-500 rounded-3xl flex flex-col items-center justify-center bg-yellow-500/10 backdrop-blur-sm shadow-[0_0_50px_rgba(234,179,8,0.4)]"
                  >
                    <XCircle className="w-20 h-20 text-yellow-400 mb-4" />
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
          )}
        </div>

        {/* Status Message */}
        <div className="min-h-[100px]">
          <motion.h2 
            key={scanState.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-bold uppercase tracking-wider mb-2 font-[var(--font-orbitron)] ${
              scanState.status === 'success' ? 'text-green-400' : 
              scanState.status === 'warning' ? 'text-yellow-400' : 
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
              className="text-gray-400 font-mono text-sm flex flex-col gap-1"
            >
              <p className="text-[var(--neon-cyan)] font-bold text-lg">{scanState.ticketData.email}</p>
              <p>Dept: {scanState.ticketData.department}</p>
              <p>Event: {scanState.ticketData.event}</p>
              <p className="text-green-400">Time: {scanState.ticketData.time}</p>
            </motion.div>
          )}

          {scanState.status === 'idle' && (
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2">
              <Focus className="w-4 h-4" /> Target scanner at QR Code
            </p>
          )}
        </div>

        {/* Manual Fallback Input (For Desktop Demo) */}
        {!useCamera && (
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
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(280px); }
          100% { transform: translateY(0); }
        }
        /* Customizing html5-qrcode scanner UI to match dark theme */
        #qr-reader { border: none !important; }
        #qr-reader__scan_region { background: transparent !important; }
        #qr-reader__dashboard { background: rgba(0,0,0,0.8); padding: 15px; color: white !important; }
        #qr-reader__dashboard_section_csr span { color: #aaa !important; }
        #qr-reader__dashboard_section_swaplink { color: var(--neon-cyan) !important; text-decoration: none; }
        #qr-reader button { background: var(--neon-cyan); color: #000; border: none; padding: 5px 15px; border-radius: 5px; font-weight: bold; cursor: pointer; margin: 5px; }
      `}} />
    </main>
  );
}
