export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-200" />
      
      <div className="p-5 flex flex-col flex-grow gap-4">
        {/* Category Placeholder */}
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        
        {/* Title Placeholder */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
          {/* Price Placeholder */}
          <div className="h-6 w-1/3 bg-gray-200 rounded" />
          {/* Button Placeholder */}
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}