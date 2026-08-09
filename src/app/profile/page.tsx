'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../lib/useStore';
import { db, Payment } from '../../lib/database';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Ticket, CreditCard, Award, Bell, Settings,
  LogOut, CalendarCheck, ChevronRight, Menu, X, Search
} from 'lucide-react';
import ToastContainer from '../../components/ToastContainer';
import VisitorProfile from '../../components/dashboard/VisitorProfile';
import TicketSection from '../../components/dashboard/TicketSection';
import InboxSection from '../../components/dashboard/InboxSection';
import CertificatesSection from '../../components/dashboard/CertificatesSection';
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

function ComingSoon({ label, description }: { label: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
        <Award className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="text-gray-300 text-sm font-bold mb-1">{label}</p>
        <p className="text-gray-500 text-xs max-w-xs">{description || 'This feature is coming soon. Check back after the fest!'}</p>
      </div>
    </div>
  );
}

function PaymentHistory() {
  const user = useStore(s => s.user);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentFilterStatus, setPaymentFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      db.getPaymentsByVisitorId(user.id).then(data => {
        setPayments(data);
        setLoading(false);
      }).catch(err => {
        console.error('Failed to fetch payments', err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-sm animate-pulse">Loading payments...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
          <CreditCard className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-sm font-bold mb-1">No Payments Yet</p>
          <p className="text-gray-500 text-xs max-w-xs">Your payment receipts will appear here once you register for events.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by Event ID..."
            value={paymentSearchTerm}
            onChange={e => setPaymentSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] outline-none"
          />
        </div>
        <select
          value={paymentFilterStatus}
          onChange={e => setPaymentFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] outline-none cursor-pointer appearance-none md:w-48"
        >
          <option value="all" className="bg-[#0f172a]">All Status</option>
          <option value="successful" className="bg-[#0f172a]">Successful</option>
          <option value="pending" className="bg-[#0f172a]">Pending</option>
          <option value="refunded" className="bg-[#0f172a]">Refunded</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {payments
          .filter(p => {
            const term = paymentSearchTerm.toLowerCase();
            const matchesSearch = p.event_id.toLowerCase().includes(term);
            const matchesStatus = paymentFilterStatus === 'all' || p.status.toLowerCase() === paymentFilterStatus;
            return matchesSearch && matchesStatus;
          })
          .map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div>
              <p className="text-white font-semibold text-sm">{payment.event_id}</p>
              <p className="text-gray-500 text-xs mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`font-bold text-sm ${payment.status === 'successful' ? 'text-[var(--neon-cyan)]' : payment.status === 'refunded' ? 'text-gray-400' : 'text-orange-400'}`}>
                ₹{payment.amount} - {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
        {payments.filter(p => {
            const term = paymentSearchTerm.toLowerCase();
            const matchesSearch = p.event_id.toLowerCase().includes(term);
            const matchesStatus = paymentFilterStatus === 'all' || p.status.toLowerCase() === paymentFilterStatus;
            return matchesSearch && matchesStatus;
          }).length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No payments match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function MyRegistrations() {
  const user = useStore(s => s.user);
  const events = user?.registeredEvents ?? [];
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
          <CalendarCheck className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 text-sm font-bold mb-1">No Registrations Yet</p>
          <p className="text-gray-500 text-xs max-w-xs">You haven't registered for any events. Explore the events page and secure your spot!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative pl-6 sm:pl-8">
      {/* Glowing vertical timeline line */}
      <div className="absolute top-0 bottom-0 left-2 sm:left-4 w-[2px] bg-gradient-to-b from-[var(--neon-cyan)] via-[var(--neon-violet)] to-transparent opacity-50" />
      
      <div className="flex flex-col gap-8 py-4">
        {events.map((eventId: string, i: number) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {/* Timeline node */}
            <div className="absolute -left-10 sm:-left-12 top-4 w-4 h-4 rounded-full bg-black border-2 border-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent shadow-lg group hover:border-white/20 transition-all">
              <div className="flex flex-col mb-4 sm:mb-0">
                <span className="text-[10px] text-[var(--neon-cyan)] font-mono uppercase tracking-widest mb-1">Aug 21, 2026</span>
                <p className="text-white font-black text-xl mb-1">{eventId}</p>
                <p className="text-gray-400 text-xs">Chennai Institute Of Technology</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                  Registered
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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
    } else if (!user.id && user.email) {
      db.getByEmail(user.email).then(data => {
        if (data && data.id) {
          setUser({ ...user, id: data.id, registeredEvents: data.registered_events, payment_status: data.payment_status });
        }
      }).catch(console.error);
    }
  }, [user, router, setUser]);

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
      case 'certificates': return <CertificatesSection />;
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

      <div className="relative z-10 container-responsive pt-28 pb-16 flex gap-6">

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
              className="fixed top-0 left-0 h-full w-72 bg-[#030014] border-r border-white/10 z-50 lg:hidden flex flex-col px-6 pb-6 pt-16 gap-2"
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

