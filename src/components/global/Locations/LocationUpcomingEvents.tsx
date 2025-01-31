'use client';

import React from 'react';
import { Event } from '@/lib/types';
import EventCard from '@/components/global/Events/EventCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LocationUpcomingEventsProps {
  name: string;
  events: Event[];
}

export default function LocationUpcomingEvents({ name, events }: LocationUpcomingEventsProps) {
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
    <section id="upcoming-events" className="py-24 bg-gradient-to-b from-sage-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.span 
            className="text-terracotta text-lg font-medium mb-4 block"
            variants={itemVariants}
          >
            Join Us
          </motion.span>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-deep-brown mb-8"
            variants={itemVariants}
          >
            Upcoming Events at {name}
          </motion.h2>
          <motion.p 
            className="text-xl text-deep-brown/80 leading-relaxed"
            variants={itemVariants}
          >
            Join us for transformative experiences that connect you with nature and our community. Each event is thoughtfully designed to create lasting impact.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {events.map((event) => (
            <motion.div 
              key={event.id}
              variants={itemVariants}
              className="transform transition-all duration-300 hover:-translate-y-1"
            >
              <EventCard
                event={event}
                showDescription={true}
                showCapacity={true}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta to-terracotta-light text-white px-10 py-5 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 transform"
            >
              View All Events
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
