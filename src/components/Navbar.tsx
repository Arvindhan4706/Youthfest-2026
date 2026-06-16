'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../lib/useStore';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300">
      <div className="px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-extrabold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            YUVENZA '26
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-white/10 text-white px-2 py-0.5 rounded-full">
            Yuvenza Club
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#hero" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link href="#galaxy" className="text-sm text-gray-300 hover:text-white transition-colors">Wellness Zones</Link>

          <Link href="#featured" className="text-sm text-gray-300 hover:text-white transition-colors">Events</Link>
          <Link href="#explorer" className="text-sm text-gray-300 hover:text-white transition-colors">AI Search</Link>
          <Link href="#memories" className="text-sm text-gray-300 hover:text-white transition-colors">Memories</Link>
          <Link href="#sponsors" className="text-sm text-gray-300 hover:text-white transition-colors">Partners</Link>
        </div>

        {/* Interactive Stats & Tools */}
        <div className="flex items-center gap-3">
          

          {/* User Dashboard / Admin Portal */}
          <div className="flex items-center gap-1">
            <button 
              onClick={handleUserClick}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
              title={user ? "User Dashboard" : "Login / Register"}
            >
              <User className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
