import { getAllLocations } from '@/lib/supabase';
import { Location } from '@/lib/types';
import LocationCard from '@/components/global/Locations/LocationCard';
import { Suspense } from 'react';

// Error card component
const ErrorCard = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{message}</p>
    </div>
);

// Separate loading component
const LoadingCard = () => (
    <div className="animate-pulse bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 bg-gray-300" />
        <div className="p-6">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-4" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
        </div>
    </div>
);

// Separate locations grid component
const LocationsGrid = ({ locations }: { locations: Location[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map((location) => {
            const heroImage = location.location_images?.find(
                (img: { is_hero?: boolean }) => img.is_hero
            )?.image_url || location.location_images?.[0]?.image_url || '/images/locations-placeholder.jpg';
            
            const upcomingEventCount = location.upcoming_event_count || 0;
            const totalEventCount = location.event_count || 0;
            
            return (
                <LocationCard
                    key={location.id}
                    name={location.name}
                    slug={location.slug}
                    imageUrl={heroImage}
                    description={location.description}
                    hasEvents={upcomingEventCount > 0}
                    eventCount={totalEventCount}
                />
            );
        })}
    </div>
);

export default async function LocationsSection() {
    let locations: Location[] = [];
    let error: Error | null = null;

    try {
        locations = await getAllLocations();
    } catch (e) {
        error = e as Error;
        console.error('Error fetching locations data:', e);
    }

    if (error) {
        return (
            <section className="py-24 bg-sage">
                <div className="container mx-auto px-4">
                    <ErrorCard message="Unable to load locations" />
                </div>
            </section>
        );
    }

    // Calculate total upcoming events across all locations
    const totalUpcomingEvents = locations.reduce((sum, location) => 
        sum + (location.upcoming_event_count || 0), 0
    );

    // Show Instagram message if no upcoming events
    if (locations.length === 0) {
        return (
            <section className="py-24 bg-sage">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-deep-brown/80 text-lg mb-4">We are planning something... keep an eye on our Instagram for now</p>
                    <a 
                        href="https://instagram.com/beforestfarming"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 transition-colors"
                    >
                        Follow us on Instagram
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                    </a>
                </div>
            </section>
        );
    }

    return (
        <section id="locations" className="py-24 bg-sage">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold text-deep-brown mb-6">
                        Our Locations
                    </h2>
                    <p className="text-lg text-deep-brown/80">
                        Each location offers unique experiences, connecting you with nature and community.
                        {totalUpcomingEvents > 0 && ` We currently have ${totalUpcomingEvents} upcoming events.`}
                    </p>
                </div>
                <Suspense fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1,2,3].map(i => <LoadingCard key={i} />)}
                    </div>
                }>
                    <LocationsGrid locations={locations} />
                </Suspense>
            </div>
        </section>
    );
}
