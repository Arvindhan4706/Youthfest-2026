'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowLeft, Loader2, Search, Download, ShieldCheck } from 'lucide-react';
import { db, Visitor } from '@/lib/database';

export default function AdminPortal() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await db.getAllVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.phone.includes(searchTerm) ||
    (v.college || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEventsRegistered = visitors.reduce((acc, curr) => acc + (curr.registered_events?.length || 0), 0);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Department', 'Year', 'Gender', 'City', 'Registered Events', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredVisitors.map(v => [
        `"${v.name}"`, `"${v.email}"`, `"${v.phone}"`, `"${v.college || ''}"`, `"${v.department || ''}"`,
        `"${v.year || ''}"`, `"${v.gender || ''}"`, `"${v.city || ''}"`, `"${(v.registered_events || []).join('; ')}"`,
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
    <main className="min-h-screen bg-[#011213] text-white p-6 relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-violet)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 pt-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono mb-4">
              <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Return to Main Site
            </Link>
            <h1 className="text-4xl font-[var(--font-orbitron)] font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-[var(--neon-cyan)]" /> Admin Core
            </h1>
            <p className="text-[var(--neon-violet)] font-mono text-xs tracking-widest uppercase font-bold mt-2">
              Yuvenza Database Control
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Link 
              href="/scanner"
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--neon-cyan)]/50 transition-colors font-bold text-sm text-center flex items-center justify-center gap-2"
            >
              Launch Scanner
            </Link>
            <button 
              onClick={exportCSV}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[var(--neon-cyan)] text-[#011213] font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl glass border border-[var(--neon-cyan)]/20 bg-gradient-to-br from-[var(--neon-cyan)]/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 uppercase font-bold tracking-wider">Total Visitors</h3>
              <Users className="w-5 h-5 text-[var(--neon-cyan)]" />
            </div>
            <p className="text-5xl font-black font-[var(--font-orbitron)]">{isLoading ? '-' : visitors.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl glass border border-[var(--neon-violet)]/20 bg-gradient-to-br from-[var(--neon-violet)]/10 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-400 uppercase font-bold tracking-wider">Event Bookings</h3>
              <Calendar className="w-5 h-5 text-[var(--neon-violet)]" />
            </div>
            <p className="text-5xl font-black font-[var(--font-orbitron)]">{isLoading ? '-' : totalEventsRegistered}</p>
          </motion.div>
        </div>

        {/* Table Section */}
        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold font-[var(--font-orbitron)] tracking-wide">Registry Log</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Participant</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Contact</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">College</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Events Registered</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--neon-cyan)]" />
                      Decrypting Data Stream...
                    </td>
                  </tr>
                ) : filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No records found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map(visitor => (
                    <tr key={visitor.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{visitor.name}</div>
                        <div className="text-xs text-[var(--neon-violet)]">{visitor.gender} • {visitor.year} Year</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{visitor.email}</div>
                        <div className="text-xs text-gray-500 font-mono">{visitor.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{visitor.college || '-'}</div>
                        <div className="text-xs text-gray-500">{visitor.department || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {visitor.registered_events?.length > 0 ? (
                            visitor.registered_events.map((evt, idx) => (
                              <span key={idx} className="px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 text-[10px] font-bold uppercase tracking-wider">
                                {evt}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500 italic">General Entry Only</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {new Date(visitor.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
