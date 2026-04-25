"use client";

import { useState, useEffect } from 'react'; 
import { useCartStore } from '@/store/cartStore';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, CheckCircle2, UploadCloud, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr'; 
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, clearCart, updateQuantity } = useCartStore();
  
  const [userEmail, setUserEmail] = useState<string>('');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file.");
        return;
      }
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      toast.error("Please provide an email address.");
      return;
    }
    
    if (!receiptFile) {
      toast.error("Please upload your DuitNow receipt.");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Processing your payment...", { id: "checkout" });

    try {
      // 1. Compress Image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(receiptFile, options);
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // 2. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const receiptUrl = `${supabaseUrl}/storage/v1/object/public/receipts/${fileName}`;

      // 3. Generate a shared transaction ID
      const transactionId = crypto.randomUUID();

      // 4. Batch Insert into orders table
      const ordersToInsert = cart.map((item) => ({
        product_id: parseInt(item.id || item.productId || "0"), // fallback for type safety based on store structure
        amount: item.price * item.quantity,
        customer_email: userEmail,
        receipt_url: receiptUrl,
        status: 'pending',
        transaction_id: transactionId
      }));

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(ordersToInsert)
        .select();

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

      // 5. Notify via Resend API
      const notifyRes = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price * i.quantity })),
          totalPrice: cartTotal(),
          customerEmail: userEmail,
          receiptUrl: receiptUrl
        })
      });

      if (!notifyRes.ok) {
        console.warn("Notification failed, but orders were saved.");
      }

      clearCart();
      setIsSuccess(true);
      toast.success("Payment submitted successfully!", { id: "checkout" });

    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "An error occurred during checkout.", { id: "checkout" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center bg-card rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-4">Payment Received!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Thank you for your purchase. We are verifying your DuitNow receipt. You will receive an email at <strong className="text-foreground">{userEmail}</strong> once your order is fulfilled.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background px-8 py-4 rounded-xl font-bold transition-all"
          >
            <ArrowLeft size={20} />
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700 mb-6" />
        <h1 className="text-2xl font-black mb-2">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
          Looks like you have not added any items to your cart yet.
        </p>
        <Link 
          href="/"
          className="bg-primary hover:bg-primary-hover text-background px-8 py-3 rounded-xl font-bold transition-all"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 overflow-hidden">
          <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
          
          <div className="flex items-center h-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {isConfirmingClear ? (
                <motion.div
                  key="confirm-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2">
                    Are you sure?
                  </span>
                  <button 
                    onClick={() => setIsConfirmingClear(false)}
                    className="text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      clearCart();
                      setIsConfirmingClear(false);
                    }}
                    className="text-sm font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Yes, Empty
                  </button>
                </motion.div>
              ) : (
                <motion.button 
                  key="clear-btn"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => setIsConfirmingClear(true)}
                  className="text-sm font-bold text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Order Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} /> 
                  Order Summary
                </h2>
                
                <div className="flex flex-col pt-2">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.div 
                        layout 
                        key={item.cartId}
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        
                        <div className="flex-1">
                          <p className="font-semibold leading-snug">{item.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-background mt-1 bg-foreground w-fit px-2 py-0.5 rounded-md">
                            {item.variantLabel || item.selectedLabel || "Standard Config"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                          
                          {/* QUANTITY CONTROLS */}
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 p-1">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-foreground hover:bg-background dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            
                            <span className="w-8 text-center font-mono font-bold text-sm">
                              {item.quantity}
                            </span>
                            
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.quantity < 1000) {
                                    updateQuantity(item.cartId, item.quantity + 1);
                                } else {
                                    toast.error("Maximum limit reached");
                                }
                              }}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-foreground hover:bg-background dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
                              disabled={item.quantity >= 1000}
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 w-28 justify-end">
                            <span className="font-mono font-bold">
                              RM{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button 
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">Total to pay</span>
                  <span className="text-3xl font-black tracking-tighter">
                    RM{cartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* DuitNow Instructions */}
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 flex flex-col items-center text-center">
              <h2 className="text-lg font-bold mb-2">Pay via DuitNow</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Scan the QR code below using your banking app or e-wallet.</p>
              
              <div className="bg-white p-4 rounded-xl border-4 border-gray-100 shadow-md mb-6 w-64 h-64 relative">
                <Image 
                  src="/duitnow-qr.jpeg" 
                  alt="DuitNow QR Code" 
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-left w-full">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Please ensure you transfer the exact amount of <strong className="text-foreground">RM{cartTotal().toFixed(2)}</strong>. Save a screenshot of the successful transaction to upload.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Payment Form */}
          <div className="lg:col-span-5 h-fit">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Payment Verification</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Delivery Details
                    </label>
                  </div>
                  
                  <input 
                    type="email" 
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground outline-none transition-all shadow-sm"
                  />
                  <p className="text-[11px] font-medium text-gray-400 mt-2">
                    We will send your order details to this email after verification.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                    Upload Receipt Image
                  </label>
                  
                  <div className="mt-1">
                    {previewUrl ? (
                      <div className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="relative w-full max-w-[200px] h-40 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <Image src={previewUrl} alt="Receipt preview" fill className="object-cover" />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setReceiptFile(null); setPreviewUrl(null); }}
                          className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer group"
                      >
                        <UploadCloud className="h-14 w-14 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 mb-4 transition-colors" />
                        <span className="bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-2.5 rounded-xl font-bold border border-gray-200 dark:border-gray-600 shadow-sm mb-3 group-hover:shadow transition-all">
                          Click to Upload Receipt
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">or drag and drop your file here</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          Supports PNG, JPG, JPEG (Max 10MB)
                        </p>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-transparent dark:border-gray-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying Payment...
                    </>
                  ) : (
                    `Submit Payment of RM${cartTotal().toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}