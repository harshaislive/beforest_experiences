'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    location: string;
    image?: string;
    community: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Living at Beforest has transformed our family's relationship with nature. Our children now understand where their food comes from and have developed a deep connection with the earth.",
        author: "Priya & Rahul",
        location: "Bangalore",
        community: "Firefly Forest",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300"
    },
    {
        id: 2,
        quote: "The community events and seasonal celebrations have brought so much joy to my life. From harvest festivals to star gazing nights, every day feels like an adventure.",
        author: "Anjali",
        location: "Chennai",
        community: "River Valley",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
        id: 3,
        quote: "After 20 years in the city, I finally found my true calling in this forest community. The organic farming workshops and traditional wisdom sessions have given me a new purpose.",
        author: "Deepak",
        location: "Mumbai",
        community: "Mountain Haven",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    }
];

export default function TestimonialSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextTestimonial = useCallback(() => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((current) => (current + 1) % testimonials.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    }, [isAnimating]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextTestimonial();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextTestimonial]);

    useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        };
    }, []);

    const previousTestimonial = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="relative bg-soft-beige py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-brown mb-12">
                    Stories from Our Community
                </h2>

                <div className="max-w-6xl mx-auto">
                    <div className="relative">
                        {/* Main Content */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Image */}
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={testimonials[activeIndex].image || ''}
                                    alt={testimonials[activeIndex].author}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Quote */}
                            <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                                <svg className="w-12 h-12 text-terracotta/40 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-lg text-deep-brown/80">
                                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                                </p>
                                <div>
                                    <p className="text-xl font-semibold text-deep-brown">
                                        {testimonials[activeIndex].author}
                                    </p>
                                    <p className="text-gray-600">
                                        {testimonials[activeIndex].community}, {testimonials[activeIndex].location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 -mx-16">
                            <button
                                onClick={previousTestimonial}
                                className="p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition-all transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className="p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition-all transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === activeIndex
                                        ? 'bg-terracotta w-6'
                                        : 'bg-terracotta/30 hover:bg-terracotta/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
