import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Helper function to create redirect URL
function createRedirectUrl(transactionId: string, path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(path, baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`);
    url.searchParams.set('id', transactionId);
    url.searchParams.set('type', 'transaction');
    return url.toString();
}

// Standard PhonePe signature verification
const verifySignature = (payload: string, xVerify: string) => {
    try {
        const [receivedHash] = xVerify.split('###');
        const calculatedHash = crypto
            .createHash('sha256')
            .update(payload + '/pg/v1/status' + process.env.PHONEPE_SALT_KEY)
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

// Helper function to handle payment status update
const updatePaymentStatus = async (
    transactionId: string,
    registrationId: string,
    isSuccess: boolean,
    paymentResponse: Record<string, unknown>
) => {
    // Update payment transaction status
    const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
            status: isSuccess ? 'completed' : 'failed',
            payment_response: paymentResponse,
            updated_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId);

    if (updateError) {
        await logPaymentEvent(transactionId, 'transaction_update_error', { error: updateError });
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
        .eq('id', registrationId);

    if (registrationError) {
        await logPaymentEvent(transactionId, 'registration_update_error', { error: registrationError });
        throw registrationError;
    }
};

export async function GET(
    request: Request,
    { params }: { params: { transactionId: string } }
) {
    const { transactionId } = params;

    try {
        // Get transaction status
        const { data: transaction, error } = await supabase
            .from('payment_transactions')
            .select('status, registration_id')
            .eq('transaction_id', transactionId)
            .single();

        if (error || !transaction) {
            console.error('Transaction fetch error:', error);
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/failed'));
        }

        // Redirect based on status
        if (transaction.status === 'completed') {
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/completed'));
        } else if (transaction.status === 'failed') {
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/failed'));
        } else {
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/pending'));
        }
    } catch (error) {
        console.error('Payment redirect error:', error);
        return NextResponse.redirect(createRedirectUrl(params.transactionId, '/payment/failed'));
    }
}

export async function POST(
    request: Request,
    { params }: { params: { transactionId: string } }
) {
    try {
        const { transactionId } = params;
        const contentType = request.headers.get('content-type');

        // Log incoming request details
        console.log('Payment callback received:', {
            transactionId,
            contentType,
            headers: Object.fromEntries(request.headers)
        });

        // Parse request body based on content type
        let response: any;
        if (contentType?.includes('application/x-www-form-urlencoded')) {
            const body = await request.text();
            const formData = new URLSearchParams(body);
            response = {
                response: Object.fromEntries(formData)
            };
        } else {
            const body = await request.text();
            try {
                response = JSON.parse(body);
            } catch {
                const searchParams = new URLSearchParams(body);
                response = {
                    response: Object.fromEntries(searchParams)
                };
            }
        }

        // Log parsed response
        console.log('Parsed payment response:', {
            transactionId,
            response
        });

        await logPaymentEvent(transactionId, 'callback_received', {
            response,
            headers: Object.fromEntries(request.headers)
        });

        // Validate request format
        if (!response.response) {
            const error = 'Missing response parameter';
            console.error('Invalid callback request:', { error, response });
            await logPaymentEvent(transactionId, 'invalid_request', {
                error,
                response
            });
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/failed'));
        }

        // Get the registration ID from transaction
        const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('registration_id, status')
            .eq('transaction_id', transactionId)
            .single();

        if (transactionError || !transaction) {
            console.error('Transaction fetch error:', {
                error: transactionError,
                transactionId
            });
            await logPaymentEvent(transactionId, 'transaction_fetch_error', {
                error: transactionError
            });
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/failed'));
        }

        // If already completed, redirect to success page
        if (transaction.status === 'completed') {
            console.log('Duplicate callback received:', {
                transactionId,
                currentStatus: transaction.status
            });
            await logPaymentEvent(transactionId, 'duplicate_callback', {
                currentStatus: transaction.status
            });
            return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/completed'));
        }

        let isSuccess = false;
        let decodedResponse: any;

        try {
            // Try to decode base64 response
            decodedResponse = JSON.parse(
                Buffer.from(response.response, 'base64').toString()
            );
            isSuccess = decodedResponse.code === 'PAYMENT_SUCCESS';
            console.log('Decoded payment response:', {
                transactionId,
                isSuccess,
                responseCode: decodedResponse.code
            });
        } catch (decodeError) {
            console.log('Base64 decode failed, trying direct JSON:', {
                transactionId,
                error: decodeError
            });
            // If base64 decode fails, try direct JSON parse
            try {
                decodedResponse = typeof response.response === 'string' 
                    ? JSON.parse(response.response)
                    : response.response;
                isSuccess = decodedResponse.code === 'PAYMENT_SUCCESS';
                console.log('Parsed JSON response:', {
                    transactionId,
                    isSuccess,
                    responseCode: decodedResponse.code
                });
            } catch (jsonError) {
                console.error('Response parse error:', {
                    transactionId,
                    decodeError,
                    jsonError,
                    response
                });
                await logPaymentEvent(transactionId, 'response_parse_error', {
                    decodeError,
                    jsonError,
                    response
                });
                return NextResponse.redirect(createRedirectUrl(transactionId, '/payment/failed'));
            }
        }

        // Update payment status
        await updatePaymentStatus(transactionId, transaction.registration_id, isSuccess, decodedResponse);
        await logPaymentEvent(transactionId, 'callback_processed', {
            success: isSuccess,
            response: decodedResponse
        });

        // Redirect based on payment status
        const redirectPath = createRedirectUrl(transactionId, `/payment/${isSuccess ? 'completed' : 'failed'}`);
        console.log('Redirecting to:', { redirectPath, isSuccess });
        return NextResponse.redirect(redirectPath);
    } catch (error) {
        console.error('Payment callback error:', {
            transactionId: params.transactionId,
            error
        });
        await logPaymentEvent(params.transactionId, 'callback_error', { error });
        return NextResponse.redirect(createRedirectUrl(params.transactionId, '/payment/failed'));
    }
}
