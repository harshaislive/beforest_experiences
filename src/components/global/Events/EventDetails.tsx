'use client';

import React from 'react';
import { ClockIcon, MapPinIcon, UsersIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ScheduleItem {
  time: string;
  activity: string;
  description?: string;
  duration?: string | null;
  order?: number;
}

interface EventDetailsProps {
  id: string;
  date: string;
  endDate: string;
  location: string;
  capacity: {
    available: number;
    total: number;
  };
  description: string;
  schedule?: ScheduleItem[];
  thingsToCarry?: string[];
  onBookingClick?: () => void;
  isAvailable?: boolean;
  title: string;
  startDate: string;
}

export default function EventDetails({ 
  id,
  date, 
  endDate, 
  location, 
  capacity, 
  description,
  schedule = [],
  thingsToCarry = [
    'Comfortable clothing',
    'Water bottle',
    'Sunscreen',
    'Hat or cap',
    'Camera (optional)',
    'Notebook and pen'
  ],
  onBookingClick,
  isAvailable = true,
  title
}: EventDetailsProps) {
  // Sort schedule by order if provided, otherwise use as-is
  const sortedSchedule = schedule.length > 0 
    ? [...schedule].sort((a, b) => (a.order || 0) - (b.order || 0)) 
    : [];

  const formatTime = (timeStr: string) => {
    try {
      // Handle HH:mm:ss format
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr; // Return original string if parsing fails
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* About Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-deep-brown mb-4">About This Event</h2>
          <p className="text-deep-brown/80 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Schedule Section */}
        {sortedSchedule.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-deep-brown mb-6">Event Schedule</h2>
            <div className="space-y-4">
              {sortedSchedule.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-sage-50 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-deep-brown/70 mt-0.5" />
                  <div>
                    <div className="font-medium text-deep-brown">
                      {formatTime(item.time)}
                      {item.duration && ` (${item.duration})`}
                    </div>
                    <div className="text-deep-brown/70">{item.activity}</div>
                    {item.description && (
                      <div className="text-sm text-deep-brown/60 mt-1">{item.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Things to Carry Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-deep-brown mb-6">What to Bring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thingsToCarry.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-terracotta" />
                <span className="text-deep-brown/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Meta Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-8 shadow-sm sticky top-4">
          <h2 className="text-2xl font-bold text-deep-brown mb-6">Event Details</h2>
          
          {/* Date & Time */}
          <div className="flex items-start gap-4 mb-6">
            <ClockIcon className="w-6 h-6 text-deep-brown/70 mt-1" />
            <div>
              <div className="font-medium text-deep-brown">Date & Time</div>
              <div className="text-deep-brown/70">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-deep-brown/70">
                {new Date(date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })} - {new Date(endDate).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4 mb-6">
            <MapPinIcon className="w-6 h-6 text-deep-brown/70 mt-1" />
            <div>
              <div className="font-medium text-deep-brown">Location</div>
              <div className="text-deep-brown/70">{location}</div>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-start gap-4 mb-8">
            <UsersIcon className="w-6 h-6 text-deep-brown/70 mt-1" />
            <div>
              <div className="font-medium text-deep-brown">Spots Available</div>
              <div className="text-deep-brown/70">{capacity.available} out of {capacity.total}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-terracotta rounded-full transition-all duration-300"
                style={{ width: `${((capacity.total - capacity.available) / capacity.total) * 100}%` }}
              />
            </div>
            <div className="text-sm text-deep-brown/70 mt-2">
              {Math.round((capacity.available / capacity.total) * 100)}% spots remaining
            </div>
          </div>

          {/* CTA Button */}
          {isAvailable && (
            <button 
              onClick={onBookingClick}
              className="w-full bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Book Your Spot
            </button>
          )}
          {!isAvailable && (
            <div className="w-full text-center bg-gray-500 text-white px-8 py-4 rounded-lg font-medium text-lg">
              Fully Booked
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
