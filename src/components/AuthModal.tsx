'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Phone, User, Loader2, Building, BookOpen, Calendar, MapPin, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [step, setStep] = useState(1);
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
          setEmail(''); setPhone(''); setName(''); setCollege(''); setDepartment(''); setCity(''); setError(''); setStep(1);
        }});
      }
    }
  }, [isOpen, shouldRender]);

  const nextStep = () => {
    setError('');
    if (step === 1 && (!email || !phone)) return setError('Email and Phone are required.');
    if (step === 2 && (!name || !city)) return setError('Name and City are required.');
    if (step === 3 && (!college || !department)) return setError('College and Department are required.');
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'register') {
        const visitor = await db.register({ name, email, phone, college, department, year, gender, city });
        setUser({ 
          email: visitor.email, name: visitor.name, phone: visitor.phone, 
          college: visitor.college, department: visitor.department, 
          year: visitor.year, gender: visitor.gender, city: visitor.city,
          registeredEvents: visitor.registered_events 
        });

        // Send OD via our new API route
        try {
          await fetch('/api/send-od', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: visitor.name, email: visitor.email, phone: visitor.phone,
              college: visitor.college, department: visitor.department, eventTitle: 'General Fest Entry',
            })
          });
        } catch (err) {}

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

  if (!shouldRender) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md opacity-0 p-4">
      <div ref={modalRef} className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 bg-[#011213] border border-[var(--neon-cyan)]/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.1)] opacity-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
            onClick={() => { setActiveTab('register'); setError(''); setStep(1); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-[var(--neon-violet)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setStep(1); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-[var(--neon-violet)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Login
          </button>
        </div>

        {/* Progress Bar (Only for Register) */}
        {activeTab === 'register' && (
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--neon-cyan)] rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
              
              {[1, 2, 3, 4].map(num => (
                <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${step >= num ? 'bg-[var(--neon-cyan)] text-[#011213]' : 'bg-[#011213] border-2 border-white/20 text-gray-500'}`}>
                  {step > num ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{num}</span>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span className={step >= 1 ? 'text-[var(--neon-cyan)]' : ''}>Contact</span>
              <span className={step >= 2 ? 'text-[var(--neon-cyan)]' : ''}>Personal</span>
              <span className={step >= 3 ? 'text-[var(--neon-cyan)]' : ''}>Academic</span>
              <span className={step >= 4 ? 'text-[var(--neon-cyan)]' : ''}>Confirm</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* LOGIN VIEW */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email Address *</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all duration-300" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Phone Number *</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all duration-300" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-4 bg-[var(--neon-violet)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Portal'}
              </button>
            </div>
          )}

          {/* REGISTER MULTI-STEP VIEW */}
          {activeTab === 'register' && (
            <>
              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email Address *</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Phone Number *</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Full Name *</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Gender *</label>
                      <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#011213] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] transition-colors">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">City *</label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                        <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Academic */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">College Name *</label>
                    <div className="relative group">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                      <input type="text" required value={college} onChange={e => setCollege(e.target.value)} placeholder="XYZ College" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Department *</label>
                      <div className="relative group">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
                        <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} placeholder="CSE" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Year *</label>
                      <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-[#011213] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] transition-colors">
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="PG">PG</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-gray-300">
                    <h3 className="text-[var(--neon-cyan)] font-bold mb-4 uppercase tracking-widest text-xs">Review Details</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div><span className="text-gray-500 text-xs">Name:</span><br/>{name}</div>
                      <div><span className="text-gray-500 text-xs">Email:</span><br/>{email}</div>
                      <div><span className="text-gray-500 text-xs">College:</span><br/>{college}</div>
                      <div><span className="text-gray-500 text-xs">Dept:</span><br/>{department}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center px-4">
                    By confirming, you agree to our terms. An automated OD email will be dispatched to your inbox.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                
                {step < 4 ? (
                  <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-[var(--neon-cyan)] text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-black rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registration'}
                  </button>
                )}
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
}
