"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

interface OrderRow {
  id: number;
  created_at: string;
  amount: number;
  customer_email: string;
  receipt_url: string;
  status: string;
  transaction_id: string;
  product_id: number;
  products?: Product;
}

interface GroupedOrder {
  transaction_id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderRow[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        router.push('/login?redirect=/orders');
        return;
      }

      try {
        // 1. Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', session.user.email)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          return;
        }

        // 2. Fetch products for these orders
        const productIds = Array.from(new Set(ordersData.map(o => o.product_id)));
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) {
           console.warn("Could not fetch product details:", productsError);
        }

        const productMap = (productsData || []).reduce((acc: Record<number, Product>, p) => {
          acc[p.id] = p;
          return acc;
        }, {});

        // 3. Group by transaction_id and attach product info
        const grouped = (ordersData as OrderRow[]).reduce((acc: Record<string, GroupedOrder>, row) => {
          const txId = row.transaction_id || `legacy-${row.id}`;
          
          if (!acc[txId]) {
            acc[txId] = {
              transaction_id: txId,
              created_at: row.created_at,
              status: row.status,
              total_amount: 0,
              items: []
            };
          }
          
          acc[txId].total_amount += Number(row.amount);
          
          // Attach product info manually
          const rowWithProduct = {
            ...row,
            products: productMap[row.product_id]
          };
          
          acc[txId].items.push(rowWithProduct);
          return acc;
        }, {});

        const groupedArray = Object.values(grouped).sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setOrders(groupedArray);
      } catch (err: unknown) {
        console.error("Full error object:", err);
        const errObj = err as { message?: string; details?: string };
        const errorMessage = errObj.message || errObj.details || "Failed to fetch orders";
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="animate-pulse flex flex-col items-center relative z-10">
          <Package size={48} className="text-primary mb-6 animate-bounce" />
          <h2 className="font-outfit text-2xl font-black text-foreground">Loading your orders...</h2>
        </div>
      </main>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-black/5 dark:border-white/5">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold mb-4 text-sm group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
            </Link>
            <h1 className="font-outfit text-4xl font-black tracking-tight flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Package size={28} strokeWidth={2.5} />
              </div>
              Order History
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-[2.5rem] shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/5 p-16 text-center flex flex-col items-center"
          >
            <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-full mb-8">
              <ShoppingBag size={48} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="font-outfit text-3xl font-black mb-4">No orders found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md font-medium text-lg leading-relaxed">
              You haven&apos;t placed any orders yet. When you do, they will appear here so you can track their status.
            </p>
            <Link 
              href="/"
              className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-premium"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                variants={itemVariants}
                key={order.transaction_id} 
                className="bg-white/50 dark:bg-[#111113]/80 backdrop-blur-xl rounded-3xl shadow-premium dark:shadow-premium-dark border border-black/5 dark:border-white/5 overflow-hidden hover:border-black/10 dark:hover:border-white/10 transition-all group"
              >
                {/* Order Header */}
                <div className="bg-slate-50/50 dark:bg-black/40 p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-slate-200/50 dark:bg-white/10 px-2 py-1 rounded-md">
                        Order Placed
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-MY', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono font-medium">
                      TXN: {order.transaction_id}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-8">
                    <div className="flex flex-col sm:text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                        Total Amount
                      </span>
                      <span className="font-outfit text-xl font-black text-foreground">
                        RM{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Status Badge - Now Glowing */}
                    <div className="flex-shrink-0">
                      {order.status === 'pending' ? (
                        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-500/20">
                          <Clock size={14} />
                          PENDING
                        </div>
                      ) : order.status === 'fulfilled' || order.status === 'completed' ? (
                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                          <CheckCircle2 size={14} />
                          FULFILLED
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-500/10 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black border border-slate-500/20">
                          {order.status.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-6 md:p-8 divide-y divide-black/5 dark:divide-white/5">
                  {order.items.map((item, idx) => (
                    <div key={item.id} className={`flex items-center gap-6 ${idx !== 0 ? 'pt-6' : 'pb-6'}`}>
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shrink-0 shadow-inner">
                        {item.products?.image_url ? (
                          <Image 
                            src={item.products.image_url} 
                            alt={item.products.name} 
                            fill 
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Package size={28} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate text-foreground mb-1">
                          {item.products?.name || `Product #${item.product_id}`}
                        </h3>
                        {item.products?.category && (
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {item.products.category}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0 ml-4 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5">
                        <span className="font-mono font-black block text-sm">RM{Number(item.amount).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
