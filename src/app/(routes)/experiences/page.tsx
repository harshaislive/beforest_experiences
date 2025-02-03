import { getUpcomingEvents, getPastEvents } from '@/lib/supabase';
import ExperienceCard from '@/components/global/Experiences/ExperienceCard';

export const metadata = {
    title: 'Experiences | Spiritual Retreats',
    description: 'Browse and book our upcoming spiritual retreats and experiences.',
};

export default async function ExperiencesPage() {
    const [upcomingExperiences, pastExperiences] = await Promise.all([
        getUpcomingEvents(),
        getPastEvents(6) // Fetch up to 6 past experiences
    ]);

    return (
        <main className="min-h-screen bg-soft-beige py-32">
            {/* Upcoming Experiences Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-6">
                        Upcoming Experiences
                    </h1>
                    <p className="text-lg text-deep-brown/70">
                        Browse our carefully curated experiences and secure your spot for a transformative experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingExperiences.length > 0 ? (
                        <>
                            {upcomingExperiences.map(event => (
                                <ExperienceCard
                                    key={event.id}
                                    experience={event}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg text-deep-brown/70 mb-4">
                                No upcoming experiences at the moment.
                            </p>
                            <p className="text-deep-brown/70">
                                Follow us on Instagram to stay updated on new experiences.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Past Experiences Section */}
            <section className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-deep-brown mb-6">
                        Past Experiences
                    </h2>
                    <p className="text-lg text-deep-brown/70">
                        Explore our previous experiences and get a glimpse of the Beforest experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastExperiences.length > 0 ? (
                        <>
                            {pastExperiences.map(event => (
                                <ExperienceCard
                                    key={event.id}
                                    experience={event}
                                    showCapacity={false}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg text-deep-brown/70">
                                No past experiences to show.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
