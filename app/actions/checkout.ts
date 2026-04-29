"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function createPayment(formData: FormData) {
  // 1. Extract and validate data
  const amount = formData.get("amount") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const cartDataString = formData.get("cartData") as string;

  // Security check: Ensure we actually have an email
  if (!email || email.trim() === "") {
    throw new Error("User email is required for checkout.");
  }
  
  if (!cartDataString) {
    throw new Error("Cart data is missing.");
  }

  let cart = [];
  try {
    cart = JSON.parse(cartDataString);
  } catch (e) {
    throw new Error("Invalid cart data.");
  }

  if (!cart || cart.length === 0) {
    throw new Error("Cart is empty.");
  }

  // Generate a unique transaction ID for this order
  const transaction_id = crypto.randomUUID();

  // Initialize Supabase with service role key to bypass RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Insert into orders table as 'pending'
  const { error: insertError } = await supabase.from('orders').insert(
    cart.map((item: any) => ({
      product_id: item.productId || item.id,
      amount: (item.price * item.quantity).toFixed(2),
      customer_email: email,
      status: 'pending',
      transaction_id
    }))
  );

  if (insertError) {
    console.error("Order insertion error:", insertError);
    throw new Error("Failed to create order record");
  }

  // Billplz expects amount in CENTS (e.g., RM10.00 = 1000)
  const amountInCents = Math.round(parseFloat(amount) * 100);

  const auth = Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString("base64");
  
  // We define this outside so we can access the URL after the try/catch
  let paymentUrl = "";

  try {
    const response = await fetch(`${process.env.BILLPLZ_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        collection_id: process.env.BILLPLZ_COLLECTION_ID!,
        email: email,
        name: name,
        amount: amountInCents.toString(),
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        description: `Purchase: ${name}`,
        reference_1_label: "Transaction ID",
        reference_1: transaction_id,
      }),
    });

    const data = await response.json();

    if (data.url) {
      paymentUrl = data.url;
    } else {
      console.error("Billplz API Error:", data);
      throw new Error(data.error?.message || "Failed to create Billplz bill");
    }
  } catch (error) {
    console.error("Checkout Action Error:", error);
    // Re-throw to be caught by the client-side toast
    throw error;
  }

  // 2. Redirect MUST happen outside of the try/catch block
  if (paymentUrl) {
    redirect(paymentUrl);
  }
}