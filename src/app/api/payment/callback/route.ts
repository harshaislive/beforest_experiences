import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const SALT_KEY = process.env.PHONEPE_SALT_KEY!;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

function verifySignature(payload: string, xVerify: string) {
    const [signature, saltIndex] = xVerify.split('###');
    const string = payload + '/pg/v1/status' + SALT_KEY;
    const calculatedSignature = crypto.createHash('sha256').update(string).digest('hex');
    return signature === calculatedSignature && saltIndex === SALT_INDEX;
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const xVerify = request.headers.get('X-VERIFY');

        if (!xVerify || !verifySignature(JSON.stringify(data), xVerify)) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const {
            merchantTransactionId,
            transactionId,
            amount,
            code,
            status
        } = data;

        // Extract registration ID from merchantTransactionId
        const registrationId = merchantTransactionId.split('_')[1];

        // Update payment transaction
        const { error: transactionError } = await supabase
            .from('payment_transactions')
            .update({
                gateway_transaction_id: transactionId,
                status: status.toLowerCase(),
                gateway_response: data
            })
            .eq('transaction_id', merchantTransactionId);

        if (transactionError) {
            console.error('Error updating transaction:', transactionError);
            return NextResponse.json(
                { error: 'Failed to update transaction' },
                { status: 500 }
            );
        }

        // Update registration payment status
        const { error: registrationError } = await supabase
            .from('registrations')
            .update({
                payment_status: status.toLowerCase(),
                payment_id: transactionId
            })
            .eq('id', registrationId);

        if (registrationError) {
            console.error('Error updating registration:', registrationError);
            return NextResponse.json(
                { error: 'Failed to update registration' },
                { status: 500 }
            );
        }

        // If payment failed, release the tickets
        if (status.toLowerCase() === 'failed') {
            const { data: registration } = await supabase
                .from('registrations')
                .select('event_id, booking_details')
                .eq('id', registrationId)
                .single();

            if (registration) {
                const totalTickets = registration.booking_details.tickets.reduce(
                    (sum: number, item: { quantity: number }) => sum + item.quantity,
                    0
                );

                await supabase.rpc('release_event_tickets', {
                    p_event_id: registration.event_id,
                    p_ticket_count: totalTickets
                });
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json(
            { error: 'Failed to process payment callback' },
            { status: 500 }
        );
    }
} 