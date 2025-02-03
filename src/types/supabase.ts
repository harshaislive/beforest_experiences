export interface Database {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    description: string;
                    start_date: string;
                    end_date: string;
                    total_capacity: number;
                    current_participants: number;
                    status: string;
                    is_featured: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    slug: string;
                    description: string;
                    start_date: string;
                    end_date: string;
                    total_capacity: number;
                    current_participants?: number;
                    status?: string;
                    is_featured?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    slug?: string;
                    description?: string;
                    start_date?: string;
                    end_date?: string;
                    total_capacity?: number;
                    current_participants?: number;
                    status?: string;
                    is_featured?: boolean;
                    updated_at?: string;
                };
            };
            locations: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string;
                    updated_at?: string;
                };
            };
            event_images: {
                Row: {
                    id: string;
                    event_id: string;
                    image_url: string;
                    is_hero: boolean;
                    alt_text: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    image_url: string;
                    is_hero?: boolean;
                    alt_text?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    image_url?: string;
                    is_hero?: boolean;
                    alt_text?: string;
                };
            };
            location_images: {
                Row: {
                    id: string;
                    location_id: string;
                    image_url: string;
                    is_hero: boolean;
                    alt_text: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    location_id: string;
                    image_url: string;
                    is_hero?: boolean;
                    alt_text?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    location_id?: string;
                    image_url?: string;
                    is_hero?: boolean;
                    alt_text?: string;
                };
            };
            pricing_options: {
                Row: {
                    id: string;
                    event_id: string;
                    category: string;
                    price: number;
                    description: string;
                    max_quantity: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    category: string;
                    price: number;
                    description: string;
                    max_quantity: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    category?: string;
                    price?: number;
                    description?: string;
                    max_quantity?: number;
                };
            };
            food_options: {
                Row: {
                    id: string;
                    event_id: string;
                    name: string;
                    description: string;
                    price: number;
                    max_quantity: number;
                    is_vegetarian: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    name: string;
                    description: string;
                    price: number;
                    max_quantity: number;
                    is_vegetarian?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    name?: string;
                    description?: string;
                    price?: number;
                    max_quantity?: number;
                    is_vegetarian?: boolean;
                };
            };
        };
    };
} 