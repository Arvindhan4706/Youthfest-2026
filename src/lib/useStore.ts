import { create } from 'zustand';
import { db } from './database';

export type CursorMode = 'default' | 'gaming' | 'festival' | 'neon';

export interface ToastMessage {
  id: string;
  message: string;
  badge?: string;
  points?: number;
}

export interface UserProfile {
  email: string;
  name: string;
  phone: string;
  college?: string;
  department?: string;
  year?: string;
  gender?: string;
  city?: string;
  registeredEvents: string[];
}

export interface EventDetails {
  id: string;
  title: string;
  category: string;
  fee: string;
  desc?: string;
}

export interface EmailMessage {
  id: string;
  eventId: string;
  eventTitle: string;
  amountPaid: string;
  timestamp: string;
  recipientEmail: string;
  subject: string;
  body: string;
}

interface AppState {
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
  isSecretMode: boolean;
  setSecretMode: (active: boolean) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthOpen: boolean;
  authModalTab: 'login' | 'register';
  setAuthOpen: (open: boolean, tab?: 'login' | 'register') => void;
  checkoutEvent: EventDetails | null;
  setCheckoutEvent: (event: EventDetails | null) => void;
  messages: EmailMessage[];
  addMessage: (msg: EmailMessage) => void;
  toasts: ToastMessage[];
  addToast: (message: string, options?: { badge?: string; points?: number }) => void;
  removeToast: (id: string) => void;
  registerForEvent: (eventId: string) => Promise<void>;
  initiateRegistration: (event: EventDetails) => void;
  addPoints: (points: number, reason: string) => void;
}

import { persist } from 'zustand/middleware';

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      // Initialize messages from localStorage if available client-side
      let initialMessages: EmailMessage[] = [];
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('y26_messages');
          if (stored) initialMessages = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }

      return {
    isMuted: true,
    setMuted: (muted) => set({ isMuted: muted }),
    cursorMode: 'default',
    setCursorMode: (mode) => set({ cursorMode: mode }),
    isSecretMode: false,
    setSecretMode: (active) => {
      set({ isSecretMode: active });
      if (active) {
        get().addToast('Secret Wellness Flow Unlocked!');
        get().setCursorMode('neon');
      }
    },
    user: null,
    setUser: (user) => set({ user }),
    isAuthOpen: false,
    authModalTab: 'login',
    setAuthOpen: (open, tab) => set({ isAuthOpen: open, authModalTab: tab || 'login' }),
    checkoutEvent: null,
    setCheckoutEvent: (event) => set({ checkoutEvent: event }),
    messages: initialMessages,
    addMessage: (msg) => set((state) => {
      const updated = [msg, ...state.messages];
      if (typeof window !== 'undefined') {
        localStorage.setItem('y26_messages', JSON.stringify(updated));
      }
      return { messages: updated };
    }),
    toasts: [],
    addToast: (message, options) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = {
        id,
        message,
        badge: options?.badge,
        points: options?.points,
      };
      
      set((state) => ({ toasts: [...state.toasts, newToast] }));

      // Auto-remove toast after 4s
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id) => set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
    registerForEvent: async (eventId) => {
      const user = get().user;
      if (!user) return;
      
      if (user.registeredEvents.includes(eventId)) {
        get().addToast('You are already registered for this event!');
        return;
      }

      try {
        // Persist to Supabase database
        const updated = await db.registerForEvent(user.email, eventId);
        
        set({
          user: {
            ...user,
            registeredEvents: updated.registered_events,
          },
        });

        get().addToast(`Successfully registered for ${eventId}!`);
      } catch (err: any) {
        get().addToast(err.message || 'Failed to register for event.');
      }
    },
    initiateRegistration: (event) => {
      const user = get().user;
      if (!user) {
        get().addToast('Please login or register a profile first to join events.');
        get().setAuthOpen(true);
        return;
      }

      if (user.registeredEvents.includes(event.title)) {
        get().addToast('You are already registered for this event!');
        return;
      }

      // Open checkout modal
      get().setCheckoutEvent(event);
    },
    addPoints: (points, reason) => {
      get().addToast(`+${points} Points: ${reason}`, { points });
    },
    };
  },
  {
    name: 'youthfest-storage',
    partialize: (state) => ({ 
      user: state.user,
      isMuted: state.isMuted,
      isSecretMode: state.isSecretMode
    }),
  }
)
);
