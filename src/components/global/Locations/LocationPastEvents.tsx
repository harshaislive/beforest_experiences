'use client';

import React from 'react';
import { Event } from '@/lib/types';
import ExperienceCard from '@/components/global/Experiences/ExperienceCard';
import { motion } from 'framer-motion';

interface LocationPastExperiencesProps {
  name: string;
  events: Event[];
}

export default function LocationPastExperiences({ name, events }: LocationPastExperiencesProps) {
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
    <section id="past-events" className="py-24 bg-gradient-to-b from-white to-sage-50/30">
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
            Our History
          </motion.span>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-deep-brown mb-8"
            variants={itemVariants}
          >
            Past Experiences at {name}
          </motion.h2>
          <motion.p 
            className="text-xl text-deep-brown/80 leading-relaxed"
            variants={itemVariants}
          >
            Relive the magic of our past experiences and get inspired for future adventures
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
              <ExperienceCard
                experience={event}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}