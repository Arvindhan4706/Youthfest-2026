'use client';
import React, { useState } from 'react';
import { User, Save, Shield, Phone, Mail, MapPin, BookOpen, Calendar, Users2, CheckCircle } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';

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
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
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
  const [profileCollege, setProfileCollege] = useState(user?.college || '');
  const [profileDepartment, setProfileDepartment] = useState(user?.department || '');
  const [profileYear, setProfileYear] = useState(user?.year || '1');
  const [profileGender, setProfileGender] = useState(user?.gender || 'Male');
  const [profileCity, setProfileCity] = useState(user?.city || '');
  const [isSaving, setIsSaving] = useState(false);

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
      const updated = await db.updateProfile(user.email, {
        name: profileName,
        email: profileEmail,
        college: profileCollege,
        department: profileDepartment,
        year: profileYear,
        gender: profileGender,
        city: profileCity,
      });
      setUser({ ...user, ...updated });
      addToast('✅ Profile information updated successfully!');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : '❌ Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-black">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{user.name || 'Your Name'}</h2>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {user.college && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                🎓 {user.college}
              </span>
            )}
            {user.year && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                📅 {user.year === 'PG' ? 'Post Graduate' : `Year ${user.year}`}
              </span>
            )}
            {user.city && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                📍 {user.city}
              </span>
            )}
          </div>
        </div>
      </div>

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
              value={user.phone || ''}
              disabled
              placeholder="Phone (locked)"
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gender</label>
              <select
                id="gender"
                value={profileGender}
                onChange={(e) => setProfileGender(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)]/60 transition-colors cursor-pointer"
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
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-cyan)]/60 transition-colors cursor-pointer"
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
            className="w-full py-3.5 bg-white hover:bg-gray-200 disabled:opacity-60 text-black font-bold text-sm rounded-full transition-all mt-2 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">YouthFest</p>
              <p className="text-white text-xs">Aug 11–13, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
