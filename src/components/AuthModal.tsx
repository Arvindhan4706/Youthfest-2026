'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/useStore';
import { db } from '../lib/database';
import { User, Mail, Phone, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login via Supabase database
        const visitor = await db.login(email, phone);

        setUser({
          email: visitor.email,
          name: visitor.name,
          phone: visitor.phone,
          registeredEvents: visitor.registered_events || [],
        });
        
        addToast(`Welcome back, ${visitor.name}!`);
        resetForm();
        onClose();
        router.push('/dashboard');
        
      } else {
        // Registration via Supabase database
        const visitor = await db.register({ email, phone, name });

        setUser({
          email: visitor.email,
          name: visitor.name,
          phone: visitor.phone,
          registeredEvents: visitor.registered_events || [],
        });
        
        addToast('Registration successful! Welcome to Yuvenza.');
        resetForm();
        onClose();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gradient-to-b from-teal-900/40 to-[#070024] border border-teal-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                {isLogin ? 'Visitor Access' : 'Festival Registration'}
              </h2>
              <p className="text-gray-400 text-xs">
                {isLogin ? 'Enter your details to access your dashboard' : 'Join 10,000+ others at Yuvenza \'26'}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-teal-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-teal-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-teal-400" /> Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="+91 98765 43210"
                />
                <p className="text-[9px] text-gray-500 mt-1.5">
                  {isLogin ? 'Used as your secure login code.' : 'This will be used for your event updates.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(20,185,129,0.3)] disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Access Portal' : 'Register Now'}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-white/10 pt-6">
              <p className="text-xs text-gray-400">
                {isLogin ? "Don't have an access pass?" : "Already registered?"}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-teal-400 font-bold hover:text-white transition-colors"
                >
                  {isLogin ? 'Register Here' : 'Login Here'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
