import { notFound } from 'next/navigation';
import { getEvent, getEvents } from '@/lib/supabase';
import EventPageClient from './EventPageClient';
import { Metadata } from 'next';

interface Event {
    id: string;
    title: string;
    description: string;
    locations: {
        name: string;
        slug: string;
    };
    start_date: string;
    end_date: string;
    event_images: {
        image_url: string;
    }[];
    total_capacity: number;
    current_participants: number;
    pricing_options: {
        id: string;
        category: string;
        price: number;
        description: string;
        max_quantity: number;
    }[];
    food_options: {
        id: string;
        name: string;
        description: string;
        price: number;
        max_quantity: number;
        is_vegetarian: boolean;
    }[];
}

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// Generate static params for all events
export async function generateStaticParams() {
    const events = await getEvents();
    return events.map((event) => ({
        slug: event.slug,
    }));
}

// Validate params
async function validateSlug(slug: string) {
    if (!slug || typeof slug !== 'string') {
        return false;
    }
    const event = await getEvent(slug);
    return !!event;
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const isValid = await validateSlug(params.slug);
    if (!isValid) {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.'
        };
    }

    const event = await getEvent(params.slug);
    return {
        title: event?.title || 'Event',
        description: event?.description || 'Event details'
    };
}

export default async function EventPage({ params }: Props) {
    const isValid = await validateSlug(params.slug);
    if (!isValid) {
        notFound();
    }

    try {
        const event = await getEvent(params.slug);
        if (!event) {
            notFound();
        }

        // Calculate capacity manually
        const capacity = {
            available: event.total_capacity - event.current_participants,
            total: event.total_capacity
        };

        return <EventPageClient event={event} capacity={capacity} />;
    } catch (error) {
        console.error('Error fetching event data:', error);
        notFound();
    }
}
