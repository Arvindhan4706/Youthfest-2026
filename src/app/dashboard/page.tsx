'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Calendar, QrCode, Download, LogOut } from 'lucide-react';

import ToastContainer from '../../components/ToastContainer';

export default function Dashboard() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);
  const router = useRouter();
  
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [selectedEventTicket, setSelectedEventTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return (
    <main className="min-h-screen bg-[#011213] flex items-center justify-center">
      <p className="text-gray-400 text-sm animate-pulse">Redirecting...</p>
    </main>
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await db.updateProfile(user.email, {
        name: profileName,
        email: profileEmail,
      });
      setUser({
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        registeredEvents: updated.registered_events,
      });
      addToast('Profile information updated!', { points: 15 });
    } catch (err: any) {
      addToast(err.message || 'Failed to update profile.');
      console.error(err);
    }
  };

  const handleDownloadTicket = () => {
    addToast('Ticket download initiated. Saved to downloads!');
  };

  const handleLogout = () => {
    setUser(null);
    addToast('You have been logged out.');
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#011213] text-white p-6 sm:p-12 relative overflow-hidden">
      
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Profile form */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              <span>Visitor Profile</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Contact Number</label>
                <input
                  type="text"
                  value={user.phone || 'Not provided'}
                  disabled
                  className="w-full bg-white/5 border border-white/5 opacity-50 rounded-xl px-4 py-3 text-xs text-gray-400 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-purple-500 text-black hover:text-white font-bold text-xs rounded-xl transition-all shadow-lg"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Registered Events & Tickets */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
            
            {/* Event list */}
            <div className="md:col-span-7 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span>My Registrations</span>
                </h2>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {user.registeredEvents.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center leading-relaxed">
                      You haven't registered for any events yet. <br />
                      Return to the main page and join some events to unlock points!
                    </p>
                  ) : (
                    user.registeredEvents.map((evt, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedEventTicket(evt)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                          selectedEventTicket === evt
                            ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                            : 'bg-black/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white mb-1">{evt}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">Tap to show boarding ticket pass</span>
                        </div>
                        <QrCode className="w-5 h-5 text-purple-400" />
                      </div>
                    ))
                  )}
                </div>
              </div>


            </div>

            {/* Neon Boarding Ticket Pass */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              {selectedEventTicket ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-gradient-to-b from-purple-900/40 to-[#070024] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between items-center text-center overflow-hidden"
                >
                  {/* Boarding ticket accent lines */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

                  <span className="text-[9px] uppercase font-mono tracking-widest text-teal-400 font-bold mb-4">
                    YUVENZA '26 VITALITY PASS
                  </span>

                  {/* QR Image mock */}
                  <div className="bg-white p-3 rounded-2xl mb-4 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                    <div className="w-28 h-28 border-[4px] border-black flex items-center justify-center relative bg-white">
                      {/* Stylized QR boxes */}
                      <div className="absolute top-0 left-0 w-8 h-8 bg-black" />
                      <div className="absolute top-0 right-0 w-8 h-8 bg-black" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 bg-black" />
                      <div className="absolute inset-4 border-2 border-black border-dashed flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black uppercase font-mono">SCAN ME</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white uppercase mb-1">{selectedEventTicket}</h3>
                  <span className="text-[10px] text-gray-400 block mb-6 font-mono">Visitor: {user.name}</span>

                  <button
                    onClick={handleDownloadTicket}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white text-white hover:text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ticket</span>
                  </button>
                </motion.div>
              ) : (
                <div className="w-full h-full border border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-black/10 min-h-[300px]">
                  <QrCode className="w-8 h-8 text-gray-600 mb-3 animate-pulse" />
                  <h4 className="text-sm font-bold text-gray-400">Generate Boarding Ticket</h4>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[150px] leading-relaxed">
                    Select one of your registered events on the left to output your entry QR pass.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
