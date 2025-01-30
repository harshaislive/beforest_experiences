'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { handleRegistrationNewsletter } from '@/lib/supabase';

type PaymentStatus = 'pending' | 'completed' | 'failed';

interface PricingOption {
    id: string;
    category: string;
    price: number;
    description: string;
    max_quantity: number;
}

interface FoodOption {
    id: string;
    name: string;
    description: string;
    price: number;
    max_quantity: number;
    is_vegetarian: boolean;
}

interface BookingData {
    personal_info: {
        full_name: string;
        email: string;
        phone: string;
        newsletter_consent?: boolean;
    };
    booking_details: {
        event_id: string;
        total_amount: number;
        pricing: Array<{
            pricing_id: string;
            quantity: number;
            amount: number;
        }>;
        food: Array<{
            food_option_id: string;
            quantity: number;
            amount: number;
        }>;
        dietary_restrictions?: string;
        emergency_contact: {
            name: string;
            phone: string;
            relation: string;
        };
    };
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    eventTitle: string;
    pricingOptions?: PricingOption[];
    foodOptions?: FoodOption[];
    currentCapacity?: number;
    maxCapacity?: number;
}

type Step = 
    | 'welcome' 
    | 'name' 
    | 'email' 
    | 'phone'
    | 'tickets'
    | 'food'
    | 'dietary'
    | 'emergency'
    | 'review';

