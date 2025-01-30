import { ExperienceCard } from '@/components/homepage';

const experiences = [
    {
        title: "Farm-to-Table Feasts",
        description: "Experience the joy of harvesting and cooking together",
        activities: [
            "Community dining experiences",
            "Organic produce celebrations",
            "Seasonal harvest festivals"
        ],
        imageSrc: "https://images.unsplash.com/photo-1592192113042-6d73d45c085e"
    },
    {
        title: "Nature Immersion",
        description: "Connect deeply with the natural world",
        activities: [
            "Forest walks",
            "Wildlife watching",
            "Star gazing sessions"
        ],
        imageSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
    },
    {
        title: "Cultural Celebrations",
        description: "Participate in vibrant community traditions",
        activities: [
            "Traditional festivals",
            "Art & music events",
            "Seasonal rituals"
        ],
        imageSrc: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e"
    }
];

export default function ExperienceSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-deep-brown mb-16">
                    Experience Life at Beforest
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {experiences.map((experience, index) => (
                        <ExperienceCard key={index} {...experience} />
                    ))}
                </div>
            </div>
        </section>
    );
}
