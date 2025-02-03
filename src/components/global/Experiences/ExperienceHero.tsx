'use client';

import Image from 'next/image';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ExperienceHeroProps {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    heroImage?: string;
}

export default function ExperienceHero({
    title,
    description,
    location,
    startDate,
    endDate,
    heroImage
}: ExperienceHeroProps) {
    const defaultImage = `https://source.unsplash.com/1600x900/?${title.toLowerCase()},nature,experience`;

    return (
        <div className="relative min-h-[600px] h-[80vh] w-full overflow-hidden">
            <Image
                src={heroImage || defaultImage}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
                            <MapPinIcon className="w-5 h-5" />
                            {location}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            {title}
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                        <div className="flex items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                <span>
                                    {new Date(startDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 