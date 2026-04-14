"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { Plus, Edit3, Package } from 'lucide-react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  asset_url: string;
  category: string | null;
  options: { id: string; label: string; price: number }[]; 
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24">
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your digital assets.</p>
        </div>
        
        <Link 
          href="/admin/add-product"
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> 
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-2">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-bold">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Package size={48} className="text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No products yet</h3>
            <p className="text-slate-500 text-sm mt-1">Click the button above to add your first digital asset.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {products.map((product) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={product.id} 
                className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden relative shrink-0 border border-slate-200">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs font-bold text-slate-500">RM{product.price.toFixed(2)}</p>
                      {product.category && (
                         <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{product.category}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Link 
                  href={`/admin/edit/${product.id}`}
                  className="bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Edit3 size={16} /> Edit
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}