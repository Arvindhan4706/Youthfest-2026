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
export interface Payment {
  id: string;
  visitor_id: string;
  event_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  created_at: string;
}
export interface Notification {
  id: string;
  visitor_email: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export interface SiteSettings {
  id: string;
  participants: number;
  events: number;
  prize_pool: number;
  colleges: number;
  workshops: number;
  workshops_status: 'coming_soon' | 'active';
  events_status: 'coming_soon' | 'active';
  pre_events_status: 'coming_soon' | 'active';
  first_prize: number;
  second_prize: number;
  third_prize: number;
  spots_remaining: number;
  total_spots: number;
  contact_institute: string;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  updated_at: string;
}
export interface AdminLog {
  id: string;
  admin_email: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}
export interface EventItem {
  id: string;
  track_id: string;
  title: string;
  description: string;
  team_size: string;
  fee: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image_url: string;
  event_date: string;
  venue: string;
  rules: string[];
  gform_link?: string;
  created_at?: string;
}
export type Role = 'Super Admin' | 'Editor' | 'Scanner' | 'Viewer';
export interface AdminUser {
  id: string;
  email: string;
  role: Role;
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
   * Log a payment attempt in the payments table
   */
  async logPayment(data: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const { data: newPayment, error } = await supabase
      .from('payments')
      .insert(data)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return newPayment;
  },
  /**
   * Fetch all payments for admin panel
   */
  async getAllPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  /**
   * Fetch payments for a specific visitor
   */
  async getPaymentsByVisitorId(visitorId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  /**
   * Mark a payment as refunded
   */
  async updatePaymentRefunded(id: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', id);
    if (error) throw new Error(error.message);
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
   * Fetch visitor profile by email.
   */
  async getVisitorByEmail(email: string): Promise<Visitor | null> {
    const { data: visitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    return visitor || null;
  },
  /**
   * Update a visitor's profile by email.
   */
  async updateProfile(email: string, updates: { name?: string; email?: string; phone?: string; college?: string; department?: string; year?: string; gender?: string; city?: string }): Promise<Visitor> {
    const emailLower = email.toLowerCase().trim();
    const payload: Partial<Visitor> = {};
    if (updates.name) payload.name = updates.name.trim();
    if (updates.phone) payload.phone = updates.phone.trim();
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
  
  /**
   * Get all event IDs a visitor has successfully attended.
   */
  async getVisitorAttendance(visitorEmail: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('event_id')
        .eq('visitor_email', visitorEmail.toLowerCase().trim());
      if (error) throw new Error(error.message);
      return (data || []).map(record => record.event_id);
    } catch (e) {
      console.error('Failed to fetch attendance', e);
      return [];
    }
  },
  
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
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    } catch (e) {
      console.warn('Failed to fetch visitors, using fallback empty array:', e);
      return [];
    }
  },
  /**
   * Log an admin action
   */
  async logAdminAction(adminEmail: string, action: string, details?: Record<string, unknown>): Promise<void> {
    try {
      await supabase.from('admin_logs').insert({
        admin_email: adminEmail,
        action,
        details: details || {}
      });
    } catch (err) {
      console.error('Failed to log admin action', err);
    }
  },
  /**
   * Get all admin logs (Super Admin only)
   */
  async getAdminLogs(): Promise<AdminLog[]> {
    const { data, error } = await supabase
      .from('admin_logs')
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
    try {
      const { count, error } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true });
      if (error) throw new Error(error.message);
      return count || 0;
    } catch (e) {
      console.warn('Failed to fetch attendance count, using fallback 0:', e);
      return 0;
    }
  },
  /**
   * Get Site Settings
   */
  async getSiteSettings(): Promise<SiteSettings> {
    const defaultSettings = {
      id: 'stats',
      participants: 5000,
      events: 50,
      prize_pool: 2,
      colleges: 100,
      workshops: 10,
      workshops_status: 'coming_soon' as const,
      events_status: 'active' as const,
      pre_events_status: 'active' as const,
      first_prize: 50000,
      second_prize: 25000,
      third_prize: 10000,
      spots_remaining: 847,
      total_spots: 5000,
      contact_institute: 'Chennai Institute of Technology',
      contact_address: 'Sarathy Nagar, Kundrathur, Chennai - 600069, Tamil Nadu',
      contact_email: 'yuvenza@citchennai.net',
      contact_phone: '+91 7339524706',
      contact_whatsapp: '+917339524706',
      updated_at: new Date().toISOString()
    };
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'stats')
        .single();
      if (error && error.code !== 'PGRST116') { // PGRST116 is not found
        throw new Error(error.message);
      }
      // Default fallback if table is empty
      if (!data) {
        return defaultSettings;
      }
      return data as SiteSettings;
    } catch (e) {
      console.warn('Failed to fetch site settings, using fallback settings:', e);
      return defaultSettings;
    }
  },
  /**
   * Update Site Settings
   */
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 'stats', ...settings, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as SiteSettings;
  },
  /**
   * Get all events from the database
   */
  async getAllEvents(): Promise<EventItem[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    } catch (e) {
      console.warn('Failed to fetch events, using fallback empty array:', e);
      return [];
    }
  },
  /**
   * Add a new event
   */
  async addEvent(event: Omit<EventItem, 'created_at'>): Promise<EventItem> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Update an existing event
   */
  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
  /**
   * Get an admin user by email
   */
  async getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Get all admin users (Super Admin only)
   */
  async getAllAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  /**
   * Add a new admin user
   */
  async addAdminUser(email: string, role: Role): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({ email: email.toLowerCase().trim(), role })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Update an admin user's role
   */
  async updateAdminUser(id: string, role: Role): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Delete an admin user
   */
  async deleteAdminUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
  
  // ─── Notifications ─────────────────────────────────────────
  async getNotifications(email: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('visitor_email', email.toLowerCase().trim())
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
  
  async createNotification(email: string, title: string, message: string): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ visitor_email: email.toLowerCase().trim(), title, message })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  
  async markNotificationRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
};

