import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { Event, Location, EventItinerary, DatabaseEvent } from './types';

// Validate client-side environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
}

// Create a singleton Supabase client for public access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client instance (public)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server instance (admin) - only available in server components
export const createServerSupabaseClient = () => {
    if (typeof window !== 'undefined') {
        throw new Error('Server-side Supabase client cannot be used in browser');
    }
    
    if (!process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('SUPABASE_SERVICE_KEY is required for server operations');
    }

    return createClient<Database>(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        }
    );
};

// Public data fetching functions
export async function getEvent(slug: string): Promise<Event | null> {
    try {
        console.log('[getEvent] Fetching event with slug:', slug);
        
        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (
                    id,
                    category,
                    price,
                    description,
                    max_quantity
                ),
                experience_food_options (
                    id,
                    name,
                    description,
                    price,
                    max_quantity,
                    is_vegetarian
                ),
                experience_itinerary (
                    id,
                    time,
                    activity,
                    description,
                    duration,
                    order
                )
            `)
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('[getEvent] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details,
                slug
            });
            return null;
        }

        if (!data) {
            console.log('[getEvent] No event found for slug:', slug);
            return null;
        }

        console.log('[getEvent] Found event:', {
            id: data.id,
            title: data.title,
            status: data.status,
            start_date: data.start_date,
            itinerary: data.experience_itinerary
        });

        const eventData = data as DatabaseEvent;

        // Transform the data to match the Event interface
        const { experience_pricing, experience_food_options, experience_itinerary, ...rest } = eventData;
        const transformedData: Event = {
            ...rest,
            pricing_options: experience_pricing || [],
            food_options: experience_food_options || [],
            itinerary: (experience_itinerary || []).map((item: EventItinerary) => ({
                ...item
            })).sort((a: EventItinerary, b: EventItinerary) => a.order - b.order)
        };

        return transformedData;
    } catch (error) {
        console.error('[getEvent] Unexpected error:', error);
        return null;
    }
}

export async function getEvents(): Promise<Event[]> {
    try {
        console.log('[getEvents] Fetching all events');
        
        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*),
                experience_itinerary (*)
            `)
            .order('start_date', { ascending: true });

        if (error) {
            console.error('[getEvents] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return [];
        }

        if (!data?.length) {
            console.log('[getEvents] No events found');
            return [];
        }

        console.log(`[getEvents] Found ${data.length} events`);

        // Transform each event to match the Event interface
        const transformedData = data.map((event: DatabaseEvent) => {
            const { experience_pricing, experience_food_options, experience_itinerary, ...rest } = event;
            return {
                ...rest,
                pricing_options: experience_pricing || [],
                food_options: experience_food_options || [],
                itinerary: (experience_itinerary || []).map((item: EventItinerary) => ({
                    ...item
                })).sort((a: EventItinerary, b: EventItinerary) => a.order - b.order)
            } as Event;
        });

        return transformedData;
    } catch (error) {
        console.error('[getEvents] Unexpected error:', error);
        return [];
    }
}

export async function getLocation(slug: string): Promise<Location | null> {
    const { data, error } = await supabase
        .from('locations')
        .select(`
            *,
            location_images (*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('[getLocation] Error fetching location:', error);
        return null;
    }

    if (!data) {
        console.log('[getLocation] No location found for slug:', slug);
        return null;
    }

    // Transform the data to match the Location interface
    return {
        ...data,
        features: data.features || [],
        highlights: Array.isArray(data.highlights) ? data.highlights.map((highlight: any) => {
            // If highlight is already in the correct format, return as is
            if (typeof highlight === 'object' && highlight.title && highlight.description) {
                return highlight;
            }
            // If highlight is a string, convert to the new format
            if (typeof highlight === 'string') {
                return {
                    title: highlight,
                    description: ''
                };
            }
            // Default case
            return {
                title: '',
                description: ''
            };
        }) : [],
        location_images: data.location_images || []
    } as Location;
}

export async function getLocations(): Promise<Location[]> {
    const { data, error } = await supabase
        .from('locations')
        .select(`
            *,
            location_images (*)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching locations:', error);
        return [];
    }

    return data.map(location => ({
        ...location,
        features: location.features || [],
        highlights: Array.isArray(location.highlights) ? location.highlights.map((highlight: any) => ({
            title: highlight.title || '',
            description: highlight.description || ''
        })) : []
    })) as Location[];
}

