'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Ticket, CreditCard, Award, Bell, Settings,
  LogOut, CalendarCheck, ChevronRight, Menu, X
} from 'lucide-react';
import ToastContainer from '../../components/ToastContainer';
import VisitorProfile from '../../components/dashboard/VisitorProfile';
import TicketSection from '../../components/dashboard/TicketSection';
import InboxSection from '../../components/dashboard/InboxSection';
import Navbar from '../../components/Navbar';

type TabId = 'profile' | 'registrations' | 'tickets' | 'payments' | 'certificates' | 'notifications' | 'settings';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'registrations', label: 'My Registrations', icon: <CalendarCheck className="w-4 h-4" /> },
  { id: 'tickets', label: 'My Tickets', icon: <Ticket className="w-4 h-4" /> },
  { id: 'payments', label: 'Payment History', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
        <Award className="w-8 h-8" />
      </div>
      <p className="text-gray-400 text-sm font-semibold">{label} — Coming Soon</p>
    </div>
  );
}

function PaymentHistory() {
  const user = useStore(s => s.user);
  const events = user?.registeredEvents ?? [];
  if (events.length === 0) {
    return <ComingSoon label="Payment History" />;
  }
  return (
    <div className="flex flex-col gap-3">
      {events.map((eventId: string, i: number) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div>
            <p className="text-white font-semibold text-sm">{eventId}</p>
            <p className="text-gray-500 text-xs mt-1">August 12, 2026</p>
          </div>
          <span className="text-[var(--neon-cyan)] font-bold text-sm">Paid</span>
        </div>
      ))}
    </div>
  );
}

function MyRegistrations() {
  const user = useStore(s => s.user);
  const events = user?.registeredEvents ?? [];
  if (events.length === 0) {
    return <ComingSoon label="My Registrations" />;
  }
  return (
    <div className="flex flex-col gap-3">
      {events.map((eventId: string, i: number) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--neon-cyan)]/10 flex items-center justify-center text-[var(--neon-cyan)]">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{eventId}</p>
              <p className="text-gray-500 text-xs mt-0.5">August 12, 2026</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">Registered</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);
  const messages = useStore((state) => state.messages);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenIntro', 'true');
    }
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

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <VisitorProfile />;
      case 'registrations': return <MyRegistrations />;
      case 'tickets': return <TicketSection />;
      case 'payments': return <PaymentHistory />;
      case 'certificates': return <ComingSoon label="Certificates" />;
      case 'notifications': return <InboxSection />;
      case 'settings': return <ComingSoon label="Settings" />;
      default: return null;
    }
  };

  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label ?? 'Dashboard';

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <ToastContainer />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-16 flex gap-6">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 gap-2">
          {/* User card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black text-lg">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="text-white font-semibold text-sm truncate max-w-[140px]">{user.name || 'User'}</p>
                <p className="text-gray-500 text-xs truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tab links */}
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[var(--neon-cyan)]' : ''}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'notifications' && messages.length > 0 && (
                <span className="ml-auto bg-[var(--neon-cyan)] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full">{messages.length}</span>
              )}
              {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4 text-[var(--neon-cyan)]" />}
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 mt-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Mobile header bar */}
          <div className="lg:hidden flex items-center justify-between mb-6 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <span className="text-white font-bold">{activeTabLabel}</span>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTab()}
          </motion.div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#030014] border-r border-white/10 z-50 lg:hidden flex flex-col p-6 gap-2"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold font-[var(--font-heading-main)]">Dashboard</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-xl hover:bg-white/5">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              {/* User card */}
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{user.name || 'User'}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[var(--neon-cyan)]' : ''}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 mt-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