export default function BookingModal({
    isOpen,
    onClose,
    eventId,
    eventTitle,
    pricingOptions = [],
    foodOptions = [],
    currentCapacity = 0,
    maxCapacity = 0
}: BookingModalProps) {
    const [step, setStep] = useState<Step>('welcome');
    const [bookingData, setBookingData] = useState<BookingData>({
        personal_info: {
            full_name: '',
            email: '',
            phone: '',
            newsletter_consent: true
        },
        booking_details: {
            event_id: eventId,
            total_amount: 0,
            pricing: [],
            food: [],
            dietary_restrictions: '',
            emergency_contact: {
                name: '',
                phone: '',
                relation: ''
            }
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

    const updatePersonalInfo = (field: keyof BookingData['personal_info'], value: string | boolean) => {
        setBookingData(prev => ({
            ...prev,
            personal_info: {
                ...prev.personal_info,
                [field]: value
            }
        }));
        // Clear validation error when user types
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const updateEmergencyContact = (field: keyof BookingData['booking_details']['emergency_contact'], value: string) => {
        setBookingData(prev => ({
            ...prev,
            booking_details: {
                ...prev.booking_details,
                emergency_contact: {
                    ...prev.booking_details.emergency_contact,
                    [field]: value
                }
            }
        }));
        // Clear validation error when user types
        if (validationErrors[`emergency_${field}`]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[`emergency_${field}`];
                return next;
            });
        }
    };

    const updateQuantity = (pricingId: string, quantity: number, price: number) => {
        setBookingData(prev => {
            const newPricing = [...prev.booking_details.pricing];
            const existingIndex = newPricing.findIndex(p => p.pricing_id === pricingId);
            
            if (quantity === 0 && existingIndex !== -1) {
                newPricing.splice(existingIndex, 1);
            } else if (quantity > 0) {
                if (existingIndex !== -1) {
                    newPricing[existingIndex] = {
                        pricing_id: pricingId,
                        quantity,
                        amount: price * quantity
                    };
                } else {
                    newPricing.push({
                        pricing_id: pricingId,
                        quantity,
                        amount: price * quantity
                    });
                }
            }

            const totalAmount = calculateTotalAmount(newPricing, prev.booking_details.food);

            return {
                ...prev,
                booking_details: {
                    ...prev.booking_details,
                    total_amount: totalAmount,
                    pricing: newPricing
                }
            };
        });
    };

    const updateFoodSelection = (foodId: string, quantity: number, price: number) => {
        setBookingData(prev => {
            const newFood = [...prev.booking_details.food];
            const existingIndex = newFood.findIndex(f => f.food_option_id === foodId);
            
            if (quantity === 0 && existingIndex !== -1) {
                newFood.splice(existingIndex, 1);
            } else if (quantity > 0) {
                if (existingIndex !== -1) {
                    newFood[existingIndex] = {
                        food_option_id: foodId,
                        quantity,
                        amount: price * quantity
                    };
                } else {
                    newFood.push({
                        food_option_id: foodId,
                        quantity,
                        amount: price * quantity
                    });
                }
            }

            const totalAmount = calculateTotalAmount(prev.booking_details.pricing, newFood);

            return {
                ...prev,
                booking_details: {
                    ...prev.booking_details,
                    total_amount: totalAmount,
                    food: newFood
                }
            };
        });
    };

    const calculateTotalAmount = (
        pricing: BookingData['booking_details']['pricing'],
        food: BookingData['booking_details']['food']
    ) => {
        const pricingTotal = pricing.reduce((sum, item) => sum + item.amount, 0);
        const foodTotal = food.reduce((sum, item) => sum + item.amount, 0);
        return pricingTotal + foodTotal;
    };

    const validateStep = (): boolean => {
        const errors: Record<string, string> = {};

        switch (step) {
            case 'name':
                if (!bookingData.personal_info.full_name.trim()) {
                    errors.full_name = 'Name is required';
                } else if (bookingData.personal_info.full_name.length < 2) {
                    errors.full_name = 'Name must be at least 2 characters long';
                }
                break;

            case 'email':
                if (!bookingData.personal_info.email.trim()) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.personal_info.email)) {
                    errors.email = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (!bookingData.personal_info.phone.trim()) {
                    errors.phone = 'Phone number is required';
                } else if (!/^[0-9]{10}$/.test(bookingData.personal_info.phone.replace(/[^0-9]/g, ''))) {
                    errors.phone = 'Please enter a valid 10-digit phone number';
                }
                break;

            case 'tickets':
                if (bookingData.booking_details.pricing.length === 0) {
                    errors.tickets = 'Please select at least one ticket';
                }
                
                const totalTickets = bookingData.booking_details.pricing.reduce((sum, item) => sum + item.quantity, 0);
                const remainingCapacity = maxCapacity - currentCapacity;
                
                if (totalTickets === 0) {
                    errors.tickets = 'Please select at least one ticket';
                } else if (remainingCapacity <= 0) {
                    errors.tickets = 'Sorry, this event is fully booked';
                } else if (totalTickets > remainingCapacity) {
                    errors.tickets = `Only ${remainingCapacity} ${remainingCapacity === 1 ? 'ticket' : 'tickets'} available`;
                }

                // Check individual ticket type limits
                bookingData.booking_details.pricing.forEach(item => {
                    const option = pricingOptions.find(o => o.id === item.pricing_id);
                    if (option && item.quantity > option.max_quantity) {
                        errors[`ticket_${item.pricing_id}`] = `Maximum ${option.max_quantity} tickets allowed for ${option.category}`;
                    }
                });
                break;

            case 'food':
                bookingData.booking_details.food.forEach(item => {
                    const option = foodOptions.find(o => o.id === item.food_option_id);
                    if (option && item.quantity > option.max_quantity) {
                        errors[`food_${item.food_option_id}`] = `Maximum ${option.max_quantity} items allowed for ${option.name}`;
                    }
                });
                break;

            case 'emergency':
                if (!bookingData.booking_details.emergency_contact.name.trim()) {
                    errors.emergency_name = 'Emergency contact name is required';
                } else if (!/^[a-zA-Z\s]+$/.test(bookingData.booking_details.emergency_contact.name.trim())) {
                    errors.emergency_name = 'Name should only contain letters and spaces';
                }

                if (!bookingData.booking_details.emergency_contact.phone.trim()) {
                    errors.emergency_phone = 'Emergency contact phone is required';
                } else if (!/^[0-9]{10}$/.test(bookingData.booking_details.emergency_contact.phone.replace(/[^0-9]/g, ''))) {
                    errors.emergency_phone = 'Please enter a valid 10-digit phone number';
                } else if (bookingData.booking_details.emergency_contact.phone === bookingData.personal_info.phone) {
                    errors.emergency_phone = 'Emergency contact should be different from your phone number';
                }

                if (!bookingData.booking_details.emergency_contact.relation.trim()) {
                    errors.emergency_relation = 'Relationship to emergency contact is required';
                } else if (!/^[a-zA-Z\s]+$/.test(bookingData.booking_details.emergency_contact.relation.trim())) {
                    errors.emergency_relation = 'Relationship should only contain letters and spaces';
                }
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            const steps: Step[] = [
                'welcome',
                'name',
                'email',
                'phone',
                'tickets',
                'food',
                'dietary',
                'emergency',
                'review'
            ];
            const currentIndex = steps.indexOf(step);
            if (currentIndex < steps.length - 1) {
                setStep(steps[currentIndex + 1]);
            } else if (step === 'review') {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        const steps: Step[] = [
            'welcome',
            'name',
            'email',
            'phone',
            'tickets',
            'food',
            'dietary',
            'emergency',
            'review'
        ];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) {
            setStep(steps[currentIndex - 1]);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setPaymentStatus('pending');

            // Create registration
            const registrationResponse = await fetch('/api/bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personal_info: bookingData.personal_info,
                    booking_details: {
                        ...bookingData.booking_details,
                        event_id: eventId
                    }
                }),
            });

            const registrationData = await registrationResponse.json();

            if (!registrationResponse.ok) {
                throw new Error(registrationData.error || 'Failed to create registration');
            }

            // Handle newsletter subscription if user consented
            if (bookingData.personal_info.newsletter_consent) {
                try {
                    await handleRegistrationNewsletter(
                        bookingData.personal_info.email,
                        registrationData.registration.id
                    );
                } catch (error) {
                    console.error('Newsletter subscription error:', error);
                    // Don't throw here, as this is not critical
                }
            }

            // Initiate payment
            const paymentResponse = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId: registrationData.registration.id,
                    amount: bookingData.booking_details.total_amount,
                    customerName: bookingData.personal_info.full_name,
                    customerEmail: bookingData.personal_info.email,
                    customerPhone: bookingData.personal_info.phone
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(paymentData.error || 'Failed to initiate payment');
            }

            // Redirect to payment gateway
            if (paymentData.redirectUrl) {
                window.location.href = paymentData.redirectUrl;
            } else {
                throw new Error('No payment redirect URL received');
            }

        } catch (error) {
            console.error('Booking error:', error);
            setError(error instanceof Error ? error.message : 'Something went wrong');
            setPaymentStatus('failed');
            setLoading(false);
        }
    };

    const updateDietaryRestrictions = (value: string) => {
        setBookingData(prev => ({
            ...prev,
            booking_details: {
                ...prev.booking_details,
                dietary_restrictions: value
            }
        }));
    };

    const renderStepContent = () => {
        switch (step) {
            case 'welcome':
                return (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-deep-brown mb-6">
                            Welcome to {eventTitle}
                        </h3>
                        <p className="text-lg text-deep-brown/70 mb-8">
                            Let&apos;s get you signed up for this amazing experience. It&apos;ll take just a few minutes.
                        </p>
                        <button
                            onClick={handleNext}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Let&apos;s Begin
                        </button>
                    </div>
                );

            case 'name':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            What&apos;s your name?
                        </h3>
                        <input
                            type="text"
                            value={bookingData.personal_info.full_name}
                            onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                            autoFocus
                        />
                        {validationErrors.full_name && (
                            <p className="text-red-500 text-sm">{validationErrors.full_name}</p>
                        )}
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            What&apos;s your email address?
                        </h3>
                        <input
                            type="email"
                            value={bookingData.personal_info.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                            autoFocus
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm">{validationErrors.email}</p>
                        )}
                        <div className="flex items-start gap-3 mt-4">
                            <input
                                type="checkbox"
                                id="newsletter_consent"
                                checked={bookingData.personal_info.newsletter_consent}
                                onChange={(e) => updatePersonalInfo('newsletter_consent', e.target.checked)}
                                className="mt-1"
                            />
                            <label htmlFor="newsletter_consent" className="text-sm text-deep-brown/70">
                                Keep me updated about future events and community stories. You can unsubscribe at any time.
                            </label>
                        </div>
                    </div>
                );

            case 'phone':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            What&apos;s your phone number?
                        </h3>
                        <input
                            type="tel"
                            value={bookingData.personal_info.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                            autoFocus
                        />
                        {validationErrors.phone && (
                            <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                        )}
                    </div>
                );

            case 'tickets':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown mb-4">
                            How many tickets would you like?
                        </h3>
                        {pricingOptions.length === 0 ? (
                            <div className="bg-sage-50 p-4 rounded-lg">
                                <p className="text-deep-brown/70">No ticket options available at the moment.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {pricingOptions.map((option) => (
                                        <div 
                                            key={option.id} 
                                            className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200 hover:border-terracotta transition-colors shadow-sm"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-lg text-deep-brown">
                                                        {option.category}
                                                    </h4>
                                                    <span className="px-2 py-0.5 bg-sage-50 rounded text-sm text-deep-brown/70">
                                                        Max: {option.max_quantity}
                                                    </span>
                                                </div>
                                                <p className="text-deep-brown/70 text-sm mt-1">
                                                    {option.description}
                                                </p>
                                                <p className="text-xl font-medium text-terracotta mt-2">
                                                    ₹{option.price.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 ml-4">
                                                <button
                                                    onClick={() => {
                                                        const currentQuantity = bookingData.booking_details.pricing.find(p => p.pricing_id === option.id)?.quantity || 0;
                                                        updateQuantity(option.id, Math.max(0, currentQuantity - 1), option.price);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-beige text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                                                    aria-label={`Decrease quantity for ${option.category}`}
                                                    disabled={!bookingData.booking_details.pricing.find(p => p.pricing_id === option.id)?.quantity}
                                                >
                                                    <span className="text-xl">−</span>
                                                </button>
                                                <span className="w-12 text-center text-lg font-medium text-deep-brown">
                                                    {bookingData.booking_details.pricing.find(p => p.pricing_id === option.id)?.quantity || 0}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const currentQuantity = bookingData.booking_details.pricing.find(p => p.pricing_id === option.id)?.quantity || 0;
                                                        updateQuantity(option.id, Math.min(option.max_quantity, currentQuantity + 1), option.price);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-beige text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                                                    aria-label={`Increase quantity for ${option.category}`}
                                                    disabled={bookingData.booking_details.pricing.find(p => p.pricing_id === option.id)?.quantity === option.max_quantity}
                                                >
                                                    <span className="text-xl">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {validationErrors.tickets && (
                                    <p className="text-red-500 text-sm mt-2">{validationErrors.tickets}</p>
                                )}
                                {bookingData.booking_details.pricing.length > 0 && (
                                    <div className="mt-6 p-6 bg-sage-50 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg text-deep-brown font-medium">Total Amount</span>
                                            <span className="text-2xl font-semibold text-terracotta">
                                                ₹{bookingData.booking_details.total_amount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );

            case 'food':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            Would you like to add any food items?
                        </h3>
                        <div className="space-y-4">
                            {foodOptions.map((option) => (
                                <div key={option.id} className="flex items-center justify-between bg-sage-50 p-4 rounded-lg">
                                    <div>
                                        <div className="font-medium text-deep-brown">
                                            {option.name}
                                            {option.is_vegetarian && (
                                                <span className="ml-2 text-sm px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                                    Veg
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-deep-brown/70">{option.description}</div>
                                        <div className="text-sm font-medium text-terracotta">₹{option.price}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateFoodSelection(option.id, Math.max(0, (bookingData.booking_details.food.find(f => f.food_option_id === option.id)?.quantity || 0) - 1), option.price)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-deep-brown border border-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{bookingData.booking_details.food.find(f => f.food_option_id === option.id)?.quantity || 0}</span>
                                        <button
                                            onClick={() => updateFoodSelection(option.id, Math.min(option.max_quantity, (bookingData.booking_details.food.find(f => f.food_option_id === option.id)?.quantity || 0) + 1), option.price)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-deep-brown border border-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'dietary':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            Do you have any dietary restrictions?
                        </h3>
                        <textarea
                            value={bookingData.booking_details.dietary_restrictions}
                            onChange={(e) => updateDietaryRestrictions(e.target.value)}
                            placeholder="Tell us about any allergies or dietary restrictions"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracotta focus:border-transparent h-32"
                            autoFocus
                        />
                    </div>
                );

            case 'emergency':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-deep-brown">
                            Emergency Contact Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={bookingData.booking_details.emergency_contact.name}
                                    onChange={(e) => updateEmergencyContact('name', e.target.value)}
                                    placeholder="Contact person's name"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        validationErrors.emergency_name 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                                    }`}
                                />
                                {validationErrors.emergency_name && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_name}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    value={bookingData.booking_details.emergency_contact.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        updateEmergencyContact('phone', value);
                                    }}
                                    placeholder="Contact person's phone (10 digits)"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        validationErrors.emergency_phone 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                                    }`}
                                    maxLength={10}
                                />
                                {validationErrors.emergency_phone && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_phone}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={bookingData.booking_details.emergency_contact.relation}
                                    onChange={(e) => updateEmergencyContact('relation', e.target.value)}
                                    placeholder="Relationship to contact person"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        validationErrors.emergency_relation 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                                    }`}
                                />
                                {validationErrors.emergency_relation && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_relation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'review':
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
                                    {bookingData.booking_details.pricing.map((item) => {
                                        const option = pricingOptions.find(o => o.id === item.pricing_id);
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
                                        {bookingData.booking_details.food.map((item) => {
                                            const option = foodOptions.find(o => o.id === item.food_option_id);
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
    };

    // Helper function to get step index for progress bar
    function getStepIndex(currentStep: Step): number {
        const stepOrder = {
            'welcome': 0,
            'name': 1,
            'email': 1,
            'phone': 1,
            'tickets': 2,
            'food': 3,
            'dietary': 3,
            'emergency': 4,
            'review': 5
        };
        return stepOrder[currentStep] || 0;
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop with blur */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-deep-brown/75 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-soft-beige px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 right-0 pt-4 pr-4 z-10 flex justify-end bg-soft-beige">
                                    <button
                                        type="button"
                                        className="rounded-full bg-deep-brown/5 p-2 text-deep-brown hover:bg-deep-brown/10 focus:outline-none transition-colors"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 text-center sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-deep-brown mb-6">
                                            Book Your Experience
                                        </Dialog.Title>

                                        {/* Progress Steps with sticky positioning */}
                                        <div className="sticky top-14 z-10 bg-soft-beige pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                    <div className="w-full border-t border-deep-brown/20" />
                                                </div>
                                                <div className="relative flex justify-between">
                                                    {[
                                                        { name: 'welcome', label: 'Start' },
                                                        { name: 'personal', label: 'Details' },
                                                        { name: 'tickets', label: 'Tickets' },
                                                        { name: 'food', label: 'Food' },
                                                        { name: 'emergency', label: 'Emergency' },
                                                        { name: 'review', label: 'Review' }
                                                    ].map((stepInfo, index) => (
                                                        <div
                                                            key={stepInfo.name}
                                                            className="flex flex-col items-center"
                                                        >
                                                            <div
                                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                                    index <= getStepIndex(step)
                                                                        ? 'bg-terracotta text-white'
                                                                        : 'bg-white border-2 border-deep-brown/20 text-deep-brown'
                                                                }`}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            <span className="mt-2 text-xs font-medium text-deep-brown/70">
                                                                {stepInfo.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content with max height */}
                                        <div className="mt-6 overflow-y-auto">
                                            {renderStepContent()}
                                        </div>

                                        {/* Actions with sticky positioning */}
                                        <div className="sticky bottom-0 mt-6 -mx-4 px-4 py-3 bg-soft-beige border-t border-deep-brown/10 sm:-mx-6 sm:px-6">
                                            <div className="sm:flex sm:flex-row-reverse gap-3">
                                                {step !== 'welcome' && (
                                                    <button
                                                        type="button"
                                                        onClick={handleNext}
                                                        disabled={loading}
                                                        className="inline-flex w-full justify-center rounded-lg bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                                                    >
                                                        {loading ? (
                                                            <span className="flex items-center gap-2">
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing...
                                                            </span>
                                                        ) : (
                                                            step === 'review' ? 'Complete Booking' : 'Next'
                                                        )}
                                                    </button>
                                                )}
                                                {step !== 'welcome' && (
                                                    <button
                                                        type="button"
                                                        onClick={handleBack}
                                                        disabled={loading}
                                                        className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-deep-brown shadow-sm ring-1 ring-inset ring-deep-brown/10 hover:bg-deep-brown/5 sm:mt-0 sm:w-auto"
                                                    >
                                                        Back
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
