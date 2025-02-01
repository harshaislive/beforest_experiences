'use client';

import { Event } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { memo } from 'react';

interface ExperienceCardProps {
    experience: Event;
    variant?: 'default' | 'featured';
    showDescription?: boolean;
    showCapacity?: boolean;
}

function ExperienceCard({ 
    experience, 
    variant = 'default',
    showDescription = true,
    showCapacity = true 
}: ExperienceCardProps) {
    const heroImage = experience.experience_images?.find(img => img.is_hero)?.image_url 
        || experience.experience_images?.[0]?.image_url;

    const defaultImage = `/images/placeholder-experience.jpg`;
    const remainingSpots = experience.total_capacity - (experience.current_participants || 0);
    const formattedDate = new Date(experience.start_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    if (variant === 'featured') {
        return (
            <article className="bg-soft-beige rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-[500px] sm:h-[600px]">
                    <Image
                        src={heroImage || defaultImage}
                        alt={`${experience.title} - Featured Experience`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                        quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="backdrop-blur-md bg-black/30 rounded-2xl p-8 border border-white/10">
                            <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
                                <MapPinIcon className="w-4 h-4" aria-hidden="true" />
                                <span>{experience.locations?.name || 'Location TBA'}</span>
                            </div>
                            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                                {experience.title}
                            </h2>
                            {showDescription && (
                                <p className="text-white/90 text-lg line-clamp-3 mb-8 max-w-3xl">
                                    {experience.description}
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
                                <Link
                                    href={`/experiences/${experience.slug}`}
                                    className="inline-flex items-center gap-2 text-white hover:text-terracotta transition-colors text-lg font-medium group/link"
                                    aria-label={`Learn more about ${experience.title}`}
                                >
                                    Learn More
                                    <svg 
                                        className="w-5 h-5 transform transition-transform group-hover/link:translate-x-1" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                {showCapacity && (
                                    <div className="flex items-center gap-2 text-white/90 text-lg">
                                        <UsersIcon className="w-5 h-5" aria-hidden="true" />
                                        <span>{remainingSpots} spots remaining</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <Link
            href={`/experiences/${experience.slug}`}
            className="block group"
            aria-label={`View details for ${experience.title}`}
        >
            <article className="bg-soft-beige rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="relative h-56 sm:h-64">
                    <Image
                        src={heroImage || defaultImage}
                        alt={`${experience.title} - Experience Preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0">
                        <div className="backdrop-blur-md bg-black/30 p-6 border-t border-white/10">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                                {experience.title}
                            </h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPinIcon className="w-4 h-4" aria-hidden="true" />
                                <span className="font-medium">{experience.locations?.name || 'Location TBA'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-6 text-sm text-deep-brown/70 mb-4">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" aria-hidden="true" />
                            <time dateTime={experience.start_date}>{formattedDate}</time>
                        </div>
                        {showCapacity && (
                            <div className="flex items-center gap-2">
                                <UsersIcon className="w-4 h-4" aria-hidden="true" />
                                <span>{remainingSpots} spots left</span>
                            </div>
                        )}
                    </div>
                    {showDescription && (
                        <p className="text-deep-brown/80 text-base mb-4 line-clamp-2">
                            {experience.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-terracotta font-medium group-hover:translate-x-1 transition-transform">
                        View Details
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default memo(ExperienceCard); 