import { getNearestUpcomingEvent } from '@/lib/supabase';
import { Event } from '@/lib/types';
import ExperienceCard from '@/components/global/Experiences/ExperienceCard';

export default async function NearestEventSection() {
    let event: Event | null = null;
    
    try {
        console.log('[NearestEventSection] Fetching nearest event...');
        event = await getNearestUpcomingEvent();
        
        if (!event) {
            console.log('[NearestEventSection] No upcoming events found');
            return (
                <section className="py-24 sm:py-32 bg-light-sage relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/patterns/texture-light.png')] opacity-30 mix-blend-overlay" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-7xl mx-auto">
                            <div className="max-w-3xl mx-auto text-center">
                                <div className="backdrop-blur-md bg-deep-brown/5 rounded-2xl p-8 sm:p-12 border border-deep-brown/10">
                                    <span className="text-terracotta text-sm sm:text-base font-medium tracking-wider uppercase mb-4 block">
                                        Coming Soon
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-bold text-deep-brown mb-6">
                                        We are planning something special...
                                    </h2>
                                    <p className="text-lg text-deep-brown/80 mb-8">
                                        Keep an eye on our Instagram for exciting announcements about upcoming events and experiences.
                                    </p>
                                    <a 
                                        href="https://instagram.com/beforest.in" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-lg font-medium text-deep-brown hover:text-terracotta transition-colors bg-white/50 hover:bg-white px-6 py-3 rounded-xl"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                        Follow us on Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        console.log('[NearestEventSection] Found event:', {
            id: event.id,
            title: event.title,
            location: event.locations?.name,
            startDate: event.start_date
        });

    } catch (error) {
        console.error('[NearestEventSection] Error fetching nearest event:', error);
        return null;
    }

    return (
        <section className="py-24 sm:py-32 bg-light-sage relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/texture-light.png')] opacity-30 mix-blend-overlay" />
            <div className="container mx-auto px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
                        <span className="text-terracotta text-sm sm:text-base font-medium tracking-wider uppercase mb-4 block">
                            Don&apos;t Miss Out
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-deep-brown mb-6">
                            Next Experience
                        </h2>
                        <p className="text-lg sm:text-xl text-deep-brown/80 max-w-2xl mx-auto">
                            Join us for our next transformative event and be part of something extraordinary
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <ExperienceCard
                            experience={event}
                            variant="featured"
                            showDescription={true}
                            showCapacity={true}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
