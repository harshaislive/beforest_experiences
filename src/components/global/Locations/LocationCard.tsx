'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LocationCardProps {
    name: string;
    slug: string;
    imageUrl: string;
    description: string;
    eventCount: number;
    hasEvents?: boolean;
}

export default function LocationCard({ name, slug, imageUrl, description, eventCount, hasEvents = false }: LocationCardProps) {
    const defaultImage = '/images/default-location.jpg';

    return (
        <Link href={`/${slug}`} className="block group">
            <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="relative h-56">
                    <Image
                        src={imageUrl || defaultImage}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        quality={85}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.currentTarget;
                            target.src = defaultImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-deep-brown mb-2">
                        {name}
                    </h3>
                    <p className="text-deep-brown/70 mb-4 line-clamp-2">
                        {description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-deep-brown/60">
                            {eventCount} {eventCount === 1 ? 'event' : 'events'} {hasEvents && '(upcoming)'}
                        </div>
                        <span className="text-terracotta group-hover:translate-x-1 transition-transform inline-flex items-center">
                            Learn more
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
