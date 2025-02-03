'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="overview" className="py-24 bg-gradient-to-b from-white to-sage-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.span 
            className="text-terracotta text-lg font-medium mb-4 block"
            variants={itemVariants}
          >
            Welcome to
          </motion.span>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-deep-brown mb-8"
            variants={itemVariants}
          >
            Life at {name} BeForest Collective
          </motion.h2>
          <motion.p 
            className="text-xl text-deep-brown/80 leading-relaxed"
            variants={itemVariants}
          >
            Experience a harmonious blend of sustainable living, community engagement, and environmental stewardship. Our collective is more than just a location—it&apos;s a movement towards conscious living.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {features.slice(0, 3).map((feature, index) => (
            <motion.div 
              key={index}
              className="group bg-white rounded-2xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="h-16 w-16 mb-8 mx-auto relative">
                <Image
                  src={getIconSrc(feature)}
                  alt={`${feature} Icon`}
                  width={64}
                  height={64}
                  className="transition-transform duration-300 group-hover:scale-110"
                  onError={() => handleImageError(feature)}
                  priority
                />
              </div>
              <h3 className="text-2xl font-semibold text-deep-brown mb-4 text-center">{feature}</h3>
              {highlights[index] && (
                <p className="text-deep-brown/70 text-center leading-relaxed">
                  {highlights[index].description}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {!hasEvents ? (
            <motion.div variants={itemVariants}>
              <p className="text-xl text-deep-brown/80 mb-8">
                No events are currently scheduled at this location. Follow us on Instagram to stay updated on new events and experiences.
              </p>
              <Link
                href="https://instagram.com/beforest.collective"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-terracotta to-terracotta-light text-white px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 transform"
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
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Link
                href="#upcoming-events"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-light text-white px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                Explore Our Events
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
