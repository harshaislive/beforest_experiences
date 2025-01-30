'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

interface EventHeroProps {
  title: string;
  description: string;
  location: {
    name: string;
    slug: string;
  };
  date: string;
  capacity: {
    available: number;
    total: number;
  };
  images: Array<{
    image_url: string;
    alt_text?: string;
  }>;
  onBookingClick: () => void;
  isAvailable: boolean;
}

export default function EventHero({ 
  title, 
  description, 
  location, 
  date, 
  capacity, 
  images,
  onBookingClick,
  isAvailable 
}: EventHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const dateFormatted = formatDate(date);

  return (
    <section className="relative h-[80vh] min-h-[600px]">
      {/* Image Gallery */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.image_url}
            alt={image.alt_text || title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-deep-brown/30 hover:bg-deep-brown/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-deep-brown/30 hover:bg-deep-brown/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-deep-brown/50 to-transparent">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <div className="text-soft-beige max-w-4xl">
            {/* Location Link */}
            <Link
              href={`/${location.slug}`}
              className="inline-flex items-center gap-2 mb-4 text-soft-beige/80 hover:text-soft-beige transition-colors group"
            >
              <MapPinIcon className="w-5 h-5" />
              <span className="group-hover:underline">{location.name}</span>
            </Link>

            {/* Title & Description */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-soft-beige">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-soft-beige/90 max-w-2xl mb-8">
              {description}
            </p>

            {/* Event Meta */}
            <div className="flex flex-wrap gap-6 items-center text-base sm:text-lg mb-8">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" />
                <div>
                  <div className="font-medium">{dateFormatted.day}</div>
                  <div className="text-soft-beige/80">{dateFormatted.date} at {dateFormatted.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-6 h-6" />
                <div>
                  <div className="font-medium">{capacity.available} spots left</div>
                  <div className="text-soft-beige/80">out of {capacity.total} total</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {isAvailable ? (
              <button 
                onClick={onBookingClick}
                className="bg-terracotta hover:bg-terracotta/90 text-soft-beige px-8 py-4 rounded-lg font-medium text-lg transition-colors active:bg-terracotta/80 touch-manipulation"
              >
                Book Your Spot
              </button>
            ) : (
              <div className="inline-block bg-deep-brown/50 text-soft-beige/80 px-8 py-4 rounded-lg font-medium text-lg">
                Fully Booked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-deep-brown/50 text-soft-beige px-4 py-2 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </section>
  );
}
