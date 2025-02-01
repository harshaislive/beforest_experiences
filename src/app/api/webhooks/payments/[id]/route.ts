import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PhonepeGateway from 'phonepepg';

// Validate environment variables (reuse from initiate route)
const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
    PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY,
    PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
} as const;

// Initialize Supabase client
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
    merchantId: 'PGTESTPAYUAT',
    saltKey: requiredEnvVars.PHONEPE_SALT_KEY!,
    saltIndex: parseInt(requiredEnvVars.PHONEPE_SALT_INDEX, 10),
    isDev: true  // Force sandbox mode
});

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const registrationId = params.id;
        const payload = await request.json();

        console.log('Payment webhook received:', {
            registrationId,
            payload: JSON.stringify(payload)
        });

        // Verify the payment with PhonePe
        const verificationResponse = await gateway.paymentStatus(payload);

        if (!verificationResponse.success) {
            console.error('Payment verification failed:', verificationResponse);
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Update payment status in database
        const { error: updateError } = await supabase
            .from('registrations')
            .update({
                payment_status: verificationResponse.data.status,
                payment_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', registrationId);

        if (updateError) {
            console.error('Error updating registration:', updateError);
            return NextResponse.json(
                { error: 'Failed to update registration' },
                { status: 500 }
            );
        }

        // Update payment transaction record
        const { error: transactionError } = await supabase
            .from('payment_transactions')
            .update({
                status: verificationResponse.data.status,
                payment_response: verificationResponse.data,
                updated_at: new Date().toISOString()
            })
            .eq('registration_id', registrationId);

        if (transactionError) {
            console.error('Error updating transaction:', transactionError);
            return NextResponse.json(
                { error: 'Failed to update transaction' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Payment webhook error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : 'Unknown error')
                    : undefined
            },
            { status: 500 }
        );
    }
} 