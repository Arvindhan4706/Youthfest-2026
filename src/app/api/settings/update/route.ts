import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body;
    if (!settings) {
      return NextResponse.json({ error: 'No settings provided' }, { status: 400 });
    }
    // Sanitize: ensure all values are numbers where appropriate
    const sanitized: Record<string, number | string> = {};
    const numericKeys = [
      'participants', 'events', 'prize_pool', 'colleges', 'workshops',
      'first_prize', 'second_prize', 'third_prize', 'spots_remaining', 'total_spots'
    ];
    for (const key of numericKeys) {
      if (key in settings) {
        sanitized[key] = parseInt(settings[key]) || 0;
      }
    }

    const stringKeys = [
      'contact_institute', 'contact_address', 'contact_email', 'contact_phone', 'contact_whatsapp'
    ];
    for (const key of stringKeys) {
      if (key in settings && settings[key] !== undefined) {
        sanitized[key] = String(settings[key]);
      }
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ id: 'stats', ...sanitized, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

