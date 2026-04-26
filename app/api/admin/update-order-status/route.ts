import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ADMIN_EMAILS = ['oswincheong@gmail.com', 'chinleon.cl@gmail.com'];

// Uses the service role key — bypasses RLS safely on the server side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { transaction_id, status } = await req.json();

    if (!transaction_id || !status) {
      return NextResponse.json({ error: 'Missing transaction_id or status' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'fulfilled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Verify the caller is an authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || !ALLOWED_ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    // Perform the update using the service role (bypasses RLS)
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('transaction_id', transaction_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
