export interface Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    start_date: string;
    end_date: string;
    total_capacity: number;
    current_participants: number;
    status: 'draft' | 'published' | 'cancelled';
    is_featured: boolean;
    location_id: string;
    locations?: Location;
    experience_images: Array<{
        id: string;
        image_url: string;
        is_hero: boolean;
        alt_text: string;
    }>;
    pricing_options: Array<{
        id: string;
        category: string;
        price: number;
        description: string;
        max_quantity: number;
    }>;
    food_options: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        is_vegetarian: boolean;
        max_quantity: number;
    }>;
    itinerary?: EventItinerary[];
}

export interface Location {
    id: string;
    name: string;
    slug: string;
    cover_image?: string;
    description?: string;
    is_active: boolean;
    features: string[];
    highlights: Array<{
        title: string;
        description: string;
    }>;
    location_images: Array<{
        id: string;
        image_url: string;
        is_hero: boolean;
        alt_text: string;
    }>;
    event_count?: number;
    upcoming_event_count?: number;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    published_date: string;
    slug: string;
    is_published: boolean;
}

export interface EventItinerary {
    id: string;
    time: string;
    activity: string;
    description?: string;
    duration?: string;
    order: number;
}

export interface DatabaseEvent extends Omit<Event, 'pricing_options' | 'food_options' | 'itinerary'> {
    experience_pricing: Event['pricing_options'];
    experience_food_options: Event['food_options'];
    experience_itinerary?: EventItinerary[];
    experience_images: Array<{
        id: string;
        image_url: string;
        is_hero: boolean;
        alt_text: string;
    }>;
}
