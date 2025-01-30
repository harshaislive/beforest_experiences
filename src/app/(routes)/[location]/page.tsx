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
  const { upcomingEvents, pastEvents } = await getLocationEvents(params.location);

  if (!locationData) {
    notFound();
  }

  console.log('Location Data:', {
    name: locationData.name,
    features: locationData.features,
    highlights: locationData.highlights
  });

  const heroImage = locationData.location_images?.find(
    (img: { is_hero?: boolean }) => img.is_hero
  )?.image_url || locationData.location_images?.[0]?.image_url;

  return (
    <>
      <LocationHero
        name={locationData.name}
        slug={locationData.slug}
        description={locationData.description}
        imageUrl={heroImage}
        hasEvents={upcomingEvents.length > 0}
      />

      <LocationOverview
        name={locationData.name}
        features={locationData.features || []}
        highlights={locationData.highlights || []}
        hasEvents={upcomingEvents.length > 0}
      />

      <LocationUpcomingEvents
        name={locationData.name}
        events={upcomingEvents.map(transformEventData)}
      />

      {pastEvents.length > 0 && (
        <LocationPastEvents
          name={locationData.name}
          events={pastEvents.map(transformEventData)}
        />
      )}
    </>
  );
}
