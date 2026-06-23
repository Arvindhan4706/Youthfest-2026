'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Loader2, Search, Download, ShieldCheck, Lock, KeyRound } from 'lucide-react';
import { db, Visitor } from '@/lib/database';

export default function AdminPortal() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Advanced Filters
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    if (passkeyInput === correctPasskey) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const fetchData = async () => {
    try {
      const [vData, aCount] = await Promise.all([
        db.getAllVisitors(),
        db.getAttendanceCount()
      ]);
      setVisitors(vData);
      setAttendanceCount(aCount);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.phone.includes(searchTerm) ||
                          (v.college || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept ? (v.department || '').toLowerCase() === filterDept.toLowerCase() : true;
    const matchesYear = filterYear ? v.year === filterYear : true;

    return matchesSearch && matchesDept && matchesYear;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Department', 'Year', 'Registered Events', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredVisitors.map(v => [
        `"${v.name}"`, `"${v.email}"`, `"${v.phone}"`, `"${v.college || ''}"`, `"${v.department || ''}"`,
        `"${v.year || ''}"`, `"${(v.registered_events || []).join('; ')}"`,
        `"${new Date(v.created_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `youthfest_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#011213] text-white p-6 relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-violet)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {!isAuthenticated ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
          <Link href="/" className="absolute top-8 left-0 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono">
            <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Return Home
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass p-8 rounded-3xl border border-[var(--neon-cyan)]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] text-center"
          >
            <div className="w-16 h-16 mx-auto bg-[var(--neon-cyan)]/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-[var(--neon-cyan)]" />
            </div>
            <h1 className="text-2xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider mb-2">Restricted Access</h1>
            <p className="text-xs text-gray-400 mb-8 font-mono">Enter Admin Passkey to continue</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter Passkey..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors font-mono tracking-[0.2em] text-center"
                  />
                </div>
                {authError && <p className="text-red-400 text-xs mt-2 font-bold uppercase tracking-wider">Invalid Passkey</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                Authenticate
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative z-10 pt-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono mb-4">
              <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Return to Main Site
            </Link>
            <h1 className="text-4xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-[var(--neon-cyan)]" /> Admin Core
            </h1>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/scanner" className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--neon-cyan)]/50 transition-colors font-bold text-sm text-center">
              Launch Scanner
            </Link>
            <button onClick={exportCSV} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[var(--neon-cyan)] text-[#011213] font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Dashboard UI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-[var(--neon-cyan)]" />
            </div>
            <p className="text-3xl font-black font-[var(--font-orbitron)]">{isLoading ? '-' : visitors.length}</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">QR Check-ins</span>
              <ShieldCheck className="w-4 h-4 text-[var(--neon-violet)]" />
            </div>
            <p className="text-3xl font-black font-[var(--font-orbitron)] text-[var(--neon-violet)]">{isLoading ? '-' : attendanceCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search User..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none">
              <option value="">[Department ▼]</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none">
              <option value="">[Year ▼]</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Email / Phone</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Dept</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Events Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--neon-cyan)]" />
                      Loading Data...
                    </td>
                  </tr>
                ) : filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      No visitors found.
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map(visitor => (
                    <tr key={visitor.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-bold text-white">{visitor.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{visitor.email}</div>
                        <div className="text-xs text-gray-500 font-mono">{visitor.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{visitor.department || '-'}</td>
                      <td className="px-6 py-4 text-[var(--neon-cyan)] text-xs font-mono font-bold">
                        {(visitor.registered_events || []).join(', ') || 'General Entry'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </main>
  );
}
