import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  // We create an array of 8 items to fill the grid during loading
  const skeletonItems = Array.from({ length: 8 });

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          {/* Mimic the header text with grey bars */}
          <div className="h-9 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skeletonItems.map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>

      </div>
    </main>
  );
}