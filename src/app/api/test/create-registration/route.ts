import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PhonepeGateway from 'phonepepg';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.PHONEPAY_MERCHANT_ID || !process.env.PHONEPAY_SALT_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('Missing environment variables');
}

// Create a Supabase client with the service role key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Initialize PhonePe gateway
const gateway = new PhonepeGateway({
    merchantId: process.env.PHONEPAY_MERCHANT_ID,
    saltKey: process.env.PHONEPAY_SALT_KEY,
    isDev: process.env.NODE_ENV === 'development'
});

export async function POST(request: Request) {
    try {
        const { amount, email, name } = await request.json();
        console.log('Received test registration request:', { amount, email, name });

        if (!amount || !email || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // First, get or create a test location
        console.log('Checking for existing test location...');
        const { data: locationData, error: locationQueryError } = await supabase
            .from('locations')
            .select('id')
            .eq('name', 'Test Location')
            .single();

        let locationId;
        if (locationQueryError && locationQueryError.code === 'PGRST116') {
            console.log('Test location not found, creating new one...');
            const { data: newLocation, error: createLocationError } = await supabase
                .from('locations')
                .insert({
                    name: 'Test Location',
                    slug: 'test-location',
                    description: 'Test location for payment verification',
                    is_active: true
                })
                .select()
                .single();

            if (createLocationError) {
                console.error('Error creating test location:', createLocationError);
                throw new Error(`Failed to create test location: ${createLocationError.message}`);
            }
            console.log('New test location created:', newLocation);
            locationId = newLocation.id;
        } else if (locationQueryError) {
            console.error('Error querying test location:', locationQueryError);
            throw new Error(`Failed to query test location: ${locationQueryError.message}`);
        } else {
            console.log('Using existing test location:', locationData);
            locationId = locationData.id;
        }

        // Create a test event if it doesn't exist
        console.log('Checking for existing test event...');
        const { data: eventData, error: eventQueryError } = await supabase
            .from('events')
            .select('id')
            .eq('title', 'Payment Test Event')
            .single();

        let eventId;
        if (eventQueryError && eventQueryError.code === 'PGRST116') {
            console.log('Test event not found, creating new one...');
            const { data: newEvent, error: createEventError } = await supabase
                .from('events')
                .insert({
                    title: 'Payment Test Event',
                    slug: 'payment-test',
                    description: 'Test event for payment verification',
                    start_date: new Date().toISOString(),
                    end_date: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
                    total_capacity: 100,
                    current_participants: 0,
                    status: 'upcoming',
                    location_id: locationId
                })
                .select()
                .single();

            if (createEventError) {
                console.error('Error creating test event:', createEventError);
                throw new Error(`Failed to create test event: ${createEventError.message}`);
            }
            console.log('New test event created:', newEvent);
            eventId = newEvent.id;
        } else if (eventQueryError) {
            console.error('Error querying test event:', eventQueryError);
            throw new Error(`Failed to query test event: ${eventQueryError.message}`);
        } else {
            console.log('Using existing test event:', eventData);
            eventId = eventData.id;
        }

        // Create a test user if needed
        console.log('Checking for existing test user...');
        const { data: userData, error: userQueryError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        let userId;
        if (userQueryError && userQueryError.code === 'PGRST116') {
            console.log('Test user not found, creating new one...');
            const { data: newUser, error: createUserError } = await supabase
                .from('users')
                .insert({
                    email,
                    full_name: name
                })
                .select()
                .single();

            if (createUserError) {
                console.error('Error creating test user:', createUserError);
                throw new Error(`Failed to create test user: ${createUserError.message}`);
            }
            console.log('New test user created:', newUser);
            userId = newUser.id;
        } else if (userQueryError) {
            console.error('Error querying test user:', userQueryError);
            throw new Error(`Failed to query test user: ${userQueryError.message}`);
        } else {
            console.log('Using existing test user:', userData);
            userId = userData.id;
        }

        // Create registration
        console.log('Creating test registration...');
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .insert({
                user_id: userId,
                event_id: eventId,
                total_amount: amount,
                payment_status: 'pending',
                booking_details: {
                    personal_info: {
                        full_name: name,
                        email: email
                    },
                    pricing: [{
                        pricing_id: 'test',
                        quantity: 1,
                        amount: amount
                    }]
                }
            })
            .select()
            .single();

        if (registrationError) {
            console.error('Error creating test registration:', registrationError);
            throw new Error(`Failed to create test registration: ${registrationError.message}`);
        }

        console.log('Test registration created successfully:', registration);

        // Initialize PhonePe payment
        const paymentResponse = await gateway.initPayment({
            transactionId: registration.id,
            amount: amount * 100, // Convert to paisa
            userId: userId,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registration.id}`,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback/${registration.id}`
        });

        console.log('PhonePe payment response:', paymentResponse); // Debug log
        console.log('Redirect URL:', `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registration.id}`); // Debug URL

        if (!paymentResponse.success) {
            throw new Error('Failed to initialize payment: ' + paymentResponse.message);
        }

        return NextResponse.json({
            success: true,
            registration,
            paymentUrl: paymentResponse.data.instrumentResponse.redirectInfo.url
        });

    } catch (error) {
        console.error('Test registration error:', error);
        const message = error instanceof Error 
            ? error.message 
            : 'Failed to create test registration';
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
} 
