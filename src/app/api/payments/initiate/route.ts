import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PaymentService } from '@/lib/payment/payment-service';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            persistSession: false
        }
    }
);

const paymentService = new PaymentService({
    merchantId: process.env.PHONEPE_MERCHANT_ID!,
    saltKey: process.env.PHONEPE_SALT_KEY!,
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1'),
    isDev: process.env.NODE_ENV !== 'production',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY!
});

interface PricingDetail {
    pricing_id: string;
    quantity: number;
    amount: number;
}

interface FoodDetail {
    food_option_id: string;
    quantity: number;
    amount: number;
}

interface BookingDetails {
    pricing: PricingDetail[];
    food?: FoodDetail[];
}

interface Registration {
    id: string;
    booking_details: BookingDetails;
    experiences: {
        id: string;
        total_capacity: number;
        current_participants: number;
        experience_pricing: Array<{
            id: string;
            price: number;
        }>;
        experience_food_options: Array<{
            id: string;
            price: number;
        }>;
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { registrationId, amount, userId, mobileNumber } = body;

        console.log('Payment initiation request:', {
            registrationId,
            amount,
            userId,
            mobileNumber: mobileNumber ? '****' + mobileNumber.slice(-4) : undefined
        });

        // Fetch registration details with experience data
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .select(`
                *,
                experiences (
                    id,
                    total_capacity,
                    current_participants,
                    experience_pricing (
                        id,
                        price
                    ),
                    experience_food_options (
                        id,
                        price
                    )
                )
            `)
            .eq('id', registrationId)
            .single();

        if (registrationError) {
            console.error('Registration fetch error:', registrationError);
            return NextResponse.json(
                { error: 'Registration not found', details: registrationError.message },
                { status: 404 }
            );
        }

        if (!registration) {
            console.error('Registration not found:', { registrationId });
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        console.log('Found registration:', {
            id: registration.id,
            experienceId: registration.experience_id,
            bookingDetails: registration.booking_details ? {
                pricingCount: registration.booking_details.pricing?.length,
                foodCount: registration.booking_details.food?.length
            } : null
        });

        const typedRegistration = registration as Registration;

        // Validate booking details exist
        if (!typedRegistration.booking_details || !typedRegistration.booking_details.pricing) {
            console.error('Invalid booking details:', {
                hasBookingDetails: !!typedRegistration.booking_details,
                hasPricing: !!typedRegistration.booking_details?.pricing
            });
            return NextResponse.json(
                { error: 'Invalid booking details' },
                { status: 400 }
            );
        }

        // Check capacity
        const experience = typedRegistration.experiences;
        if (!experience) {
            return NextResponse.json(
                { error: 'Experience details not found' },
                { status: 400 }
            );
        }

        const totalTickets = typedRegistration.booking_details.pricing.reduce(
            (sum: number, item: PricingDetail) => sum + item.quantity,
            0
        );

        // Validate experience has capacity data
        if (typeof experience.total_capacity !== 'number' || 
            typeof experience.current_participants !== 'number') {
            return NextResponse.json(
                { error: 'Invalid experience capacity data' },
                { status: 400 }
            );
        }

        const availableCapacity = experience.total_capacity - experience.current_participants;

        if (totalTickets > availableCapacity) {
            return NextResponse.json(
                { error: `Only ${availableCapacity} tickets remaining` },
                { status: 400 }
            );
        }

        // Validate pricing data exists
        if (!experience.experience_pricing) {
            return NextResponse.json(
                { error: 'Experience pricing data not found' },
                { status: 400 }
            );
        }

        // Validate total amount
        let calculatedAmount = 0;

        // Calculate tickets amount
        for (const item of typedRegistration.booking_details.pricing) {
            const pricingOption = experience.experience_pricing.find(
                (p) => p.id === item.pricing_id
            );
            if (!pricingOption) {
                return NextResponse.json(
                    { error: 'Invalid pricing option' },
                    { status: 400 }
                );
            }
            calculatedAmount += pricingOption.price * item.quantity;
        }

        // Calculate food amount if any
        if (typedRegistration.booking_details.food?.length) {
            if (!experience.experience_food_options) {
                return NextResponse.json(
                    { error: 'Experience food options not found' },
                    { status: 400 }
                );
            }

            for (const item of typedRegistration.booking_details.food) {
                const foodOption = experience.experience_food_options.find(
                    (f) => f.id === item.food_option_id
                );
                if (!foodOption) {
                    return NextResponse.json(
                        { error: 'Invalid food option' },
                        { status: 400 }
                    );
                }
                calculatedAmount += foodOption.price * item.quantity;
            }
        }

        // Compare with submitted amount
        if (calculatedAmount !== amount) {
            return NextResponse.json(
                { error: 'Amount mismatch' },
                { status: 400 }
            );
        }

        // Log successful validation
        console.log('Validation successful:', {
            calculatedAmount,
            submittedAmount: amount,
            totalTickets,
            availableCapacity
        });

        // Proceed with payment initiation
        const result = await paymentService.initiatePayment({
            registrationId,
            amount,
            userId,
            mobileNumber
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Payment initiation error:', {
            error: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json(
            { error: error.message || 'Failed to initiate payment' },
            { status: 500 }
        );
    }
} 