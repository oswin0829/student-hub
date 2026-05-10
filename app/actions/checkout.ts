"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function checkFirstPurchaseEligibility(email: string): Promise<boolean> {
  if (!email || email.trim() === "") return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_email', email)
    .in('status', ['pending', 'fulfilled', 'completed'])
    .limit(1);

  if (error) {
    console.error("Error checking eligibility:", error);
    return false; // Safe fallback
  }

  return !data || data.length === 0;
}

export async function createPayment(formData: FormData) {
  // 1. Extract and validate data
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

  // Initialize Supabase with service role key to bypass RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Fetch authentic prices from database
  const productIds = cart.map((item: any) => item.productId || item.id);
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('id, price, options')
    .in('id', productIds);

  if (productsError || !dbProducts) {
    console.error("Error fetching products for validation:", productsError);
    throw new Error("Failed to validate product prices.");
  }

  // Calculate secure total
  let secureTotal = 0;
  const orderItemsData = [];

  for (const item of cart) {
    const dbProduct = dbProducts.find((p) => p.id === (item.productId || item.id));
    if (!dbProduct) {
      throw new Error(`Product not found: ${item.name}`);
    }

    let itemPrice = dbProduct.price;
    const label = item.selectedLabel || item.variantLabel;

    // Check for variant price
    if (label && dbProduct.options && Array.isArray(dbProduct.options)) {
      const option = dbProduct.options.find((opt: any) => opt.label === label);
      if (option) {
        itemPrice = option.price;
      }
    }

    const itemTotal = itemPrice * item.quantity;
    secureTotal += itemTotal;

    orderItemsData.push({
      product_id: dbProduct.id,
      amount: itemTotal.toFixed(2), // Pre-discount individual amount
      customer_email: email,
      status: 'awaiting_payment',
      transaction_id: "" // We will set this shortly
    });
  }

  // 3. Apply Discount
  const isEligible = await checkFirstPurchaseEligibility(email);
  if (isEligible) {
    secureTotal = secureTotal * 0.9;
    
    // Also apply the 10% discount to each individual item recorded in the database
    orderItemsData.forEach(item => {
      item.amount = (parseFloat(item.amount) * 0.9).toFixed(2);
    });
  }

  // Generate a unique transaction ID for this order
  const transaction_id = crypto.randomUUID();

  // Attach transaction_id to items
  const finalOrderData = orderItemsData.map(item => ({
    ...item,
    transaction_id
  }));

  // Insert into orders table as 'pending'
  const { error: insertError } = await supabase.from('orders').insert(finalOrderData);

  if (insertError) {
    console.error("Order insertion error:", insertError);
    throw new Error("Failed to create order record");
  }

  // Billplz expects amount in CENTS (e.g., RM10.00 = 1000)
  const amountInCents = Math.round(secureTotal * 100);

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
        description: `Purchase: ${name}${isEligible ? ' (First Purchase 10% Off)' : ''}`,
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

export async function verifyBillplzPayment(billId: string) {
  try {
    const auth = Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString("base64");
    
    // Convert API endpoint from /bills to /bills/ID
    const endpoint = process.env.BILLPLZ_ENDPOINT!.replace(/\/$/, "");
    const res = await fetch(`${endpoint}/${billId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error("Failed to verify Billplz payment:", await res.text());
      return false;
    }

    const data = await res.json();
    
    if (data.paid && data.reference_1) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('transaction_id', data.reference_1)
        .eq('status', 'awaiting_payment');

      if (error) {
        console.error("Failed to update order status:", error);
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return false;
  }
}