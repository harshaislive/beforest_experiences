'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Activity {
    title: string;
    description: string;
    imageSrc: string;
}

interface Season {
    name: string;
    title: string;
    subtitle: string;
    bgColor: string;
    textColor: string;
    activities: Activity[];
}

const seasons: Season[] = [
    {
        name: "Spring",
        title: "Season of New Beginnings",
        subtitle: "Experience the joy of planting and growth",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        activities: [
            {
                title: "Planting Festival",
                description: "Join the community in sowing seeds for the new season",
                imageSrc: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2"
            },
            {
                title: "Bird Watching",
                description: "Observe and learn about migratory birds in their natural habitat",
                imageSrc: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890"
            },
            {
                title: "Flower Trail Walks",
                description: "Explore blooming wildflower trails with expert guides",
                imageSrc: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
            }
        ]
    },
    {
        name: "Summer",
        title: "Season of Abundance",
        subtitle: "Discover the richness of forest life",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        activities: [
            {
                title: "Night Camps",
                description: "Sleep under the stars and experience the forest at night",
                imageSrc: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7"
            },
            {
                title: "Water Conservation",
                description: "Learn and participate in water conservation practices",
                imageSrc: "https://images.unsplash.com/photo-1519699047748-de8e457a634e"
            },
            {
                title: "Summer Harvest",
                description: "Harvest and prepare seasonal summer produce",
                imageSrc: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad"
            }
        ]
    },
    {
        name: "Monsoon",
        title: "Season of Renewal",
        subtitle: "Embrace the magic of the rains",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        activities: [
            {
                title: "Rain Dance",
                description: "Celebrate the arrival of monsoon with traditional dances",
                imageSrc: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0"
            },
            {
                title: "Indoor Crafts",
                description: "Learn traditional crafts from community artisans",
                imageSrc: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b"
            },
            {
                title: "Nature Photography",
                description: "Capture the beauty of rain-soaked landscapes",
                imageSrc: "https://images.unsplash.com/photo-1519681393784-d120267933ba"
            }
        ]
    },
    {
        name: "Winter",
        title: "Season of Togetherness",
        subtitle: "Gather around warmth and community",
        bgColor: "bg-orange-50",
        textColor: "text-orange-800",
        activities: [
            {
                title: "Bonfire Gatherings",
                description: "Share stories and music around community bonfires",
                imageSrc: "https://images.unsplash.com/photo-1475619690528-ffe2deb3a5c8"
            },
            {
                title: "Winter Harvest",
                description: "Celebrate the winter harvest with traditional festivities",
                imageSrc: "https://images.unsplash.com/photo-1511735643442-503bb3bd348a"
            },
            {
                title: "Nature Trails",
                description: "Explore winter trails and observe seasonal changes",
                imageSrc: "https://images.unsplash.com/photo-1418985991508-e47386d96a71"
            }
        ]
    }
];

export default function SeasonalActivities() {
    const [mounted, setMounted] = useState(false);
    const [activeSeason, setActiveSeason] = useState(seasons[0]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Season Navigation */}
            <div className="flex flex-wrap justify-center mb-12 gap-4">
                {seasons.map((season) => (
                    <button
                        key={season.name}
                        onClick={() => setActiveSeason(season)}
                        className={`px-8 py-3 rounded-xl transition-all duration-300 text-lg font-medium ${
                            activeSeason.name === season.name
                                ? `${season.bgColor} ${season.textColor} shadow-lg scale-105`
                                : 'bg-white/80 backdrop-blur-sm text-deep-brown/70 hover:bg-white hover:text-deep-brown hover:scale-105'
                        }`}
                    >
                        {season.name}
                    </button>
                ))}
            </div>

            {/* Season Content */}
            <div className={`rounded-3xl p-8 sm:p-12 transition-all duration-500 ${activeSeason.bgColor}`}>
                <div className="text-center mb-12">
                    <h2 className={`text-3xl sm:text-4xl font-bold mb-3 ${activeSeason.textColor}`}>
                        {activeSeason.title}
                    </h2>
                    <p className="text-deep-brown/80 text-lg">{activeSeason.subtitle}</p>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {activeSeason.activities.map((activity, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-56">
                                <Image
                                    src={activity.imageSrc}
                                    alt={activity.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="relative">
                                <div className="absolute -top-16 inset-x-0">
                                    <div className="backdrop-blur-md bg-white/90 mx-4 p-4 rounded-xl border border-white/20 shadow-lg transform -translate-y-2 transition-transform group-hover:translate-y-0">
                                        <h3 className="font-bold text-xl text-deep-brown group-hover:text-terracotta transition-colors">
                                            {activity.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6 pt-12">
                                    <p className="text-deep-brown/80">{activity.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
