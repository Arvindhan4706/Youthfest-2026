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
    setIsGenerating(eventName);
    addToast('Generating your certificate...');
    
    try {
      const pdfDoc = await PDFDocument.create();
      // Landscape A4 roughly
      const page = pdfDoc.addPage([842, 595]);
      
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // Background
      page.drawRectangle({ x: 0, y: 0, width: 842, height: 595, color: rgb(0.01, 0.0, 0.05) });
      
      // Border
      page.drawRectangle({
        x: 20, y: 20, width: 802, height: 555,
        borderColor: rgb(0.1, 0.8, 0.8),
        borderWidth: 2,
        color: undefined
      });
      page.drawRectangle({
        x: 25, y: 25, width: 792, height: 545,
        borderColor: rgb(0.5, 0.2, 0.8),
        borderWidth: 1,
        color: undefined
      });

      // Text
      page.drawText("YUVENZA '26", { x: 300, y: 500, size: 36, font, color: rgb(0.1, 0.9, 0.9) });
      page.drawText("CERTIFICATE OF PARTICIPATION", { x: 190, y: 440, size: 28, font, color: rgb(1, 1, 1) });
      
      page.drawText("This is proudly presented to", { x: 310, y: 380, size: 18, font: italicFont, color: rgb(0.7, 0.7, 0.7) });
      
      const nameWidth = font.widthOfTextAtSize(user.name, 36);
      page.drawText(user.name, { x: (842 - nameWidth) / 2, y: 320, size: 36, font, color: rgb(0.9, 0.8, 0.2) });
      
      page.drawText("For successfully participating and completing the event", { x: 230, y: 260, size: 16, font: normalFont, color: rgb(0.7, 0.7, 0.7) });
      
      const eventWidth = font.widthOfTextAtSize(eventName, 28);
      page.drawText(eventName, { x: (842 - eventWidth) / 2, y: 210, size: 28, font, color: rgb(0.8, 0.4, 0.9) });

      page.drawText("Date: August 12, 2026", { x: 340, y: 150, size: 16, font: normalFont, color: rgb(0.9, 0.9, 0.9) });
      
      // Signatures
      page.drawText("__________________", { x: 150, y: 80, size: 14, font: normalFont, color: rgb(1, 1, 1) });
      page.drawText("Event Coordinator", { x: 155, y: 60, size: 12, font: normalFont, color: rgb(0.6, 0.6, 0.6) });

      page.drawText("__________________", { x: 550, y: 80, size: 14, font: normalFont, color: rgb(1, 1, 1) });
      page.drawText("Principal", { x: 590, y: 60, size: 12, font: normalFont, color: rgb(0.6, 0.6, 0.6) });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${eventName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Certificate downloaded successfully!');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate certificate.');
    } finally {
      setIsGenerating(null);
    }
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