export async function checkEventCapacity(eventId: string) {
    const { data, error } = await supabase
        .from('experiences')
        .select('total_capacity, current_participants')
        .eq('id', eventId)
        .single();

    if (error) {
        console.error('Error checking event capacity:', error);
        return { available: 0, total: 0 };
    }

    return {
        available: data.total_capacity - data.current_participants,
        total: data.total_capacity
    };
}

export async function getUpcomingEvents(limit: number = 3): Promise<Event[]> {
    try {
        // Get the start of today in UTC
        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const currentDate = utcDate.toISOString();
        
        console.log('[getUpcomingEvents] Date debugging:', {
            rawNow: new Date().toISOString(),
            utcNow: utcDate.toISOString(),
            comparisonDate: currentDate,
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
            date: now.getUTCDate()
        });
        
        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*),
                experience_itinerary (*)
            `)
            .gte('start_date', currentDate)
            .eq('status', 'upcoming')
            .order('start_date', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('[getUpcomingEvents] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            throw error;
        }

        if (!data?.length) {
            console.log('[getUpcomingEvents] No upcoming events found');
            return [];
        }

        console.log('[getUpcomingEvents] Events date comparison:', data.map(event => ({
            id: event.id,
            title: event.title,
            startDate: event.start_date,
            status: event.status,
            isAfterCurrentDate: new Date(event.start_date) >= utcDate
        })));

        return data.map((event: DatabaseEvent) => {
            const { experience_pricing, experience_food_options, experience_itinerary, ...rest } = event;
            return {
                ...rest,
                pricing_options: experience_pricing || [],
                food_options: experience_food_options || [],
                itinerary: (experience_itinerary || []).map((item: EventItinerary) => ({
                    ...item
                })).sort((a: EventItinerary, b: EventItinerary) => a.order - b.order)
            } as Event;
        });
    } catch (error) {
        console.error('[getUpcomingEvents] Error:', error);
        return [];
    }
}

export async function getFeaturedEvent(): Promise<Event | null> {
    const currentDate = new Date().toISOString();
    
    try {
        // First try to get featured upcoming events
        const { data: featuredData, error: featuredError } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*)
            `)
            .eq('is_featured', true)
            .gt('start_date', currentDate)
            .order('start_date', { ascending: true })
            .limit(1)
            .single();

        if (!featuredError && featuredData) {
            return featuredData as Event;
        }

        // If no featured event, get the nearest non-featured event
        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*)
            `)
            .gt('start_date', currentDate)
            .order('start_date', { ascending: true })
            .limit(1)
            .single();

        if (error) throw error;
        return data as Event;
    } catch (error) {
        console.error('[getFeaturedEvent] Error:', error);
        return null;
    }
}

export async function getNearestUpcomingEvent(): Promise<Event | null> {
    console.log('[getNearestUpcomingEvent] Searching for upcoming events...');
    
    try {
        // Get the start of today in UTC
        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const currentDate = utcDate.toISOString();
        
        console.log('[getNearestUpcomingEvent] Raw current time:', new Date().toISOString());
        console.log('[getNearestUpcomingEvent] UTC midnight:', currentDate);
        console.log('[getNearestUpcomingEvent] Fetching events with status: upcoming');

        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*),
                experience_itinerary (*)
            `)
            .eq('status', 'upcoming')
            .gte('start_date', currentDate)
            .order('start_date', { ascending: true })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('[getNearestUpcomingEvent] No upcoming events found');
                return null;
            }
            console.error('[getNearestUpcomingEvent] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return null;
        }

        if (!data) {
            console.log('[getNearestUpcomingEvent] No event data returned');
            return null;
        }

        console.log('[getNearestUpcomingEvent] Found event:', {
            id: data.id,
            title: data.title,
            startDate: data.start_date,
            status: data.status,
            locationId: data.location_id
        });

        const { experience_pricing, experience_food_options, experience_itinerary, ...rest } = data;
        return {
            ...rest,
            pricing_options: experience_pricing || [],
            food_options: experience_food_options || [],
            itinerary: (experience_itinerary || []).map((item: EventItinerary) => ({
                ...item
            })).sort((a: EventItinerary, b: EventItinerary) => a.order - b.order)
        } as Event;
    } catch (error) {
        console.error('[getNearestUpcomingEvent] Unexpected error:', error);
        return null;
    }
}

