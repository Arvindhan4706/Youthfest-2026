'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';

export default function PaymentModal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const checkoutEvent = useStore(state => state.checkoutEvent);
  const setCheckoutEvent = useStore(state => state.setCheckoutEvent);
  const registerForEvent = useStore(state => state.registerForEvent);
  const addMessage = useStore(state => state.addMessage);
  const addToast = useStore(state => state.addToast);
  const user = useStore(state => state.user);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!checkoutEvent);

  useEffect(() => {
    if (checkoutEvent) setShouldRender(true);
  }, [checkoutEvent]);

  useEffect(() => {
    if (shouldRender) {
      if (checkoutEvent) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 });
      } else {
        gsap.to(modalRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: 'power2.in' });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1, onComplete: () => setShouldRender(false) });
      }
    }
  }, [checkoutEvent, shouldRender]);

  if (!shouldRender || !checkoutEvent) return null;

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate 2 second payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Perform registration (saves to supabase + zustand state)
    await registerForEvent(checkoutEvent.title);
    
    // Generate simulated email receipt in the inbox
    if (user) {
      addMessage({
        id: `RCPT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        eventId: checkoutEvent.id,
        eventTitle: checkoutEvent.title,
        amountPaid: checkoutEvent.fee,
        timestamp: new Date().toISOString(),
        recipientEmail: user.email,
        subject: `Registration Confirmed: ${checkoutEvent.title}`,
        body: `Hello ${user.name},\n\nYour registration for ${checkoutEvent.title} is confirmed!\n\nAmount Paid: ${checkoutEvent.fee}\nEvent Category: ${checkoutEvent.category}\n\n🎟️ YOUR QR ENTRY PASS 🎟️\nYour personalized QR Code has been generated.\nTicket ID: ${btoa(user.email + '|' + checkoutEvent.title).substring(0, 15)}...\n\nYour QR Boarding Pass is available in your Wellness Visitor Portal dashboard. You can also view it securely at the venue by logging in.\n\nPlease show your QR pass at the entrance on the day of the event to check in instantly.\n\nSee you at Youthfest '26!\n- The Yuvenza Team`
      });
    }

    addToast('Payment Successful! Registration complete.', { points: 100 });
    setIsLoading(false);
    setCheckoutEvent(null); // Close modal
    
    // Route to dashboard to show QR Code / Email Confirmation
    router.push('/dashboard');
  };

  const handleClose = () => {
    if (!isLoading) setCheckoutEvent(null);
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md opacity-0 p-4">
      <div ref={modalRef} className="relative w-full max-w-md p-8 bg-[#011213] border border-[var(--neon-cyan)]/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.1)] opacity-0">
        <button onClick={handleClose} disabled={isLoading} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-[var(--font-orbitron)] font-black text-white text-center mb-1">Secure Checkout</h2>
        <p className="text-gray-400 text-xs text-center mb-6">Complete your payment to secure your spot.</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Event</span>
            <span className="text-sm font-bold text-white text-right ml-4">{checkoutEvent.title}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Fee</span>
            <span className="text-xl font-[var(--font-orbitron)] font-black text-[var(--neon-cyan)]">
              {checkoutEvent.fee}
            </span>
          </div>
        </div>

        {/* Mock Payment Options */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--neon-violet)] bg-[var(--neon-violet)]/10 cursor-pointer">
            <input type="radio" name="payment" defaultChecked className="text-[var(--neon-violet)] focus:ring-[var(--neon-violet)]" />
            <span className="text-sm font-bold text-white">Credit / Debit Card</span>
          </label>
          <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-not-allowed opacity-50">
            <input type="radio" name="payment" disabled />
            <span className="text-sm font-bold text-white">UPI / Net Banking (Unavailable)</span>
          </label>
        </div>

        <button 
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(108,99,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Pay {checkoutEvent.fee} Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
