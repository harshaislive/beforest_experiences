'use client';

import React from 'react';
import { Event } from '@/lib/types';
import ExperienceCard from '@/components/global/Experiences/ExperienceCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LocationUpcomingExperiencesProps {
  name: string;
  events: Event[];
}

export default function LocationUpcomingExperiences({ name, events }: LocationUpcomingExperiencesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <section id="upcoming-experiences" className="py-24 bg-gradient-to-b from-sage-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-deep-brown mb-6">
            Upcoming Experiences at {name}
          </h2>
          <p className="text-lg text-deep-brown/70">
            Join us for these carefully curated experiences that bring our community together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <ExperienceCard
              key={event.id}
              experience={event}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 font-medium text-lg group"
          >
            View All Experiences
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
    </section>
  );
}
