"use client"; // This tells Next.js this component runs in the user's browser

import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  // Plug into our global brain to get the live total
  const cartTotal = useCartStore((state) => state.cartTotal());

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
          Mega<span className="text-gray-900">Helper</span>
        </Link>

        <div className="flex-1 max-w-2xl mx-8 hidden md:flex">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
            <User size={24} />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
            <ShoppingCart size={24} />
            {/* Display the live total here! */}
            <span className="hidden sm:inline font-semibold">RM{cartTotal.toFixed(2)}</span>
          </Link>
        </div>
      </div>

      <nav className="bg-gray-50 border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/category/educational" className="hover:text-blue-600">Educational</Link>
          <Link href="/category/ai-tools" className="hover:text-blue-600">AI Tools</Link>
          <Link href="/category/writing" className="hover:text-blue-600">Writing Tools</Link>
          <Link href="/category/entertainment" className="hover:text-blue-600">Entertainment</Link>
        </div>
      </nav>
    </header>
  );
}