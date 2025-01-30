import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/global/Footer';

interface PaymentFailedPageProps {
    searchParams: {
        id?: string;
    };
}

export async function generateMetadata({ searchParams }: PaymentFailedPageProps): Promise<Metadata> {
    if (!searchParams.id) {
        return {
            title: 'Payment Failed | BeForest Events',
            description: 'Your payment could not be processed',
            robots: {
                index: false,
                follow: true
            }
        };
    }

    const supabase = createServerComponentClient({ cookies });
    
    try {
        const { data: registration } = await supabase
            .from('registrations')
            .select(`
                *,
                events (
                    title
                )
            `)
            .eq('id', searchParams.id)
            .single();

        if (!registration) {
            return {
                title: 'Payment Failed | BeForest Events',
                description: 'The requested payment information could not be found',
                robots: {
                    index: false,
                    follow: true
                }
            };
        }

        return {
            title: `Payment Failed - ${registration.events.title} | BeForest Events`,
            description: `Your payment for ${registration.events.title} could not be processed`,
            robots: {
                index: false,
                follow: true
            }
        };
    } catch (error) {
        console.error('Error fetching registration for metadata:', error);
        return {
            title: 'Payment Failed | BeForest Events',
            description: 'Your payment could not be processed',
            robots: {
                index: false,
                follow: true
            }
        };
    }
}

export default async function PaymentFailedPage({ searchParams }: PaymentFailedPageProps) {
    const { id } = searchParams;
    
    if (!id) {
        notFound();
    }

    const supabase = createServerComponentClient({ cookies });
    const { data: registration } = await supabase
        .from('registrations')
        .select(`
            *,
            events (
                title,
                slug
            )
        `)
        .eq('id', id)
        .single();

    if (!registration) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-soft-beige">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-deep-brown mb-4">Payment Failed</h1>
                        <p className="text-lg text-deep-brown/70 mb-8">
                            We were unable to process your payment for {registration.events.title}.
                            Please try again or contact support if the problem persists.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={`/events/${registration.events.slug}`}
                                className="inline-flex items-center justify-center px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-white rounded-lg font-medium transition-colors"
                            >
                                Try Payment Again
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 bg-sage-100 hover:bg-sage-200 text-deep-brown rounded-lg font-medium transition-colors"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
} 