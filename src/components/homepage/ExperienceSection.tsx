import ExperienceCard from '@/components/global/Experiences/ExperienceCard';

type Experience = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
    slug: string;
};

const experiences: Experience[] = [
    {
        id: 'farm-to-table',
        title: "Farm-to-Table Feasts",
        description: "Experience the joy of harvesting and cooking together. Join us for an immersive culinary journey where you'll learn about sustainable farming practices, harvest fresh ingredients, and create delicious meals with our expert chefs.",
        imageUrl: "https://i.postimg.cc/XvMgZrcS/8.jpg",
        altText: "Farm to Table Experience",
        slug: "farm-to-table-feasts"
    },
    {
        id: 'nature-immersion',
        title: "Nature Immersion",
        description: "Connect deeply with the natural world through guided forest walks, meditation sessions, and wildlife observation. Learn about local flora and fauna while experiencing the therapeutic benefits of nature.",
        imageUrl: "https://i.postimg.cc/Qt21Hwr8/PBR-2100.jpg",
        altText: "Nature Immersion Experience",
        slug: "nature-immersion"
    },
    {
        id: 'cultural-celebrations',
        title: "Cultural Celebrations",
        description: "Participate in vibrant community traditions that celebrate local heritage. Immerse yourself in music, dance, crafts, and storytelling sessions that bring age-old customs to life.",
        imageUrl: "https://i.postimg.cc/ZRqRLc4G/PBR-7538.jpg",
        altText: "Cultural Celebrations Experience",
        slug: "cultural-celebrations"
    }
];

export default function ExperienceSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-terracotta/5 via-transparent to-transparent" />
            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="text-terracotta font-medium mb-4 block">Our Experiences</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-deep-brown mb-6">
                        Experience Life at Beforest
                    </h2>
                    <p className="text-lg text-deep-brown/70">
                        Immerse yourself in a community where nature, culture, and sustainable living come together. 
                        Each experience is thoughtfully crafted to bring you closer to nature and our community.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {experiences.map((experience) => (
                        <div key={experience.id} className="group hover:scale-[1.02] transition-transform duration-300">
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={experience.imageUrl} 
                                        alt={experience.altText}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-deep-brown mb-3">
                                        {experience.title}
                                    </h3>
                                    <p className="text-deep-brown/70 mb-4">
                                        {experience.description}
                                    </p>
                                    <a 
                                        href={`/experiences/${experience.slug}`}
                                        className="inline-flex items-center text-terracotta hover:text-terracotta/80 font-medium"
                                    >
                                        Learn more
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
