'use client';
import React, { useEffect, useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle2, User as UserIcon, Calendar, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { getTicketId } from '../lib/utils';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function PaymentModal() {
  const checkoutEvent = useStore((state) => state.checkoutEvent);
  const setCheckoutEvent = useStore((state) => state.setCheckoutEvent);
  const registerForEvent = useStore((state) => state.registerForEvent);
  const addMessage = useStore((state) => state.addMessage);
  const addToast = useStore((state) => state.addToast);
  const user = useStore((state) => state.user);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (checkoutEvent) {
      setStep(1);
      setQrDataUrl(null);
      setIsLoading(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [checkoutEvent]);

  const handlePayment = async () => {
    if (!checkoutEvent) return;
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
        throw new Error(`Server error`);
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
        name: "Yuvenza Youthfest",
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
    if (!checkoutEvent) return;

    // Save registration
    await registerForEvent(checkoutEvent.title);
    
    // Generate QR Code immediately for Step 3
    const qrData = `${user?.email}|${checkoutEvent.title}`;
    const generatedQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1, color: { dark: '#000000', light: '#ffffff' } });
    setQrDataUrl(generatedQrDataUrl);

    if (user) {
      addMessage({
        id: `RCPT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        eventId: checkoutEvent.id,
        eventTitle: checkoutEvent.title,
        amountPaid: checkoutEvent.fee,
        timestamp: new Date().toISOString(),
        recipientEmail: user.email,
        subject: `Registration Confirmed: ${checkoutEvent.title}`,
        body: `Hello ${user.name},\n\nYour registration for ${checkoutEvent.title} is confirmed!\n\nAmount Paid: ${checkoutEvent.fee}\nEvent Category: ${checkoutEvent.category}\n\n[ YOUR QR ENTRY PASS ]\nYour personalized QR Code has been generated.\nTicket ID: ${getTicketId(user.email, checkoutEvent.title)}\n\nYour QR Boarding Pass is available in your Visitor Portal dashboard. You can also view it securely at the venue by logging in.\n\nPlease show your QR pass at the entrance on the day of the event to check in instantly.\n\nSee you at Youthfest '26!\n- The Yuvenza Team`
      });

      // Send OD
      fetch('/api/send-od', {
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
      }).catch(console.error);

      // Send Ticket PDF
      fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          event: checkoutEvent.title,
          venue: 'Chennai Institute Of Technology',
          date: 'August 21, 2026',
          qrDataUrl: generatedQrDataUrl
        })
      }).catch(console.error);
    }
    
    setIsLoading(false);
    
    // Move to Success Step
    setStep(3);

    // Confetti!
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff006e', '#8a2be2', '#ffffff']
      });
    }, 100);
  };

  const handleClose = () => {
    if (!isLoading) setCheckoutEvent(null);
  };

  const handleDashboardRedirect = () => {
    setCheckoutEvent(null);
    router.push('/profile');
  };

  return (
    <AnimatePresence>
      {checkoutEvent && (
        <motion.div 
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose} 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#02000a]/80 backdrop-blur-md p-4"
        >
          <motion.div 
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-lg bg-[#050114] border border-white/10 rounded-[24px] shadow-[0_0_50px_rgba(0,240,255,0.05)] overflow-hidden flex flex-col"
          >
            {/* Progress Bar Header */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2 items-center">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]' : 'bg-white/20'}`} />
                  <div className={`h-[2px] w-8 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[var(--neon-cyan)]' : 'bg-white/10'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]' : 'bg-white/20'}`} />
                  <div className={`h-[2px] w-8 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-[var(--neon-cyan)]' : 'bg-white/10'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]' : 'bg-white/20'}`} />
                </div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  {step === 1 ? 'Step 1/3' : step === 2 ? 'Step 2/3' : 'Step 3/3'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleClose} 
              disabled={isLoading} 
              className="absolute top-6 right-6 min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 disabled:opacity-50 bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dynamic Content Based on Step */}
            <div className="px-8 pb-8 flex-1">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Your Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-[var(--font-heading-main)] font-black text-white mb-2">Participant Details</h2>
                    <p className="text-gray-400 text-sm mb-6">Verify your registration profile before proceeding to payment.</p>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center shrink-0">
                          <UserIcon className="w-5 h-5 text-[var(--neon-cyan)]" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Full Name</div>
                          <div className="text-white font-medium">{user?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 border-t border-white/5 pt-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--neon-violet)]/10 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-[var(--neon-violet)]" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email / Verification</div>
                          <div className="text-white font-medium">{user?.email}</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="w-full min-h-[48px] bg-white text-black font-bold text-base rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      Continue to Event Review
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Event Review & Payment */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-2xl font-[var(--font-heading-main)] font-black text-white">Event Review</h2>
                      <button onClick={() => setStep(1)} className="text-[var(--neon-cyan)] text-xs hover:underline font-bold">Edit Details</button>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">Confirm the event details and complete your secure checkout.</p>
                    
                    <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-5 mb-8 relative overflow-hidden">
                      {/* Decorative glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-cyan)]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                      
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg leading-tight">{checkoutEvent.title}</div>
                          <div className="text-[var(--neon-cyan)] text-xs font-mono mt-1">{checkoutEvent.category?.toUpperCase() || 'EVENT'}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-2">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Amount</span>
                        <span className="text-3xl font-[var(--font-heading-main)] font-black text-white tracking-tighter">
                          {checkoutEvent.fee}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePayment} 
                      disabled={isLoading || !user}
                      className="w-full min-h-[48px] bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-black font-bold text-base rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay Securely
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* STEP 3: Success & QR Code */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-[var(--neon-cyan)]/20 border-2 border-[var(--neon-cyan)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                      <CheckCircle2 className="w-10 h-10 text-[var(--neon-cyan)]" />
                    </div>
                    <h2 className="text-3xl font-[var(--font-heading-main)] font-black text-white mb-2">You're In!</h2>
                    <p className="text-gray-400 text-sm mb-6">Your registration for <strong className="text-white">{checkoutEvent.title}</strong> is confirmed. An email receipt and OD have been dispatched.</p>
                    
                    {/* Digital Boarding Pass */}
                    <div className="bg-white rounded-2xl p-4 inline-block mb-8 relative">
                      <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#050114] rounded-full border border-white/10 border-b-transparent border-r-transparent rotate-45" />
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#050114] rounded-full border border-white/10 border-t-transparent border-l-transparent rotate-45" />
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#050114] rounded-full border border-white/10 border-b-transparent border-l-transparent -rotate-45" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#050114] rounded-full border border-white/10 border-t-transparent border-r-transparent -rotate-45" />
                      
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="Your QR Pass" className="w-40 h-40 object-contain rounded-lg" />
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
                          <QrCode className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="mt-3 text-black font-mono text-[10px] font-bold tracking-widest uppercase">
                        ID: {getTicketId(user?.email || '', checkoutEvent.title)}
                      </div>
                    </div>

                    <button 
                      onClick={handleDashboardRedirect}
                      className="w-full min-h-[48px] border border-white/20 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      View My Dashboard
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
