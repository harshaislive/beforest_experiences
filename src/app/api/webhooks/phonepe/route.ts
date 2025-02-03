import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/payment-service';

const paymentService = new PaymentService({
    merchantId: process.env.PHONEPE_MERCHANT_ID!,
    saltKey: process.env.PHONEPE_SALT_KEY!,
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1'),
    isDev: process.env.NODE_ENV !== 'production',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY!
});

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const signature = request.headers.get('x-phonepe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        const result = await paymentService.handlePaymentCallback(payload, signature);

        if (!result.success) {
            console.error('Webhook handling failed:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
