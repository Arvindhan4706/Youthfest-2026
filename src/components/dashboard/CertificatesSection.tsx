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
    <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
      <div className="w-16 h-16 rounded-2xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <Award className="w-8 h-8" />
      </div>
      <div className="text-center max-w-md">
        <p className="text-white text-lg font-bold mb-2">Coming Soon</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Certificates will be issued only for <strong className="text-white">Workshops</strong> after the event is completed. Please check back here after August 21, 2026 to download your certificate.
        </p>
      </div>
    </div>
  );
}

