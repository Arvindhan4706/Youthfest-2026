'use client';
import { useEffect } from 'react';
import { useStore } from '../lib/useStore';

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function useAutoLogout() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const addToast = useStore((state) => state.addToast);

  useEffect(() => {
    // If no user is logged in, do nothing
    if (!user) return;

    // Check if the user was already inactive for >10 mins before opening the tab/reloading
    const lastActiveStr = localStorage.getItem('y26_last_active');
    if (lastActiveStr) {
      const lastActiveTime = parseInt(lastActiveStr, 10);
      if (Date.now() - lastActiveTime > TIMEOUT_MS) {
        setUser(null);
        addToast('You have been logged out due to inactivity.');
        return; 
      }
    }

    let timeoutId: NodeJS.Timeout;

    const logout = () => {
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
    
    // Throttle the local storage update so we don't spam it on every single mousemove
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
