import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import MainLayout from '@/components/layout/MainLayout';

// Move Supabase client to server-side only
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            persistSession: false
        }
    }
);

interface PaymentResultPageProps {
    params: {
        status: string;
    };
    searchParams: {
        id?: string;
    };
}

interface PricingOption {
    id: string;
    category: 'adult' | 'child' | 'camping_gear';
    price: number;
    description: string | null;
    max_quantity: number | null;
}

interface FoodOption {
    id: string;
    name: string;
    description: string | null;
    price: number;
    max_quantity: number | null;
    is_vegetarian: boolean | null;
}

interface Event {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    event_pricing: PricingOption[];
    event_food_options: FoodOption[];
}

interface BookingDetails {
    pricing: Array<{
        pricing_id: string;
        quantity: number;
        amount: number;
    }>;
    personal_info: {
        email: string;
        full_name: string;
    };
    food?: Array<{
        food_option_id: string;
        quantity: number;
        amount: number;
    }>;
}

interface PaymentTransaction {
    transaction_id: string;
    status: string;
    payment_response: Record<string, unknown>;
}

interface Registration {
    id: string;
    user_id: string | null;
    event_id: string | null;
    total_amount: number;
    phonepay_transaction_id: string | null;
    payment_status: 'pending' | 'completed' | 'failed' | null;
    payment_date: string | null;
    booking_details: BookingDetails;
    created_at: string | null;
    updated_at: string | null;
    events: Event;
    payment_transactions?: PaymentTransaction[];
}

interface TemplateSection {
    type: string;
    content: string;
}

interface Template {
    type: string;
    title: string;
    content: {
        sections: TemplateSection[];
    };
}

// Fix the ticket details template
const createTemplateContent = (registration: Registration) => {
    // Early return if no registration details
    if (!registration?.booking_details?.pricing || registration.booking_details.pricing.length === 0) {
        return `
Dear ${registration.booking_details?.personal_info?.full_name || 'Guest'},

Thank you for booking **${registration.events?.title || 'the event'}**. However, there seems to be an issue with the ticket details. Please contact support for assistance.`;
    }

    return `
Dear ${registration.booking_details?.personal_info?.full_name || 'Guest'},

Thank you for booking **${registration.events?.title || 'the event'}**. Here are your booking details:

## Event Details
• Event: ${registration.events?.title || ''}
• Date: ${registration.events?.start_date ? new Date(registration.events.start_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
}) : ''}
• Transaction ID: ${registration.phonepay_transaction_id || registration.id}
• Total Amount: ₹${registration.total_amount.toLocaleString('en-IN')}

## Ticket Details
${registration.booking_details.pricing.map((item) => {
    const option = registration.events?.event_pricing?.find(p => p.id === item.pricing_id);
    return `• ${item.quantity}x ${option?.category || 'Ticket'} - ₹${item.amount.toLocaleString('en-IN')}`;
}).join('\n')}

${registration.booking_details?.food?.length ? `
## Food Items
${registration.booking_details.food.map((item) => {
    const option = registration.events?.event_food_options?.find(f => f.id === item.food_option_id);
    return `• ${item.quantity}x ${option?.name || 'Food Item'} - ₹${item.amount.toLocaleString('en-IN')}`;
}).join('\n')}
` : ''}

## Next Steps
1. Save your booking ID for future reference
2. Arrive at the venue 15 minutes before the event starts

If you have any questions, please don't hesitate to contact us.`;
};

async function getRegistrationDetails(registrationId: string): Promise<Registration | null> {
    try {
    const { data, error } = await supabase
        .from('registrations')
        .select(`
            id,
            user_id,
            event_id,
            total_amount,
            phonepay_transaction_id,
            payment_status,
            payment_date,
            booking_details,
            created_at,
            updated_at,
            events (
                id,
                title,
                start_date,
                end_date,
                event_pricing (
                    id,
                    category,
                    price,
                    description,
                    max_quantity
                ),
                event_food_options (
                    id,
                    name,
                    description,
                    price,
                    max_quantity,
                    is_vegetarian
                )
            ),
            payment_transactions (
                transaction_id,
                status,
                payment_response
            )
        `)
        .eq('id', registrationId)
        .single();

    if (error) {
        console.error('Error fetching registration:', error);
        return null;
    }

    if (!data) {
        return null;
    }

    // Transform the data to match our types
    const eventData = Array.isArray(data.events) ? data.events[0] : data.events;
    
    const registration: Registration = {
        ...data,
        events: {
            ...eventData,
            event_pricing: eventData.event_pricing || [],
            event_food_options: eventData.event_food_options || []
        }
    };

    console.log('Fetched registration with details:', registration);
    return registration;
    } catch (error) {
        console.error('Unexpected error fetching registration:', error);
        return null;
    }
}

