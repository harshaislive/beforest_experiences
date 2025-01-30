import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl font-bold text-deep-brown mb-4">
          Location Not Found
        </h2>
        <div className="text-deep-brown/80 mb-8">
          We couldn&apos;t find the location you&apos;re looking for.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-block bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/locations"
            className="inline-block bg-sage-100 hover:bg-sage-200 text-deep-brown px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View All Locations
          </Link>
        </div>
      </div>
    </div>
  );
}
