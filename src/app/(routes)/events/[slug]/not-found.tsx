import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function EventNotFound() {
    return (
        <main className="min-h-screen bg-sage-50 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto bg-terracotta/10 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-4xl font-bold text-deep-brown mb-4">
                        Event Not Found
                    </h1>
                    <div className="text-deep-brown/80">
                        We couldn&apos;t find the event you&apos;re looking for.
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/events"
                            className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                            Browse All Events
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-sage-100 hover:bg-sage-200 text-deep-brown px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-12 text-deep-brown/60">
                        <p>Need help? Contact us at</p>
                        <a href="mailto:support@beforest.in" className="text-terracotta hover:text-terracotta/80 transition-colors">
                            support@beforest.in
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
