import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const signature = request.headers.get('x-phonepe-signature');

        // Verify signature
        if (!verifySignature(payload, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Extract registration ID from merchant transaction ID
        const registrationId = payload.merchantTransactionId;

        // Update registration payment status
        const { error: updateError } = await supabase
            .from('registrations')
            .update({
                payment_status: payload.code === 'PAYMENT_SUCCESS' ? 'completed' : 'failed'
            })
            .eq('id', registrationId);

        if (updateError) {
            console.error('Error updating registration:', updateError);
            return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
        }

        // Store payment transaction details
        const { error: transactionError } = await supabase
            .from('payment_transactions')
            .insert({
                registration_id: registrationId,
                transaction_id: payload.transactionId,
                status: payload.code === 'PAYMENT_SUCCESS' ? 'completed' : 'failed',
                amount: payload.amount,
                payment_response: payload
            });

        if (transactionError) {
            console.error('Error storing transaction:', transactionError);
            return NextResponse.json({ error: 'Failed to store transaction' }, { status: 500 });
        }

        // Return success response to PhonePe
        return NextResponse.json({ status: 'success' });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function verifySignature(payload: any, signature: string | null): boolean {
    if (!signature || !process.env.PHONEPE_WEBHOOK_SECRET) return false;

    const hmac = crypto.createHmac('sha256', process.env.PHONEPE_WEBHOOK_SECRET);
    const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(calculatedSignature)
    );
} 
