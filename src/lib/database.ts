import { supabase } from './supabase';

export interface Visitor {
  id: string;
  email: string;
  phone: string;
  name: string;
  registered_events: string[];
  created_at: string;
}

// ─── Public API ──────────────────────────────────────────

export const db = {
  /**
   * Register a new visitor. Returns the new visitor or throws if email/phone already exists.
   */
  async register(data: { email: string; phone: string; name: string }): Promise<Visitor> {
    const emailLower = data.email.toLowerCase().trim();
    const phoneTrim = data.phone.trim();
    const nameTrim = data.name.trim();

    // Check if email or phone already exists
    const { data: existing, error: checkError } = await supabase
      .from('visitors')
      .select('*')
      .or(`email.eq.${emailLower},phone.eq.${phoneTrim}`);

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (existing && existing.length > 0) {
      const emailMatch = existing.some(v => v.email.toLowerCase() === emailLower);
      if (emailMatch) {
        throw new Error('This email is already registered. Please login instead.');
      }
      throw new Error('This phone number is already registered. Please login instead.');
    }

    const { data: newVisitor, error: insertError } = await supabase
      .from('visitors')
      .insert({
        email: emailLower,
        phone: phoneTrim,
        name: nameTrim,
        registered_events: [],
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return newVisitor;
  },

  /**
   * Login by email + phone. Returns the visitor or throws if not found.
   */
  async login(email: string, phone: string): Promise<Visitor> {
    const { data: visitor, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('phone', phone.trim())
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!visitor) {
      throw new Error('Invalid email or contact number. Please check and try again.');
    }

    return visitor;
  },

  /**
   * Update a visitor's profile by email.
   */
  async updateProfile(email: string, updates: { name?: string; email?: string }): Promise<Visitor> {
    const emailLower = email.toLowerCase().trim();
    const payload: any = {};
    if (updates.name) payload.name = updates.name.trim();
    if (updates.email) {
      const newEmail = updates.email.toLowerCase().trim();
      // Check if new email conflicts with another visitor
      const { data: conflict, error: checkError } = await supabase
        .from('visitors')
        .select('id')
        .eq('email', newEmail)
        .maybeSingle();

      if (checkError) throw new Error(checkError.message);
      if (conflict) {
        throw new Error('This email is already taken by another visitor.');
      }
      payload.email = newEmail;
    }

    const { data: updated, error } = await supabase
      .from('visitors')
      .update(payload)
      .eq('email', emailLower)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updated;
  },

  /**
   * Register a visitor for an event.
   */
  async registerForEvent(email: string, eventId: string): Promise<Visitor> {
    const emailLower = email.toLowerCase().trim();
    // First get current events
    const { data: visitor, error: getError } = await supabase
      .from('visitors')
      .select('*')
      .eq('email', emailLower)
      .single();

    if (getError) throw new Error(getError.message);
    if (!visitor) throw new Error('Visitor not found.');

    const events = visitor.registered_events || [];
    if (events.includes(eventId)) {
      throw new Error('You are already registered for this event.');
    }

    const updatedEvents = [...events, eventId];

    const { data: updated, error: updateError } = await supabase
      .from('visitors')
      .update({ registered_events: updatedEvents })
      .eq('email', emailLower)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);
    return updated;
  },

  /**
   * Get total registered count.
   */
  async getVisitorCount(): Promise<number> {
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count || 0;
  },

  /**
   * Get a visitor by email.
   */
  async getByEmail(email: string): Promise<Visitor | null> {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },
};