interface LocationWithEvents extends Location {
    experiences?: Array<{
        id: string;
        start_date: string;
        status: string;
    }>;
}

export async function getAllLocations(): Promise<Location[]> {
    const currentDate = new Date().toISOString();

    try {
        // First get all locations with their images
        const { data: locations, error: locationsError } = await supabase
            .from('locations')
            .select(`
                *,
                location_images (*),
                experiences!location_id (
                    id,
                    start_date,
                    status
                )
            `)
            .eq('is_active', true)
            .order('name');

        if (locationsError) {
            console.error('[getAllLocations] Error fetching locations:', locationsError);
            return [];
        }

        if (!locations?.length) {
            console.log('[getAllLocations] No active locations found');
            return [];
        }

        // Transform the data to include event counts
        return (locations as LocationWithEvents[]).map(location => {
            const upcomingEvents = (location.experiences || []).filter(event => 
                event.start_date >= currentDate && 
                event.status === 'upcoming'
            );

            const { experiences, ...locationData } = location;
            return {
                ...locationData,
                event_count: (location.experiences || []).length,
                upcoming_event_count: upcomingEvents.length,
                features: location.features || [],
                highlights: location.highlights || []
            };
        });
    } catch (error) {
        console.error('[getAllLocations] Unexpected error:', error);
        return [];
    }
}

