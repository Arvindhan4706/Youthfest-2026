'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut } from 'lucide-react';
import ToastContainer from '../../components/ToastContainer';
import VisitorProfile from '../../components/dashboard/VisitorProfile';
import TicketSection from '../../components/dashboard/TicketSection';
import InboxSection from '../../components/dashboard/InboxSection';

export default function Dashboard() {
 const user = useStore((state) => state.user);
 const setUser = useStore((state) => state.setUser);
 const addToast = useStore((state) => state.addToast);
 const messages = useStore((state) => state.messages);
 const router = useRouter();
 const [activeTab, setActiveTab] = useState<'tickets' | 'inbox'>('tickets');

 useEffect(() => {
 if (!user) {
 router.push('/');
 }
 }, [user, router]);

 if (!user) return (
 <main className="min-h-screen bg-black flex items-center justify-center">
 <p className="text-gray-400 text-sm animate-pulse">Redirecting...</p>
 </main>
 );

 const handleLogout = () => {
 setUser(null);
 addToast('You have been logged out.');
 router.push('/');
 };

 return (
 <main className="min-h-screen bg-black text-white p-6 sm:p-12 relative overflow-x-hidden overflow-y-auto">
 {/* Background neon elements */}
 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
 <ToastContainer />
 <div className="max-w-6xl mx-auto z-10 relative">
 {/* Navigation header */}
 <div className="flex items-center justify-between mb-12">
 <Link 
 href="/"
 className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono"
 >
 <ArrowLeft className="w-4 h-4 text-purple-400" /> Go back to Main Site
 </Link>
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold font-mono text-teal-400 uppercase tracking-widest">
 WELLNESS VISITOR PORTAL
 </span>
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 text-[10px] font-semibold uppercase tracking-wider transition-all"
        >
          <LogOut className="w-3 h-3" /> Logout
        </button>
 </div>
 </div>
 {/* Dashboard Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile form */}
          <div className="lg:col-span-4">
            <VisitorProfile />
          </div>

          {/* Registered Events & Tickets Container */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            {/* Tabs selector */}
            <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl self-start ">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === 'tickets' 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Boarding Passes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === 'inbox' 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Inbox & Mails</span>
                {messages.length > 0 && (
                  <span className="bg-teal-400 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </button>
            </div>

            {activeTab === 'tickets' ? <TicketSection /> : <InboxSection />}
          </div>
 </div>
 </div>
 </main>
 );
}
