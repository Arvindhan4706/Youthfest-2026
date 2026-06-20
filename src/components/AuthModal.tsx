'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Phone, User, Loader2, Building, BookOpen, Calendar, MapPin, Search } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../lib/useStore';
import { db } from '../lib/database';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  
  const setUser = useStore(state => state.setUser);
  const addToast = useStore(state => state.addToast);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender) {
      if (isOpen) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 });
      } else {
        gsap.to(modalRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: 'power2.in' });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1, onComplete: () => {
          setShouldRender(false);
          // Reset form state on close
          setEmail(''); setPhone(''); setName(''); setCollege(''); setDepartment(''); setCity(''); setError('');
        }});
      }
    }
  }, [isOpen, shouldRender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'register') {
        if (!name || !email || !phone || !college || !department || !city) {
          throw new Error('Please fill in all required fields.');
        }
        const visitor = await db.register({ name, email, phone, college, department, year, gender, city });
        setUser({ 
          email: visitor.email, name: visitor.name, phone: visitor.phone, 
          college: visitor.college, department: visitor.department, 
          year: visitor.year, gender: visitor.gender, city: visitor.city,
          registeredEvents: visitor.registered_events 
        });
        addToast('Registration successful! Welcome to Youthfest.', { points: 50 });
      } else {
        if (!email || !phone) throw new Error('Please fill in email and phone to login.');
        const visitor = await db.login(email, phone);
        setUser({ 
          email: visitor.email, name: visitor.name, phone: visitor.phone, 
          college: visitor.college, department: visitor.department, 
          year: visitor.year, gender: visitor.gender, city: visitor.city,
          registeredEvents: visitor.registered_events 
        });
        addToast(`Welcome back, ${visitor.name}!`);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockOAuth = async (provider: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate OAuth delay
    addToast(`${provider} Login simulated successfully!`);
    setIsLoading(false);
    
    // Simulate generic login
    setUser({
      name: "Demo User",
      email: "demo@gmail.com",
      phone: "+91 0000000000",
      college: "Demo Institute",
      registeredEvents: []
    });
    onClose();
  };

  const handleMockOTP = async () => {
    if (!email) {
      setError('Please enter your email first to receive an OTP.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    addToast('OTP sent to your email! (Simulated)');
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    addToast('Password reset link sent to your email. (Simulated)');
  };

  if (!shouldRender) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md opacity-0 p-4">
      <div ref={modalRef} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 bg-[#011213] border border-[var(--neon-cyan)]/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.1)] opacity-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-3xl font-[var(--font-orbitron)] font-black text-white mb-6 text-center mt-2">
          {activeTab === 'register' ? 'JOIN THE FESTIVAL' : 'VISITOR LOGIN'}
        </h2>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-[var(--neon-violet)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-[var(--neon-violet)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Login
          </button>
        </div>

        {/* OAuth Mock Buttons */}
        <div className="flex gap-4 mb-6">
          <button 
            type="button"
            onClick={() => handleMockOAuth('Google')}
            className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all flex justify-center items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>
          {activeTab === 'login' && (
            <button 
              type="button"
              onClick={handleMockOTP}
              className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all flex justify-center items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[var(--neon-cyan)]" />
              Send Email OTP
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-mono uppercase">OR CONTINUE WITH PHONE</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base Fields */}
            {activeTab === 'register' && (
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
                </div>
              </div>
            )}
            
            <div className={activeTab === 'register' ? 'col-span-1' : 'col-span-2'}>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
              </div>
            </div>

            <div className={activeTab === 'register' ? 'col-span-1' : 'col-span-2'}>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
              </div>
            </div>

            {/* Extended Fields for Registration */}
            {activeTab === 'register' && (
              <>
                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">College Name *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" required value={college} onChange={e => setCollege(e.target.value)} placeholder="XYZ Engineering College" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Department *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} placeholder="Computer Science" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Year of Study *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-[#011213] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-[var(--neon-cyan)] transition-colors cursor-pointer">
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="PG">Post Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Gender *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#011213] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-[var(--neon-cyan)] transition-colors cursor-pointer">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai, Bangalore..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors" />
                  </div>
                </div>
              </>
            )}

          </div>

          {activeTab === 'login' && (
            <div className="text-right mt-2">
              <button type="button" onClick={handleForgotPassword} className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-widest hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (activeTab === 'register' ? 'Complete Profile' : 'Access Portal via JWT')}
          </button>
        </form>
      </div>
    </div>
  );
}
