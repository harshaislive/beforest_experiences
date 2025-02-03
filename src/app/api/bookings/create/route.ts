import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for admin operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            persistSession: false
        }
    }
);

interface BookingDetails {
    experience_id: string;
    total_amount: number;
    pricing: Array<{
        pricing_id: string;
        quantity: number;
        amount: number;
    }>;
    food?: Array<{
        food_option_id: string;
        quantity: number;
        amount: number;
    }>;
    dietary_restrictions?: string;
    emergency_contact: {
        name: string;
        phone: string;
        relation: string;
    };
}

interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
    newsletter_consent: boolean;
}

interface PricingItem {
    pricing_id: string;
    quantity: number;
    amount: number;
}

interface FoodItem {
    food_option_id: string;
    quantity: number;
    amount: number;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { personal_info, booking_details } = body;

        console.log('Creating registration with:', {
            personal_info: {
                ...personal_info,
                email: personal_info.email,
                phone: `****${personal_info.phone.slice(-4)}`
            },
            booking_details: {
                experience_id: booking_details.experience_id,
                total_amount: booking_details.total_amount,
                pricing_count: booking_details.pricing?.length,
                food_count: booking_details.food?.length
            }
        });

        // Validate required fields
        if (!personal_info?.email || !booking_details?.experience_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate booking details structure
        if (!Array.isArray(booking_details.pricing) || booking_details.pricing.length === 0) {
            return NextResponse.json(
                { error: 'Invalid pricing details' },
                { status: 400 }
            );
        }

        // Get or create user
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', personal_info.email)
            .single();

        let userId;

        if (userError) {
            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    email: personal_info.email,
                    full_name: personal_info.full_name,
                    phone: personal_info.phone
                })
                .select('id')
                .single();

            if (createError) {
                console.error('Error creating user:', createError);
                return NextResponse.json(
                    { error: 'Failed to create user' },
                    { status: 500 }
                );
            }

            userId = newUser.id;
        } else {
            userId = existingUser.id;
        }

        // Create registration with properly structured booking details
        const registrationData = {
            user_id: userId,
            experience_id: booking_details.experience_id,
            total_amount: booking_details.total_amount,
            payment_status: 'pending',
            booking_details: {
                pricing: booking_details.pricing.map((item: PricingItem) => ({
                    pricing_id: item.pricing_id,
                    quantity: item.quantity,
                    amount: item.amount
                })),
                food: booking_details.food?.map((item: FoodItem) => ({
                    food_option_id: item.food_option_id,
                    quantity: item.quantity,
                    amount: item.amount
                })) || [],
                dietary_restrictions: booking_details.dietary_restrictions || '',
                emergency_contact: {
                    name: booking_details.emergency_contact.name,
                    phone: booking_details.emergency_contact.phone,
                    relation: booking_details.emergency_contact.relation
                }
            }
        };

        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .insert(registrationData)
            .select('*')
            .single();

        if (registrationError) {
            console.error('Error creating registration:', registrationError);
            return NextResponse.json(
                { error: 'Failed to create registration' },
                { status: 500 }
            );
        }

        console.log('Registration created successfully:', {
            id: registration.id,
            user_id: registration.user_id,
            booking_details: {
                pricing_count: registration.booking_details.pricing?.length,
                food_count: registration.booking_details.food?.length
            }
        });

        return NextResponse.json({ registration });
    } catch (error: any) {
        console.error('Unexpected error creating registration:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 