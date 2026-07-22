'use client';
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';

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

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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

      setUser({
        ...user,
        email: updated.email,
        name: updated.name,
        college: updated.college,
        department: updated.department,
        year: updated.year,
        gender: updated.gender,
        city: updated.city,
      });

      addToast('Profile information updated!');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed to update profile.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">College</label>
            <input type="text" value={profileCollege} onChange={(e) => setProfileCollege(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Department</label>
            <input type="text" value={profileDepartment} onChange={(e) => setProfileDepartment(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Year</label>
            <select value={profileYear} onChange={(e) => setProfileYear(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="PG">Post Graduate</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Gender</label>
            <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">City</label>
            <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-white hover:bg-gray-200 text-black font-semibold text-sm rounded-full transition-all mt-2"
        >
          Save Details
        </button>
      </form>
    </div>
  );
}
