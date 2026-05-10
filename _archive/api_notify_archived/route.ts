import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = ['oswincheong@gmail.com', 'chinleon.cl@gmail.com'];

// ── Validated email helper ──────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Service-role client for storage signed URL generation
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('No admin email configured for notifications.');
      return NextResponse.json({ success: true, message: 'Order processed, no notification sent.' });
    }

    const body = await request.json();
    const {
      orderId, productId, amount,      // legacy single-item format
      transactionId, items, totalPrice, // cart format
      customerEmail, receiptUrl,
      receiptFileName,                  // NEW: just the file name, not the full public URL
    } = body;

    // ── Input validation ────────────────────────────────────────────────────

    // 1. Validate customerEmail
    if (!customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json({ error: 'Invalid customer email.' }, { status: 400 });
    }

    // 2. Validate amount (must be a positive number)
    const isCart = items && Array.isArray(items);
    const finalTotal = isCart ? totalPrice : amount;
    if (typeof finalTotal !== 'number' || finalTotal <= 0 || !isFinite(finalTotal)) {
      return NextResponse.json({ error: 'Invalid order amount.' }, { status: 400 });
    }

    // 3. Validate receipt file extension (server-side guard)
    if (receiptFileName) {
      const ext = receiptFileName.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          { error: 'Invalid receipt file type. Only JPG and PNG are accepted.' },
          { status: 400 }
        );
      }
    }

    // ── Generate signed URL (1 hour) for the receipt ────────────────────────
    let receiptLink = receiptUrl; // fallback to the public URL if signing fails
    if (receiptFileName) {
      const { data: signedData, error: signError } = await supabaseAdmin
        .storage
        .from('receipts')
        .createSignedUrl(receiptFileName, 3600); // 1 hour

      if (!signError && signedData?.signedUrl) {
        receiptLink = signedData.signedUrl;
      } else {
        console.warn('Could not generate signed URL, falling back to public URL:', signError);
      }
    }

    // ── Build email body ────────────────────────────────────────────────────
    let itemsHtml = '';
    if (isCart) {
      itemsHtml = items
        .map((item: { name: string; quantity: number; price: number }) =>
          `<li><strong>${item.name}</strong> x${item.quantity} – RM${item.price.toFixed(2)}</li>`
        )
        .join('');
    } else {
      itemsHtml = `<li><strong>Product ID:</strong> ${productId} – RM${amount}</li>`;
    }

    const finalId = isCart ? transactionId : orderId;
    const idLabel = isCart ? 'Transaction ID' : 'Order ID';

    const { data, error } = await resend.emails.send({
      from: 'Student Hub <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Manual Payment: ${idLabel} #${finalId}`,
      html: `
        <h2>New Manual Payment Received</h2>
        <p>A new order has been placed using DuitNow QR.</p>

        <h3>Order Details:</h3>
        <ul>
          <li><strong>${idLabel}:</strong> ${finalId}</li>
          <li><strong>Customer Email:</strong> ${customerEmail}</li>
          <li><strong>Total Amount:</strong> RM${finalTotal.toFixed(2)}</li>
        </ul>

        <h3>Items Ordered:</h3>
        <ul>${itemsHtml}</ul>

        <p>Please review the payment receipt and fulfill the order:</p>
        <p>
          <a href="${receiptLink}" target="_blank" style="background:#000;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">
            View Receipt (valid 1 hour)
          </a>
        </p>
        <p style="color:#888;font-size:12px;">
          This receipt link expires in 1 hour. Go to <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/orders">Admin Orders</a> to mark it fulfilled.
        </p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Notify API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export { ALLOWED_FILE_TYPES };
