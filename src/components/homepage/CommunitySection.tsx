import { CommunityGlimpses } from '@/components/homepage';

export const communityGlimpses = [
    {
        title: "Morning Yoga in the Forest",
        description: "Start your day with rejuvenating yoga sessions amidst the serene forest environment",
        imageSrc: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
        category: "Wellness"
    },
    {
        title: "Community Farming",
        description: "Experience the joy of growing your own food with fellow community members",
        imageSrc: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1600&q=80",
        category: "Farming"
    },
    {
        title: "Evening Campfires",
        description: "Share stories and build connections around the warmth of community campfires",
        imageSrc: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1600&q=80",
        category: "Community"
    },
    {
        title: "Children's Nature Play",
        description: "Watch children learn and grow through natural play experiences",
        imageSrc: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=80",
        category: "Family"
    },
    {
        title: "Collective Cooking",
        description: "Cook and share meals together using fresh ingredients from our farms",
        imageSrc: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80",
        category: "Food"
    },
    {
        title: "Learning Workshops",
        description: "Participate in hands-on workshops about sustainable living and natural farming",
        imageSrc: "https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=1600&q=80",
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
