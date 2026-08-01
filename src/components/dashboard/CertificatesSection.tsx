'use client';
import React, { useState, useEffect } from 'react';
import { Award, Download, Clock } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function CertificatesSection() {
  const user = useStore((state) => state.user);
  const addToast = useStore((state) => state.addToast);
  const [attendedEvents, setAttendedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      db.getVisitorAttendance(user.email)
        .then(data => setAttendedEvents(data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (!user) return null;

  const registeredEvents = user.registeredEvents || [];

  const handleDownloadCertificate = async (eventName: string) => {
    addToast('Certificates will be issued on August 13, 2026.');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
        <p className="text-gray-400 text-sm animate-pulse">Checking records...</p>
      </div>
    );
  }

  if (registeredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
          <Award className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-sm font-bold mb-1">No Events Found</p>
          <p className="text-gray-500 text-xs max-w-xs">You haven't registered for any events yet to earn certificates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {registeredEvents.map((eventId: string, i: number) => {
        const hasAttended = attendedEvents.includes(eventId);
        return (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.03] gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasAttended ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]' : 'bg-white/5 text-gray-500'}`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-base">{eventId}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {hasAttended ? 'Event Completed successfully!' : 'Awaiting Event Completion'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleDownloadCertificate(eventId)}
              disabled={!hasAttended || isGenerating === eventId}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                hasAttended 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!hasAttended ? (
                <>
                  <Clock className="w-4 h-4" /> Locked
                </>
              ) : isGenerating === eventId ? (
                'Generating...'
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Certificate
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