export async function getLocationEvents(locationId: string): Promise<{ upcomingEvents: Event[], pastEvents: Event[] }> {
    try {
        // Get the start of today in UTC
        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const currentDate = utcDate.toISOString();
        
        console.log('[getLocationEvents] Starting to fetch events:', {
            locationId,
            currentDate,
            rawCurrentTime: new Date().toISOString(),
            utcMidnight: currentDate
        });

        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*),
                experience_itinerary (*)
            `)
            .eq('location_id', locationId)
            .in('status', ['upcoming', 'published'])  // Include both upcoming and published events
            .order('start_date', { ascending: true });

        if (error) {
            console.error('[getLocationEvents] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details,
                locationId
            });
            return { upcomingEvents: [], pastEvents: [] };
        }

        if (!data) {
            console.log('[getLocationEvents] No events found for location:', locationId);
            return { upcomingEvents: [], pastEvents: [] };
        }

        console.log('[getLocationEvents] Raw events data:', {
            totalEvents: data.length,
            events: data.map(e => ({
                id: e.id,
                title: e.title,
                startDate: e.start_date,
                endDate: e.end_date,
                status: e.status,
                locationId: e.location_id
            }))
        });

        const transformedEvents = data.map((event: DatabaseEvent) => {
            const { experience_pricing, experience_food_options, experience_itinerary, ...rest } = event;
            return {
                ...rest,
                pricing_options: experience_pricing || [],
                food_options: experience_food_options || [],
                itinerary: (experience_itinerary || []).map((item: EventItinerary) => ({
                    ...item
                })).sort((a: EventItinerary, b: EventItinerary) => a.order - b.order)
            } as Event;
        });

        // Split events into upcoming and past based on end_date
        const upcomingEvents = transformedEvents.filter(event => {
            const eventEndDate = new Date(event.end_date);
            const isUpcoming = eventEndDate >= utcDate;
            console.log('[getLocationEvents] Event date check:', {
                eventId: event.id,
                title: event.title,
                endDate: event.end_date,
                currentDate,
                isUpcoming
            });
            return isUpcoming;
        });

        const pastEvents = transformedEvents.filter(event => {
            const eventEndDate = new Date(event.end_date);
            return eventEndDate < utcDate;
        });

        console.log('[getLocationEvents] Final events split:', {
            locationId,
            totalEvents: data.length,
            upcomingCount: upcomingEvents.length,
            pastCount: pastEvents.length,
            upcomingEvents: upcomingEvents.map(e => ({
                id: e.id,
                title: e.title,
                startDate: e.start_date,
                endDate: e.end_date,
                status: e.status
            }))
        });

        return { upcomingEvents, pastEvents };
    } catch (error) {
        console.error('[getLocationEvents] Error:', error);
        return { upcomingEvents: [], pastEvents: [] };
    }
}

export async function getPastEvents(limit: number = 6): Promise<Event[]> {
    const currentDate = new Date().toISOString();
    
    try {
        const { data, error } = await supabase
            .from('experiences')
            .select(`
                *,
                locations (*),
                experience_images (*),
                experience_pricing (*),
                experience_food_options (*)
            `)
            .lt('end_date', currentDate)
            .order('start_date', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[getPastEvents] Database error:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return [];
        }

        if (!data?.length) {
            console.log('[getPastEvents] No past events found');
            return [];
        }

        return data as Event[];
    } catch (error) {
        console.error('[getPastEvents] Unexpected error:', error);
        return [];
    }
}

interface SubscribeOptions {
    source?: 'footer' | 'registration' | 'other';
    registrationId?: string;
}

export async function subscribeToNewsletter(email: string, options: SubscribeOptions = { source: 'footer' }) {
    try {
        // First check if email already exists
        const { data: existingSubscriber } = await supabase
            .from('newsletter_subscriptions')
            .select('id, email, is_active')
            .eq('email', email)
            .single();

        if (existingSubscriber) {
            // If subscriber exists and is active
            if (existingSubscriber.is_active) {
                return {
                    success: false,
                    message: 'This email is already subscribed to our newsletter.'
                };
            }
            
            // If subscriber exists but is inactive, reactivate them
            const { error: updateError } = await supabase
                .from('newsletter_subscriptions')
                .update({
                    is_active: true,
                    unsubscribed_at: null,
                    updated_at: new Date().toISOString()
                })
                .eq('email', email);

            if (updateError) throw updateError;

            return {
                success: true,
                message: 'Welcome back! Your subscription has been reactivated.'
            };
        }

        // If email doesn't exist, add new subscriber
        const { error } = await supabase
            .from('newsletter_subscriptions')
            .insert([
                {
                    email,
                    source: options.source,
                    registration_id: options.registrationId,
                    is_active: true,
                    subscribed_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        const sourceMessage = options.source === 'registration' 
            ? 'You have been subscribed to our newsletter to receive updates about your booking and future events.'
            : 'Thank you for subscribing to our newsletter!';

        return {
            success: true,
            message: sourceMessage
        };
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return {
            success: false,
            message: 'Failed to subscribe to the newsletter. Please try again later.'
        };
    }
}

// Function to handle newsletter subscription during registration
export async function handleRegistrationNewsletter(
    email: string,
    registrationId: string,
    shouldSubscribe: boolean = true
): Promise<void> {
    if (!shouldSubscribe) return;

    try {
        await subscribeToNewsletter(email, {
            source: 'registration',
            registrationId
        });
    } catch (error) {
        // We don't want to fail the registration if newsletter subscription fails
        console.error('[handleRegistrationNewsletter] Error:', error);
    }
}
