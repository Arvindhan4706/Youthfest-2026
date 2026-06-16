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
  registeredEvents: string[];
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
  toasts: ToastMessage[];
  addToast: (message: string, options?: { badge?: string; points?: number }) => void;
  removeToast: (id: string) => void;
  registerForEvent: (eventId: string) => Promise<void>;
  addPoints: (points: number, reason: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isMuted: true,
  setMuted: (muted) => set({ isMuted: muted }),
  cursorMode: 'default',
  setCursorMode: (mode) => set({ cursorMode: mode }),
  isSecretMode: false,
  setSecretMode: (active) => {
    set({ isSecretMode: active });
    if (active) {
      get().addToast('🌌 Secret Wellness Flow Unlocked!');
      get().setCursorMode('neon');
    }
  },
  user: null,
  setUser: (user) => set({ user }),
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
  addPoints: (points, reason) => {
    get().addToast(`+${points} Points: ${reason}`, { points });
  },
}));
