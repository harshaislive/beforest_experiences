'use client';

import React from 'react';
import { Event } from '@/lib/types';
import EventCard from '@/components/global/Events/EventCard';
import Link from 'next/link';

interface LocationUpcomingEventsProps {
  name: string;
  events: Event[];
}

export default function LocationUpcomingEvents({ name, events }: LocationUpcomingEventsProps) {
  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date());
  console.log('LocationUpcomingEvents filtered events:', upcomingEvents.length);
  
  if (upcomingEvents.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-deep-brown mb-6">
                Upcoming Events at {name}
              </h2>
              <p className="text-lg text-deep-brown/80 mb-8">
                We are planning something... keep an eye on our Instagram for now
              </p>
              <a 
                href="https://instagram.com/beforestfarming"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 transition-colors"
              >
                <span>Follow us on Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-deep-brown mb-6">
              Upcoming Events at {name}
            </h2>
            <p className="text-lg text-deep-brown/80">
              Join us for transformative experiences that connect you with nature and our community. Each event is thoughtfully designed to create lasting impact.
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showDescription={true}
                  showCapacity={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-sage-50 rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-deep-brown mb-4">
                New Events Coming Soon
              </h3>
              <p className="text-deep-brown/70 mb-8">
                We&apos;re planning exciting new events at {name}. Join our community to be the first to know when new events are announced.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/events" 
                  className="inline-block bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse All Events
                </Link>
                <Link 
                  href="/newsletter" 
                  className="inline-block bg-sage-100 hover:bg-sage-200 text-deep-brown px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe to Updates
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
