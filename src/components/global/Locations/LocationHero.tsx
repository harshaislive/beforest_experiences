'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LocationHeroProps {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  hasEvents?: boolean;
}

export default function LocationHero({ name, slug, description, imageUrl, hasEvents }: LocationHeroProps) {
  const defaultImage = '/images/default-location-hero.jpg';
  
  return (
    <div className="relative h-[70vh] w-full">
      <Image
        src={imageUrl || defaultImage}
        alt={`${name} location`}
        fill
        sizes="100vw"
        className="object-cover"
        priority
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget;
          target.src = defaultImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {name} BeForest Collective
          </h1>
          {description && (
            <p className="text-xl text-white/90 max-w-2xl">
              {description}
            </p>
          )}
          <p className="text-lg text-white/80 mt-4">
            Join us in our mission to preserve and nurture our natural environment
          </p>
          <div className="flex space-x-4 mt-6">
            {hasEvents && (
              <Link 
                href="/events" 
                className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                View Events
              </Link>
            )}
            <Link 
              href={`/${slug}`} 
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Location Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
