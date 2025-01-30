'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LocationOverviewProps {
  name: string;
  features?: string[];
  highlights?: Array<{
    title: string;
    description: string;
  }>;
  hasEvents?: boolean;
}

export default function LocationOverview({ name, features = [], highlights = [], hasEvents = false }: LocationOverviewProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const getIconSrc = (feature: string) => {
    const iconKey = feature.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return failedImages[iconKey] ? '/icons/default.svg' : `/icons/${iconKey}.svg`;
  };

  const handleImageError = (feature: string) => {
    const iconKey = feature.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setFailedImages(prev => ({
      ...prev,
      [iconKey]: true
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-deep-brown mb-6">
            Life at {name} BeForest Collective
          </h2>
          <p className="text-lg text-deep-brown/80">
            Experience a harmonious blend of sustainable living, community engagement, and environmental stewardship. Our collective is more than just a location—it&apos;s a movement towards conscious living.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="bg-sage-50 rounded-xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 mb-6 mx-auto relative">
                <Image
                  src={getIconSrc(feature)}
                  alt={`${feature} Icon`}
                  width={48}
                  height={48}
                  onError={() => handleImageError(feature)}
                  priority
                />
              </div>
              <h3 className="text-xl font-semibold text-deep-brown mb-4 text-center">{feature}</h3>
              {highlights[index] && (
                <p className="text-deep-brown/70 text-center">
                  {highlights[index].description}
                </p>
              )}
            </div>
          ))}
        </div>

        {!hasEvents ? (
          <div className="text-center">
            <p className="text-lg text-deep-brown/80 mb-6">
              No events are currently scheduled at this location. Follow us on Instagram to stay updated on new events and experiences.
            </p>
            <Link
              href="https://instagram.com/beforest.collective"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="invert"
              />
              Follow on Instagram
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <button className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Join Our Community
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
