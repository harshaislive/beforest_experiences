'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocations } from '@/hooks/useLocations';
import { motion, AnimatePresence } from 'framer-motion';

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
                                src={locations[currentIndex].cover_image || '/placeholder.jpg'}
                                alt={locations[currentIndex].name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white text-xl font-semibold mb-1">
                                    {locations[currentIndex].name}
                                </h4>
                                <p className="text-white/80 text-sm line-clamp-2">
                                    {locations[currentIndex].description}
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