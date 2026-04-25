"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
        const { data, error } = await supabase
          .from('orders')
          .select('*, products(*)')
          .eq('customer_email', session.user.email)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group by transaction_id
        const grouped = (data as OrderRow[]).reduce((acc: Record<string, GroupedOrder>, row) => {
          // If a row somehow doesn't have a transaction_id (e.g. legacy data), use its ID as group
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
          acc[txId].items.push(row);
          return acc;
        }, {});

        // Convert object to array and sort by created_at descending again just in case
        const groupedArray = Object.values(grouped).sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setOrders(groupedArray);
      } catch (err: any) {
        console.error("Full error object:", err);
        const errorMessage = err?.message || err?.details || "Failed to fetch orders";
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Package size={48} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-bold">Loading your orders...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground transition-colors font-semibold mb-4">
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Package className="text-primary" size={32} strokeWidth={2.5} />
              My Orders
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center flex flex-col items-center">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              You haven&apos;t placed any orders yet. When you do, they will appear here so you can track their status.
            </p>
            <Link 
              href="/"
              className="bg-primary hover:bg-primary-hover text-background px-8 py-3 rounded-xl font-bold transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.transaction_id} 
                className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-5 md:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Order Placed
                      </span>
                      <span className="text-sm font-semibold">
                        {new Date(order.created_at).toLocaleDateString('en-MY', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      TXN: {order.transaction_id.substring(0, 8).toUpperCase()}...
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex flex-col sm:text-right">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-lg font-black">
                        RM{order.total_amount.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {order.status === 'pending' ? (
                        <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-900/50 shadow-sm">
                          <Clock size={14} />
                          Pending
                        </div>
                      ) : order.status === 'fulfilled' || order.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 dark:border-green-900/50 shadow-sm">
                          <CheckCircle2 size={14} />
                          Fulfilled
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                          {order.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-5 md:p-6 divide-y divide-gray-100 dark:divide-gray-800">
                  {order.items.map((item, idx) => (
                    <div key={item.id} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-4' : 'pb-4'}`}>
                      {/* Product Thumbnail (fallback to a gray box if no image) */}
                      <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                        {item.products?.image_url ? (
                          <Image 
                            src={item.products.image_url} 
                            alt={item.products.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold truncate">
                          {item.products?.name || `Product #${item.product_id}`}
                        </h3>
                        {item.products?.category && (
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.products.category}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono font-bold block">RM{Number(item.amount).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View Receipt Link (Optional extra detail) */}
                {order.items[0]?.receipt_url && (
                  <div className="bg-gray-50/50 dark:bg-gray-900/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <a 
                      href={order.items[0].receipt_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View Uploaded Receipt <ChevronRight size={14} />
                    </a>
                  </div>
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
