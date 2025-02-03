import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import MainLayout from '@/components/layout/MainLayout';
import { 
    PAYMENT_STATUS, 
    PAYMENT_MESSAGES, 
    PAYMENT_TITLES, 
    PAYMENT_EMOJIS, 
    PAYMENT_NEXT_STEPS,
    PaymentStatusType 
} from '@/lib/constants/payment';
import { createServerSupabaseClient } from '@/lib/supabase';
import PaymentStatusClient from './PaymentStatusClient';

interface PaymentResultPageProps {
    params: {
        status: string;
    };
    searchParams: {
        id?: string;
        type?: string;
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

interface Experience {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    experience_pricing: PricingOption[];
    experience_food_options: FoodOption[];
}

interface PricingItem {
    pricing_id: string;
    quantity: number;
    amount: number;
}

interface FoodItem {
    food_option_id: string;
    quantity: number;
    amount: number;
}

interface BookingDetails {
    pricing: PricingItem[];
    personal_info: {
        email: string;
        full_name: string;
    };
    food?: FoodItem[];
    emergency_contact?: {
        name: string;
        phone: string;
        relation: string;
    };
    dietary_restrictions?: string;
}

interface PaymentTransaction {
    transaction_id: string;
    status: string;
    payment_response: Record<string, unknown>;
}

interface Registration {
    id: string;
    user_id: string;
    experience_id: string;
    total_amount: number;
    transaction_id: string | null;
    payment_status: string;
    payment_date: string | null;
    booking_details: BookingDetails;
    created_at: string;
    updated_at: string;
    experiences: Experience;
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

interface TemplateData {
    name: string;
    email: string;
    experience_title: string;
    experience_date: string;
    amount: string;
    transaction_id: string;
    tickets: string;
    food_items: string;
}

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
const formatDateTime = (date: string) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
});

const getStatusEmoji = (status: string) => {
    return PAYMENT_EMOJIS[status as PaymentStatusType] || '❓';
};

const getStatusText = (status: string) => {
    return PAYMENT_TITLES[status as PaymentStatusType]?.replace('Payment ', '').replace('Booking ', '') || 'Unknown';
};

const getStatusMessage = (status: string) => {
    return `**${PAYMENT_MESSAGES[status as PaymentStatusType]}**` || '**Please contact support for assistance.**';
};

const getNextSteps = (status: string) => {
    return PAYMENT_NEXT_STEPS[status as PaymentStatusType]?.join('\n') || 'Please contact our support team for assistance.';
};

const formatName = (name?: string) => name ? name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
).join(' ') : 'Guest';

const formatPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};

const formatRelation = (relation?: string) => relation ? 
    relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase() : '';

const createTemplateContent = (registration: Registration, status: string) => {
    const {
        booking_details,
        experiences,
        transaction_id,
        id,
        total_amount,
        created_at
    } = registration;

    const {
        personal_info,
        pricing,
        food,
        emergency_contact,
        dietary_restrictions
    } = booking_details;

    console.log('Creating template with personal info:', personal_info);
    const userName = formatName(personal_info?.full_name);
    console.log('Formatted name:', userName);

    // Early return if no registration details
    if (!pricing || pricing.length === 0) {
        return `
Dear ${userName},

Thank you for booking **${experiences?.title || 'the experience'}**. However, there seems to be an issue with the ticket details. Please contact support for assistance.`;
    }

    const bookingDate = new Date(created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const ticketDetails = pricing.map((item: PricingItem) => {
        const option = experiences?.experience_pricing?.find(p => p.id === item.pricing_id);
        return `• ${item.quantity}x ${option?.category || 'Ticket'} - ${formatCurrency(item.amount)}`;
    }).join('\n');

    const foodDetails = food?.length ? `
## Food & Beverages
${food.map((item: FoodItem) => {
    const option = experiences?.experience_food_options?.find(f => f.id === item.food_option_id);
    return `• ${item.quantity}x ${option?.name || 'Food Item'} - ${formatCurrency(item.amount)}`;
}).join('\n')}` : '';

    const emergencyContactDetails = emergency_contact ? `
## Emergency Contact Information
• Name: ${formatName(emergency_contact.name)}
• Phone: ${formatPhone(emergency_contact.phone)}
• Relation: ${formatRelation(emergency_contact.relation)}` : '';

    const dietaryRestrictionsDetails = dietary_restrictions ? `
## Special Requirements
• Dietary Restrictions: ${dietary_restrictions}` : '';

    return `
Dear ${userName},

Thank you for booking **${experiences?.title || 'the experience'}**.

${getStatusMessage(status)}

## Booking Information
• Booking Date: ${bookingDate}
• Booking ID: ${id}
• Transaction ID: ${transaction_id || id}
• Payment Status: ${getStatusEmoji(status)} ${getStatusText(status)}

## Experience Details
• Experience: ${experiences?.title || ''}
• Date: ${experiences?.start_date ? formatDateTime(experiences.start_date) : ''}
• Duration: ${experiences?.end_date ? calculateDuration(experiences.start_date, experiences.end_date) : ''}
• Venue: Hyderabad

## Order Summary
• Total Amount: ${formatCurrency(total_amount)}

## Ticket Details
${ticketDetails}
${foodDetails}
${emergencyContactDetails}
${dietaryRestrictionsDetails}

## Next Steps
${getNextSteps(status)}

If you have any questions, please don't hesitate to contact us.

---
*This is an automatically generated confirmation. You can download a PDF copy of this receipt for your records.*`;
};

const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = Math.abs(endDate.getTime() - startDate.getTime()) / 36e5;
    return `${Math.floor(hours)} hours ${hours % 1 * 60 >= 1 ? Math.round(hours % 1 * 60) + ' minutes' : ''}`;
};

