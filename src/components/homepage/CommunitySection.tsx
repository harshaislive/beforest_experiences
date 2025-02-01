import { CommunityGlimpses } from '@/components/homepage';

export const communityGlimpses = [
    {
        title: "Morning Yoga in the Forest",
        description: "Start your day with rejuvenating yoga sessions amidst the serene forest environment",
        imageSrc: "https://i.postimg.cc/SKszxqHF/PBR-9576.jpg",
        category: "Wellness"
    },
    {
        title: "Community Farming",
        description: "Experience the joy of growing your own food with fellow community members",
        imageSrc: "https://i.postimg.cc/XvyDmMx3/Photo-03.jpg",
        category: "Farming"
    },
    {
        title: "Evening Campfires",
        description: "Share stories and build connections around the warmth of community campfires",
        imageSrc: "https://i.postimg.cc/fL90nCS6/PBR-8762.jpg",
        category: "Community"
    },
    {
        title: "Children's Nature Play",
        description: "Watch children learn and grow through natural play experiences",
        imageSrc: "https://i.postimg.cc/T3fjVz5h/IMG-2358.avif",
        category: "Family"
    },
    {
        title: "Collective Cooking",
        description: "Cook and share meals together using fresh ingredients from our farms",
        imageSrc: "https://i.postimg.cc/PxDJCq4c/PBR-9982.jpg",
        category: "Food"
    },
    {
        title: "Learning Workshops",
        description: "Participate in hands-on workshops about sustainable living and natural farming",
        imageSrc: "https://i.postimg.cc/R0yqCtcK/IMG-2562.jpg",
        category: "Education"
    }
];

export default function CommunitySection() {
    return (
        <section className="py-24 sm:py-32 bg-soft-beige/50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
                    <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta text-sm font-medium rounded-full mb-6">
                        Community Life
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-deep-brown mb-6 tracking-tight">
                        A Day in Our Community
                    </h2>
                    <p className="text-lg sm:text-xl text-deep-brown/70 max-w-2xl mx-auto leading-relaxed">
                        Experience the rhythm of life at Beforest through these daily moments of connection and growth
                    </p>
                </div>
                <div className="max-w-7xl mx-auto">
                    <CommunityGlimpses glimpses={communityGlimpses} />
                </div>
            </div>
        </section>
    );
}
