'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, EmailMessage } from '../lib/useStore';
import { X, CreditCard, QrCode, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentModal() {
  const user = useStore((state) => state.user);
  const checkoutEvent = useStore((state) => state.checkoutEvent);
  const setCheckoutEvent = useStore((state) => state.setCheckoutEvent);
  const registerForEvent = useStore((state) => state.registerForEvent);
  const addMessage = useStore((state) => state.addMessage);
  const addToast = useStore((state) => state.addToast);
  const addPoints = useStore((state) => state.addPoints);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('card');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Card input states
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Reset states when event changes
  useEffect(() => {
    if (checkoutEvent) {
      setPaymentMethod('card');
      setLoading(false);
      setPaymentSuccess(false);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
    }
  }, [checkoutEvent]);

  if (!checkoutEvent || !user) return null;

  const isFree = 
    checkoutEvent.fee.toLowerCase().includes('free') || 
    checkoutEvent.fee.toLowerCase().includes('included') || 
    checkoutEvent.fee === '₹0';

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        // 1. Register in the database
        await registerForEvent(checkoutEvent.title);

        // 2. Generate and store simulated confirmation email receipt
        const amount = isFree ? '₹0 (Free Registration)' : checkoutEvent.fee;
        const txId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        const emailBody = `
Dear ${user.name},

Congratulations! Your registration for "${checkoutEvent.title}" at YUVENZA '26 has been successfully confirmed.

--- REGISTRATION & PAYMENT RECEIPT ---
Event Name: ${checkoutEvent.title}
Category: ${checkoutEvent.category}
Amount Paid: ${amount}
Transaction Status: SUCCESSFUL
Payment Method: ${isFree ? 'Direct Free Checkout' : paymentMethod === 'card' ? 'Visa/Mastercard Ending in ' + cardNumber.slice(-4) : 'UPI Scanner'}
Transaction Reference: ${txId}
Date/Time: ${new Date().toLocaleString()}

--- EVENT INFORMATION ---
- Please log in to your Visitor Portal (Dashboard) to download your entry Boarding Pass containing your entry QR code.
- Ensure you arrive at least 30 minutes prior to the scheduled session.
- Feel free to reach out to the organizing team for any specific queries.

See you at the Wellness Sphere!

Best regards,
Registrations Desk,
YUVENZA '26 Organizing Committee
        `.trim();

        const newEmail: EmailMessage = {
          id: txId,
          eventId: checkoutEvent.id,
          eventTitle: checkoutEvent.title,
          amountPaid: amount,
          timestamp: new Date().toISOString(),
          recipientEmail: user.email,
          subject: `Confirmed: Registration receipt for ${checkoutEvent.title}`,
          body: emailBody
        };

        addMessage(newEmail);
        addPoints(50, `Registered for ${checkoutEvent.title}`);
        
        setLoading(false);
        setPaymentSuccess(true);

        // Fire standard confetti explosion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err: any) {
        setLoading(false);
        addToast(err.message || 'Payment processing failed. Please try again.');
      }
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => !loading && setCheckoutEvent(null)}
        />
        
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#0e1726]/90 to-[#030712]/95 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(168,85,247,0.15)] overflow-hidden text-white"
        >
          {/* Top aesthetic border */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          
          {/* Close button */}
          {!loading && (
            <button 
              onClick={() => setCheckoutEvent(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {!paymentSuccess ? (
            <>
              {/* Header Info */}
              <div className="mb-6">
                <span className="text-[10px] font-extrabold font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  Checkout Portal
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mt-3 text-white">
                  Confirm Registration
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Complete registration for <strong className="text-white">{checkoutEvent.title}</strong> ({checkoutEvent.category})
                </p>
              </div>

              {/* Amount Display */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Total Due Amount</span>
                  <p className="text-xs text-gray-400 mt-0.5">Visitor: {user.name} ({user.email})</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    {checkoutEvent.fee}
                  </span>
                </div>
              </div>

              {isFree ? (
                /* Free checkout UI */
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-400 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>This is a free event module. Click confirm to complete your registration!</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(20,185,129,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Registration...</span>
                      </>
                    ) : (
                      <span>Confirm Free Spot</span>
                    )}
                  </button>
                </form>
              ) : (
                /* Paid checkout UI with tabs */
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                  
                  {/* Method Selector Tabs */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/30 border border-white/5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'card' 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qr')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'qr' 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI QR Scanner</span>
                    </button>
                  </div>

                  {/* Payment Details Form Fields */}
                  {paymentMethod === 'card' ? (
                    <div className="flex flex-col gap-3 mt-1">
                      <div>
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            // Format with spaces
                            const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = val.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            if (parts.length > 0) {
                              setCardNumber(parts.join(' '));
                            } else {
                              setCardNumber(val);
                            }
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/[^0-9]/g, '');
                              if (val.length >= 2) {
                                val = val.substring(0, 2) + '/' + val.substring(2, 4);
                              }
                              setCardExpiry(val);
                            }}
                            placeholder="MM/YY"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 text-center focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">CVV Code</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="123"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 text-center focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* UPI QR Code Scanner Simulation */
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-white/10 rounded-2xl bg-black/20 my-1">
                      <div className="p-3 bg-white rounded-xl shadow-lg relative overflow-hidden group">
                        {/* Dynamic scanning laser line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500 animate-bounce" />
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=yuvenza@bank%26pn=YuvenzaClub%26am=${checkoutEvent.fee.replace(/[^0-9]/g, '')}%26cu=INR`}
                          alt="UPI QR Code"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed max-w-xs">
                        Scan this QR code with any UPI app (GPay, PhonePe, Paytm) or click pay to simulate a transaction.
                      </p>
                    </div>
                  )}

                  {/* Trust indicator */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                    <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Secure end-to-end 256-bit encrypted gateway.</span>
                  </div>

                  {/* Pay button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-95 text-white font-black text-xs rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Safe Payment...</span>
                      </>
                    ) : (
                      <span>Authorize Payment of {checkoutEvent.fee}</span>
                    )}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Success confirmation screen */
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2 text-white">
                Payment Authorized!
              </h3>
              
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">
                You are registered for <span className="text-white font-bold">{checkoutEvent.title}</span>. A receipt & confirmation email has been dispatched to <span className="text-purple-400">{user.email}</span>.
              </p>

              <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-[10px] text-left text-gray-400 w-full mb-6 font-mono leading-relaxed">
                <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
                  <span>Txn Ref:</span>
                  <span className="text-white">SUCCESS-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
                <div>A copy of this ticket pass has been added to your dashboard inbox.</div>
              </div>

              <button
                onClick={() => setCheckoutEvent(null)}
                className="px-8 py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
              >
                Return to Site
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
