import ProductCard from '@/components/ProductCard';
import { supabase } from '@/utils/supabase';

// We added 'async' here so the page can wait for the database to respond
export default async function Home() {
  
  // 1. Fetch the data from your Supabase 'products' table
  const { data: products, error } = await supabase.from('products').select('*');

  // 2. If there's an error fetching, show a warning
  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-12 text-center text-red-500">Failed to load products.</div>;
  }

  // 3. Render the page using the live database data!
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Latest Products</h1>
          <p className="text-gray-600 mt-2">Get the best digital tools at student prices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* We map over the live 'products' array now */}
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </main>
  );
}