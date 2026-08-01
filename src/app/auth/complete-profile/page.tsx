'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Building, BookOpen, MapPin, Loader2, User, Mail } from 'lucide-react';
import { useStore } from '@/lib/useStore';

function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useStore(state => state.setUser);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const pEmail = searchParams?.get('email');
    const pName = searchParams?.get('name');
    if (pEmail) setEmail(pEmail);
    if (pName) setName(pName);
    
    if (!pEmail) {
       router.push('/');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanedPhone = phone.replace(/\D/g, '').slice(-10);

    try {
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
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-6 md:p-8 bg-black border border-[var(--neon-cyan)]/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.1)] relative">
      <h2 className="text-3xl font-[var(--font-heading-main)] font-black text-white mb-2 text-center mt-2">
        COMPLETE PROFILE
      </h2>
      <p className="text-gray-400 text-sm text-center mb-8">
        Almost there! Please provide the remaining details to complete your registration.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" readOnly value={name} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" readOnly value={email} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Phone Number *</label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] focus:bg-[var(--neon-cyan)]/5 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">City *</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
              <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">College Name *</label>
            <div className="relative group">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
              <input type="text" required value={college} onChange={e => setCollege(e.target.value)} placeholder="XYZ College" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Department *</label>
            <div className="relative group">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--neon-cyan)] transition-colors" />
              <input type="text" required value={department} onChange={e => setDepartment(e.target.value)} placeholder="CSE" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Year *</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] transition-colors">
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Gender *</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] transition-colors">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
        </div>

        <button type="submit" disabled={isLoading || !email} className="w-full mt-4 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-24 md:pt-32">
      <Suspense fallback={
        <div className="text-center space-y-4 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[var(--neon-cyan)] animate-spin" />
        </div>
      }>
        <ProfileForm />
      </Suspense>
    </div>
  );
}

