'use client';
import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Phone, User, Loader2, Building, BookOpen, Calendar, MapPin, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { useStore } from '../lib/useStore';
import { supabase } from '../lib/supabase';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
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
 const authModalTab = useStore(state => state.authModalTab);
 const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
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
 if (isOpen) {
 setShouldRender(true);
 setActiveTab(authModalTab);
 }
 }, [isOpen, authModalTab]);
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

 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape' && isOpen) onClose();
   };
   window.addEventListener('keydown', handleKeyDown);
   return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isOpen, onClose]);
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

 const handleGoogleLogin = async () => {
  try {
   setIsLoading(true);
   setError('');
   const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
     redirectTo: `${window.location.origin}/auth/callback`,
    }
   });
   if (error) throw error;
  } catch (err: any) {
   setError(err.message);
   setIsLoading(false);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setIsLoading(true);

 const cleanedPhone = phone.replace(/\D/g, '').slice(-10);

 try {
 if (activeTab === 'register') {
 const res = await fetch('/api/auth/register', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name, email, phone: cleanedPhone, college, department, year, gender, city })
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || 'Registration failed');
 const visitor = data.visitor;
 setUser({ 
 email: visitor.email, name: visitor.name, phone: visitor.phone, 
 college: visitor.college, department: visitor.department, 
 year: visitor.year, gender: visitor.gender, city: visitor.city,
 registeredEvents: visitor.registered_events,
 payment_status: visitor.payment_status 
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
 
 if (data.paymentLinkUrl) {
  window.location.href = data.paymentLinkUrl;
  return;
 } else {
  addToast('Registration successful! Welcome to Yuvenza.');
  setIsLoading(false);
  onClose();
 }
 } else {
 if (!email || !cleanedPhone) {
 setIsLoading(false);
 throw new Error('Please fill in email and phone to login.');
 }
 const res = await fetch('/api/auth/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email, phone: cleanedPhone })
 });
 const data = await res.json();
 if (!res.ok) {
 setIsLoading(false);
 throw new Error(data.message || 'Login failed');
 }
 const visitor = data.visitor;
 setUser({ 
 email: visitor.email, name: visitor.name, phone: visitor.phone, 
 college: visitor.college, department: visitor.department, 
 year: visitor.year, gender: visitor.gender, city: visitor.city,
 registeredEvents: visitor.registered_events,
 payment_status: visitor.payment_status 
 });
 addToast(`Welcome back, ${visitor.name}!`);
 setIsLoading(false);
 if (activeTab === 'login') onClose();
 }
 } catch (err: any) {
 setError(err.message);
 setIsLoading(false);
 }
 };
 if (!shouldRender) return null;
 return (
 <div ref={overlayRef} onClick={onClose} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4">
 <div ref={modalRef} onClick={(e) => e.stopPropagation()} data-lenis-prevent="true" className="relative w-full max-w-md max-h-[90dvh] flex flex-col overflow-y-auto bg-black/90 backdrop-blur-2xl border border-[var(--neon-cyan)]/40 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.15)] hover:shadow-[0_0_80px_rgba(0,240,255,0.25)] transition-shadow duration-700 opacity-0 p-6 sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <button type="button" onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 rounded-lg hover:bg-white/10 cursor-pointer">
 <X className="w-5 h-5 pointer-events-none" />
 </button>
 <h2 className="text-2xl sm:text-3xl font-[var(--font-heading-main)] font-black text-white mb-6 text-center mt-8 sm:mt-2 tracking-wide animate-in fade-in zoom-in duration-500">
 {activeTab === 'register' ? 'JOIN THE FESTIVAL' : 'VISITOR LOGIN'}
 </h2>

 {/* Progress Bar (Only for Register) */}
 {activeTab === 'register' && (
 <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
 <div className="flex justify-between items-center relative">
 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[#0088ff] rounded-full transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 3) * 100}%` }} />
 </div>
 {[1, 2, 3, 4].map(num => (
 <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${step >= num ? 'bg-gradient-to-r from-[var(--neon-cyan)] to-[#0088ff] text-[#000000] scale-110 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-black border-2 border-white/20 text-gray-500'}`}>
 {step > num ? <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-300" /> : <span className="text-xs font-bold">{num}</span>}
 </div>
 ))}
 </div>
 <div className="flex justify-between mt-3 text-[9px] font-bold uppercase tracking-widest text-gray-500">
 <span className={`transition-colors duration-300 ${step >= 1 ? 'text-[var(--neon-cyan)]' : ''}`}>Contact</span>
 <span className={`transition-colors duration-300 ${step >= 2 ? 'text-[var(--neon-cyan)]' : ''}`}>Personal</span>
 <span className={`transition-colors duration-300 ${step >= 3 ? 'text-[var(--neon-cyan)]' : ''}`}>Academic</span>
 <span className={`transition-colors duration-300 ${step >= 4 ? 'text-[var(--neon-cyan)]' : ''}`}>Confirm</span>
 </div>
 </div>
 )}
 {error && (
 <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-in shake duration-300">
 {error}
 </div>
 )}
 <form onSubmit={handleSubmit} className="space-y-6">
 {/* LOGIN VIEW */}
 {activeTab === 'login' && (
 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5 transition-colors">Email Address *</label>
 <div className="relative group">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5 transition-colors">Phone Number *</label>
 <div className="relative group">
 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 7339524706" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <button type="submit" disabled={isLoading} className="w-full min-h-[44px] py-3.5 mt-2 bg-gradient-to-r from-[var(--neon-cyan)] to-[#0088ff] text-black font-bold rounded-full hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2">
 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Portal'}
 </button>
  
  <div className="relative flex items-center py-2 opacity-70">
    <div className="flex-grow border-t border-white/10"></div>
    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">or</span>
    <div className="flex-grow border-t border-white/10"></div>
  </div>

  <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full min-h-[44px] py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
    <GoogleIcon /> Continue with Google
  </button>
  
  <p className="text-center text-gray-500 text-xs pt-4">
    Don't have an account? <button type="button" onClick={() => { setActiveTab('register'); setStep(1); setError(''); }} className="text-[var(--neon-cyan)] hover:underline font-bold transition-colors">Register here</button>
  </p>
 </div>
 )}
 {/* REGISTER MULTI-STEP VIEW */}
 {activeTab === 'register' && (
 <>
 {/* Step 1: Contact */}
 {step === 1 && (
 <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Email Address *</label>
 <div className="relative group">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Phone Number *</label>
 <div className="relative group">
 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
  </div>
 )}
  
  {step === 1 && (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 delay-100 fill-mode-both">
      <div className="relative flex items-center py-2 mt-4 opacity-70">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">or</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full py-3.5 mt-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
        <GoogleIcon /> Sign up with Google
      </button>
    </div>
  )}

 {/* Step 2: Personal */}
 {step === 2 && (
 <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Full Name *</label>
 <div className="relative group">
 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Gender *</label>
 <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 cursor-pointer">
 <option value="Male" className="bg-black">Male</option>
 <option value="Female" className="bg-black">Female</option>
 <option value="Other" className="bg-black">Other</option>
 </select>
 </div>
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">City *</label>
 <div className="relative group">
 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 </div>
 </div>
 )}
 {/* Step 3: Academic */}
 {step === 3 && (
 <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">College Name *</label>
 <div className="relative group">
 <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="text" required value={college} onChange={e => setCollege(e.target.value)} placeholder="XYZ College" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Department *</label>
 <div className="relative group">
 <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] group-focus-within:scale-110 transition-all duration-300" />
 <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} placeholder="CSE" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300" />
 </div>
 </div>
 <div>
 <label className="text-[10px] text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1.5">Year *</label>
 <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 cursor-pointer">
 <option value="1" className="bg-black">1st Year</option>
 <option value="2" className="bg-black">2nd Year</option>
 <option value="3" className="bg-black">3rd Year</option>
 <option value="4" className="bg-black">4th Year</option>
 <option value="PG" className="bg-black">PG</option>
 </select>
 </div>
 </div>
 </div>
 )}
 {/* Step 4: Confirm */}
 {step === 4 && (
 <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
 <div className="bg-white/5 border border-[var(--neon-cyan)]/30 rounded-2xl p-6 text-sm text-gray-300 relative overflow-hidden group hover:border-[var(--neon-cyan)]/60 transition-colors duration-300">
 <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[#0088ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 <h3 className="text-[var(--neon-cyan)] font-bold mb-4 uppercase tracking-widest text-xs relative z-10 flex items-center gap-2">
  <CheckCircle2 className="w-4 h-4 text-[#0088ff]" /> Review Details
 </h3>
 <div className="grid grid-cols-2 gap-y-4 relative z-10">
 <div><span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Name</span><br/><span className="font-medium text-white">{name}</span></div>
 <div><span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Email</span><br/><span className="font-medium text-white truncate block pr-2">{email}</span></div>
 <div><span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">College</span><br/><span className="font-medium text-white">{college}</span></div>
 <div><span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Dept</span><br/><span className="font-medium text-white">{department}</span></div>
 </div>
 </div>
 <p className="text-xs text-gray-400 text-center px-4 animate-pulse">
 By confirming, you agree to our terms. An automated OD email will be dispatched to your inbox.
 </p>
 </div>
 )}
 {/* Navigation Buttons */}
  <div className="flex gap-4 pt-6">
  {step > 1 && (
  <button type="button" onClick={prevStep} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-all duration-300 flex justify-center items-center gap-2 hover:-translate-x-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
  <ChevronLeft className="w-4 h-4" /> Back
  </button>
  )}
  {step < 4 ? (
  <button type="button" onClick={nextStep} className="flex-[2] py-3.5 bg-gradient-to-r from-[var(--neon-cyan)] to-[#0088ff] text-black font-bold rounded-full hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 flex justify-center items-center gap-2 group">
  Next Step <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>
  ) : (
  <button type="submit" disabled={isLoading} className="flex-[2] py-3.5 bg-gradient-to-r from-[var(--neon-cyan)] to-[#0088ff] text-black font-bold rounded-full hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registration'}
  </button>
  )}
  </div>

  {step === 1 && (
    <p className="text-center text-gray-500 text-xs pt-4">
      Already have an account? <button type="button" onClick={() => { setActiveTab('login'); setError(''); }} className="text-[var(--neon-cyan)] hover:underline font-bold transition-colors">Log in</button>
    </p>
  )}
 </>
 )}
 </form>
 </div>
 </div>
 );
}
