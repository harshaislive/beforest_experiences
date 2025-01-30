import { getUpcomingEvents } from '@/lib/supabase';
import { Event } from '@/lib/types';
import EventCard from '@/components/global/Events/EventCard';
import Link from 'next/link';

export default async function UpcomingEventsSection() {
    let events: Event[] = [];
    
    try {
        console.log('[UpcomingEventsSection] Fetching upcoming events...');
        events = await getUpcomingEvents(3); // Show 3 upcoming events
        console.log('[UpcomingEventsSection] Found events:', {
            count: events.length,
            events: events.map(e => ({
                id: e.id,
                title: e.title,
                startDate: e.start_date,
                status: e.status
            }))
        });
    } catch (error) {
        console.error('[UpcomingEventsSection] Error fetching upcoming events:', error);
    }

    if (!events.length) {
        console.log('[UpcomingEventsSection] No events found, showing Instagram CTA');
        return (
            <section className="py-24 sm:py-32 bg-white relative">
                <div className="absolute inset-0 bg-[url('/patterns/dots-light.png')] opacity-20" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-deep-brown mb-6">
                                We are planning something special...
                            </h2>
                            <p className="text-lg sm:text-xl text-deep-brown/80 mb-8">
                                Keep an eye on our Instagram for exciting announcements about upcoming events and experiences.
                            </p>
                            <a 
                                href="https://instagram.com/beforest.in" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-lg font-medium text-deep-brown hover:text-terracotta transition-colors"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                Follow us on Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 sm:py-32 bg-white relative">
            <div className="absolute inset-0 bg-[url('/patterns/dots-light.png')] opacity-20" />
            <div className="container mx-auto px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
                        <span className="text-terracotta text-sm sm:text-base font-medium tracking-wider uppercase mb-4 block">
                            Mark Your Calendar
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-deep-brown mb-6">
                            Upcoming Events
                        </h2>
                        <p className="text-lg sm:text-xl text-deep-brown/80 max-w-2xl mx-auto">
                            Join us for these transformative experiences at our carefully chosen locations
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                showDescription={true}
                                showCapacity={true}
                            />
                        ))}
                    </div>
                    <div className="mt-16 sm:mt-20 text-center">
                        <Link 
                            href="/events" 
                            className="inline-flex items-center gap-2 text-lg font-medium text-deep-brown hover:text-terracotta transition-colors group"
                        >
                            View All Events
                            <svg 
                                className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
