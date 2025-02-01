import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PhonepeGateway from '@/lib/payment/phonepepg';

// Validate required environment variables
if (!process.env.PHONEPE_MERCHANT_ID || !process.env.PHONEPE_SALT_KEY) {
    throw new Error('Missing required PhonePe environment variables. Please check your .env file.');
}

// Debug log environment variables (with more detail)
console.log('PhonePe Environment Variables:', {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantIdLength: process.env.PHONEPE_MERCHANT_ID?.length,
    saltKey: process.env.PHONEPE_SALT_KEY?.substring(0, 4) + '...',  // Show just first 4 chars
    saltKeyLength: process.env.PHONEPE_SALT_KEY?.length,
    saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
    isDev: process.env.NODE_ENV === 'development',
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    envKeys: Object.keys(process.env).filter(key => key.includes('PHONE'))
});

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

// Initialize PhonePe gateway
const gateway = new PhonepeGateway({
    merchantId: process.env.PHONEPE_MERCHANT_ID!,
    saltKey: process.env.PHONEPE_SALT_KEY!,
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1', 10),
    isDev: process.env.NODE_ENV !== 'production'
});

// Add debug logging for gateway configuration
console.log('PhonePe Gateway Configuration:', {
    isDev: process.env.NODE_ENV !== 'production',
    environment: process.env.NODE_ENV !== 'production' ? 'sandbox' : 'production',
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    hasSaltKey: true,
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1', 10)
});

export async function POST(request: Request) {
    try {
        const { registrationId, amount, customerName, customerEmail, customerPhone } = await request.json();

        // Get registration details
        const { data: registration, error: registrationError } = await supabase
            .from('registrations')
            .select('*')
            .eq('id', registrationId)
            .single();

        if (registrationError || !registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Create a unique transaction ID
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const merchantTransactionId = `TR${timestamp}_${random}_${registrationId}`;

        // Update registration with transaction ID
        const { error: updateError } = await supabase
            .from('registrations')
            .update({
                payment_status: 'pending',
                transaction_id: merchantTransactionId,
                total_amount: amount,
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
            console.error('Error creating payment transaction:', transactionError);
            return NextResponse.json(
                { error: 'Failed to create payment transaction' },
                { status: 500 }
            );
        }

        // Initialize payment
        console.log('Initiating payment with request:', {
            amount: amount * 100,
            merchantTransactionId,
            merchantUserId: registration.user_id,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registrationId}`,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payments/${registrationId}`,
            mobileNumber: customerPhone
        });

        const paymentResponse = await gateway.initPayment({
            amount: amount * 100, // Convert to paisa
            merchantTransactionId,
            merchantUserId: registration.user_id,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registrationId}`,
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payments/${registrationId}`,
            mobileNumber: customerPhone
        });

        // Store the initial payment response
        await supabase
            .from('payment_transactions')
            .update({
                payment_response: paymentResponse,
                updated_at: new Date().toISOString()
            })
            .eq('transaction_id', merchantTransactionId);

        console.log('PhonePe payment response:', {
            success: paymentResponse.success,
            code: paymentResponse.code,
            message: paymentResponse.message,
            data: paymentResponse.data
        });

        if (!paymentResponse.success) {
            // Update registration and transaction status to failed
            await Promise.all([
                supabase
                    .from('registrations')
                    .update({
                        payment_status: 'failed',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', registrationId),
                supabase
                    .from('payment_transactions')
                    .update({
                        status: 'failed',
                        updated_at: new Date().toISOString()
                    })
                    .eq('transaction_id', merchantTransactionId)
            ]);

            // If it's a rate limit error, add a delay and retry once
            if (paymentResponse.code === 'TOO_MANY_REQUESTS') {
                console.log('Rate limited, waiting 5 seconds before retry...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const retryTransactionId = `RETRY_${merchantTransactionId}`;
                
                console.log('Retrying payment initiation...');
                const retryResponse = await gateway.initPayment({
                    amount: amount * 100,
                    merchantTransactionId: retryTransactionId,
                    merchantUserId: registration.user_id,
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registrationId}`,
                    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payments/${registrationId}`,
                    mobileNumber: customerPhone
                });
                
                if (retryResponse.success) {
                    // Update registration and create new transaction record for retry
                    await Promise.all([
                        supabase
                            .from('registrations')
                            .update({
                                payment_status: 'pending',
                                transaction_id: retryTransactionId,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', registrationId),
                        supabase
                            .from('payment_transactions')
                            .insert({
                                registration_id: registrationId,
                                transaction_id: retryTransactionId,
                                amount: amount,
                                status: 'pending',
                                payment_response: retryResponse,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            })
                    ]);

                    return NextResponse.json({
                        success: true,
                        registration,
                        redirectUrl: retryResponse.data.data.instrumentResponse.redirectInfo.url,
                        transactionId: retryTransactionId
                    });
                }
            }
            
            return NextResponse.json(
                { error: 'Payment initiation failed', details: paymentResponse.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            registration,
            redirectUrl: paymentResponse.data.data.instrumentResponse.redirectInfo.url,
            transactionId: merchantTransactionId
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate payment' },
            { status: 500 }
        );
    }
}
