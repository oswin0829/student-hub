import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    // Initialize Resend inside the request handler so it doesn't fail Vercel static build if env var is missing
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const body = await request.json();
    
    // Support both single-item checkout and cart checkout formats
    const { 
      orderId, productId, amount, // legacy single-item format
      transactionId, items, totalPrice, // new cart format
      customerEmail, receiptUrl 
    } = body;

    const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.warn("No admin email configured for notifications.");
      return NextResponse.json({ success: true, message: "Order processed, but no notification sent." });
    }

    // Determine if it's a cart or single item
    const isCart = items && Array.isArray(items);
    
    // Build the items list HTML
    let itemsHtml = '';
    if (isCart) {
      itemsHtml = items.map((item: { name: string; quantity: number; price: number }) => `
        <li><strong>${item.name}</strong> x${item.quantity} - RM${item.price.toFixed(2)}</li>
      `).join('');
    } else {
      itemsHtml = `<li><strong>Product ID:</strong> ${productId} - RM${amount}</li>`;
    }

    const finalTotal = isCart ? totalPrice : amount;
    const finalId = isCart ? transactionId : orderId;
    const idLabel = isCart ? 'Transaction ID' : 'Order ID';

    const { data, error } = await resend.emails.send({
      from: 'Student Hub <onboarding@resend.dev>', // Use a verified domain or resend's test domain
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
        <ul>
          ${itemsHtml}
        </ul>

        <p>Please review the payment receipt and fulfill the order:</p>
        <p><a href="${receiptUrl}" target="_blank">View Receipt Image</a></p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Notify API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
