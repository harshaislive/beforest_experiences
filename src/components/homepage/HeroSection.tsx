'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroContentProps {
    className?: string;
}

interface HeroImageProps {
    className?: string;
}

// Static hero content component
const HeroContent: React.FC<HeroContentProps> = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 md:px-8 w-full max-w-5xl mx-auto">
            <div className="backdrop-blur-md bg-black/30 rounded-2xl p-8 sm:p-12 border border-white/10 shadow-2xl">
                <p className="text-lg sm:text-xl font-medium mb-2 text-white/90">
                    Remember When Life Was Simple?
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white">
                    Rediscover Life&apos;s Pure Moments in the Forest
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
                    Join intimate Beforest experiences where campfires, starlit dinners, and morning birdsong bring back the joy of simple living
                </p>
                <Link 
                    href="/experiences" 
                    className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all active:bg-terracotta/80 touch-manipulation group"
                >
                    View Experiences
                    <svg 
                        className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    </div>
);

// Static fallback image component
const HeroImage: React.FC<HeroImageProps> = () => (
    <div className="relative w-full h-full">
        <Image 
            src="https://i.postimg.cc/MGXQtq6Z/PBR-6090.jpg"
            alt="Beforest Hero"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
            className="object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.currentTarget;
                target.src = "https://i.postimg.cc/MGXQtq6Z/PBR-6090.jpg";
            }}
        />
    </div>
);

const HeroSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8;
        }
    }, []);

    const handleVideoError = () => {
        console.warn('Failed to load hero video, falling back to image');
        setVideoError(true);
    };

    const handleVideoLoad = () => {
        setVideoLoaded(true);
    };

    return (
        <div className="relative min-h-[600px] h-[100vh] w-full overflow-hidden hero-container">
            {isClient ? (
                <>
                    {!videoError ? (
                        <div className="relative w-full h-full">
                            <div className={`absolute inset-0 bg-deep-brown/20 ${!videoLoaded ? 'animate-pulse' : ''}`} />
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className={`absolute top-0 left-0 w-full h-full object-cover ${
                                    videoLoaded ? 'opacity-100' : 'opacity-0'
                                } transition-opacity duration-700`}
                                onError={handleVideoError}
                                onLoadedData={handleVideoLoad}
                            >
                                <source src="/videos/hero-background.mp4" type="video/mp4" />
                                <HeroImage />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
                        </div>
                    ) : (
                        <>
                            <HeroImage />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
                        </>
                    )}
                </>
            ) : (
                <>
                    <HeroImage />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
                </>
            )}
            <HeroContent />
        </div>
    );
};

export default HeroSection;
