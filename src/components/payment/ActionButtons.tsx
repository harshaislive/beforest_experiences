'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PAYMENT_STATUS, PaymentStatusType } from '@/lib/constants/payment';

interface ActionButtonsProps {
    status: PaymentStatusType;
}

export default function ActionButtons({ status }: ActionButtonsProps) {
    const router = useRouter();
    const isPending = status === PAYMENT_STATUS.PENDING;
    const isFailed = status === PAYMENT_STATUS.FAILED;

    const handleBack = () => {
        router.back();
    };

    const handlePrint = () => {
        window.print();
    };

    if (isPending) {
        return (
            <div className="flex items-center space-x-2 text-deep-brown/70">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Refreshing in 5 seconds...</span>
            </div>
        );
    }

    return (
        <>
            <Link 
                href="/experiences"
                className="inline-flex items-center px-6 py-3 bg-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta/90 transition-colors"
            >
                Browse More Experiences
            </Link>
            {isFailed && (
                <button
                    onClick={handleBack}
                    className="inline-flex items-center px-6 py-3 border border-terracotta text-terracotta text-sm font-medium rounded-lg hover:bg-terracotta/10 transition-colors"
                >
                    Try Again
                </button>
            )}
            {!isPending && (
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-3 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download PDF
                </button>
            )}
        </>
    );
} 
