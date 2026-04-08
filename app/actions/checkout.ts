"use server";

import { redirect } from "next/navigation";

export async function createPayment(formData: FormData) {
  const amount = formData.get("amount") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // Billplz expects amount in CENTS (e.g., RM10.00 = 1000)
  const amountInCents = Math.round(parseFloat(amount) * 100);

  const auth = Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString("base64");

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
      description: "MegaHelper Digital Tool Purchase",
    }),
  });

  const data = await response.json();

  if (data.url) {
    // Redirect the user to Billplz Sandbox to "pay"
    redirect(data.url);
  } else {
    console.error("Billplz Error:", data);
    throw new Error("Failed to create payment link");
  }
}