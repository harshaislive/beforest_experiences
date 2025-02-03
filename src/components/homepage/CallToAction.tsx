'use client';

import Link from 'next/link';

export default function CallToAction() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969')] bg-cover bg-center bg-fixed" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>
            <div className="relative container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="backdrop-blur-md bg-black/20 rounded-2xl p-8 sm:p-12 border border-white/10 shadow-2xl">
                        <div className="text-center">
                            <span className="inline-block text-terracotta text-sm sm:text-base font-medium tracking-wider uppercase mb-4">
                                Your Journey Awaits
                            </span>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                                Begin Your Beforest Journey
                            </h2>
                            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
                                Join our community and discover a life in harmony with nature
                            </p>
                            <Link
                                href="/experiences"
                                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 active:scale-100 group"
                            >
                                Explore Events
                                <svg 
                                    className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
