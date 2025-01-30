import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PhonepeGateway from '@/lib/payment/phonepepg';

// Validate all required environment variables
const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    PHONEPAY_MERCHANT_ID: process.env.PHONEPAY_MERCHANT_ID,
    PHONEPAY_SALT_KEY: process.env.PHONEPAY_SALT_KEY,
    PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
} as const;

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create a Supabase client with the service role key
const supabase = createClient(
    requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    requiredEnvVars.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Initialize PhonePe gateway
const gateway = new PhonepeGateway({
    merchantId: requiredEnvVars.PHONEPAY_MERCHANT_ID!,
    saltKey: requiredEnvVars.PHONEPAY_SALT_KEY!,
    saltIndex: parseInt(requiredEnvVars.PHONEPE_SALT_INDEX, 10),
    isDev: process.env.NODE_ENV === 'development'
});

export async function POST(request: Request) {
    try {
        const { registrationId, amount, customerName, customerEmail, customerPhone } = await request.json();

        console.log('Payment initiation request:', {
            registrationId,
            amount,
            customerName,
            customerEmail: customerEmail.replace(/(?<=.{3}).(?=.*@)/g, '*'), // Mask email for logging
            customerPhone: customerPhone.replace(/\d(?=\d{4})/g, '*') // Mask phone for logging
        });

        // Validate required fields
        if (!registrationId || !amount || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: 'Missing required fields', details: 'All customer details and amount are required' },
                { status: 400 }
            );
        }

        // Validate amount
        if (amount <= 0 || !Number.isFinite(amount)) {
            return NextResponse.json(
                { error: 'Invalid amount', details: 'Amount must be a positive number' },
                { status: 400 }
            );
        }

        // Get registration details
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .select(`
                *,
                events (
                    title,
                    slug
                ),
                users (
                    id,
                    email
                )
            `)
            .eq('id', registrationId)
            .single();

        if (registrationError) {
            console.error('Error fetching registration:', registrationError);
            return NextResponse.json(
                { error: 'Failed to fetch registration details', details: registrationError.message },
                { status: 500 }
            );
        }

        if (!registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Verify amount matches registration
        if (registration.total_amount !== amount) {
            console.error('Amount mismatch:', { expected: registration.total_amount, received: amount });
            return NextResponse.json(
                { error: 'Amount mismatch', details: 'Payment amount does not match registration amount' },
                { status: 400 }
            );
        }

        // Create a unique transaction ID with timestamp and random string for uniqueness
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const merchantTransactionId = `TR${timestamp}_${random}_${registrationId}`;

        // Create payment transaction record
        const { error: transactionError } = await supabase
            .from('payment_transactions')
            .insert({
                registration_id: registrationId,
                transaction_id: merchantTransactionId,
                amount: amount,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (transactionError) {
            console.error('Error creating transaction record:', transactionError);
            return NextResponse.json(
                { error: 'Failed to create transaction record', details: transactionError.message },
                { status: 500 }
            );
        }

        // Prepare PhonePe payment request
        const callbackUrl = `${requiredEnvVars.NEXT_PUBLIC_APP_URL}/api/webhooks/payments/${registrationId}`;
        const redirectUrl = `${requiredEnvVars.NEXT_PUBLIC_APP_URL}/payment/success?id=${registrationId}`;

        // Format amount in paisa (multiply by 100)
        const amountInPaisa = Math.round(amount * 100);

        const paymentRequest = {
            merchantId: requiredEnvVars.PHONEPAY_MERCHANT_ID!,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: registration.user_id,
            amount: amountInPaisa,
            redirectUrl: redirectUrl,
            redirectMode: "POST",
            callbackUrl: callbackUrl,
            paymentInstrument: {
                type: "PAY_PAGE"
            },
            mobileNumber: customerPhone.replace(/[^0-9]/g, ''),
            deviceContext: {
                deviceOS: "WEB"
            }
        };

        console.log('Initiating PhonePe payment with request:', {
            ...paymentRequest,
            merchantId: requiredEnvVars.PHONEPAY_MERCHANT_ID,
            isDev: process.env.NODE_ENV === 'development'
        });

        // Initialize PhonePe payment
        const paymentResponse = await gateway.initPayment(paymentRequest);

        console.log('PhonePe payment response:', {
            success: paymentResponse.success,
            data: paymentResponse.data,
            error: paymentResponse.error,
            message: paymentResponse.message
        });

        if (!paymentResponse.success) {
            // Log the error but don't expose internal details to client
            console.error('Payment initiation failed:', {
                error: paymentResponse.error,
                message: paymentResponse.message,
                code: paymentResponse.code
            });
            return NextResponse.json(
                { 
                    error: 'Payment initiation failed', 
                    details: process.env.NODE_ENV === 'development' 
                        ? paymentResponse.message || 'Unable to initialize payment gateway'
                        : 'Unable to initialize payment gateway'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            redirectUrl: paymentResponse.data.redirectUrl,
            paymentUrl: paymentResponse.data.redirectUrl,
            registration: {
                id: registrationId,
                total_amount: amount,
                event: registration.events,
                booking_details: registration.booking_details
            }
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        // Don't expose internal error details in production
        return NextResponse.json(
            { 
                error: 'Failed to initiate payment',
                details: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : 'Unknown error')
                    : 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}
