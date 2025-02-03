'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GlimpseItem {
    title: string;
    description: string;
    imageSrc: string;
    category: string;
}

interface CommunityGlimpsesProps {
    glimpses: GlimpseItem[];
}

export default function CommunityGlimpses({ glimpses }: CommunityGlimpsesProps) {
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleImageLoad = (imageSrc: string) => {
        setLoadedImages(prev => ({ ...prev, [imageSrc]: true }));
    };

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {glimpses.map((glimpse, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ 
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <div className="group h-full bg-white rounded-3xl overflow-hidden">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gray-100 animate-pulse ${
                                    loadedImages[glimpse.imageSrc] ? 'hidden' : ''
                                }`} />
                                <Image
                                    src={glimpse.imageSrc}
                                    alt={glimpse.title}
                                    fill
                                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                                        loadedImages[glimpse.imageSrc] ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => handleImageLoad(glimpse.imageSrc)}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index < 3}
                                />
                            </div>
                            <div className="p-6 sm:p-8">
                                <span className="inline-block px-3 py-1 bg-terracotta/10 text-terracotta text-sm font-medium rounded-full mb-4">
                                    {glimpse.category}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-semibold text-deep-brown mb-3 group-hover:text-terracotta transition-colors">
                                    {glimpse.title}
                                </h3>
                                <p className="text-deep-brown/70 text-base sm:text-lg leading-relaxed">
                                    {glimpse.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
