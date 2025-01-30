'use client';

import { useRouter } from 'next/navigation';

export const ErrorCardClient = ({ message }: { message: string }) => {
    const router = useRouter();

    const handleRetry = () => {
        router.refresh(); // Use Next.js router refresh instead of window.location.reload
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{message}</p>
            <button 
                onClick={handleRetry}
                className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
            >
                Try again
            </button>
        </div>
    );
};