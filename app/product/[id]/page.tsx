import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

// Next.js passes the URL parameters (like the ID) into this component
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the parameters (required in Next.js 15+)
  const resolvedParams = await params;

  // Fetch the single product where the ID matches the URL
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Big Image Placeholder */}
          <div className="md:w-1/2 bg-gray-100 min-h-[400px] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
             <span className="text-gray-400 font-medium text-xl">Product Image</span>
          </div>

          {/* Right Side: Product Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-2">
              {product.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              This is a digital product delivered instantly. Enhance your workflow and get access to premium features with this subscription.
            </p>

            <div className="text-4xl font-black text-gray-900 mb-8">
              RM{product.price.toFixed(2)}
            </div>

            {/* Use our new interactive client component here */}
            <AddToCartButton product={product} />
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
              <p>⚡️ Instant Email Delivery</p>
              <p>🛡️ Full Warranty Included</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}