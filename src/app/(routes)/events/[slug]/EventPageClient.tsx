'use client';

import React, { useState } from 'react';
import EventHero from '@/components/global/Events/EventHero';
import EventDetails from '@/components/global/Events/EventDetails';
import BookingModal from '@/components/global/Events/BookingModal';
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
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <div className="absolute inset-0">
          <Image
            src={event.event_images[0]?.image_url || '/images/event-placeholder.jpg'}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {event.title}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {event.description}
            </p>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{event.locations?.name || 'Location TBA'}</span>
              </div>
              {isAvailable && (
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg font-medium transition-colors hidden md:block"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <EventDetails
              id={event.id}
              title={event.title}
              description={event.description}
              location={event.locations?.name || 'Location TBA'}
              startDate={event.start_date}
              date={event.start_date}
              endDate={event.end_date}
              capacity={capacity}
              isAvailable={isAvailable}
              onBookingClick={() => setBookingModalOpen(true)}
              schedule={event.itinerary?.map(item => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                duration: item.duration,
                order: item.order
              }))}
            />
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        event={event}
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