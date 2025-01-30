'use client';

import Image from 'next/image';

interface ExperienceCardProps {
    title: string;
    description: string;
    activities: string[];
    imageSrc: string;
}

export default function ExperienceCard({ title, description, activities, imageSrc }: ExperienceCardProps) {
    return (
        <div className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <div className="relative h-64">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
                <div className="absolute inset-x-0 bottom-0">
                    <div className="backdrop-blur-md bg-white/90 p-6 border-t border-white/20">
                        <h3 className="text-2xl font-bold text-deep-brown group-hover:text-terracotta transition-colors">
                            {title}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-6 sm:p-8">
                <p className="text-deep-brown/80 text-lg mb-6">
                    {description}
                </p>
                <ul className="space-y-3">
                    {activities.map((activity, index) => (
                        <li key={index} className="flex items-start text-deep-brown/70 group/item">
                            <span className="w-2 h-2 bg-terracotta rounded-full mr-3 mt-2 group-hover/item:scale-125 transition-transform" />
                            <span className="group-hover/item:text-deep-brown transition-colors">
                                {activity}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div 
                className="absolute bottom-0 left-0 h-1 bg-terracotta w-0 group-hover:w-full transition-all duration-500"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
        </div>
    );
}
