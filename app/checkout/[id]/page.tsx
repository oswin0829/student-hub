"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import imageCompression from 'browser-image-compression';
import { UploadCloud, CheckCircle2, AlertCircle, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function ManualCheckoutPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        // Fetch product from supabase products table
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProduct(data);
      } catch (err: unknown) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details.");
      } finally {
        setLoadingProduct(false);
      }
    }
    
    // Also try to get user session email to prefill
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
        setIsLoggedIn(true);
      }
    });

    fetchProduct();
  }, [id]);

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
    
    if (!email) {
      toast.error("Please provide an email address.");
      return;
    }
    
    if (!receiptFile) {
      toast.error("Please upload your DuitNow receipt.");
      return;
    }
    
    if (!product) {
      toast.error("Product details are missing.");
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
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // Construct public URL
      const receiptUrl = `${supabaseUrl}/storage/v1/object/public/receipts/${fileName}`;

      // 3. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          product_id: parseInt(id),
          amount: product.price,
          customer_email: email,
          receipt_url: receiptUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

      // 4. Notify via Resend API
      const notifyRes = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          productId: id,
          amount: product.price,
          customerEmail: email,
          receiptUrl: receiptUrl
        })
      });

      if (!notifyRes.ok) {
        console.warn("Notification failed, but order was saved.");
      }

      setIsSuccess(true);
      toast.success("Payment submitted successfully!", { id: "checkout" });

    } catch (err: unknown) {
      console.error("Checkout error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during checkout.";
      toast.error(errorMessage, { id: "checkout" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShoppingBag size={48} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-bold">Loading Checkout...</h2>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center bg-card rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-lg">
          <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-4">Payment Received!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
            Thank you for your purchase. We are verifying your DuitNow receipt. You will receive an email at <strong className="text-foreground">{email}</strong> once your order is fulfilled.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground px-8 py-4 rounded-xl font-bold transition-all"
            >
              <ArrowLeft size={20} />
              Back to Store
            </Link>
            <Link 
              href="/orders"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background px-8 py-4 rounded-xl font-bold transition-all shadow-md"
            >
              <Package size={20} />
              Track Your Order
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-foreground transition-colors font-semibold">
            <ArrowLeft size={16} /> Back to Products
          </Link>
          <h1 className="text-3xl font-black mt-4 tracking-tight">Manual Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Order Summary & QR Code */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShoppingBag size={20} /> 
                Order Summary
              </h2>
              
              {product ? (
                <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                  </div>
                  <span className="font-black text-xl">RM{product.price?.toFixed(2) || '0.00'}</span>
                </div>
              ) : (
                <div className="py-4 text-red-500">Product not found.</div>
              )}
              
              <div className="mt-6 flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-bold">Total to pay</span>
                <span className="text-3xl font-black">RM{product?.price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 flex flex-col items-center text-center">
              <h2 className="text-lg font-bold mb-2">Pay via DuitNow</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Scan the QR code below using your banking app or e-wallet.</p>
              
              <div className="bg-white p-4 rounded-xl border-4 border-gray-100 shadow-md mb-6 w-64 h-64 relative">
                {/* Fallback styling just in case the image fails to load, though we use next/image */}
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
                  Please ensure you transfer the exact amount of <strong className="text-foreground">RM{product?.price?.toFixed(2)}</strong>. Save a screenshot of the successful transaction to upload here.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form */}
          <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold mb-6">Payment Verification</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground outline-none transition-all shadow-sm"
                />
                <p className="text-[11px] font-medium text-gray-400 mt-2">
                  We will send your order details to this email after verification.
                </p>
                {!isLoggedIn && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Save your orders and checkout faster.</span>
                    <Link href={`/login?redirect=/checkout/${id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      Log in or Sign up
                    </Link>
                  </div>
                )}
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
                disabled={isSubmitting || !product}
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
                  `Submit Payment of RM${product?.price?.toFixed(2) || '0.00'}`
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
