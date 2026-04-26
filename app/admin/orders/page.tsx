"use client";

import { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ChevronRight,
  Package,
  RefreshCw,
  Receipt,
  Filter,
} from 'lucide-react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ---------- types ---------- */
interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
  image_url?: string;
}

interface OrderRow {
  id: number;
  created_at: string;
  amount: number;
  customer_email: string;
  receipt_url?: string;
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
  customer_email: string;
  receipt_url?: string;
  items: OrderRow[];
}

type StatusFilter = 'all' | 'pending' | 'fulfilled';

/* ---------- helpers ---------- */
function groupOrders(rows: OrderRow[]): GroupedOrder[] {
  const map: Record<string, GroupedOrder> = {};
  for (const row of rows) {
    const key = row.transaction_id || `legacy-${row.id}`;
    if (!map[key]) {
      map[key] = {
        transaction_id: key,
        created_at: row.created_at,
        status: row.status,
        total_amount: 0,
        customer_email: row.customer_email,
        receipt_url: row.receipt_url,
        items: [],
      };
    }
    map[key].total_amount += Number(row.amount);
    map[key].items.push(row);
  }
  return Object.values(map).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/* ---------- page ---------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // 1. fetch all orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr) throw ordersErr;
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // 2. fetch products separately to avoid FK dependency
      const productIds = Array.from(new Set(ordersData.map((o: OrderRow) => o.product_id)));
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      const productMap = ((productsData ?? []) as Product[]).reduce<Record<number, Product>>(
        (acc, p) => { acc[p.id] = p; return acc; },
        {}
      );

      const rowsWithProducts: OrderRow[] = ordersData.map((row: OrderRow) => ({
        ...row,
        products: productMap[row.product_id],
      }));

      setOrders(groupOrders(rowsWithProducts));
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? 'Failed to load orders';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* update every row that shares this transaction_id */
  const updateStatus = async (txId: string, newStatus: string) => {
    setUpdating(txId);
    try {
      // Get the current user's session token to authenticate the API call
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ transaction_id: txId, status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Update failed');

      // Optimistically update local state
      setOrders(prev =>
        prev.map(o =>
          o.transaction_id === txId
            ? { ...o, status: newStatus, items: o.items.map(i => ({ ...i, status: newStatus })) }
            : o
        )
      );
      toast.success(`Order marked as "${newStatus}"`);
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10 pb-24">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Package size={30} className="text-slate-700 dark:text-slate-300" />
            Orders
            {pendingCount > 0 && (
              <span className="text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 px-2.5 py-0.5 rounded-full font-bold border border-yellow-200 dark:border-yellow-800">
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Review customer receipts and update order statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit">
        {(['all', 'pending', 'fulfilled'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg font-bold text-sm capitalize transition-all ${
              filter === s
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
          <RefreshCw size={36} className="animate-spin mb-4" />
          <p className="font-bold">Loading orders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <Filter size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">No orders found</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            {filter === 'all' ? 'No orders have been placed yet.' : `No "${filter}" orders right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map(order => (
            <div
              key={order.transaction_id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              {/* order header */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      TXN {order.transaction_id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.created_at).toLocaleString('en-MY', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {order.customer_email}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    RM{order.total_amount.toFixed(2)}
                  </span>

                  {/* Status badge */}
                  {order.status === 'pending' ? (
                    <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                      <Clock size={13} /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                      <CheckCircle2 size={13} /> Fulfilled
                    </span>
                  )}

                  {/* Action button */}
                  {order.status === 'pending' ? (
                    <button
                      onClick={() => updateStatus(order.transaction_id, 'fulfilled')}
                      disabled={updating === order.transaction_id}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      {updating === order.transaction_id ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      Mark Fulfilled
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(order.transaction_id, 'pending')}
                      disabled={updating === order.transaction_id}
                      className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-60 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      {updating === order.transaction_id ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <Clock size={13} />
                      )}
                      Revert to Pending
                    </button>
                  )}
                </div>
              </div>

              {/* items */}
              <div className="divide-y divide-slate-50 dark:divide-slate-800 px-5">
                {order.items.map((item, idx) => (
                  <div key={item.id} className={`flex items-center gap-4 py-4 ${idx === 0 ? '' : ''}`}>
                    <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                      {item.products?.image_url ? (
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {item.products?.name ?? `Product #${item.product_id}`}
                      </p>
                      {item.products?.category && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {item.products.category}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      RM{Number(item.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* receipt link */}
              {order.receipt_url && (
                <div className="bg-slate-50/60 dark:bg-slate-800/30 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <a
                    href={order.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Receipt size={14} /> View Receipt <ChevronRight size={13} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
