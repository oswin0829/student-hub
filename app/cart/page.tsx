"use client";

import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  // Grab our cart data and functions from the global store
  const { cart, cartTotal, removeFromCart } = useCartStore();

  // If the cart is empty, show a friendly message
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you have not added anything yet.</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  // If there are items, show the cart layout
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">Img</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 mb-2">RM{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Order Summary */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Subtotal</span>
              <span>RM{cartTotal().toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>RM{cartTotal().toFixed(2)}</span>
              </div>
            </div>
            <Link 
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>
            </div>
        </div>
      </div>
    </main>
  );
}