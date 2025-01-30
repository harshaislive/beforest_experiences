'use client';

import React from 'react';
import { Event } from '@/lib/types';
import EventCard from '@/components/global/Events/EventCard';

interface LocationPastEventsProps {
  name: string;
  events: Event[];
}

export default function LocationPastEvents({ name, events }: LocationPastEventsProps) {
  const pastEvents = events.filter(event => new Date(event.end_date) <= new Date());
  console.log('LocationPastEvents filtered events:', pastEvents.length);
  return (
    <section className="py-24 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-deep-brown mb-6">
              Past Events at {name}
            </h2>
            <p className="text-lg text-deep-brown/80">
              Explore the memorable experiences we&apos;ve hosted at this location. Each event has contributed to our growing community and connection with nature.
            </p>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showDescription={true}
                  showCapacity={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-deep-brown mb-4">
                No Past Events Yet
              </h3>
              <p className="text-deep-brown/70">
                Stay tuned for future events at {name}. We&apos;re excited to create new experiences and memories with our community.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}