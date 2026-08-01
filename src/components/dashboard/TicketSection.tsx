'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, QrCode, Download, Printer } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { getTicketId } from '../../lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { db } from '../../lib/database';

export default function TicketSection() {
  const user = useStore((state) => state.user);
  const addToast = useStore((state) => state.addToast);
  const [selectedEventTicket, setSelectedEventTicket] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [eventFee, setEventFee] = useState<string>('₹250');

  React.useEffect(() => {
    if (selectedEventTicket && user) {
      const qrData = `${user.email}|${selectedEventTicket}`;
      QRCode.toDataURL(qrData, { width: 300, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Failed to generate local QR code', err));
        
      const fetchFee = async () => {
        try {
          const events = await db.getAllEvents();
          const evt = events.find(e => e.title === selectedEventTicket);
          if (evt) setEventFee(evt.fee);
        } catch (e) {}
      };
      fetchFee();
    }
  }, [selectedEventTicket, user]);

  if (!user) return null;

  const handleDownloadTicket = async () => {
    if (!selectedEventTicket) return;
    
    addToast('Generating digital ticket PDF...');
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 300]);
      
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Draw background
      page.drawRectangle({ x: 0, y: 0, width: 600, height: 300, color: rgb(0.02, 0.0, 0.1) });
      
      // Draw Ticket Header
      page.drawText("YUVENZA &apos;26 VITALITY PASS", { x: 30, y: 250, size: 20, font, color: rgb(0.1, 0.9, 0.9) });
      
      // Draw Event Name
      page.drawText(selectedEventTicket, { x: 30, y: 200, size: 24, font, color: rgb(1, 1, 1) });
      
      // Draw Visitor Details
      page.drawText(`Visitor: ${user.name}`, { x: 30, y: 150, size: 14, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      page.drawText(`Email: ${user.email}`, { x: 30, y: 130, size: 12, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      const ticketId = getTicketId(user.email, selectedEventTicket);
      page.drawText(`Ticket ID: ${ticketId}`, { x: 30, y: 110, size: 12, font: normalFont, color: rgb(0.6, 0.3, 0.9) });
      
      // Generate QR Code locally to avoid proxy SSL and CORS issues
      const qrData = user.email + '|' + selectedEventTicket;
      
      let localQrDataUrl = '';
      try {
        localQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });
        // The data URL is base64 encoded, e.g., data:image/png;base64,...
        const base64Data = localQrDataUrl.split(',')[1];
        const qrImageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        page.drawImage(qrImage, { x: 420, y: 75, width: 150, height: 150 });
        page.drawText("SCAN AT ENTRANCE", { x: 435, y: 55, size: 12, font, color: rgb(1, 1, 1) });
      } catch (err: unknown) {
        console.warn('Could not embed QR code in PDF', err);
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Yuvenza_Pass_${selectedEventTicket.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addToast('Ticket PDF saved to downloads!');
      
      // Email the ticket in the background
      try {
        const base64Pdf = await pdfDoc.saveAsBase64({ dataUri: true });
        const emailRes = await fetch('/api/send-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            event: selectedEventTicket,
            qrDataUrl: localQrDataUrl
          })
        });
        
        if (emailRes.ok) {
          const emailData = await emailRes.json();
          if (emailData.success) {
            addToast('A copy has been emailed to you!');
          }
        }
      } catch (emailErr) {
        console.warn('Failed to email ticket', emailErr);
      }
    } catch (err: unknown) {
      console.error(err);
      addToast('Failed to download ticket.');
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Event list */}
      <div className="w-full bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>My Registrations</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" data-lenis-prevent="true">
            {user.registeredEvents.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center leading-relaxed col-span-full">
                You haven't registered for any events yet. <br />
                Return to the main page to register for events!
              </p>
            ) : (
              user.registeredEvents.map((evt) => (
                <div 
                  key={evt}
                  onClick={() => setSelectedEventTicket(evt)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                    selectedEventTicket === evt
                      ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{evt}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">Tap to show boarding ticket pass</span>
                  </div>
                  <QrCode className="w-5 h-5 text-purple-400" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center mb-8">
      {selectedEventTicket ? (
        <motion.div
          id="ticket-pass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col md:flex-row shadow-[0_0_50px_rgba(255,255,255,0.05)] relative rounded-3xl overflow-hidden font-sans border border-white/10 group backdrop-blur-xl"
        >
          {/* Holographic sweep effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none z-50 mix-blend-overlay" />
          
          {/* Left Main Section (70%) */}
          <div className="md:w-[70%] bg-[#080808]/90 relative p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Left vertical text */}
            <div className="hidden sm:flex absolute left-2 top-0 bottom-0 items-center justify-center w-8">
              <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">
                  BE PART SOMETHING EXTRAORDINARY
                </span>
              </div>
            </div>

            <div className="sm:pl-10 relative z-10 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-4 sm:gap-0 relative z-20">
                <div className="flex items-center gap-4">
                  <Image src="/yuvenzalogo.png" alt="Yuvenza Logo" width={60} height={60} className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-purple-400 tracking-[0.2em] uppercase font-bold mb-1">YUVENZA PRESENTS</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-300 tracking-widest uppercase">YOUTHFEST 2026</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-[9px] sm:text-[10px] text-gray-300 tracking-widest uppercase">ONE CAMPUS.</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-300 tracking-widest uppercase">COUNTLESS MEMORIES.</p>
                </div>
              </div>

              {/* Main Title Area */}
              <div className="mt-12 mb-16">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
                  <h2 className="text-7xl sm:text-8xl md:text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    '26
                  </h2>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs sm:text-sm text-white tracking-[0.2em] uppercase font-bold leading-tight">YOUTH. TALENT.</p>
                    <p className="text-xs sm:text-sm text-white tracking-[0.2em] uppercase font-bold leading-tight">CELEBRATION.</p>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-md">
                  {selectedEventTicket}
                </h1>
                
                <div className="inline-block border border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)] px-4 py-1.5 rounded-sm">
                  <p className="text-[10px] sm:text-xs text-cyan-400 tracking-[0.3em] font-bold">UNITE. CREATE. INSPIRE.</p>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-12 border-t border-gray-800 pt-6 relative z-20">
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
                    <p className="text-sm font-bold text-white uppercase">Chennai Institute Of Technology</p>
                    <p className="text-sm text-cyan-400 font-semibold uppercase">Chennai, Tamil Nadu</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full text-center mt-10 relative z-20">
                <p className="text-[10px] text-gray-400 tracking-[0.5em]">YOUTHFEST-2026.VERCEL.APP</p>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="hidden md:flex flex-col items-center justify-between w-8 bg-[#0a0a0a] relative z-20">
            {/* Using a solid background matching the page to simulate cutouts */}
            <div className="w-8 h-8 rounded-full bg-[var(--background)] absolute -top-4 shadow-inner" />
            <div className="h-full w-[2px] border-l-[3px] border-dashed border-gray-800" />
            <div className="w-8 h-8 rounded-full bg-[var(--background)] absolute -bottom-4 shadow-inner" />
          </div>

          {/* Right Stub Section (30%) */}
          <div className="md:w-[30%] bg-[#0e0e0e]/90 backdrop-blur-md relative p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-gray-800 md:border-none z-10 transition-transform duration-500 md:group-hover:translate-x-2">
            {/* Background texture for stub */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative z-10 flex flex-col items-center w-full mt-4">

              <div className="bg-white p-3 rounded-lg mb-8 shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.6)]">
                {qrCodeDataUrl ? (
                  <Image 
                    src={qrCodeDataUrl}
                    alt="Ticket QR Code"
                    width={180}
                    height={180}
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-lg" />
                )}
              </div>

              <div className="border-2 border-pink-500/80 rounded-2xl p-4 w-full text-center shadow-[0_0_20px_rgba(236,72,153,0.15)] mb-8 bg-pink-500/5">
                <p className="text-xs text-white tracking-[0.3em] font-bold mb-1">ADMIT ONE</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl text-pink-500">★</span>
                  <span className="text-3xl font-black text-cyan-400">{eventFee}</span>
                  <span className="text-2xl text-pink-500">★</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 tracking-[0.2em] font-mono text-center">
                NO : {getTicketId(user.email, selectedEventTicket).toUpperCase()}
              </p>

              <div className="flex flex-col gap-3 mt-8 w-full">
                 <button onClick={handleDownloadTicket} className="w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                   <Download className="w-4 h-4" /> Download PDF
                 </button>
                 <button onClick={() => window.print()} className="w-full py-3 bg-transparent hover:bg-white/5 border border-white/20 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                   <Printer className="w-4 h-4" /> Print Ticket
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="w-full border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-black/10 min-h-[400px]">
          <QrCode className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
          <h4 className="text-lg font-bold text-gray-400">Select an Event</h4>
          <p className="text-sm text-gray-500 mt-2 max-w-[250px] leading-relaxed">
            Click on one of your registered events to generate your VIP Festival Pass.
          </p>
        </div>
      )}
    </div>
    </div>
  );
}

