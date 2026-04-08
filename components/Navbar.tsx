"use client";

import Link from 'next/link';
import { ShoppingCart, User, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { cart } = useCartStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Increased height from h-16 to h-20 for more 'breathing room' */}
        <div className="flex justify-between items-center h-20">
          
          {/* Scaled Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-blue-200">
              <Zap size={24} className="text-white fill-current" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              MegaHelper
            </span>
          </Link>

          {/* Scaled Right Side Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-base font-bold text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User size={22} strokeWidth={2.5} />
              <span className="hidden md:block">Login</span>
            </Link>

            <Link 
              href="/checkout" 
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-all active:scale-90"
            >
              <ShoppingCart size={26} strokeWidth={2.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}