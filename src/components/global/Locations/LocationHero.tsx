'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface LocationHeroProps {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  hasEvents?: boolean;
}

export default function LocationHero({ name, slug, description, imageUrl, hasEvents }: LocationHeroProps) {
  const defaultImage = '/images/default-location-hero.jpg';
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 scale-105">
        <Image
          src={imageUrl || defaultImage}
          alt={`${name} location`}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 ease-out"
          style={{ transform: isLoaded ? 'scale(1)' : 'scale(1.1)' }}
          priority
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.src = defaultImage;
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative h-screen flex flex-col justify-between">
        {/* Main Content */}
        <motion.div 
          className="flex-1 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {name}
                <span className="block text-2xl sm:text-3xl md:text-4xl mt-4 text-white/80 font-normal">
                  BeForest Collective
                </span>
              </motion.h1>
              
              {description && (
                <motion.p 
                  className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {description}
                </motion.p>
              )}

              <motion.div 
                className="flex flex-wrap gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {hasEvents && (
                  <Link 
                    href="#upcoming-events" 
                    className="px-8 py-4 bg-white text-deep-brown rounded-full hover:bg-white/90 transition-colors text-lg font-medium"
                  >
                    View Events
                  </Link>
                )}
                <Link 
                  href="#overview" 
                  className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/20 transition-colors text-lg font-medium"
                >
                  Explore Location
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="text-center pb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link 
            href="#overview"
            className="inline-flex flex-col items-center text-white/80 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <ChevronDownIcon className="w-6 h-6 animate-bounce" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
