import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-sage-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] w-full bg-sage-100 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="h-12 w-2/3 bg-white/20 rounded-lg mb-4"></div>
            <div className="h-6 w-1/2 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Overview Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="h-8 w-1/2 bg-sage-100 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-3/4 bg-sage-100 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-sage-50 rounded-xl p-8 animate-pulse">
                <div className="h-12 w-12 bg-sage-100 rounded-full mx-auto mb-6"></div>
                <div className="h-6 w-3/4 bg-sage-100 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 w-full bg-sage-100 rounded-lg mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section Skeleton */}
      <section className="py-16 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="h-8 w-1/2 bg-white rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-3/4 bg-white rounded-lg mx-auto animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-8 animate-pulse">
                <div className="h-48 w-full bg-sage-100 rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-sage-100 rounded-lg mb-4"></div>
                <div className="h-4 w-full bg-sage-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
