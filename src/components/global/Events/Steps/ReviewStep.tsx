import { Event } from '@/lib/types';
import { BookingData, PaymentStatus } from '../types';

interface ReviewStepProps {
    bookingData: BookingData;
    event: Event;
    paymentStatus: PaymentStatus;
}

export default function ReviewStep({
    bookingData,
    event,
    paymentStatus
}: ReviewStepProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-deep-brown">
                Review Your Booking
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-sage-50 p-4 rounded-lg">
                    <h4 className="font-medium text-deep-brown mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Personal Details
                    </h4>
                    <div className="space-y-1 text-sm text-deep-brown/70">
                        <p><span className="font-medium">Name:</span> {bookingData.personal_info.full_name}</p>
                        <p><span className="font-medium">Email:</span> {bookingData.personal_info.email}</p>
                        <p><span className="font-medium">Phone:</span> {bookingData.personal_info.phone}</p>
                    </div>
                </div>

                <div className="bg-sage-50 p-4 rounded-lg">
                    <h4 className="font-medium text-deep-brown mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                        </svg>
                        Tickets
                    </h4>
                    <div className="space-y-1 text-sm text-deep-brown/70">
                        {bookingData.booking_details.pricing.map((item: { pricing_id: string; quantity: number; amount: number }) => {
                            const option = event.pricing_options.find(o => o.id === item.pricing_id);
                            return (
                                <p key={item.pricing_id} className="flex justify-between">
                                    <span>{option?.category} × {item.quantity}</span>
                                    <span>₹{item.amount.toLocaleString('en-IN')}</span>
                                </p>
                            );
                        })}
                    </div>
                </div>

                {bookingData.booking_details.food.length > 0 && (
                    <div className="bg-sage-50 p-4 rounded-lg">
                        <h4 className="font-medium text-deep-brown mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Food Items
                        </h4>
                        <div className="space-y-1 text-sm text-deep-brown/70">
                            {bookingData.booking_details.food.map((item: { food_option_id: string; quantity: number; amount: number }) => {
                                const option = event.food_options.find(o => o.id === item.food_option_id);
                                return (
                                    <p key={item.food_option_id} className="flex justify-between">
                                        <span>{option?.name} × {item.quantity}</span>
                                        <span>₹{item.amount.toLocaleString('en-IN')}</span>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bg-sage-50 p-4 rounded-lg">
                    <h4 className="font-medium text-deep-brown mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Emergency Contact
                    </h4>
                    <div className="space-y-1 text-sm text-deep-brown/70">
                        <p><span className="font-medium">Name:</span> {bookingData.booking_details.emergency_contact.name}</p>
                        <p><span className="font-medium">Phone:</span> {bookingData.booking_details.emergency_contact.phone}</p>
                        <p><span className="font-medium">Relation:</span> {bookingData.booking_details.emergency_contact.relation}</p>
                    </div>
                </div>
            </div>

            {bookingData.booking_details.dietary_restrictions && (
                <div className="bg-sage-50 p-4 rounded-lg">
                    <h4 className="font-medium text-deep-brown mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.344c2.672 0 4.011-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                        </svg>
                        Dietary Restrictions
                    </h4>
                    <p className="text-sm text-deep-brown/70">{bookingData.booking_details.dietary_restrictions}</p>
                </div>
            )}

            <div className="bg-terracotta/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-deep-brown flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Total Amount
                    </h4>
                    <p className="text-xl font-semibold text-terracotta">
                        ₹{bookingData.booking_details.total_amount.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {paymentStatus === 'failed' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Payment failed. Please try again.
                    </p>
                </div>
            )}
        </div>
    );
} 
