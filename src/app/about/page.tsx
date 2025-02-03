import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us | BeForest Events',
    description: 'Learn about BeForest Events and our mission to connect people with nature through unique experiences.',
};

export default function AboutPage() {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px]">
                <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                    alt="Nature landscape"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Connecting People with Nature
                            </h1>
                            <p className="text-xl text-white/90">
                                Creating meaningful experiences in nature&apos;s most beautiful settings
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-deep-brown mb-6">Our Mission</h2>
                                <p className="text-lg text-deep-brown/80">
                                    We&apos;re dedicated to creating sustainable and mindful experiences that connect people with nature. Through our carefully curated events, we aim to foster a deeper appreciation for the environment while building lasting connections between like-minded individuals.
                                </p>
                            </div>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1510797215324-95aa89f43c33"
                                    alt="People enjoying nature"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-deep-brown text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Sustainability',
                                description: 'We are committed to preserving and protecting the natural environments we operate in.',
                                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09'
                            },
                            {
                                title: 'Community',
                                description: 'Building meaningful connections between people and fostering a sense of belonging.',
                                image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846'
                            },
                            {
                                title: 'Adventure',
                                description: 'Creating unique experiences that challenge and inspire our participants.',
                                image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e'
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-sage-50 rounded-xl overflow-hidden">
                                <div className="relative h-48">
                                    <Image
                                        src={value.image}
                                        alt={value.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-semibold text-deep-brown mb-4">{value.title}</h3>
                                    <p className="text-deep-brown/80">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-deep-brown text-center mb-12">Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: 'John Doe',
                                role: 'Founder & CEO',
                                bio: 'Nature enthusiast with 10+ years of experience in outdoor adventures.',
                                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                            },
                            {
                                name: 'Jane Smith',
                                role: 'Experience Director',
                                bio: 'Expert in creating meaningful outdoor experiences and community building.',
                                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                            },
                            {
                                name: 'Mike Johnson',
                                role: 'Head of Operations',
                                bio: 'Passionate about sustainable tourism and environmental conservation.',
                                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
                            }
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-deep-brown mb-2">{member.name}</h3>
                                <p className="text-terracotta mb-2">{member.role}</p>
                                <p className="text-deep-brown/80">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
} 