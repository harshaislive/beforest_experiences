'use client';

import { PaymentStatusType } from '@/lib/constants/payment';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import PaymentStatusClient from './PaymentStatusClient';

interface PaymentStatusWrapperProps {
    status: PaymentStatusType;
    searchParams: {
        id: string;
        type?: string;
    };
    templateContent: string;
}

export default function PaymentStatusWrapper({ status, searchParams, templateContent }: PaymentStatusWrapperProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-deep-brown to-terracotta text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl p-8">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {templateContent}
                        </ReactMarkdown>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-8">
                        <PaymentStatusClient 
                            status={status} 
                            searchParams={searchParams} 
                            templateContent={templateContent}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 