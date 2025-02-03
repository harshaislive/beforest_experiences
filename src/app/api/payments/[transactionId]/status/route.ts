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

export async function GET(
    request: Request,
    { params }: { params: { transactionId: string } }
) {
    try {
        const result = await paymentService.checkPaymentStatus(params.transactionId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error: any) {
        console.error('Payment status check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 