import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const { visitor_id } = await request.json();

    if (!visitor_id) {
      return NextResponse.json({ error: 'Missing visitor_id' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: visitor, error } = await supabaseAdmin
      .from('visitors')
      .select('*')
      .eq('id', visitor_id)
      .single();

    if (error || !visitor) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    const qrDataUrl = await QRCode.toDataURL(visitor.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const eventTitle = visitor.registered_events && visitor.registered_events.length > 0 
      ? visitor.registered_events.join(', ')
      : 'General Fest Entry';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Send OD Letter
    const odRes = await fetch(`${baseUrl}/api/send-od`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        college: visitor.college,
        department: visitor.department,
        eventTitle: eventTitle
      })
    });

    // Send QR Ticket
    const ticketRes = await fetch(`${baseUrl}/api/send-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: visitor.name,
        email: visitor.email,
        event: eventTitle,
        venue: 'Chennai Institute Of Technology',
        date: 'August 21, 2026',
        qrDataUrl: qrDataUrl
      })
    });

    if (!odRes.ok || !ticketRes.ok) {
      return NextResponse.json({ error: 'Failed to send one or more emails' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OD and Ticket sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error resending ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
