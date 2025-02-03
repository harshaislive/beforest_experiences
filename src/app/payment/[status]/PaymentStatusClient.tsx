'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PAYMENT_STATUS, PaymentStatusType } from '@/lib/constants/payment';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import ActionButtons from './ActionButtons';

interface PaymentStatusClientProps {
    status: PaymentStatusType;
    searchParams: {
        id: string;
        type?: string;
    };
    templateContent: string;
}

export default function PaymentStatusClient({ status, searchParams, templateContent }: PaymentStatusClientProps) {
    const router = useRouter();

    useEffect(() => {
        if (status === PAYMENT_STATUS.PENDING) {
            const timer = setTimeout(() => {
                router.refresh();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        {/* Status Header */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
                                {status === PAYMENT_STATUS.SUCCESS && (
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                                {status === PAYMENT_STATUS.FAILED && (
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                )}
                                {status === PAYMENT_STATUS.PENDING && (
                                    <svg className="w-8 h-8 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none">
                            <ReactMarkdown 
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-4xl font-extrabold mb-6 text-gray-900" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-800" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gray-600" {...props} />,
                                    li: ({node, ...props}) => <li className="mb-2 text-gray-600" {...props} />,
                                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                                }}
                            >
                                {templateContent}
                            </ReactMarkdown>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <ActionButtons status={status} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