async function getConfirmationTemplate(type: string, registration: Registration): Promise<Template | null> {
    try {
    console.log('Fetching template for type:', type);
    
    // Create a clean template structure
    const createTemplate = (content: string) => ({
        type,
        title: 'Booking Confirmation',
        content: {
            sections: [{
                type: 'details',
                content: content
            }]
        }
    });

        const templateContent = createTemplateContent(registration);

    // Try to get template from database
    const { data: dbTemplate, error } = await supabase
        .from('confirmation_templates')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .single();

    if (error || !dbTemplate) {
        console.log('Using fallback template');
        return createTemplate(templateContent);
    }

    // Process database template
    const templateData = {
        name: registration.booking_details?.personal_info?.full_name || '',
        email: registration.booking_details?.personal_info?.email || '',
        event_title: registration.events?.title || '',
        event_date: registration.events?.start_date ? new Date(registration.events.start_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        }) : '',
        amount: `₹${registration.total_amount.toLocaleString('en-IN')}`,
        transaction_id: registration.phonepay_transaction_id || registration.id,
        tickets: registration.booking_details?.pricing?.map((item) => {
            const option = registration.events?.event_pricing?.find(p => p.id === item.pricing_id);
                return `• ${item.quantity}x ${option?.category || 'Ticket'} - ₹${item.amount.toLocaleString('en-IN')}`;
        }).join('\n') || '',
        food_items: registration.booking_details?.food?.map((item) => {
            const option = registration.events?.event_food_options?.find(f => f.id === item.food_option_id);
                return `• ${item.quantity}x ${option?.name || 'Food Item'} - ₹${item.amount.toLocaleString('en-IN')}`;
        }).join('\n') || ''
    };

    // Replace variables in the database template
    const processedContent = Object.entries(templateData).reduce(
        (content, [key, value]) => content.replace(new RegExp(`{{${key}}}`, 'g'), String(value)),
        dbTemplate.content
    );

    return createTemplate(processedContent);
    } catch (error) {
        console.error('Error creating confirmation template:', error);
        return null;
    }
}

export default async function PaymentStatusPage({ params, searchParams }: PaymentResultPageProps) {
    const { status } = params;
    const { id: registrationId } = searchParams;
    const normalizedStatus = status.toLowerCase();

    if (!registrationId) {
        notFound();
    }

    // Get registration details
    const registration = await getRegistrationDetails(registrationId);

    if (!registration) {
        notFound();
    }

    // Get confirmation template
    const template = await getConfirmationTemplate('booking', registration);

    if (!template) {
        notFound();
    }

    const statusConfig = {
        success: {
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
            title: 'Payment Successful',
            description: 'Your booking has been confirmed'
        },
        failed: {
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            borderColor: 'border-red-200',
            title: 'Payment Failed',
            description: 'There was an issue with your payment'
        }
    };

    const config = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.failed;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <Link 
                            href="/"
                            className="inline-flex items-center text-terracotta hover:text-terracotta/80 transition-colors font-medium"
                        >
                            <svg 
                                className="w-5 h-5 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                                />
                            </svg>
                            Back to Home
                        </Link>
                    </div>

                    <div className={`w-full ${config.bgColor} rounded-2xl p-6 md:p-8 shadow-xl border ${config.borderColor}`}>
                        {/* Status Header */}
                        <div className="flex flex-col items-center justify-center text-center mb-8">
                            <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                                {normalizedStatus === 'success' ? (
                                    <svg className={`w-10 h-10 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className={`w-10 h-10 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold mb-2 text-deep-brown">
                                {config.title}
                            </h1>
                            <p className="text-lg text-deep-brown/80">
                                {config.description}
                            </p>
                        </div>

                        {/* Ticket Details Card */}
                        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                            <div className="space-y-6">
                                {/* Event Details */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-deep-brown">Event Details</h2>
                                    <div className="grid gap-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">•</span>
                                            <div>
                                                <span className="font-medium">Event:</span>{' '}
                                                <span className="text-deep-brown/80">{registration.events?.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">•</span>
                                            <div>
                                                <span className="font-medium">Date:</span>{' '}
                                                <span className="text-deep-brown/80">
                                                    {registration.events?.start_date ? new Date(registration.events.start_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        timeZone: 'Asia/Kolkata'
                                                    }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">•</span>
                                            <div>
                                                <span className="font-medium">Transaction ID:</span>{' '}
                                                <span className="text-deep-brown/80">{registration.phonepay_transaction_id || registration.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">•</span>
                                            <div>
                                                <span className="font-medium">Total Amount:</span>{' '}
                                                <span className="text-deep-brown/80">₹{registration.total_amount.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Details */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-deep-brown">Ticket Details</h2>
                                    <div className="grid gap-3">
                                        {registration.booking_details?.pricing?.map((item, index) => {
                                            const option = registration.events?.event_pricing?.find(p => p.id === item.pricing_id);
                                            return (
                                                <div key={index} className="flex items-start gap-2">
                                                    <span className="text-terracotta">•</span>
                                                    <div>
                                                        <span className="text-deep-brown/80">
                                                            {item.quantity}x {option?.category || 'Ticket'} - ₹{item.amount.toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Food Items */}
                                {registration.booking_details?.food && registration.booking_details.food.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-deep-brown">Food Items</h2>
                                        <div className="grid gap-3">
                                            {registration.booking_details.food.map((item, index) => {
                                                const option = registration.events?.event_food_options?.find(f => f.id === item.food_option_id);
                                                return (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <span className="text-terracotta">•</span>
                                                        <div>
                                                            <span className="text-deep-brown/80">
                                                                {item.quantity}x {option?.name || 'Food Item'} - ₹{item.amount.toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Next Steps */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-deep-brown">Next Steps</h2>
                                    <div className="grid gap-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">1.</span>
                                            <div>
                                                <span className="text-deep-brown/80">Save your booking ID for future reference</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-terracotta">2.</span>
                                            <div>
                                                <span className="text-deep-brown/80">Arrive at the venue 15 minutes before the event starts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {normalizedStatus === 'success' && (
                                <a
                                    href={`/api/tickets/${registrationId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-deep-brown hover:bg-deep-brown/90 text-white font-medium transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Ticket
                                </a>
                            )}
                            <Link
                                href="/"
                                className={`
                                    inline-flex items-center justify-center px-6 py-3 rounded-lg
                                    ${normalizedStatus === 'success' ? 'bg-terracotta hover:bg-terracotta/90' : 'bg-deep-brown hover:bg-deep-brown/90'}
                                    text-white font-medium transition-colors duration-200
                                `}
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
        </div>
        </MainLayout>
    );
} 