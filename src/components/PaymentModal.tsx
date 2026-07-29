'use client';
import React, { useEffect, useRef, useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { getTicketId } from '../lib/utils';
import QRCode from 'qrcode';

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

    try {
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseInt(checkoutEvent.fee.replace(/\D/g, '')) || 0,
          email: user?.email,
          eventTitle: checkoutEvent.title
        })
      });
      
      if (!orderResponse.ok) {
        const errText = await orderResponse.text();
        console.error('Server returned error:', errText);
        throw new Error(`Server error: ${orderResponse.status}`);
      }
      
      const orderData = await orderResponse.json();
      
      // Load Razorpay SDK
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
        });
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Yuvenza Yuvenza",
        description: `Registration for ${checkoutEvent.title}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                email: user?.email,
                eventTitle: checkoutEvent.title
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              await completeRegistration();
            } else {
              addToast('Payment verification failed.');
              setIsLoading(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            addToast('Error verifying payment.');
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#00f0ff"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        addToast('Payment failed: ' + response.error.description);
        setIsLoading(false);
      });
      rzp.open();

    } catch (err: unknown) {
      console.error(err);
      addToast('Payment initialization failed.');
      setIsLoading(false);
    }
  };
 const completeRegistration = async () => {
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
 body: `Hello ${user.name},\n\nYour registration for ${checkoutEvent.title} is confirmed!\n\nAmount Paid: ${checkoutEvent.fee}\nEvent Category: ${checkoutEvent.category}\n\n[ YOUR QR ENTRY PASS ]\nYour personalized QR Code has been generated.\nTicket ID: ${getTicketId(user.email, checkoutEvent.title)}\n\nYour QR Boarding Pass is available in your Wellness Visitor Portal dashboard. You can also view it securely at the venue by logging in.\n\nPlease show your QR pass at the entrance on the day of the event to check in instantly.\n\nSee you at Yuvenza '26!\n- The Yuvenza Team`
 });
 // Send the OD via our new API route
 try {
 await fetch('/api/send-od', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 name: user.name,
 email: user.email,
 phone: user.phone,
 college: user.college,
 department: user.department,
 eventTitle: checkoutEvent.title,
 })
 });
 addToast('OD Letter dispatched to your Email!');
 } catch (err) {
 console.error('Failed to send OD:', err);
 }

 // Send the Ticket PDF via our new API route
 try {
   const qrData = JSON.stringify({
     email: user.email,
     name: user.name || 'Attendee',
     event: checkoutEvent.title,
     regId: getTicketId(user.email, checkoutEvent.title),
     qrId: crypto.randomUUID(),
     time: Date.now()
   });
   const qrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1 });
   
   await fetch('/api/send-ticket', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: user.name,
       email: user.email,
       event: checkoutEvent.title,
       venue: 'Chennai Institute Of Technology',
       date: 'August 12, 2026',
       qrDataUrl: qrDataUrl
     })
   });
   addToast('Ticket PDF dispatched to your Email!');
 } catch (err) {
   console.error('Failed to send ticket:', err);
 }
 }
 addToast('Payment Successful! Registration complete.');
 setIsLoading(false);
 setCheckoutEvent(null); // Close modal
 // Route to dashboard to show QR Code / Email Confirmation
 router.push('/profile');
 };
 const handleClose = () => {
 if (!isLoading) setCheckoutEvent(null);
 };
 return (
 <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 opacity-0 p-4">
 <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" className="relative w-full max-w-md bg-black border border-[var(--theme-primary)]/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.1)] opacity-0 max-h-[90dvh] flex flex-col overflow-hidden">
 <button onClick={handleClose} disabled={isLoading} aria-label="Close payment modal" className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50">
 <X className="w-5 h-5" />
 </button>
 <div className="flex justify-center mb-6">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-tertiary)] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
 <CreditCard className="w-8 h-8 text-white" />
 </div>
 </div>
 <h2 id="payment-modal-title" className="text-2xl font-[var(--font-heading-main)] font-black text-white text-center mb-1">Secure Checkout</h2>
 <p className="text-gray-400 text-xs text-center mb-6">Complete your payment to secure your spot.</p>
 <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
 <div className="flex justify-between items-center mb-3">
 <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Event</span>
 <span className="text-sm font-bold text-white text-right ml-4">{checkoutEvent.title}</span>
 </div>
 <div className="flex justify-between items-center pt-3 border-t border-white/10">
 <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Fee</span>
 <span className="text-xl font-[var(--font-heading-main)] font-black text-[var(--theme-primary)]">
 {checkoutEvent.fee}
 </span>
 </div>
 </div>
 <button 
          onClick={handlePayment} 
          disabled={isLoading || !user}
          className="w-full min-h-[44px] h-[48px] bg-white text-black font-semibold rounded-[12px] hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
