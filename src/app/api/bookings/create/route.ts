import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for admin operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { personal_info, booking_details } = data;

        console.log('Received registration request:', { personal_info, booking_details });

        // Validate required fields
        if (!personal_info?.full_name || !personal_info?.email || !personal_info?.phone) {
            return NextResponse.json(
                { error: 'Missing required personal information' },
                { status: 400 }
            );
        }

        if (!booking_details?.event_id || !booking_details?.pricing || booking_details.pricing.length === 0) {
            return NextResponse.json(
                { error: 'Missing required booking details' },
                { status: 400 }
            );
        }

        // Check event capacity
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('total_capacity, current_participants')
            .eq('id', booking_details.event_id)
            .single();

        if (eventError) {
            console.error('Error fetching event:', eventError);
            return NextResponse.json(
                { error: 'Event not found or database error', details: eventError.message },
                { status: 404 }
            );
        }

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        const totalTickets = booking_details.pricing.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
        const remainingCapacity = event.total_capacity - event.current_participants;

        if (totalTickets > remainingCapacity) {
            return NextResponse.json(
                { error: 'Not enough tickets available', details: `Only ${remainingCapacity} tickets remaining` },
                { status: 400 }
            );
        }

        // Check if user exists or create a new one
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', personal_info.email)
            .single();

        let userId;
        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create a new user
            const { data: newUser, error: createUserError } = await supabase
                .from('users')
                .insert({
                    email: personal_info.email,
                    full_name: personal_info.full_name,
                    phone: personal_info.phone
                })
                .select('id')
                .single();

            if (createUserError) {
                console.error('Error creating user:', createUserError);
                return NextResponse.json(
                    { error: 'Failed to create user', details: createUserError.message },
                    { status: 500 }
                );
            }
            userId = newUser.id;
        }

        // Create registration record
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .insert({
                user_id: userId, // Now we have a valid user ID
                event_id: booking_details.event_id,
                total_amount: booking_details.total_amount,
                payment_status: 'pending',
                booking_details: {
                    personal_info: {
                        full_name: personal_info.full_name,
                        email: personal_info.email,
                        phone: personal_info.phone,
                        newsletter_consent: personal_info.newsletter_consent
                    },
                    tickets: booking_details.pricing,
                    food_items: booking_details.food || [],
                    dietary_restrictions: booking_details.dietary_restrictions || '',
                    emergency_contact: booking_details.emergency_contact
                }
            })
            .select()
            .single();

        if (registrationError) {
            console.error('Registration error:', registrationError);
            return NextResponse.json(
                { error: 'Failed to create registration', details: registrationError.message },
                { status: 500 }
            );
        }

        // Update event participants count
        const { error: updateError } = await supabase
            .from('events')
            .update({
                current_participants: event.current_participants + totalTickets
            })
            .eq('id', booking_details.event_id);

        if (updateError) {
            console.error('Error updating event participants:', updateError);
            // Don't fail the registration, but log the error
            // We might want to implement a background job to retry this update
        }

        return NextResponse.json({ registration });
    } catch (error) {
        console.error('Unexpected error during registration:', error);
        return NextResponse.json(
            { 
                error: 'An unexpected error occurred during registration',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 