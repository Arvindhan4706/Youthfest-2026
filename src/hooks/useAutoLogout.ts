'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '../lib/useStore';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function useAutoLogout() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);
  const userEmailRef = useRef<string | null>(null);

  useEffect(() => {
    // If no user is logged in, reset tracker
    if (!user) {
      userEmailRef.current = null;
      return;
    }

    const isNewLogin = userEmailRef.current !== user.email;
    userEmailRef.current = user.email;

    if (isNewLogin) {
      // Refresh active timestamp on new login session
      localStorage.setItem('y26_last_active', Date.now().toString());
    } else {
      // Check if user was inactive for >10 mins
      const lastActiveStr = localStorage.getItem('y26_last_active');
      if (lastActiveStr) {
        const lastActiveTime = parseInt(lastActiveStr, 10);
        if (Date.now() - lastActiveTime > TIMEOUT_MS) {
          localStorage.removeItem('y26_last_active');
          setUser(null);
          addToast('You have been logged out due to inactivity.');
          return; 
        }
      } else {
        localStorage.setItem('y26_last_active', Date.now().toString());
      }
    }

    let timeoutId: NodeJS.Timeout;

    const logout = () => {
      localStorage.removeItem('y26_last_active');
      setUser(null);
      addToast('You have been logged out due to inactivity.');
    };

    const resetTimer = () => {
      // Update the last active timestamp in localStorage
      localStorage.setItem('y26_last_active', Date.now().toString());
      
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, TIMEOUT_MS);
    };

    // Set initial timer
    resetTimer();

    // Setup event listeners for user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    let throttleTimer: boolean = false;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = true;
      resetTimer();
      setTimeout(() => { throttleTimer = false; }, 1000); // Only update timer once per second max
    };

    events.forEach(event => document.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, handleActivity));
    };
  }, [user, setUser, addToast]);
}

