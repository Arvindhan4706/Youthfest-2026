'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Calendar } from 'lucide-react';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';
import { toPng } from 'html-to-image';
import { getTicketId } from '@/lib/utils';
import { Visitor } from '@/lib/database';

interface AdminTicketGeneratorProps {
  visitor: Visitor | null;
  eventTitle: string | null;
  eventFee: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export interface AdminTicketGeneratorRef {
  generatePdf: () => Promise<void>;
}

export const AdminTicketGenerator = forwardRef<AdminTicketGeneratorRef, AdminTicketGeneratorProps>(
  ({ visitor, eventTitle, eventFee, onSuccess, onError }, ref) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

    useEffect(() => {
      if (visitor && eventTitle) {
        const qrData = `${visitor.email}|${eventTitle}`;
        QRCode.toDataURL(qrData, { width: 300, margin: 1 })
          .then(url => setQrCodeDataUrl(url))
          .catch(err => console.error('Failed to generate local QR code', err));
      }
    }, [visitor, eventTitle]);

    useImperativeHandle(ref, () => ({
      generatePdf: async () => {
        try {
          const node = document.getElementById('admin-ticket-pass');
          if (!node) throw new Error('Ticket UI not found.');
          
          // Add a tiny delay to ensure images/fonts are fully rendered in the DOM
          await new Promise(r => setTimeout(r, 100));

          const dataUrl = await toPng(node, { quality: 1.0, pixelRatio: 2 });
          const pdfDoc = await PDFDocument.create();
          const base64Data = dataUrl.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const embeddedImage = await pdfDoc.embedPng(imageBytes);
          const imgDims = embeddedImage.scale(1);
          
          const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: imgDims.width,
            height: imgDims.height,
          });
          
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const safeTitle = eventTitle!.replace(/\s+/g, '_');
          const safeName = visitor!.name.replace(/\s+/g, '_');
          link.download = `Yuvenza_Pass_${safeTitle}_${safeName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          if (onSuccess) onSuccess();
        } catch (err) {
          if (onError) onError(err);
        }
      }
    }));

    if (!visitor || !eventTitle) return null;

    return (
      <div className="fixed -left-[9999px] top-0 w-[1000px] opacity-0 pointer-events-none">
        <div
          id="admin-ticket-pass"
          className="w-[1000px] h-[350px] flex flex-row relative rounded-3xl overflow-hidden font-sans border border-white/10 group backdrop-blur-xl bg-[#080808] text-white"
        >
          {/* Holographic sweep effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-50 mix-blend-overlay" />
          
          {/* Left Main Section (70%) */}
          <div className="w-[70%] bg-[#080808]/90 relative p-8 flex flex-col justify-between overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full" />
            
            {/* Left vertical text */}
            <div className="flex absolute left-2 top-0 bottom-0 items-center justify-center w-8">
              <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">
                  BE PART SOMETHING EXTRAORDINARY
                </span>
              </div>
            </div>

            <div className="pl-10 relative z-10 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-row justify-between items-start w-full relative z-20">
                <div className="flex items-center gap-4">
                  {/* Using standard img tag to bypass next/image complexities in toPng */}
                  <img src="/yuvenzalogo.png" alt="Yuvenza Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  <div>
                    <p className="text-xs text-purple-400 tracking-[0.2em] uppercase font-bold mb-1">YUVENZA PRESENTS</p>
                    <p className="text-[10px] text-gray-300 tracking-widest uppercase">YOUTHFEST 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-300 tracking-widest uppercase">ONE CAMPUS.</p>
                  <p className="text-[10px] text-gray-300 tracking-widest uppercase">COUNTLESS MEMORIES.</p>
                </div>
              </div>

              {/* Main Title Area */}
              <div className="mt-4 mb-4">
                <div className="flex flex-row items-center gap-6 mb-2">
                  <h2 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    '26
                  </h2>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-white tracking-[0.2em] uppercase font-bold leading-tight">YOUTH. TALENT.</p>
                    <p className="text-sm text-white tracking-[0.2em] uppercase font-bold leading-tight">CELEBRATION.</p>
                  </div>
                </div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4 drop-shadow-md">
                  {eventTitle}
                </h1>
                
                <div className="inline-block border border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)] px-4 py-1.5 rounded-sm">
                  <p className="text-xs text-cyan-400 tracking-[0.3em] font-bold">UNITE. CREATE. INSPIRE.</p>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex flex-row flex-wrap items-center gap-10 border-t border-gray-800 pt-4 relative z-20">
                <div className="flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-pink-500" />
                  <div>
                    <p className="text-sm font-bold text-white">12th AUGUST</p>
                    <p className="text-sm text-pink-500 font-semibold">2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border-[2.5px] border-purple-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">9:30 PM</p>
                    <p className="text-sm text-purple-500 font-semibold">- 3:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-7 border-[2.5px] border-cyan-400 rounded-full rounded-b-none" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase">Visitor: {visitor.name}</p>
                    <p className="text-sm text-cyan-400 font-semibold uppercase">{visitor.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="flex flex-col items-center justify-between w-8 bg-[#0a0a0a] relative z-20">
            <div className="w-8 h-8 rounded-full bg-[#000000] absolute -top-4 shadow-inner" />
            <div className="h-full w-[2px] border-l-[3px] border-dashed border-gray-800" />
            <div className="w-8 h-8 rounded-full bg-[#000000] absolute -bottom-4 shadow-inner" />
          </div>

          {/* Right Stub Section (30%) */}
          <div className="w-[30%] bg-[#0e0e0e]/90 backdrop-blur-md relative p-8 flex flex-col items-center justify-center border-none z-10">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative z-10 flex flex-col items-center w-full mt-4">
              <div className="bg-white p-3 rounded-lg mb-6 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Ticket QR Code" className="w-24 h-24 object-contain" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg" />
                )}
              </div>

              <div className="border-2 border-pink-500/80 rounded-2xl p-2 w-full text-center shadow-[0_0_20px_rgba(236,72,153,0.15)] mb-4 bg-pink-500/5">
                <p className="text-[10px] text-white tracking-[0.3em] font-bold mb-1">ADMIT ONE</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-pink-500">★</span>
                  <span className="text-xl font-black text-cyan-400">{eventFee}</span>
                  <span className="text-lg text-pink-500">★</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 tracking-[0.2em] font-mono text-center">
                NO : {getTicketId(visitor.email, eventTitle).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
AdminTicketGenerator.displayName = 'AdminTicketGenerator';
