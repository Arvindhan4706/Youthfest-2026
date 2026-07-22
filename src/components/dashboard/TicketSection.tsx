'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, QrCode, Download } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export default function TicketSection() {
  const user = useStore((state) => state.user);
  const addToast = useStore((state) => state.addToast);
  const [selectedEventTicket, setSelectedEventTicket] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  React.useEffect(() => {
    if (selectedEventTicket && user) {
      const qrData = encodeURIComponent(user.email + '|' + selectedEventTicket);
      QRCode.toDataURL(qrData, { width: 300, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Failed to generate local QR code', err));
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
      page.drawText("YOUTHFEST &apos;26 VITALITY PASS", { x: 30, y: 250, size: 20, font, color: rgb(0.1, 0.9, 0.9) });
      
      // Draw Event Name
      page.drawText(selectedEventTicket, { x: 30, y: 200, size: 24, font, color: rgb(1, 1, 1) });
      
      // Draw Visitor Details
      page.drawText(`Visitor: ${user.name}`, { x: 30, y: 150, size: 14, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      page.drawText(`Email: ${user.email}`, { x: 30, y: 130, size: 12, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      const ticketId = btoa(user.email + '|' + selectedEventTicket).substring(0, 15);
      page.drawText(`Ticket ID: ${ticketId}`, { x: 30, y: 110, size: 12, font: normalFont, color: rgb(0.6, 0.3, 0.9) });
      
      // Generate QR Code locally to avoid proxy SSL and CORS issues
      const qrData = encodeURIComponent(user.email + '|' + selectedEventTicket);
      
      try {
        const localQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });
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
            ticketDataUrl: base64Pdf
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full">
      {/* Event list */}
      <div className="md:col-span-7 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>My Registrations</span>
          </h2>
          
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {user.registeredEvents.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center leading-relaxed">
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

      {/* Neon Boarding Ticket Pass */}
      <div className="md:col-span-5 flex flex-col items-center justify-center">
        {selectedEventTicket ? (
          <motion.div
            id="ticket-pass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-gradient-to-b from-purple-900/40 to-[#070024] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between items-center text-center overflow-hidden"
          >
            {/* Boarding ticket accent lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-teal-400 font-bold mb-4">
              YOUTHFEST &apos;26 VITALITY PASS
            </span>
            
            {/* Real QR Image generated locally */}
            <div className="bg-white p-2 rounded-2xl mb-4 shadow-[0_0_25px_rgba(168,85,247,0.3)] pointer-events-none">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl}
                  alt="Ticket QR Code"
                  className="w-28 h-28 object-contain"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-200 animate-pulse rounded-lg" />
              )}
            </div>
            
            <h3 className="text-base font-black text-white uppercase mb-1">{selectedEventTicket}</h3>
            <span className="text-[10px] text-gray-400 block mb-6 font-mono">Visitor: {user.name}</span>
            <span className="text-[8px] text-purple-400/80 block -mt-5 mb-6 font-mono uppercase tracking-widest break-all">ID: {btoa(user.email + '|' + selectedEventTicket).substring(0, 15)}...</span>
            
            <button
              onClick={handleDownloadTicket}
              className="w-full py-3 rounded-full bg-white text-black hover:bg-gray-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download ticket</span>
            </button>
          </motion.div>
        ) : (
          <div className="w-full h-full border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-black/10 min-h-[300px]">
            <QrCode className="w-8 h-8 text-gray-600 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-gray-400">Generate Boarding Ticket</h4>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] leading-relaxed">
              Select one of your registered events on the left to output your entry QR pass.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
