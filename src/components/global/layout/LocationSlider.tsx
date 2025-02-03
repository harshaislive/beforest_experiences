'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocations } from '@/hooks/useLocations';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '@/lib/types';

interface LocationSliderProps {
    onLocationClick?: () => void;
}

export default function LocationSlider({ onLocationClick }: LocationSliderProps) {
    const { locations } = useLocations();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (locations.length > 0) {
            setCurrentIndex((prevIndex) => 
                prevIndex === locations.length - 1 ? 0 : prevIndex + 1
            );
        }
    }, [locations.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 3000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!locations.length) return null;

    const getLocationImage = (location: Location) => {
        const heroImage = location.location_images?.find(img => img.is_hero);
        const firstImage = location.location_images?.[0];
        return heroImage?.image_url || firstImage?.image_url || '/images/locations-placeholder.jpg';
    };

    return (
        <div className="mt-8 px-6">
            <h3 className="text-deep-brown/70 text-sm font-medium uppercase tracking-wider mb-4">
                Discover Our Locations
            </h3>
            <div className="relative h-48 overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Link 
                            href={`/${locations[currentIndex].slug}`}
                            onClick={onLocationClick}
                            className="block relative h-full group"
                        >
                            <Image
                                src={getLocationImage(locations[currentIndex])}
                                alt={locations[currentIndex].name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    const target = e.currentTarget;
                                    target.src = '/images/locations-placeholder.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white text-xl font-semibold mb-1">
                                    {locations[currentIndex].name}
                                </h4>
                                <p className="text-white/80 text-sm line-clamp-2">
                                    {locations[currentIndex].highlights?.[0]?.description || 'Discover this beautiful location'}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-terracotta/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                </AnimatePresence>
                
                {/* Progress Indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {locations.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'w-4 bg-white' 
                                    : 'w-1 bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 