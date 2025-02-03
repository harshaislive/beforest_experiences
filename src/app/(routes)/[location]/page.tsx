import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Event } from '@/lib/types';
import LocationHero from '@/components/global/Locations/LocationHero';
import LocationOverview from '@/components/global/Locations/LocationOverview';
import LocationUpcomingEvents from '@/components/global/Locations/LocationUpcomingEvents';
import LocationPastEvents from '@/components/global/Locations/LocationPastEvents';
import { getLocation, getLocationEvents } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface LocationPageProps {
  params: {
    location: string;
  };
}

interface LocationImage {
  image_url: string;
  is_hero: boolean;
  alt_text?: string;
}

interface LocationData {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  highlights: Array<{
    title: string;
    description: string;
  }>;
  location_images: LocationImage[];
}

// Transform event data to match Event interface
const transformEventData = (event: any): Event => ({
  ...event,
  pricing_options: event.event_pricing || [],
  food_options: event.event_food_options || [],
  itinerary: event.event_itinerary || []
});

export default async function LocationPage({ params }: LocationPageProps) {
  const locationData = await getLocation(params.location);
  if (!locationData) {
    notFound();
  }

  const { upcomingEvents: rawUpcomingEvents, pastEvents: rawPastEvents } = await getLocationEvents(locationData.id);

  // Transform event data
  const upcomingEvents = rawUpcomingEvents.map(transformEventData);
  const pastEvents = rawPastEvents.map(transformEventData);

  console.log('Location Data:', {
    name: locationData.name,
    features: locationData.features,
    highlights: locationData.highlights,
    upcomingEventsCount: upcomingEvents.length,
    pastEventsCount: pastEvents.length
  });

  const heroImage = locationData.location_images?.find(
    (img: { is_hero?: boolean }) => img.is_hero
  )?.image_url || locationData.location_images?.[0]?.image_url;

  const hasEvents = upcomingEvents.length > 0;

  return (
    <main className="min-h-screen">
      <LocationHero
        name={locationData.name}
        slug={locationData.slug}
        description={locationData.description}
        imageUrl={heroImage}
        hasEvents={hasEvents}
      />

      {hasEvents && (
        <LocationUpcomingEvents
          name={locationData.name}
          events={upcomingEvents}
        />
      )}

      <LocationOverview
        name={locationData.name}
        features={locationData.features || []}
        highlights={locationData.highlights || []}
        hasEvents={hasEvents}
      />

      {pastEvents.length > 0 && (
        <LocationPastEvents
          name={locationData.name}
          events={pastEvents}
        />
      )}
    </main>
  );
}
