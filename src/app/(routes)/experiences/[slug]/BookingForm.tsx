'use client';

import { useState } from 'react';
import { Event } from '@/lib/types';
import BookingModal from '@/components/global/Experiences/BookingModal';

interface BookingFormProps {
    event: Event;
    capacity: {
        available: number;
        total: number;
    };
}

export default function BookingForm({ event, capacity }: BookingFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookNow = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-deep-brown/70">Availability</p>
                    <p className="text-lg font-medium text-deep-brown">
                        {capacity.available} / {capacity.total} spots left
                    </p>
                </div>
                <button
                    onClick={handleBookNow}
                    className="btn-primary"
                    disabled={capacity.available === 0}
                >
                    {capacity.available === 0 ? 'Sold Out' : 'Book Now'}
                </button>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={closeModal}
                experience={event}
                capacity={capacity}
            />
        </div>
    );
}
