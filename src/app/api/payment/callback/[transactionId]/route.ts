import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Standard PhonePe signature verification
const verifySignature = (payload: string, xVerify: string) => {
    try {
        const [receivedHash] = xVerify.split('###');
        const calculatedHash = crypto
            .createHash('sha256')
            .update(payload + '/pg/v1/status' + process.env.PHONEPAY_SALT_KEY)
            .digest('hex');
        return receivedHash === calculatedHash;
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
};

// Helper function to log payment events
const logPaymentEvent = async (
    transactionId: string,
    event: string,
    details: Record<string, unknown>
) => {
    try {
        await supabase
            .from('payment_logs')
            .insert([
                {
                    transaction_id: transactionId,
                    event,
                    details,
                    created_at: new Date().toISOString()
                }
            ]);
    } catch (error) {
        console.error('Failed to log payment event:', error);
    }
};

export async function POST(
    request: Request,
    { params }: { params: { transactionId: string } }
) {
    const startTime = Date.now();
    try {
        const { transactionId } = params;
        const body = await request.json();

        await logPaymentEvent(transactionId, 'callback_received', { body });

        if (!body.response || !request.headers.get('X-VERIFY')) {
            await logPaymentEvent(transactionId, 'invalid_request', { 
                error: 'Missing response or X-VERIFY header' 
            });
            return NextResponse.json(
                { error: 'Invalid request format' },
                { status: 400 }
            );
        }

        // Verify the callback signature
        const isValid = verifySignature(body.response, request.headers.get('X-VERIFY')!);

        if (!isValid) {
            await logPaymentEvent(transactionId, 'signature_verification_failed', {
                response: body.response,
                xVerify: request.headers.get('X-VERIFY')
            });
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Decode and parse the response
        const decodedResponse = JSON.parse(
            Buffer.from(body.response, 'base64').toString()
        );

        await logPaymentEvent(transactionId, 'response_decoded', { decodedResponse });

        const { code } = decodedResponse;
        const isSuccess = code === 'PAYMENT_SUCCESS';

        // Get the registration ID from transaction
        const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('registration_id, status')
            .eq('transaction_id', transactionId)
            .single();

        if (transactionError || !transaction) {
            await logPaymentEvent(transactionId, 'transaction_fetch_error', { 
                error: transactionError 
            });
            throw new Error('Transaction not found');
        }

        // Prevent duplicate processing
        if (transaction.status === 'completed') {
            await logPaymentEvent(transactionId, 'duplicate_callback', {
                currentStatus: transaction.status,
                newStatus: isSuccess ? 'completed' : 'failed'
            });
            return NextResponse.json({
                status: 'success',
                message: 'Transaction already processed'
            });
        }

        // Update payment transaction status
        const { error: updateError } = await supabase
            .from('payment_transactions')
            .update({
                status: isSuccess ? 'completed' : 'failed',
                payment_response: decodedResponse,
                updated_at: new Date().toISOString()
            })
            .eq('transaction_id', transactionId);

        if (updateError) {
            await logPaymentEvent(transactionId, 'transaction_update_error', { 
                error: updateError 
            });
            throw updateError;
        }

        // Update registration status
        const { error: registrationError } = await supabase
            .from('registrations')
            .update({
                payment_status: isSuccess ? 'completed' : 'failed',
                payment_date: isSuccess ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', transaction.registration_id);

        if (registrationError) {
            await logPaymentEvent(transactionId, 'registration_update_error', { 
                error: registrationError 
            });
            throw registrationError;
        }

        await logPaymentEvent(transactionId, 'callback_processed', {
            success: isSuccess,
            processingTime: Date.now() - startTime
        });

        // Return appropriate response
        return NextResponse.json({
            status: isSuccess ? 'success' : 'failed',
            message: isSuccess ? 'Payment successful' : 'Payment failed'
        });

    } catch (error) {
        console.error('Payment callback error:', error);
        await logPaymentEvent(params.transactionId, 'callback_error', { error });
        return NextResponse.json(
            { error: 'Payment callback processing failed' },
            { status: 500 }
        );
    }
}

// Add GET handler for redirect confirmation
export async function GET(
    request: Request,
    { params }: { params: { transactionId: string } }
) {
    try {
        const { transactionId } = params;
        const searchParams = new URL(request.url).searchParams;
        const code = searchParams.get('code');

        await logPaymentEvent(transactionId, 'redirect_received', { 
            code,
            params: Object.fromEntries(searchParams)
        });

        // Update payment status based on redirect parameters
        const isSuccess = code === 'PAYMENT_SUCCESS';

        // Get the registration ID from transaction
        const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('registration_id, status')
            .eq('transaction_id', transactionId)
            .single();

        if (transactionError || !transaction) {
            await logPaymentEvent(transactionId, 'redirect_transaction_fetch_error', { 
                error: transactionError 
            });
            throw new Error('Transaction not found');
        }

        // Prevent duplicate processing
        if (transaction.status === 'completed') {
            await logPaymentEvent(transactionId, 'redirect_duplicate_update', {
                currentStatus: transaction.status,
                newStatus: isSuccess ? 'completed' : 'failed'
            });
            return NextResponse.redirect(
                new URL(`/payment/success?id=${transactionId}`, request.url)
            );
        }

        // Update payment transaction status
        const { error: updateError } = await supabase
            .from('payment_transactions')
            .update({
                status: isSuccess ? 'completed' : 'failed',
                updated_at: new Date().toISOString()
            })
            .eq('transaction_id', transactionId);

        if (updateError) {
            await logPaymentEvent(transactionId, 'redirect_transaction_update_error', { 
                error: updateError 
            });
            throw updateError;
        }

        // Update registration status
        const { error: registrationError } = await supabase
            .from('registrations')
            .update({
                payment_status: isSuccess ? 'completed' : 'failed',
                payment_date: isSuccess ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', transaction.registration_id);

        if (registrationError) {
            await logPaymentEvent(transactionId, 'redirect_registration_update_error', { 
                error: registrationError 
            });
            throw registrationError;
        }

        await logPaymentEvent(transactionId, 'redirect_processed', {
            success: isSuccess
        });

        // Redirect to appropriate page
        const redirectUrl = isSuccess
            ? `/payment/success?id=${transactionId}`
            : `/payment/failed?id=${transactionId}`;

        return NextResponse.redirect(new URL(redirectUrl, request.url));

    } catch (error) {
        console.error('Payment redirect error:', error);
        await logPaymentEvent(params.transactionId, 'redirect_error', { error });
        return NextResponse.redirect(
            new URL('/payment/error', request.url)
        );
    }
}
