'use client';

import React, { useState } from 'react';
import ExperienceHero from '@/components/global/Experiences/ExperienceHero';
import ExperienceDetails from '@/components/global/Experiences/ExperienceDetails';
import BookingModal from '@/components/global/Experiences/BookingModal';
import { Event, EventItinerary } from '@/lib/types';
import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface EventPageClientProps {
  event: Event;
  capacity: {
    available: number;
    total: number;
  };
}

export default function EventPageClient({ event, capacity }: EventPageClientProps) {
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);

  // Log the event and itinerary for debugging
  console.log('Event in EventPageClient:', JSON.stringify(event, null, 2));
  console.log('Event Itinerary:', JSON.stringify(event.itinerary || [], null, 2));

  const isAvailable = capacity.available > 0;

  return (
    <main className="min-h-screen bg-sage-50">
      <ExperienceHero
        title={event.title}
        description={event.description}
        location={event.locations?.name || 'Location TBA'}
        startDate={event.start_date}
        endDate={event.end_date}
        heroImage={event.experience_images?.[0]?.image_url}
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <ExperienceDetails
              experience={event}
              images={event.experience_images.map(img => ({
                image_url: img.image_url,
                alt_text: img.alt_text
              }))}
              itinerary={event.itinerary?.map(item => ({
                id: item.id,
                time: item.time,
                activity: item.activity,
                description: item.description,
                duration: item.duration,
                order: item.order
              })) || []}
              pricing={event.pricing_options.map(option => ({
                category: option.category,
                price: option.price,
                description: option.description || undefined
              }))}
              foodOptions={event.food_options.map(option => ({
                name: option.name,
                price: option.price,
                description: option.description || undefined,
                is_vegetarian: option.is_vegetarian || undefined
              }))}
            />
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        experience={event}
        capacity={capacity}
      />

      {/* Mobile Booking Button */}
      {isAvailable && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4">
            <button
              className="w-full bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
              onClick={() => setBookingModalOpen(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}