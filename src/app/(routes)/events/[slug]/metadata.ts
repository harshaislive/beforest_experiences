import { Metadata } from 'next';
import { getEvent } from '@/lib/supabase';

interface EventPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const event = await getEvent(params.slug);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: `${event.title} | BeForest Events`,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: event.event_images?.[0]?.image_url ? [event.event_images[0].image_url] : [],
        },
    };
}