const ErrorComponent = () => (
    <MainLayout>
        <div className="min-h-[80vh] bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-red-600 px-6 py-4">
                        <h1 className="text-2xl font-semibold text-white">
                            Error Loading Payment Status
                        </h1>
                    </div>
                    <div className="p-6">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-8">
                                We encountered an error while loading your payment status. Please try again later or contact support if the issue persists.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link 
                                    href="/experiences"
                                    className="inline-flex items-center px-6 py-3 bg-terracotta text-white text-sm font-medium rounded-lg hover:bg-terracotta/90 transition-colors"
                                >
                                    Browse Experiences
                                </Link>
                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center px-6 py-3 border border-terracotta text-terracotta text-sm font-medium rounded-lg hover:bg-terracotta/10 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
);

async function getRegistrationDetails(id: string, type: string = 'registration'): Promise<Registration | null> {
    if (!id) {
        console.error('No ID provided to getRegistrationDetails');
        return null;
    }

    try {
        console.log('Fetching registration details:', { id, type });
        const supabase = createServerSupabaseClient();
        let registrationId = id;

        if (type === 'transaction') {
            // First, get the registration_id from payment_transactions
            const { data: transaction, error: transactionError } = await supabase
                .from('payment_transactions')
                .select('registration_id')
                .eq('transaction_id', id)
                .maybeSingle();

            if (transactionError) {
                console.error('Error fetching transaction:', transactionError);
                return null;
            }

            if (!transaction?.registration_id) {
                console.error('No registration found for transaction:', id);
                return null;
            }

            console.log('Found registration ID:', transaction.registration_id);
            registrationId = transaction.registration_id;
        }

        // Then get the registration details using the registration_id
        const { data, error } = await supabase
            .from('registrations')
            .select(`
                id,
                user_id,
                experience_id,
                total_amount,
                transaction_id,
                payment_status,
                payment_date,
                booking_details,
                created_at,
                updated_at,
                experiences:experience_id (
                    id,
                    title,
                    start_date,
                    end_date,
                    experience_pricing (
                        id,
                        price,
                        category,
                        description,
                        max_quantity
                    ),
                    experience_food_options (
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
            .maybeSingle();

        if (error) {
            console.error('Error fetching registration:', error);
            return null;
        }

        if (!data) {
            console.error('No registration found with ID:', registrationId);
            return null;
        }

        // Transform the data to match our types
        const experienceData = Array.isArray(data.experiences) 
            ? data.experiences[0] 
            : data.experiences;
        
        if (!experienceData) {
            console.error('No experience data found for registration:', registrationId);
            return null;
        }

        // Parse booking_details if it's a string
        let parsedBookingDetails: BookingDetails;
        try {
            parsedBookingDetails = typeof data.booking_details === 'string'
                ? JSON.parse(data.booking_details)
                : data.booking_details;
                
            console.log('Parsed booking details:', {
                hasPersonalInfo: !!parsedBookingDetails?.personal_info,
                personalInfo: parsedBookingDetails?.personal_info
            });

            // Fallback: If personal_info is missing, fetch from users table
            if ((!parsedBookingDetails.personal_info || !parsedBookingDetails.personal_info.full_name) && data.user_id) {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('full_name, email, phone')
                    .eq('id', data.user_id)
                    .maybeSingle();

                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else if (userData) {
                    parsedBookingDetails.personal_info = {
                        full_name: userData.full_name,
                        email: userData.email
                    };
                    console.log('Falling back to user data:', parsedBookingDetails.personal_info);
                }
            }
        } catch (e) {
            console.error('Error parsing booking_details:', e);
            return null;
        }

        const registration: Registration = {
            ...data,
            booking_details: parsedBookingDetails,
            experiences: {
                ...experienceData,
                experience_pricing: experienceData.experience_pricing || [],
                experience_food_options: experienceData.experience_food_options || []
            }
        };

        console.log('Successfully fetched registration:', {
            id: registration.id,
            status: registration.payment_status,
            experienceTitle: registration.experiences.title,
            transactions: registration.payment_transactions?.length || 0,
            userName: registration.booking_details?.personal_info?.full_name
        });

        return registration;
    } catch (error) {
        console.error('Unexpected error in getRegistrationDetails:', error);
        return null;
    }
}

async function getConfirmationTemplate(type: string, registration: Registration): Promise<Template | null> {
    try {
        console.log('Fetching template for type:', type);
        
        // Create a clean template structure
        const createTemplate = (content: string): Template => ({
            type,
            title: type === 'pending' ? 'Payment Processing' : 
                  type === 'success' ? 'Booking Confirmation' : 'Payment Failed',
            content: {
                sections: [{
                    type: 'details',
                    content: content
                }]
            }
        });

        const templateContent = createTemplateContent(registration, type);
        return createTemplate(templateContent);
    } catch (error) {
        console.error('Error creating confirmation template:', error);
        return null;
    }
}

export default async function PaymentResultPage({ params, searchParams }: PaymentResultPageProps) {
    try {
        const { status } = params;
        const { id, type } = searchParams;

        if (!id) {
            console.error('No ID provided in search params');
            return <ErrorComponent />;
        }

        if (!Object.values(PAYMENT_STATUS).includes(status as PaymentStatusType)) {
            console.error('Invalid payment status:', status);
            return <ErrorComponent />;
        }

        // Get registration details
        const registration = await getRegistrationDetails(id, type);
        if (!registration) {
            console.error('Registration not found:', { id, type });
            return <ErrorComponent />;
        }

        // Determine the actual payment status
        const paymentStatus = registration.payment_transactions?.[0]?.status || registration.payment_status;
        let actualStatus: PaymentStatusType = PAYMENT_STATUS.PENDING;
        
        if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
            actualStatus = PAYMENT_STATUS.SUCCESS;
        } else if (paymentStatus === PAYMENT_STATUS.FAILED || status === 'failed') {
            actualStatus = PAYMENT_STATUS.FAILED;
            // Log additional details for failed payments
            console.log('Payment failed:', {
                registrationId: registration.id,
                transactionId: registration.transaction_id,
                paymentStatus,
                requestedStatus: status,
                paymentTransactions: registration.payment_transactions
            });
        }

        // If we're on the wrong status page, redirect
        if (status !== actualStatus && status !== 'failed') {
            // Construct the path first
            const path = `/payment/${actualStatus}`;
            
            // Create search params
            const searchParams = new URLSearchParams();
            searchParams.set('id', id);
            if (type) {
                searchParams.set('type', type);
            }
            
            // Combine path and search params
            const redirectPath = `${path}?${searchParams.toString()}`;
            
            return redirect(redirectPath);
        }

        // Get template
        const template = await getConfirmationTemplate(actualStatus, registration);
        if (!template) {
            throw new Error('Failed to create payment template');
        }

        return (
            <MainLayout>
                <PaymentStatusClient 
                    status={actualStatus}
                    searchParams={{ id, type }}
                    templateContent={template.content.sections[0].content}
                />
            </MainLayout>
        );
    } catch (error) {
        console.error('Error in PaymentResultPage:', error);
        return <ErrorComponent />;
    }
} 