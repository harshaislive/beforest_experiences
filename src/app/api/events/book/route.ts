import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Create a Supabase client with the service role key
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

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { userId, eventId, pricingDetails, foodDetails } = data;

        if (!userId || !eventId || !pricingDetails) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Calculate total amount
        const totalAmount = pricingDetails.reduce((sum: number, item: any) => sum + (item.amount * item.quantity), 0) +
            (foodDetails?.reduce((sum: number, item: any) => sum + (item.amount * item.quantity), 0) || 0);

        // Create registration
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .insert({
                user_id: userId,
                event_id: eventId,
                total_amount: totalAmount,
                payment_status: 'pending',
                booking_details: {
                    pricing: pricingDetails,
                    food: foodDetails || []
                }
            })
            .select()
            .single();

        if (registrationError) {
            console.error('Error creating registration:', registrationError);
            return NextResponse.json(
                { error: registrationError.message },
                { status: 500 }
            );
        }

        // Return registration data
        return NextResponse.json({
            success: true,
            registration
        });

    } catch (error: any) {
        console.error('Error creating registration:', error);
        
        return NextResponse.json(
            { error: error.message || 'Failed to create registration' },
            { status: 500 }
        );
    }
}
