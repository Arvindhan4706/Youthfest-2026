import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/lib/database';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  try {
    const { email, passkey } = await request.json();

    // 1. Verify Passkey
    const correctPasskey = process.env.ADMIN_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    if (!correctPasskey || passkey?.trim() !== correctPasskey.trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify Admin Role
    const normalizedEmail = email.toLowerCase().trim();
    const adminUser = await db.getAdminUserByEmail(normalizedEmail).catch(() => null);
    if (!adminUser || (adminUser.role !== 'Super Admin' && adminUser.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized Role' }, { status: 403 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
       return NextResponse.json({ error: 'Supabase configuration is missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 3. Fetch all pending payments from Supabase
    const { data: pendingPayments, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('payment_status', 'pending');

    if (fetchError || !pendingPayments) {
      return NextResponse.json({ error: 'Failed to fetch pending payments from DB' }, { status: 500 });
    }

    if (pendingPayments.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending payments found', fixedCount: 0 });
    }

    let fixedCount = 0;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 4. Process each pending payment
    for (const payment of pendingPayments) {
      if (!payment.razorpay_order_id) continue;

      try {
        // Fetch the payments for this specific order from Razorpay
        const orderPayments = await razorpay.orders.fetchPayments(payment.razorpay_order_id);
        
        // Check if any payment for this order was successful
        const successfulPayment = orderPayments.items.find((p: any) => p.status === 'captured' || p.status === 'authorized');

        if (successfulPayment) {
          console.log(`Fixing payment for visitor ${payment.visitor_id}, Order: ${payment.razorpay_order_id}`);
          
          // Update the payments table
          await supabaseAdmin
            .from('payments')
            .update({ payment_status: 'success' })
            .eq('id', payment.id);

          // Update the visitors table
          await supabaseAdmin
            .from('visitors')
            .update({ payment_status: 'paid' })
            .eq('id', payment.visitor_id);

          // Dispatch tickets and receipts
          await fetch(`${baseUrl}/api/admin/resend-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitor_id: payment.visitor_id })
          }).catch(err => console.error('Failed to trigger resend-ticket:', err));

          fixedCount++;
        }
      } catch (err: any) {
        console.error(`Error checking Razorpay for order ${payment.razorpay_order_id}:`, err.message);
      }
    }

    // 5. Log the action
    if (fixedCount > 0) {
      await db.logAdminAction(normalizedEmail, 'Synced Pending Payments', { fixedCount });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully checked ${pendingPayments.length} pending payments and fixed ${fixedCount}.`,
      fixedCount
    });

  } catch (error: any) {
    console.error('Failed to sync payments:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
