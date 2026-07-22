import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique, clean, readable Ticket ID for a user registration.
 * Format: Y26-[EVENT_PREFIX]-[UNIQUE_HASH] (e.g. Y26-HAC-7F3A92)
 */
export function getTicketId(email: string, eventTitle: string): string {
  const str = `${(email || '').toLowerCase().trim()}|${(eventTitle || '').toLowerCase().trim()}`;
  
  let h1 = 5381;
  let h2 = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    h1 = (h1 * 33) ^ char;
    h2 = (h2 << 5) - h2 + char;
    h1 |= 0;
    h2 |= 0;
  }
  
  const hashStr = (Math.abs(h1).toString(36) + Math.abs(h2).toString(36)).toUpperCase();
  const cleanHash = hashStr.padEnd(6, 'X').slice(0, 6);

  const cleanTitle = (eventTitle || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const prefix = cleanTitle.length >= 3 ? cleanTitle.slice(0, 3) : cleanTitle.padEnd(3, 'X');

  return `Y26-${prefix}-${cleanHash}`;
}
