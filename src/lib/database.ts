import { supabase } from './supabase';

export interface Visitor {
  id: string;
  email: string;
  phone: string;
  name: string;
  college?: string;
  department?: string;
  year?: string;
  gender?: string;
  city?: string;
  registered_events: string[];
  payment_status: 'pending' | 'paid';
  created_at: string;
}

// ─── Public API ──────────────────────────────────────────

export const db = {
  /**
   * Register a new visitor. Returns the new visitor or throws if email/phone already exists.
   */
  async register(data: { email: string; phone: string; name: string; college?: string; department?: string; year?: string; gender?: string; city?: string }): Promise<Visitor> {
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
        college: data.college,
        department: data.department,
        year: data.year,
        gender: data.gender,
        city: data.city,
        registered_events: [],
        payment_status: 'pending',
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
  async updateProfile(email: string, updates: { name?: string; email?: string; college?: string; department?: string; year?: string; gender?: string; city?: string }): Promise<Visitor> {
    const emailLower = email.toLowerCase().trim();
    const payload: any = {};
    if (updates.name) payload.name = updates.name.trim();
    if (updates.college) payload.college = updates.college.trim();
    if (updates.department) payload.department = updates.department.trim();
    if (updates.year) payload.year = updates.year.trim();
    if (updates.gender) payload.gender = updates.gender.trim();
    if (updates.city) payload.city = updates.city.trim();
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
   * Update a visitor's payment status (usually called by Webhook).
   */
  async updatePaymentStatus(email: string, status: 'paid' | 'pending'): Promise<Visitor> {
    const emailLower = email.toLowerCase().trim();

    const { data: updated, error } = await supabase
      .from('visitors')
      .update({ payment_status: status })
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

  /**
   * Get all registered visitors (Admin feature).
   */
  async getAllVisitors(): Promise<Visitor[]> {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Verify a ticket for scanner and mark attendance.
   */
  async verifyTicket(email: string, eventId: string): Promise<Visitor> {
    const { data: visitor, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !visitor) {
      throw new Error('Ticket Invalid: Visitor not found.');
    }

    const events = visitor.registered_events || [];
    if (!events.includes(eventId)) {
      throw new Error(`UNAUTHORIZED: Not registered for ${eventId}`);
    }

    // Try to mark attendance
    const { error: attendanceError } = await supabase
      .from('attendance')
      .insert({
        visitor_id: visitor.id,
        visitor_name: visitor.name || 'Unknown',
        visitor_email: visitor.email || email,
        event_id: eventId,
      });

    // If it violates unique constraint, they are already checked in
    if (attendanceError) {
      if (attendanceError.code === '23505') { // Postgres unique violation code
        throw new Error('ALREADY ENTERED: This ticket was already scanned.');
      } else {
        throw new Error(`Attendance Error: ${attendanceError.message}`);
      }
    }

    return visitor;
  },

  /**
   * Get Total Check-ins
   */
  async getAttendanceCount(): Promise<number> {
    const { count, error } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count || 0;
  },
};
