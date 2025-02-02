'use client';

import { Event, EventItinerary } from '@/lib/types';
import { useState } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import BookingModal from './BookingModal';
import ScheduleTimeline from './ScheduleTimeline';

interface ExperienceDetailsProps {
    experience: Event;
    images: Array<{
        image_url: string;
        alt_text?: string;
    }>;
    itinerary: EventItinerary[];
    pricing: Array<{
        category?: string;
        price: number;
        description?: string;
    }>;
    foodOptions: Array<{
        name: string;
        price: number;
        description?: string;
        is_vegetarian?: boolean;
    }>;
}

export default function ExperienceDetails({
    experience,
    images,
    itinerary,
    pricing,
    foodOptions
}: ExperienceDetailsProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    // Calculate the lowest price from pricing options
    const lowestPrice = pricing.reduce((min, option) => 
        option.price < min ? option.price : min,
        pricing[0]?.price || 0
    );

    return (
        <>
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Tab.Group>
                            <Tab.List className="flex space-x-4 border-b border-deep-brown/10">
                                <Tab className={({ selected }) =>
                                    `px-6 py-3 text-lg font-medium border-b-2 transition-colors outline-none ${
                                        selected
                                            ? 'border-terracotta text-terracotta'
                                            : 'border-transparent text-deep-brown/60 hover:text-deep-brown hover:border-deep-brown/20'
                                    }`
                                }>
                                    Overview
                                </Tab>
                                <Tab className={({ selected }) =>
                                    `px-6 py-3 text-lg font-medium border-b-2 transition-colors outline-none ${
                                        selected
                                            ? 'border-terracotta text-terracotta'
                                            : 'border-transparent text-deep-brown/60 hover:text-deep-brown hover:border-deep-brown/20'
                                    }`
                                }>
                                    Schedule
                                </Tab>
                            </Tab.List>
                            <Tab.Panels className="mt-8">
                                <Tab.Panel>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-deep-brown/80 leading-relaxed">
                                            {experience.description}
                                        </p>
                                    </div>
                                    
                                    {/* Image Gallery */}
                                    <div className="mt-12">
                                        <h3 className="text-2xl font-bold text-deep-brown mb-6">Gallery</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative h-64 rounded-xl overflow-hidden group">
                                                    <Image
                                                        src={image.image_url}
                                                        alt={image.alt_text || `Gallery image ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Tab.Panel>
                                
                                <Tab.Panel>
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <h3 className="text-2xl font-bold text-deep-brown mb-6">Daily Schedule</h3>
                                        <ScheduleTimeline itinerary={itinerary} />
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24 border border-deep-brown/5">
                            {/* Price Display */}
                            <div className="mb-6">
                                <div className="text-sm text-deep-brown/70 mb-1">Starting from</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-deep-brown">₹{lowestPrice.toLocaleString()}</span>
                                    <span className="text-deep-brown/70">per person</span>
                                </div>
                            </div>

                            {/* Date and Location */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-deep-brown/70 p-3 bg-soft-beige rounded-lg">
                                    <CalendarIcon className="w-5 h-5" />
                                    <div>
                                        <div className="text-sm text-deep-brown/60">Date</div>
                                        <div className="text-deep-brown font-medium">
                                            {new Date(experience.start_date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 text-deep-brown/70 p-3 bg-soft-beige rounded-lg">
                                    <MapPinIcon className="w-5 h-5" />
                                    <div>
                                        <div className="text-sm text-deep-brown/60">Location</div>
                                        <div className="text-deep-brown font-medium">
                                            {experience.locations?.name || 'Location TBA'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-deep-brown/70 p-3 bg-soft-beige rounded-lg">
                                    <UsersIcon className="w-5 h-5" />
                                    <div>
                                        <div className="text-sm text-deep-brown/60">Availability</div>
                                        <div className="text-deep-brown font-medium">
                                            {experience.total_capacity - (experience.current_participants || 0)} spots remaining
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Button - Mobile Sticky */}
                            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-deep-brown/10 shadow-lg z-[100]">
                                <div className="container mx-auto px-4">
                                    <button
                                        onClick={() => setIsBookingOpen(true)}
                                        className="w-full bg-terracotta hover:bg-terracotta/90 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all active:bg-terracotta/80"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>

                            {/* Booking Button - Desktop */}
                            <div className="hidden md:block">
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-terracotta hover:bg-terracotta/90 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all active:bg-terracotta/80 shadow-md hover:shadow-lg"
                                >
                                    Book Now
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 pt-6 border-t border-deep-brown/10">
                                <div className="flex items-center gap-2 text-deep-brown/60 text-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Instant confirmation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                experience={experience}
                capacity={{
                    available: experience.total_capacity - (experience.current_participants || 0),
                    total: experience.total_capacity
                }}
            />
        </>
    );
} 