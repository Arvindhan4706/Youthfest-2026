'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Home, Download, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../lib/useStore';
import { getTicketId } from '../../lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

import { db } from '../../lib/database';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);

  const eventTitle = searchParams.get('eventTitle') || 'Vitality Pass';
  const email = searchParams.get('email') || user?.email || 'attendee@youthfest.com';
  const attendeeName = user?.name || 'Festival Attendee';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenIntro', 'true');
      localStorage.setItem('y26_has_seen_intro', 'true');
    }
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('razorpay_payment_id');
        const paymentLinkId = searchParams.get('razorpay_payment_link_id');
        const paymentLinkRefId = searchParams.get('razorpay_payment_link_reference_id');
        const paymentLinkStatus = searchParams.get('razorpay_payment_link_status');
        const signature = searchParams.get('razorpay_signature');
        const eventTitleParam = searchParams.get('eventTitle');
        const emailParam = searchParams.get('email');

        if (!paymentId || !paymentLinkId || !signature) {
          throw new Error('Missing payment verification details from Razorpay.');
        }

        const res = await fetch('/api/payment/verify-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: paymentId,
            razorpay_payment_link_id: paymentLinkId,
            razorpay_payment_link_reference_id: paymentLinkRefId,
            razorpay_payment_link_status: paymentLinkStatus,
            razorpay_signature: signature,
            eventTitle: eventTitleParam,
            email: emailParam,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus('success');
          
          // Generate QR code for gate verification
          const qrData = `${email}|${eventTitleParam || 'Youthfest 2026'}`;
          QRCode.toDataURL(qrData, { width: 300, margin: 1 })
            .then(url => setQrCodeDataUrl(url))
            .catch(err => console.error('Failed to generate QR code:', err));

          // Ensure user session is fully restored/updated in Zustand store
          const targetEmail = emailParam || user?.email;
          if (targetEmail) {
            try {
              const visitor = await db.getVisitorByEmail(targetEmail);
              if (visitor) {
                const regEvents = visitor.registered_events || [];
                if (eventTitleParam && !regEvents.includes(eventTitleParam)) {
                  regEvents.push(eventTitleParam);
                }
                setUser({
                  email: visitor.email,
                  name: visitor.name,
                  phone: visitor.phone,
                  college: visitor.college,
                  department: visitor.department,
                  year: visitor.year,
                  gender: visitor.gender,
                  city: visitor.city,
                  registeredEvents: regEvents,
                });
              }
            } catch (visitorErr) {
              console.warn('Could not restore visitor profile:', visitorErr);
            }
          }
        } else {
          throw new Error(data.error || 'Payment verification failed.');
        }
      } catch (err: any) {
        setStatus('failed');
        setErrorMessage(err.message || 'An unknown error occurred during verification.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleDownloadPass = async () => {
    setIsDownloading(true);
    addToast('Generating Digital Pass PDF...');
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 300]);
      
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawRectangle({ x: 0, y: 0, width: 600, height: 300, color: rgb(0.02, 0.0, 0.1) });
      page.drawText("YOUTHFEST '26 VITALITY PASS", { x: 30, y: 250, size: 20, font, color: rgb(0.1, 0.9, 0.9) });
      page.drawText(eventTitle, { x: 30, y: 200, size: 24, font, color: rgb(1, 1, 1) });
      page.drawText(`Visitor: ${attendeeName}`, { x: 30, y: 150, size: 14, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      page.drawText(`Email: ${email}`, { x: 30, y: 130, size: 12, font: normalFont, color: rgb(0.8, 0.8, 0.8) });
      const ticketId = getTicketId(email, eventTitle);
      page.drawText(`Ticket ID: ${ticketId}`, { x: 30, y: 110, size: 12, font: normalFont, color: rgb(0.6, 0.3, 0.9) });

      const qrData = `${email}|${eventTitle}`;
      try {
        const localQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });
        const base64Data = localQrDataUrl.split(',')[1];
        const qrImageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        page.drawImage(qrImage, { x: 420, y: 75, width: 150, height: 150 });
        page.drawText("SCAN AT ENTRANCE", { x: 435, y: 55, size: 12, font, color: rgb(1, 1, 1) });
      } catch (qrErr) {
        console.warn('Could not embed QR code into PDF:', qrErr);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Youthfest_Pass_${eventTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Digital Pass downloaded successfully!');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate Digital Pass PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[var(--neon-cyan)]/20 rounded-full blur-3xl" />

        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[var(--neon-cyan)] animate-spin mb-6" />
            <h1 className="text-2xl font-[var(--font-heading-main)] font-bold text-white mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-400">
              Please wait while we confirm your payment securely with Razorpay...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <h1 className="text-2xl font-[var(--font-heading-main)] font-bold text-white mb-1">
              Payment Successful!
            </h1>
            <p className="text-xs text-gray-300 mb-6">
              Your registration for <span className="text-[var(--neon-cyan)] font-semibold">{eventTitle}</span> is confirmed. Your gate entry pass is ready below.
            </p>

            {/* Boarding Ticket Pass UI */}
            <div className="w-full bg-gradient-to-b from-purple-900/40 to-[#070024] border border-purple-500/30 rounded-2xl p-5 mb-6 shadow-xl relative flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
              <span className="text-[9px] uppercase font-mono tracking-widest text-teal-400 font-bold mb-3">
                YOUTHFEST &apos;26 OFFICIAL GATE PASS
              </span>

              <div className="bg-white p-2 rounded-xl mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                {qrCodeDataUrl ? (
                  <Image src={qrCodeDataUrl} alt="Gate Pass QR" width={96} height={96} className="w-24 h-24 object-contain" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <h3 className="text-sm font-black text-white uppercase mb-0.5">{eventTitle}</h3>
              <span className="text-[10px] text-gray-400 block font-mono">{attendeeName} • {email}</span>
              <span className="text-[10px] text-purple-400/90 block mt-1 font-mono uppercase tracking-widest font-semibold">
                ID: {getTicketId(email, eventTitle)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={handleDownloadPass}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl bg-[var(--neon-cyan)] text-black font-semibold text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download Pass (PDF)</span>
              </button>

              <Link 
                href="/profile"
                className="w-full py-3 px-4 border border-white/20 text-white font-semibold text-xs rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <XCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h1 className="text-3xl font-[var(--font-heading-main)] font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-8">
              {errorMessage}
            </p>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 text-[var(--neon-cyan)] animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
