'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/useStore';

export default function AuthCallback() {
  const router = useRouter();
  const setUser = useStore(state => state.setUser);
  const addToast = useStore(state => state.addToast);
  const setAuthOpen = useStore(state => state.setAuthOpen);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    let handled = false;
    
    async function handleAuth(session: any) {
      if (handled) return;
      handled = true;
      try {
        const res = await fetch('/api/auth/google-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Authentication failed');

        if (data.status === 'existing') {
          const visitor = data.visitor;
          if (mounted) {
            setUser({ 
              email: visitor.email, name: visitor.name, phone: visitor.phone, 
              college: visitor.college, department: visitor.department, 
              year: visitor.year, gender: visitor.gender, city: visitor.city,
              registeredEvents: visitor.registered_events 
            });
            addToast(`Welcome back, ${visitor.name}!`);
            router.push('/');
          }
        } else if (data.status === 'new') {
          if (mounted) {
            router.push(`/auth/complete-profile?email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name)}`);
          }
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) {
          setError(err.message || 'An error occurred during authentication.');
          setTimeout(() => {
            router.push('/');
            setAuthOpen(true, 'login');
          }, 3000);
        }
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
         handleAuth(session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            handleAuth(session);
        } else {
            // Check if URL has hash, if it does, onAuthStateChange will catch it shortly
            if (!window.location.hash) {
                if (mounted && !handled) {
                    setError('No session found. Please try logging in again.');
                    setTimeout(() => router.push('/'), 3000);
                }
            }
        }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router, setUser, addToast, setAuthOpen]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center space-y-4">
          <p className="text-red-400 font-bold text-lg">{error}</p>
          <p className="text-gray-400 text-sm">Redirecting back...</p>
        </div>
      ) : (
        <div className="text-center space-y-4 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[var(--neon-cyan)] animate-spin" />
          <h2 className="text-white font-bold text-xl">Authenticating...</h2>
          <p className="text-gray-400 text-sm">Please wait while we verify your account.</p>
        </div>
      )}
    </div>
  );
}
