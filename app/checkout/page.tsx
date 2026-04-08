"use client";

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { createPayment } from '@/app/actions/checkout'; // 1. Imported your Server Action

export default function CheckoutPage() {
  const { cart, cartTotal } = useCartStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">Go back to store</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            
            {/* Order Summary Summary */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span>RM{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-100">
                <span>Total to pay</span>
                <span>RM{cartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* 2. THE LIVE BILLPLZ FORM */}
            <form action={createPayment} onSubmit={() => setIsLoading(true)}>
              
              {/* Hidden variables to pass the cart data to Billplz */}
              <input type="hidden" name="amount" value={cartTotal()} />
              <input type="hidden" name="name" value="MegaHelper Cart Checkout" />

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (for digital delivery)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email" // Added name attribute so the server action can grab it
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center shadow-lg active:scale-95"
              >
                {isLoading ? "Connecting to Billplz..." : `Pay RM${cartTotal().toFixed(2)}`}
              </button>
            </form>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Secure checkout. Your digital product will be sent instantly after payment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}