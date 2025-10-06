import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 animate-pulse">
      {/* Popular Badge Skeleton */}
      <div className="absolute top-4 left-4 bg-gray-200 h-6 w-24 rounded-full z-10"></div>
      
      {/* Discount Badge Skeleton */}
      <div className="absolute top-4 right-4 bg-gray-200 h-5 w-16 rounded-full"></div>

      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-gray-300 animate-pulse"></div>
      </div>

      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        
        {/* Count Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Pricing Skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const ProductSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductSkeletonGrid;
