import ExperienceCard from '@/components/global/Experiences/ExperienceCard';
import { Event } from '@/lib/types';

const experiences: Event[] = [
    {
        id: 'farm-to-table',
        title: "Farm-to-Table Feasts",
        description: "Experience the joy of harvesting and cooking together",
        slug: "farm-to-table-feasts",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(), // next day
        total_capacity: 20,
        current_participants: 0,
        status: 'published',
        is_featured: false,
        location_id: 'all',
        experience_images: [{
            id: 'farm-1',
            image_url: "https://i.postimg.cc/XvMgZrcS/8.jpg",
            is_hero: true,
            alt_text: "Farm to Table Experience"
        }],
        locations: {
            id: 'all',
            name: "All Locations",
            slug: 'all-locations',
            description: 'Available at all locations',
            is_active: true,
            location_images: [],
            upcoming_event_count: 0,
            event_count: 0,
            features: [],
            highlights: []
        },
        pricing_options: [],
        food_options: [],
        itinerary: []
    },
    {
        id: 'nature-immersion',
        title: "Nature Immersion",
        description: "Connect deeply with the natural world",
        slug: "nature-immersion",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        total_capacity: 20,
        current_participants: 0,
        status: 'published',
        is_featured: false,
        location_id: 'all',
        experience_images: [{
            id: 'nature-1',
            image_url: "https://i.postimg.cc/Qt21Hwr8/PBR-2100.jpg",
            is_hero: true,
            alt_text: "Nature Immersion Experience"
        }],
        locations: {
            id: 'all',
            name: "All Locations",
            slug: 'all-locations',
            description: 'Available at all locations',
            is_active: true,
            location_images: [],
            upcoming_event_count: 0,
            event_count: 0,
            features: [],
            highlights: []
        },
        pricing_options: [],
        food_options: [],
        itinerary: []
    },
    {
        id: 'cultural-celebrations',
        title: "Cultural Celebrations",
        description: "Participate in vibrant community traditions",
        slug: "cultural-celebrations",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        total_capacity: 20,
        current_participants: 0,
        status: 'published',
        is_featured: false,
        location_id: 'all',
        experience_images: [{
            id: 'cultural-1',
            image_url: "https://i.postimg.cc/ZRqRLc4G/PBR-7538.jpg",
            is_hero: true,
            alt_text: "Cultural Celebrations Experience"
        }],
        locations: {
            id: 'all',
            name: "All Locations",
            slug: 'all-locations',
            description: 'Available at all locations',
            is_active: true,
            location_images: [],
            upcoming_event_count: 0,
            event_count: 0,
            features: [],
            highlights: []
        },
        pricing_options: [],
        food_options: [],
        itinerary: []
    }
];

export default function ExperienceSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-terracotta/5 via-transparent to-transparent" />
            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-deep-brown mb-6">
                        Experience Life at Beforest
                    </h2>
                    <p className="text-lg text-deep-brown/70">
                        Immerse yourself in a community where nature, culture, and sustainable living come together.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {experiences.map((experience) => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            showDescription={true}
                            variant="default"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
