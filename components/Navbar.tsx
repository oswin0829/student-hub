"use client";

import Link from 'next/link';
import Image from 'next/image'; // 1. Imported for optimized logo rendering
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { cart } = useCartStore();

  // 2. Logic: Calculate total quantity instead of just unique items
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* --- BRANDING SECTION --- */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Logo Container: Fixed size to prevent layout shift */}
            <div className="relative w-12 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[15deg]">
              <Image 
                src="/logo.png" 
                alt="MegaHelper Store Logo"
                fill
                className="object-contain"
                priority // Ensures the logo loads immediately (LCP optimization)
              />
            </div>

            {/* Typography: Using Jakarta Sans for a geometric, modern look */}
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
                MĒGA HELPER
              </span>
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-[0.3em] -mt-0.5">
                Digital Assets
              </span>
            </div>
          </Link>

          {/* --- ACTIONS SECTION --- */}
          <div className="flex items-center gap-8">
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-base font-bold text-gray-500 hover:text-blue-600 transition-colors group"
            >
              <User size={22} strokeWidth={2.5} className="group-hover:translate-y-[-1px] transition-transform" />
              <span className="hidden md:block">Login</span>
            </Link>

            <Link 
              href="/checkout" 
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-all active:scale-90"
            >
              <ShoppingCart size={28} strokeWidth={2.5} />
              
              {/* Dynamic Badge with Animation */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}