'use client';
import React, { useState, useEffect } from 'react';
import { User, Save, Shield, Phone, Mail, MapPin, BookOpen, Calendar, Users2, CheckCircle, Bell, X } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { db, Notification } from '../../lib/database';

function Field({
  label, value, onChange, type = 'text', disabled = false, placeholder = '', id
}: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; disabled?: boolean; placeholder?: string; id?: string;
}) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-[12px] px-4 h-[48px] text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
          disabled
            ? 'border-white/5 opacity-50 cursor-not-allowed'
            : 'border-white/10 focus:border-[var(--neon-cyan)]/60 hover:border-white/20'
        }`}
      />
    </div>
  );
}

export default function VisitorProfile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileCollege, setProfileCollege] = useState(user?.college || '');
  const [profileDepartment, setProfileDepartment] = useState(user?.department || '');
  const [profileYear, setProfileYear] = useState(user?.year || '1');
  const [profileGender, setProfileGender] = useState(user?.gender || 'Male');
  const [profileCity, setProfileCity] = useState(user?.city || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const [isRequestingOD, setIsRequestingOD] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user?.email]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(user!.email)}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  if (!user) return null;

  const initials = profileName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'YF';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileEmail,
          name: profileName,
          phone: profilePhone,
          college: profileCollege,
          department: profileDepartment,
          city: profileCity
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      setUser({ ...user, ...data.visitor });
      addToast('✅ Profile information updated successfully!');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : '❌ Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

 // Retry logic removed

  const handleRequestOD = async () => {
    setIsRequestingOD(true);
    try {
      const res = await fetch('/api/send-od', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          department: user.department,
          eventTitle: user.registeredEvents && user.registeredEvents.length > 0 ? user.registeredEvents[0] : 'Events & Workshops'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request OD letter');
      addToast('📧 OD Letter has been sent to your email!');
    } catch (err: any) {
      addToast('❌ ' + (err.message || 'Failed to request OD'));
    } finally {
      setIsRequestingOD(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Notification Bell */}
      <div className="absolute top-0 right-0 z-50">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:border-white/30 flex items-center justify-center transition-all relative group shadow-lg"
        >
          <Bell className={`w-5 h-5 text-gray-400 group-hover:text-white transition-colors ${unreadCount > 0 ? 'animate-pulse text-[var(--neon-magenta)]' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-[var(--neon-magenta)] rounded-full border-2 border-black" />
          )}
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-bold text-sm text-white">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm font-mono">No notifications yet</div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${notif.is_read ? 'opacity-70 hover:bg-white/[0.02]' : 'bg-[var(--neon-cyan)]/5 hover:bg-[var(--neon-cyan)]/10'}`}
                      onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-sm font-bold ${notif.is_read ? 'text-gray-300' : 'text-[var(--neon-cyan)]'}`}>{notif.title}</h4>
                        {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-wider">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] pr-16">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-[12px] bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-[12px] bg-green-500 flex items-center justify-center border-2 border-black">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{user.name || 'Your Name'}</h2>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {user.college && (
              <span className="text-xs px-3 py-1 rounded-[12px] bg-white/5 border border-white/10 text-gray-300">
                🎓 {user.college}
              </span>
            )}
            {user.year && (
              <span className="text-xs px-3 py-1 rounded-[12px] bg-white/5 border border-white/10 text-gray-300">
                📅 {user.year === 'PG' ? 'Post Graduate' : `Year ${user.year}`}
              </span>
            )}
            {user.city && (
              <span className="text-xs px-3 py-1 rounded-[12px] bg-white/5 border border-white/10 text-gray-300">
                📍 {user.city}
              </span>
            )}
          </div>
        </div>
      </div>



      {user.payment_status === 'paid' && user.registeredEvents && user.registeredEvents.length > 0 && (
        <div className="p-5 rounded-2xl bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[var(--neon-cyan)] font-bold text-sm">Official On Duty (OD) Letter</h3>
            <p className="text-[var(--neon-cyan)]/80 text-xs mt-1">Get an official digital OD letter sent to your email to submit to your college.</p>
          </div>
          <button 
            onClick={handleRequestOD}
            disabled={isRequestingOD}
            className="px-6 py-2.5 bg-[var(--neon-cyan)] hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            {isRequestingOD ? 'Sending...' : 'Email My OD Letter'}
          </button>
        </div>
      )}

      {/* Edit Form */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--neon-cyan)]" />
          Edit Profile Information
        </h3>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" value={profileName} onChange={setProfileName} placeholder="Enter your full name" />
            <Field label="Email Address" value={profileEmail} type="email" disabled placeholder="Email address" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Contact Number"
              value={profilePhone}
              onChange={setProfilePhone}
              placeholder="e.g. 9876543210"
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gender</label>
              <select
                id="gender"
                value={profileGender}
                onChange={(e) => setProfileGender(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-[12px] px-4 h-[48px] text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)]/60 transition-colors cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="College / Institution" value={profileCollege} onChange={setProfileCollege} placeholder="e.g., Chennai Institute of Technology" />
            <Field label="Department" value={profileDepartment} onChange={setProfileDepartment} placeholder="e.g., Computer Science" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="year-of-study" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Year of Study</label>
              <select
                id="year-of-study"
                value={profileYear}
                onChange={(e) => setProfileYear(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-[12px] px-4 h-[48px] text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)]/60 transition-colors cursor-pointer"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="PG">Post Graduate</option>
              </select>
            </div>
            <Field label="City" value={profileCity} onChange={setProfileCity} placeholder="Your city" />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-[48px] bg-white hover:bg-gray-200 disabled:opacity-60 text-black font-bold text-sm rounded-[12px] transition-all mt-2 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-[12px] animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile Details
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--neon-violet)]" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Mail className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-white text-xs truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
              <p className="text-green-400 text-xs font-bold">Verified Participant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Calendar className="w-4 h-4 text-[var(--neon-magenta)] shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Yuvenza</p>
              <p className="text-white text-xs">Aug 21, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

