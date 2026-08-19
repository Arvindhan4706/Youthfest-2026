'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Loader2, Search, Download, ShieldCheck, Lock, KeyRound, Settings, Calendar, Edit, Trash2, Plus, X, LogOut, RefreshCw, CreditCard, Send, Bell, Mail } from 'lucide-react';
import { db, Visitor, EventItem, AdminUser, Role, Payment } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';
import { AdminTicketGenerator, AdminTicketGeneratorRef } from '@/components/admin/AdminTicketGenerator';
export default function AdminPortal() {
 const [visitors, setVisitors] = useState<Visitor[]>([]);
 const [totalUsers, setTotalUsers] = useState(0);
 const [attendanceCount, setAttendanceCount] = useState(0);
 const [isLoading, setIsLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 // Auth state
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [emailInput, setEmailInput] = useState('');
 const [passkeyInput, setPasskeyInput] = useState('');
 const [authError, setAuthError] = useState('');
 const [loggedInEmail, setLoggedInEmail] = useState('');
 const [userRole, setUserRole] = useState<Role | ''>('');
 // Advanced Filters
 const [filterTrack, setFilterTrack] = useState('');
 // Settings State
 const [activeTab, setActiveTab] = useState<'visitors' | 'settings' | 'logs' | 'events' | 'users' | 'payments' | 'broadcast'>('visitors');
 const [siteSettings, setSiteSettings] = useState<any>(null);
 const [isSavingSettings, setIsSavingSettings] = useState(false);
 // Events State
 const [events, setEvents] = useState<EventItem[]>([]);
 const [isEventModalOpen, setIsEventModalOpen] = useState(false);
 const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
 // Logs State
 const [adminLogs, setAdminLogs] = useState<{ id: string; admin_email: string; action: string; created_at: string }[]>([]);
 const [logSearchTerm, setLogSearchTerm] = useState('');
 // Users State
 const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
 const [newUserEmail, setNewUserEmail] = useState('');
 const [newUserRole, setNewUserRole] = useState<Role>('Viewer');
 // Payments State
 const [payments, setPayments] = useState<Payment[]>([]);
 const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
 const [paymentFilterStatus, setPaymentFilterStatus] = useState('all');
 const [isRefunding, setIsRefunding] = useState<string | null>(null);
 const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'paid'>('all');
 const [broadcastSubject, setBroadcastSubject] = useState('');
 const [broadcastMessage, setBroadcastMessage] = useState('');
 const [isBroadcasting, setIsBroadcasting] = useState(false);
 // Notification State
 const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  // Razorpay Stats State
  const [razorpayStats, setRazorpayStats] = useState<{gross: number, net: number} | null>(null);
  const [isFetchingRazorpay, setIsFetchingRazorpay] = useState(false);
  // Ticket Generator State
  const ticketGenRef = React.useRef<AdminTicketGeneratorRef>(null);
  const [ticketGenVisitor, setTicketGenVisitor] = useState<Visitor | null>(null);
  const [ticketGenEvent, setTicketGenEvent] = useState<string | null>(null);
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);

  const handleAdminGenerateTicket = async (visitor: Visitor, eventTitle: string) => {
    setTicketGenVisitor(visitor);
    setTicketGenEvent(eventTitle);
    setIsGeneratingTicket(true);
    setTimeout(() => {
      if (ticketGenRef.current) {
        ticketGenRef.current.generatePdf().then(() => {
          setIsGeneratingTicket(false);
          setTicketGenVisitor(null);
          setTicketGenEvent(null);
        }).catch(err => {
          console.error(err);
          alert('Failed to generate ticket PDF');
          setIsGeneratingTicket(false);
        });
      }
    }, 100);
  };

 useEffect(() => {
 if (activeTab === 'logs' && userRole === 'Super Admin') {
 fetchLogs();
 }
 if (activeTab === 'users' && userRole === 'Super Admin') {
 fetchAdminUsers();
 }
 if (activeTab === 'payments' && (userRole === 'Super Admin' || userRole === 'Editor')) {
 fetchPayments();
 }
 }, [activeTab, userRole]);

  const exportCSV = () => {
    if (activeTab === 'users') {
      downloadCSV(adminUsers, 'youthfest_admin_users');
    } else if (activeTab === 'payments') {
      downloadCSV(payments, 'youthfest_payments');
    } else if (activeTab === 'visitors') {
      downloadCSV(visitors, 'youthfest_visitors');
    } else {
      alert('CSV Export is only available for Visitors, Admin Users, and Payments tabs.');
    }
  };

 const downloadCSV = (data: any[], filename: string) => {
   if (!data || !data.length) return alert('No data to export');
   const headers = Object.keys(data[0]);
   const csvRows = [];
   csvRows.push(headers.join(','));
   for (const row of data) {
     const values = headers.map(header => {
       const escape = ('' + row[header]).replace(/"/g, '\"');
       return '"' + escape + '"';
     });
     csvRows.push(values.join(','));
   }
   const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.setAttribute('hidden', '');
   a.setAttribute('href', url);
   a.setAttribute('download', filename + '.csv');
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
 };

 const fetchPayments = async () => {
 try {
 const data = await db.getAllPayments();
 setPayments(data);
 } catch (err) {
 console.error('Failed to fetch payments', err);
 }
 };

 const handleRefund = async (paymentId: string, razorpayPaymentId: string | undefined, amount: number) => {
 if (!razorpayPaymentId) {
 alert('Cannot refund: Missing Razorpay Payment ID. This transaction may not have been completed properly.');
 return;
 }
 if (!confirm(`Are you sure you want to refund ₹${amount}? This action cannot be undone.`)) return;

 setIsRefunding(paymentId);
 try {
 const res = await fetch('/api/admin/refund', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 payment_id: paymentId,
 razorpay_payment_id: razorpayPaymentId,
 amount,
 adminPasskey: passkeyInput,
 adminEmail: loggedInEmail
 })
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || 'Refund failed');

 alert('Refund processed successfully!');
 fetchPayments(); // Refresh the list
 await db.logAdminAction(loggedInEmail, 'Processed Refund', { paymentId, amount });
 } catch (err: any) {
 alert(err.message || 'Failed to process refund');
 } finally {
 setIsRefunding(null);
 }
 };

  const handleResendTicket = async (payment: Payment, visitorName: string, visitorEmail: string) => {
    if (!confirm(`Are you sure you want to resend the ticket for ${payment.event_id} to ${visitorEmail}?`)) return;
    try {
      const qrData = `${visitorEmail}|${payment.event_id}`;
      const generatedQrDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 1, color: { dark: '#000000', light: '#ffffff' } });
      
      const res = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitorName,
          email: visitorEmail,
          event: payment.event_id,
          venue: 'Chennai Institute Of Technology',
          date: 'August 21, 2026',
          qrDataUrl: generatedQrDataUrl
        })
      });
      if (!res.ok) throw new Error('Failed to send ticket');
      alert('Ticket resent successfully!');
      await db.logAdminAction(loggedInEmail, 'Resent Ticket', { email: visitorEmail, eventId: payment.event_id });
    } catch (err: any) {
      alert(err.message || 'Failed to resend ticket');
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to drop an alert to ${notifyEmail}?`)) return;
    setIsNotifying(true);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: notifyEmail,
          title: notifyTitle,
          message: notifyMessage,
          adminPasskey: passkeyInput,
          adminEmail: loggedInEmail
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send notification');
      alert('Notification dropped successfully!');
      setNotifyTitle('');
      setNotifyMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to send notification');
    } finally {
      setIsNotifying(false);
    }
  };

 const fetchAdminUsers = async () => {
 try {
 const users = await db.getAllAdminUsers();
 setAdminUsers(users);
 } catch (err) {
 console.error('Failed to fetch admin users', err);
 }
 };
 const handleAddAdminUser = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 await db.addAdminUser(newUserEmail, newUserRole);
 await db.logAdminAction(loggedInEmail, 'Added Admin User', { email: newUserEmail, role: newUserRole });
 setNewUserEmail('');
 fetchAdminUsers();
 alert('User added successfully');
 } catch (err: any) {
 alert('Failed to add user: ' + err.message);
 }
 };
 const handleDeleteAdminUser = async (id: string, email: string) => {
 if (!confirm(`Are you sure you want to remove ${email}?`)) return;
 try {
 await db.deleteAdminUser(id);
 await db.logAdminAction(loggedInEmail, 'Removed Admin User', { email });
 fetchAdminUsers();
 } catch (err: any) {
 alert('Failed to remove user: ' + err.message);
 }
 };
 const fetchLogs = async () => {
 try {
 const logs = await db.getAdminLogs();
 setAdminLogs(logs);
 } catch (err) {
 console.error('Failed to fetch logs', err);
 }
 };
 const fetchSettings = async () => {
 try {
 const settings = await db.getSiteSettings();
 setSiteSettings(settings);
 } catch (err) {
 console.error('Failed to fetch settings', err);
 }
 };
 const handleSaveSettings = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSavingSettings(true);
 // Convert any string values (from typing) back to integers before saving
 const sanitizedSettings = { ...siteSettings };
 const stringKeys = ['id', 'updated_at', 'workshops_status', 'events_status', 'pre_events_status'];
 
 // Remove deleted schema fields to prevent backend errors
 delete sanitizedSettings.contact_institute;
 delete sanitizedSettings.contact_address;
 delete sanitizedSettings.contact_email;
 delete sanitizedSettings.contact_phone;
 delete sanitizedSettings.contact_whatsapp;

 Object.keys(sanitizedSettings).forEach(key => {
 if (typeof sanitizedSettings[key] === 'string' && !stringKeys.includes(key)) {
 sanitizedSettings[key] = parseInt(sanitizedSettings[key]) || 0;
 }
 });
 try {
 // Use server-side API route to bypass Supabase RLS
 const res = await fetch('/api/settings/update', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ settings: sanitizedSettings })
 });
 const result = await res.json();
 if (!res.ok) throw new Error(result.error || 'Failed to save');
 await db.logAdminAction(loggedInEmail, 'Updated Site Settings', sanitizedSettings);
 // Update local state with confirmed data from server
 setSiteSettings(result.data);
 alert('Settings saved successfully! The website will now show the updated stats.');
 } catch (err: any) {
 alert('Failed to save settings: ' + err.message);
 } finally {
 setIsSavingSettings(false);
 }
 };
 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 setAuthError('');
 setIsLoading(true);
 try {
 const res = await fetch('/api/auth/admin-secure', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email: emailInput, passkey: passkeyInput })
 });
 const data = await res.json();
 if (res.ok && data.success) {
 setLoggedInEmail(data.email);
 setUserRole(data.role);
 setIsAuthenticated(true);
 if (data.role === 'Scanner') {
 window.location.href = '/scanner';
 }
 } else {
 setAuthError(data.error || 'Invalid Credentials');
 }
 } catch (error) {
 setAuthError('Network error or server unreachable');
 } finally {
 setIsLoading(false);
 }
 };
 const handleSignOut = async () => {
 setIsAuthenticated(false);
 setEmailInput('');
 setPasskeyInput('');
 setLoggedInEmail('');
 setUserRole('');
 };
 const fetchData = async () => {
 try {
 const [vData, vCount, aCount, eData, pData] = await Promise.all([
 db.getAllVisitors(),
 db.getVisitorCount(),
 db.getAttendanceCount(),
 db.getAllEvents(),
 db.getAllPayments()
 ]);
 setVisitors(vData);
 setTotalUsers(vCount);
 setAttendanceCount(aCount);
 setEvents(eData);
 setPayments(pData);

 // Fetch Razorpay Stats
 if (userRole === 'Super Admin' || userRole === 'Editor' || userRole === '') {
   setIsFetchingRazorpay(true);
   try {
     const rzRes = await fetch('/api/admin/razorpay-stats', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: emailInput || loggedInEmail, passkey: passkeyInput })
     });
     const rzData = await rzRes.json();
     if (rzRes.ok && rzData.success) {
       setRazorpayStats({ gross: rzData.gross, net: rzData.net });
     }
   } catch (e) {
     console.error('Failed to fetch razorpay stats', e);
   } finally {
     setIsFetchingRazorpay(false);
   }
 }

 } catch (err) {
 console.error('Failed to fetch data:', err);
 } finally {
 setIsLoading(false);
 }
 };
 useEffect(() => {
 if (isAuthenticated) {
 fetchData();
 fetchSettings();
 }
  
 }, [isAuthenticated]);
 const filteredVisitors = visitors.filter(v => {
 const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
 v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 v.phone.includes(searchTerm) ||
 (v.college || '').toLowerCase().includes(searchTerm.toLowerCase());
 const matchesTrack = filterTrack
 ? (v.registered_events || []).some(evtId => evtId.startsWith(filterTrack))
 : true;
 return matchesSearch && matchesTrack;
 });
 const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const formData = new FormData(e.currentTarget);
 const rulesStr = formData.get('rules') as string;
 const eventId = editingEvent ? editingEvent.id : (formData.get('id') as string)?.trim() || '';
 const eventData: Omit<EventItem, 'created_at'> = {
 id: eventId,
 track_id: (formData.get('track_id') as string)?.trim() || '',
 title: (formData.get('title') as string).trim(),
 description: (formData.get('description') as string).trim(),
 team_size: (formData.get('team_size') as string).trim(),
 fee: (formData.get('fee') as string).trim(),
 difficulty: (formData.get('difficulty') as 'Easy' | 'Medium' | 'Hard') || 'Easy',
 image_url: (formData.get('image_url') as string).trim(),
 event_date: (formData.get('event_date') as string).trim(),
 venue: (formData.get('venue') as string).trim(),
 gform_link: (formData.get('gform_link') as string)?.trim() || undefined,
 contact_number: (formData.get('contact_number') as string)?.trim() || undefined,
 contact_name: (formData.get('contact_name') as string)?.trim() || undefined,
 housefull: formData.get('housefull') === 'on',
 rules: rulesStr ? rulesStr.split('\n').map(r => r.trim()).filter(Boolean) : []
 };
 try {
 if (editingEvent) {
 await db.updateEvent(eventData.id, eventData);
 await db.logAdminAction(loggedInEmail, 'Updated Event', { eventId: eventData.id });
 } else {
 await db.addEvent(eventData);
 await db.logAdminAction(loggedInEmail, 'Added Event', { eventId: eventData.id });
 }
 setIsEventModalOpen(false);
 setEditingEvent(null);
 fetchData(); // Refresh events
 } catch (error: any) {
 alert('Error saving event: ' + error.message);
 }
 };
 const handleDeleteEvent = async (id: string) => {
 if (!confirm('Are you sure you want to delete this event?')) return;
 try {
 await db.deleteEvent(id);
 await db.logAdminAction(loggedInEmail, 'Deleted Event', { eventId: id });
 fetchData(); // Refresh events
 } catch (error: any) {
 alert('Error deleting event: ' + error.message);
 }
 };
 
 const handleSendBroadcast = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!confirm(`Are you sure you want to send this broadcast to ${broadcastAudience === 'all' ? 'All Registered Users' : 'Users with Successful Payments'}?`)) return;
 setIsBroadcasting(true);
 try {
 const res = await fetch('/api/admin/broadcast', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 subject: broadcastSubject,
 message: broadcastMessage,
 audience: broadcastAudience,
 adminPasskey: passkeyInput,
 adminEmail: loggedInEmail
 })
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || 'Failed to send broadcast');
 alert(`Broadcast sent successfully to ${data.count} recipients!`);
 setBroadcastSubject('');
 setBroadcastMessage('');
 } catch (err: any) {
 alert(err.message || 'Failed to send broadcast');
 } finally {
 setIsBroadcasting(false);
 }
 };

 return (
 <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden flex flex-col">
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
 <h1 className="text-2xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-2">Restricted Access</h1>
 <p className="text-xs text-gray-400 mb-8 font-mono">Enter Admin Credentials to continue</p>
 <form onSubmit={handleLogin} className="space-y-4">
 <div className="space-y-4">
 <div className="relative">
 <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="email"
 required
 autoComplete="off"
 value={emailInput}
 onChange={(e) => setEmailInput(e.target.value)}
 placeholder="Admin Email"
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors font-mono tracking-wide"
 />
 </div>
 <div className="relative">
 <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="password"
 required
 autoComplete="new-password"
 value={passkeyInput}
 onChange={(e) => setPasskeyInput(e.target.value)}
 placeholder="Global Passkey"
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)] transition-colors font-mono tracking-[0.2em]"
 />
 </div>
 {authError && <p className="text-red-400 text-xs mt-2 font-bold uppercase tracking-wider text-center">{authError}</p>}
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
 <div className="container-responsive relative z-10 pt-8 w-full">
 {/* Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
 <div>
 <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase font-mono mb-4">
 <ArrowLeft className="w-4 h-4 text-[var(--neon-cyan)]" /> Return to Main Site
 </Link>
 <h1 className="text-4xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-3">
 <ShieldCheck className="w-10 h-10 text-[var(--neon-cyan)]" /> Admin Core
 </h1>
 </div>
 <div className="flex flex-wrap gap-4 w-full md:w-auto">
 <Link href="/scanner" className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--neon-cyan)]/50 transition-colors font-bold text-sm text-center">
 Launch Scanner
 </Link>
 <button onClick={() => fetchData()} disabled={isLoading} className="flex-1 md:flex-none px-6 py-3.5 rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30 hover:bg-[var(--neon-cyan)]/20 transition-colors font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
 </button>
 <button onClick={exportCSV} className="flex-1 md:flex-none px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
 <Download className="w-4 h-4" /> Export CSV
 </button>
 <button onClick={handleSignOut} className="flex-1 md:flex-none px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
 <LogOut className="w-4 h-4" /> Sign Out
 </button>
 </div>
 </div>
 {/* Dashboard UI Metrics */}
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--neon-cyan)]/50 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-cyan)]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[var(--neon-cyan)]/20 transition-colors" />
      <div className="flex justify-between items-center text-gray-400 mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest">Total Users</span>
        <Users className="w-5 h-5 text-[var(--neon-cyan)]" />
      </div>
      <p className="text-4xl font-black font-[var(--font-heading-main)] text-white relative z-10">{isLoading ? '-' : totalUsers}</p>
    </div>

    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--neon-violet)]/50 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-violet)]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[var(--neon-violet)]/20 transition-colors" />
      <div className="flex justify-between items-center text-gray-400 mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest">Active Check-ins</span>
        <ShieldCheck className="w-5 h-5 text-[var(--neon-violet)]" />
      </div>
      <p className="text-4xl font-black font-[var(--font-heading-main)] text-[var(--neon-violet)] relative z-10">{isLoading ? '-' : attendanceCount}</p>
    </div>

    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--neon-magenta)]/50 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-magenta)]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[var(--neon-magenta)]/20 transition-colors" />
      <div className="flex justify-between items-center text-gray-400 mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest">Gross Revenue</span>
        <CreditCard className="w-5 h-5 text-[var(--neon-magenta)]" />
      </div>
      <p className="text-4xl font-black font-[var(--font-heading-main)] text-[var(--neon-magenta)] relative z-10">
        {isLoading ? '-' : `₹${payments.filter(p => p.status === 'successful').reduce((acc, p) => acc + p.amount, 0)}`}
      </p>
    </div>

    {userRole !== 'Viewer' && (
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-yellow-500/20 transition-colors" />
        <div className="flex justify-between items-center text-gray-400 mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest">Razorpay Balance</span>
          <CreditCard className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-4xl font-black font-[var(--font-heading-main)] text-yellow-400 relative z-10">
          {isFetchingRazorpay ? <Loader2 className="w-8 h-8 animate-spin" /> : razorpayStats ? `₹${razorpayStats.net}` : '-'}
        </p>
      </div>
    )}

    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/50 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/20 transition-colors" />
      <div className="flex justify-between items-center text-gray-400 mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest">Active Events</span>
        <Calendar className="w-5 h-5 text-green-400" />
      </div>
      <p className="text-4xl font-black font-[var(--font-heading-main)] text-green-400 relative z-10">{isLoading ? '-' : events.length}</p>
    </div>
  </div>
 {/* Tabs */}
 <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
 {['Super Admin', 'Editor', 'Viewer'].includes(userRole) && (
 <button 
 onClick={() => setActiveTab('visitors')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'visitors' ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30' : 'text-gray-400 hover:text-white'}`}
 >
 <Users className="w-4 h-4" /> Visitors
 </button>
 )}
 {userRole === 'Super Admin' && (
 <button 
 onClick={() => setActiveTab('settings')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-[var(--neon-violet)]/10 text-[var(--neon-violet)] border border-[var(--neon-violet)]/30' : 'text-gray-400 hover:text-white'}`}
 >
 <Settings className="w-4 h-4" /> Live Stats
 </button>
 )}
 {userRole === 'Super Admin' && (
 <button 
 onClick={() => setActiveTab('users')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'text-gray-400 hover:text-white'}`}
 >
 <Users className="w-4 h-4" /> Manage Roles
 </button>
 )}
 {userRole === 'Super Admin' && (
 <button 
 onClick={() => setActiveTab('logs')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'logs' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white'}`}
 >
 <ShieldCheck className="w-4 h-4" /> Audit Logs
 </button>
 )}
 {(userRole === 'Super Admin' || userRole === 'Editor') && (
 <button
 onClick={() => setActiveTab('payments')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'payments' ? 'bg-white/10 text-white border border-white/30' : 'text-gray-400 hover:text-white'}`}
 >
 <CreditCard className="w-4 h-4" /> Payments
 </button>
 )}
 {(userRole === 'Super Admin' || userRole === 'Editor') && (
 <button 
 onClick={() => setActiveTab('broadcast')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'broadcast' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white'}`}
 >
 <Send className="w-4 h-4" /> Broadcast
 </button>
 )}
 {['Super Admin', 'Editor', 'Viewer'].includes(userRole) && (
 <button 
 onClick={() => setActiveTab('events')}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)] border border-[var(--neon-magenta)]/30' : 'text-gray-400 hover:text-white'}`}
 >
 <Calendar className="w-4 h-4" /> Events
 </button>
 )}
 </div>
 {activeTab === 'settings' && siteSettings ? (
 <div className="glass rounded-3xl border border-white/10 p-8 max-w-4xl">
 <h2 className="text-2xl font-[var(--font-heading-main)] font-black mb-6 text-[var(--neon-violet)]">Edit Live Stats</h2>
 <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { key: 'participants', label: 'Participants (5000+)', type: 'number' },
 { key: 'events', label: 'Total Events (50+)', type: 'number' },
 { key: 'prize_pool', label: 'Prize Pool in Lakhs (2L+)', type: 'number' },
 { key: 'colleges', label: 'Colleges (100+)', type: 'number' },
 { key: 'workshops', label: 'Workshops (10+)', type: 'number' },
 { key: 'first_prize', label: '1st Prize Amount (₹)', type: 'number' },
 { key: 'second_prize', label: '2nd Prize Amount (₹)', type: 'number' },
 { key: 'third_prize', label: '3rd Prize Amount (₹)', type: 'number' },
 { key: 'spots_remaining', label: 'Spots Remaining', type: 'number' },
 { key: 'total_spots', label: 'Total Spots', type: 'number' }
 ].map(field => (
 <div key={field.key}>
 <label htmlFor={field.key} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
 <input
 id={field.key}
 type={field.type}
 value={siteSettings[field.key] ?? ''}
 onChange={(e) => setSiteSettings({ ...siteSettings, [field.key]: e.target.value })}
 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-violet)] outline-none"
 required
 />
 </div>
 ))}
 <div className="md:col-span-2">
 <label htmlFor="workshops_status" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Workshops Status</label>
 <select
   id="workshops_status"
   value={siteSettings.workshops_status || 'coming_soon'}
   onChange={(e) => setSiteSettings({ ...siteSettings, workshops_status: e.target.value })}
   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-violet)] outline-none"
 >
   <option value="coming_soon">Coming Soon</option>
   <option value="active">Active</option>
 </select>
 </div>
 <div className="md:col-span-2">
 <label htmlFor="events_status" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Events Status</label>
 <select
   id="events_status"
   value={(siteSettings as any).events_status || 'active'}
   onChange={(e) => setSiteSettings({ ...siteSettings, events_status: e.target.value } as any)}
   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] outline-none"
 >
   <option value="coming_soon">Coming Soon</option>
   <option value="active">Active</option>
 </select>
 </div>
 <div className="md:col-span-2">
 <label htmlFor="pre_events_status" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pre-Events Status</label>
 <select
   id="pre_events_status"
   value={(siteSettings as any).pre_events_status || 'active'}
   onChange={(e) => setSiteSettings({ ...siteSettings, pre_events_status: e.target.value } as any)}
   className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-magenta)] outline-none"
 >
   <option value="coming_soon">Coming Soon</option>
   <option value="active">Active</option>
 </select>
 </div>
 <div className="md:col-span-2 pt-4">
 <button
 type="submit"
 disabled={isSavingSettings}
 className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
 >
 {isSavingSettings ? 'Saving...' : 'Save Settings'}
 </button>
 </div>
 </form>
 </div>
 ) : activeTab === 'logs' ? (
  <div className="glass rounded-3xl border border-white/10 p-8 max-w-4xl">
  <h2 className="text-2xl font-[var(--font-heading-main)] font-black mb-6 text-red-400">Security Audit Logs</h2>
  
  {/* Logs Filter */}
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input 
        type="text" 
        placeholder="Search Logs by Admin Email or Action..."
        value={logSearchTerm}
        onChange={e => setLogSearchTerm(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[var(--neon-cyan)] outline-none"
      />
    </div>
  </div>

  <div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
 <thead>
 <tr className="border-b border-white/10 text-gray-400 font-mono text-xs uppercase">
 <th className="py-4 font-bold">Admin Email</th>
 <th className="py-4 font-bold">Action</th>
 <th className="py-4 font-bold">Time</th>
 </tr>
 </thead>
 <tbody>
  {adminLogs.filter(log => {
    const term = logSearchTerm.toLowerCase();
    return log.admin_email.toLowerCase().includes(term) || log.action.toLowerCase().includes(term);
  }).map((log) => (
  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
  <td className="py-4 font-mono text-[var(--neon-cyan)]">{log.admin_email}</td>
  <td className="py-4 font-bold">{log.action}</td>
  <td className="py-4 text-gray-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
  </tr>
  ))}
  {adminLogs.filter(log => {
    const term = logSearchTerm.toLowerCase();
    return log.admin_email.toLowerCase().includes(term) || log.action.toLowerCase().includes(term);
  }).length === 0 && (
  <tr>
  <td colSpan={3} className="py-8 text-center text-gray-500 font-mono">No logs found</td>
  </tr>
  )}
  </tbody>
 </table>
 </div>
 </div>
 ) : activeTab === 'users' ? (
 <div className="glass rounded-3xl border border-white/10 p-8 max-w-4xl">
 <h2 className="text-2xl font-[var(--font-heading-main)] font-black mb-6 text-orange-400">Manage Roles</h2>
 <form onSubmit={handleAddAdminUser} className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
 <input
 type="email"
 placeholder="User Email"
 required
 value={newUserEmail}
 onChange={(e) => setNewUserEmail(e.target.value)}
 className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
 />
 <select 
 value={newUserRole}
 onChange={(e) => setNewUserRole(e.target.value as Role)}
 className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
 >
 <option value="Super Admin">Super Admin</option>
 <option value="Editor">Editor</option>
 <option value="Scanner">Scanner</option>
 <option value="Viewer">Viewer</option>
 </select>
 <button type="submit" className="bg-white text-black hover:bg-gray-200 transition-colors font-semibold rounded-full px-6 py-3 text-sm flex items-center justify-center gap-2">
 Make Admin
 </button>
 </form>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="border-b border-white/10 text-gray-400 font-mono text-xs uppercase">
 <th className="py-4 font-bold">Email</th>
 <th className="py-4 font-bold">Role</th>
 <th className="py-4 font-bold text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {adminUsers.map((user) => (
 <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
 <td className="py-4 font-mono text-white">{user.email}</td>
 <td className="py-4">
 <span className={`text-xs font-bold px-2 py-1 rounded-full border 
 ${user.role === 'Super Admin' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 
 user.role === 'Editor' ? 'border-[var(--neon-magenta)]/30 text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10' : 
 user.role === 'Scanner' ? 'border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10' : 
 'border-gray-500/30 text-gray-400 bg-gray-500/10'}`}
 >
 {user.role}
 </span>
 </td>
 <td className="py-4 text-right">
 {user.email !== loggedInEmail && (
 <button onClick={() => handleDeleteAdminUser(user.id, user.email)} className="text-red-400 hover:text-red-300 p-2 transition-colors">
 <Trash2 className="w-4 h-4" />
 </button>
 )}
 </td>
 </tr>
 ))}
 {adminUsers.length === 0 && (
 <tr>
 <td colSpan={3} className="py-8 text-center text-gray-500 font-mono">No users found</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 ) : activeTab === 'payments' ? (
 <div className="glass rounded-3xl border border-white/10 p-8 max-w-4xl">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl font-black text-white flex items-center gap-2">
 <CreditCard className="w-5 h-5 text-[var(--neon-cyan)]" />
 Payments & Refunds
 </h2>
 <button onClick={fetchPayments} className="text-xs font-bold text-gray-400 hover:text-white uppercase">Refresh</button>
 </div>
 {/* Filters */}
 <div className="flex flex-col md:flex-row gap-4 mb-6">
  <div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  <input 
  type="text" 
  placeholder="Search Payment by Name, Event, Email, or Phone..."
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
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-gray-300">
  <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
  <tr>
  <th className="px-6 py-4">Visitor Name</th>
  <th className="px-6 py-4">Contact No.</th>
  <th className="px-6 py-4">Event</th>
  <th className="px-6 py-4">Amount</th>
  <th className="px-6 py-4">Status</th>
  <th className="px-6 py-4 text-right">Actions</th>
  </tr>
  </thead>
 <tbody className="divide-y divide-white/5">
 {payments.length === 0 ? (
 <tr><td colSpan={6} className="px-6 py-8 text-center">No payments found.</td></tr>
 ) : (
  payments.filter(p => {
    const term = paymentSearchTerm.toLowerCase();
    const v = visitors.find(vis => vis.id === p.visitor_id);
    const name = (v?.name || '').toLowerCase();
    const phone = (v?.phone || '').toLowerCase();
    const event = (p.event_id || '').toLowerCase();
    const email = (v?.email || '').toLowerCase();
    const matchesSearch = name.includes(term) || phone.includes(term) || event.includes(term) || email.includes(term);
    const matchesStatus = paymentFilterStatus === 'all' || p.status.toLowerCase() === paymentFilterStatus;
    return matchesSearch && matchesStatus;
  }).map((p) => {
    const v = visitors.find(vis => vis.id === p.visitor_id);
    return (
  <tr key={p.id}>
  <td className="px-6 py-4 font-semibold text-white">{v?.name || p.visitor_id.substring(0, 8)}</td>
  <td className="px-6 py-4 text-gray-300 font-mono text-xs">{v?.phone || '-'}</td>
 <td className="px-6 py-4">{p.event_id}</td>
 <td className="px-6 py-4">₹{p.amount}</td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status === 'successful' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20'}`}>
 {p.status}
 </span>
 </td>
 <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
 {p.status === 'successful' && (
 <>
  <button onClick={() => handleResendTicket(p, v?.name || 'Visitor', v?.email || '')} className="text-blue-400 hover:underline flex items-center gap-1 text-xs" title="Resend Ticket Email">
    <Mail className="w-3 h-3" /> Resend Ticket
  </button>
  <button onClick={() => handleRefund(p.id, p.razorpay_payment_id, p.amount)} className="text-red-400 hover:underline text-xs">Refund</button>
 </>
 )}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 ) : activeTab === 'visitors' ? (
 <>
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
 <select value={filterTrack} onChange={e => setFilterTrack(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-[var(--neon-cyan)] transition-colors">
 <option value="">All Tracks ▼</option>
 <option value="main">🎯 Main Events</option>
 <option value="workshop">🔧 Workshops</option>
 <option value="pre">⚡ Pre-Events</option>
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
 {(visitor.registered_events || []).length > 0 ? (
   visitor.registered_events.map(eventTitle => (
     <div key={eventTitle} className="flex items-center gap-2 mb-2">
       <span>{eventTitle}</span>
       <button onClick={() => handleAdminGenerateTicket(visitor, eventTitle)} className="text-[10px] text-white bg-white/10 px-2 py-1 rounded hover:bg-[var(--neon-cyan)] hover:text-black transition-colors flex items-center gap-1">
         <Download className="w-3 h-3" /> Ticket
       </button>
     </div>
   ))
 ) : 'General Entry'}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </>
 ) : activeTab === 'events' ? (
 <>
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-[var(--font-heading-main)] font-black text-[var(--neon-magenta)]">Event Management</h2>
 {['Super Admin', 'Editor'].includes(userRole) && (
 <button 
 onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }}
 className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
 >
 <Plus className="w-4 h-4" /> Add Event
 </button>
 )}
 </div>
 <div className="glass rounded-3xl border border-white/10 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-white/5 border-b border-white/10">
 <tr>
 <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Event</th>
 <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Track</th>
 <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Registrations</th>
 <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {isLoading ? (
 <tr>
 <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
 <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--neon-magenta)]" />
 </td>
 </tr>
 ) : events.length === 0 ? (
 <tr>
 <td colSpan={3} className="px-6 py-12 text-center text-gray-400">No events found.</td>
 </tr>
 ) : (
 events.map(event => {
 const regCount = visitors.filter(v => v.registered_events && v.registered_events.includes(event.title)).length;
 return (
 <tr key={event.id} className="hover:bg-white/[0.02]">
 <td className="px-6 py-4">
 <div className="font-bold text-white">{event.title}</div>
 <div className="text-xs text-gray-500">{event.event_date}</div>
 </td>
 <td className="px-6 py-4 text-gray-300 font-mono text-xs">{event.track_id}</td>
 <td className="px-6 py-4 text-[var(--neon-cyan)] font-bold">{regCount}</td>
 <td className="px-6 py-4 text-right">
 {['Super Admin', 'Editor'].includes(userRole) ? (
 <>
 <button onClick={() => { setEditingEvent(event); setIsEventModalOpen(true); }} className="text-[var(--neon-cyan)] hover:text-white mr-4 p-2 transition-colors">
 <Edit className="w-4 h-4" />
 </button>
 <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-300 p-2 transition-colors">
 <Trash2 className="w-4 h-4" />
 </button>
 </>
 ) : (
 <span className="text-xs text-gray-500 font-mono">Read Only</span>
 )}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 {isEventModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setIsEventModalOpen(false)}>
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-[#030014] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
 <h2 className="text-2xl font-[var(--font-heading-main)] font-black text-white">
 {editingEvent ? 'Edit Event' : 'Add New Event'}
 </h2>
 <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-white p-2">
 <X className="w-6 h-6" />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin" data-lenis-prevent="true">
 <form onSubmit={handleSaveEvent} className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Event ID</label>
 <input name="id" defaultValue={editingEvent?.id} required disabled={!!editingEvent} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-50" placeholder="e.g. main-1" />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Track ID</label>
 <select name="track_id" defaultValue={editingEvent?.track_id || 'pre-events'} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white">
 <option value="pre-events">Pre-Events</option>
 <option value="main-events">Main Events</option>
 <option value="workshops">Workshops</option>
 </select>
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
 <input name="title" defaultValue={editingEvent?.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
 <textarea name="description" defaultValue={editingEvent?.description} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Team Size</label>
 <input name="team_size" defaultValue={editingEvent?.team_size} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="e.g. Solo, Duo, Squad" />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fee</label>
 <input name="fee" defaultValue={editingEvent?.fee} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="e.g. ₹100" />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date & Time</label>
 <input name="event_date" defaultValue={editingEvent?.event_date} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="e.g. Day 1 - 10:00 AM" />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Venue</label>
 <input name="venue" defaultValue={editingEvent?.venue} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image URL</label>
 <input name="image_url" defaultValue={editingEvent?.image_url} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Google Form Link (Pre-Events Only)</label>
 <input name="gform_link" defaultValue={editingEvent?.gform_link} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="https://forms.gle/..." />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Coordinator Name</label>
 <input name="contact_name" defaultValue={editingEvent?.contact_name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="e.g. Yuvenza Event Desk" />
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Contact Number</label>
 <input name="contact_number" defaultValue={editingEvent?.contact_number} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="+91 98765 43210" />
 </div>
 <div className="md:col-span-2 flex items-center gap-2 mt-2">
 <input type="checkbox" name="housefull" id="housefull" defaultChecked={editingEvent?.housefull} className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[var(--neon-cyan)] cursor-pointer" />
 <label htmlFor="housefull" className="text-xs font-bold text-gray-400 uppercase cursor-pointer">Mark as Housefull (Sold Out)</label>
 </div>
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rules (One per line)</label>
 <textarea name="rules" defaultValue={editingEvent?.rules.join('\n')} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" placeholder="Rule 1\nRule 2" />
 </div>
 </div>
 <div className="pt-4 flex">
 <button type="submit" className="flex-1 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
 {editingEvent ? 'Update Event' : 'Create Event'}
 </button>
 </div>
 </form>
 </div>
 </motion.div>
 </div>
 )}
 </>
 ) : activeTab === 'broadcast' ? (
    <div className="glass rounded-3xl border border-white/10 p-8 max-w-4xl">
      <h2 className="text-2xl font-[var(--font-heading-main)] font-black mb-6 text-blue-400 flex items-center gap-3">
        <Send className="w-6 h-6" /> Broadcast Center
      </h2>
      <form onSubmit={handleSendBroadcast} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Audience</label>
          <select 
            value={broadcastAudience} 
            onChange={(e) => setBroadcastAudience(e.target.value as 'all' | 'paid')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0f172a]">All Registered Users</option>
            <option value="paid" className="bg-[#0f172a]">Users with Successful Payments (Vitality Pass)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Subject</label>
          <input 
            type="text" 
            required
            value={broadcastSubject}
            onChange={(e) => setBroadcastSubject(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
            placeholder="e.g. Important Update: Yuvenza '26 Schedule"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Message (HTML allowed)</label>
          <textarea 
            required
            rows={6}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-y"
            placeholder="Write your message here. Line breaks will be converted to <br/> tags automatically."
          />
        </div>
        <button
          type="submit"
          disabled={isBroadcasting}
          className="w-full md:w-auto px-8 py-4 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isBroadcasting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isBroadcasting ? 'Sending...' : 'Send Broadcast'}
        </button>
      </form>

      <hr className="my-10 border-white/10" />

      <h2 className="text-2xl font-[var(--font-heading-main)] font-black mb-6 text-[var(--neon-magenta)] flex items-center gap-3">
        <Bell className="w-6 h-6" /> Drop Dashboard Alert
      </h2>
      <form onSubmit={handleSendNotification} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Participant Email</label>
          <input 
            type="email" 
            required
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-magenta)] outline-none"
            placeholder="e.g. participant@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alert Title</label>
          <input 
            type="text" 
            required
            value={notifyTitle}
            onChange={(e) => setNotifyTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-magenta)] outline-none"
            placeholder="e.g. Missing ID Proof"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alert Message</label>
          <textarea 
            required
            rows={4}
            value={notifyMessage}
            onChange={(e) => setNotifyMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--neon-magenta)] outline-none resize-none"
            placeholder="Please upload your college ID proof in the portal..."
          />
        </div>
        <button 
          type="submit" 
          disabled={isNotifying}
          className="w-full md:w-auto px-8 py-4 bg-[var(--neon-magenta)] text-black font-bold rounded-full hover:opacity-90 transition-opacity uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isNotifying ? (
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          ) : (
            <Bell className="w-5 h-5 text-black" />
          )}
          {isNotifying ? 'Sending...' : 'Drop Dashboard Alert'}
        </button>
      </form>
    </div>
   ) : null}
   </div>
   )}
   
   {ticketGenVisitor && ticketGenEvent && (
     <AdminTicketGenerator 
       ref={ticketGenRef}
       visitor={ticketGenVisitor}
       eventTitle={ticketGenEvent}
       eventFee="VIP"
     />
   )}
   {isGeneratingTicket && (
     <div className="fixed bottom-4 right-4 bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 z-[9999] shadow-2xl">
       <Loader2 className="w-4 h-4 animate-spin" /> Generating HD Ticket...
     </div>
   )}
 </main>
 );
}
