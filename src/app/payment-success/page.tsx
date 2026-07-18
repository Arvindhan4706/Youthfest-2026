'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('razorpay_payment_id');
        const paymentLinkId = searchParams.get('razorpay_payment_link_id');
        const paymentLinkRefId = searchParams.get('razorpay_payment_link_reference_id');
        const paymentLinkStatus = searchParams.get('razorpay_payment_link_status');
        const signature = searchParams.get('razorpay_signature');
        const eventTitle = searchParams.get('eventTitle');
        const email = searchParams.get('email');

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
            eventTitle: eventTitle,
            email: email,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus('success');
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--neon-cyan)]/20 rounded-full blur-3xl" />

        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[var(--neon-cyan)] animate-spin mb-6" />
            <h1 className="text-2xl font-[var(--font-orbitron)] font-bold text-white mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-400">
              Please wait while we confirm your payment securely with Razorpay...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <h1 className="text-3xl font-[var(--font-orbitron)] font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-300 mb-8">
              Your payment has been successfully verified. Your registration is complete and your digital pass has been generated.
            </p>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
            >
              <Home className="w-5 h-5" />
              Return to Dashboard
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <XCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h1 className="text-3xl font-[var(--font-orbitron)] font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-8">
              {errorMessage}
            </p>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              <Home className="w-5 h-5" />
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
