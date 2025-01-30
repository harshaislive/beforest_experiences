'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { handleRegistrationNewsletter } from '@/lib/supabase';
import { Event } from '@/lib/types';
import PersonalInfoForm from './PersonalInfoForm';
import WelcomeStep from './Steps/WelcomeStep';
import TicketsStep from './Steps/TicketsStep';
import FoodStep from './Steps/FoodStep';
import DietaryStep from './Steps/DietaryStep';
import EmergencyContactStep from './Steps/EmergencyContactStep';
import ReviewStep from './Steps/ReviewStep';
import { BookingData, PaymentStatus, RegistrationPricingDetail, RegistrationFoodDetail } from './types';

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

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
    capacity: {
        available: number;
        total: number;
    };
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
    event,
    capacity
}: BookingModalProps) {
    const [step, setStep] = useState<Step>('welcome');
    const [bookingData, setBookingData] = useState<BookingData>({
        personal_info: {
            full_name: '',
            email: '',
            phone: ''
        },
        booking_details: {
            event_id: event.id,
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
    const [selectedPricing, setSelectedPricing] = useState<Record<string, number>>({});
    const [selectedFood, setSelectedFood] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            case 'welcome':
                // No validation needed for welcome step
                return true;

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
                const remainingCapacity = capacity.available;
                
                if (totalTickets === 0) {
                    errors.tickets = 'Please select at least one ticket';
                } else if (remainingCapacity <= 0) {
                    errors.tickets = 'Sorry, this event is fully booked';
                } else if (totalTickets > remainingCapacity) {
                    errors.tickets = `Only ${remainingCapacity} ${remainingCapacity === 1 ? 'ticket' : 'tickets'} available`;
                }

                // Check individual ticket type limits
                bookingData.booking_details.pricing.forEach(item => {
                    const option = event.pricing_options.find((o: PricingOption) => o.id === item.pricing_id);
                    if (option && item.quantity > option.max_quantity) {
                        errors[`ticket_${item.pricing_id}`] = `Maximum ${option.max_quantity} tickets allowed for ${option.category}`;
                    }
                });
                break;

            case 'food':
                // Food is optional, but if selected, validate quantities
                bookingData.booking_details.food.forEach(item => {
                    const option = event.food_options.find((o: FoodOption) => o.id === item.food_option_id);
                    if (option && item.quantity > option.max_quantity) {
                        errors[`food_${item.food_option_id}`] = `Maximum ${option.max_quantity} items allowed for ${option.name}`;
                    }
                });
                break;

            case 'dietary':
                // Dietary restrictions are optional
                return true;

            case 'emergency':
                if (!bookingData.booking_details.emergency_contact.name.trim()) {
                    errors.emergency_name = 'Emergency contact name is required';
                }
                if (!bookingData.booking_details.emergency_contact.phone.trim()) {
                    errors.emergency_phone = 'Emergency contact phone is required';
                } else if (!/^[0-9]{10}$/.test(bookingData.booking_details.emergency_contact.phone.replace(/[^0-9]/g, ''))) {
                    errors.emergency_phone = 'Please enter a valid 10-digit phone number';
                }
                if (!bookingData.booking_details.emergency_contact.relation.trim()) {
                    errors.emergency_relation = 'Relationship to emergency contact is required';
                }
                break;

            case 'review':
                // No validation needed for review step
                return true;
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
            }
            if (step === 'review') {
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
                        event_id: event.id
                    }
                }),
            });

            const registrationData = await registrationResponse.json();

            if (!registrationResponse.ok) {
                throw new Error(registrationData.error || 'Failed to create registration');
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

            // Redirect to PhonePe payment gateway
            if (paymentData.redirectUrl) {
                window.location.href = paymentData.redirectUrl;
            } else {
                throw new Error('No payment redirect URL received');
            }

        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
            setIsSubmitting(false);
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

    const handlePricingChange = (id: string, quantity: number) => {
        const option = event.pricing_options.find((p: PricingOption) => p.id === id);
        if (option) {
            setSelectedPricing(prev => ({
                ...prev,
                [id]: quantity
            }));
            updateQuantity(id, quantity, option.price);
        }
    };

    const handleFoodChange = (id: string, quantity: number) => {
        const option = event.food_options.find((f: FoodOption) => f.id === id);
        if (option) {
            setSelectedFood(prev => ({
                ...prev,
                [id]: quantity
            }));
            updateFoodSelection(id, quantity, option.price);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        
        // Add pricing options total
        Object.entries(selectedPricing).forEach(([id, quantity]) => {
            const option = event.pricing_options.find((p: PricingOption) => p.id === id);
            if (option) {
                total += option.price * quantity;
            }
        });

        // Add food options total
        Object.entries(selectedFood).forEach(([id, quantity]) => {
            const option = event.food_options.find((f: FoodOption) => f.id === id);
            if (option) {
                total += option.price * quantity;
            }
        });

        return total;
    };

    const calculateAge = (birthDate: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const renderStepContent = () => {
        switch (step) {
            case 'welcome':
                return (
                    <WelcomeStep
                        eventTitle={event.title}
                        onNext={handleNext}
                    />
                );

            case 'name':
            case 'email':
            case 'phone':
                return (
                    <PersonalInfoForm
                        personalInfo={bookingData.personal_info}
                        validationErrors={validationErrors}
                        onUpdate={updatePersonalInfo}
                        step={step}
                    />
                );

            case 'tickets':
                return (
                    <TicketsStep
                        event={event}
                        selectedPricing={selectedPricing}
                        validationErrors={validationErrors}
                        totalAmount={bookingData.booking_details.total_amount}
                        onQuantityChange={handlePricingChange}
                    />
                );

            case 'food':
                return (
                    <FoodStep
                        event={event}
                        selectedFood={selectedFood}
                        validationErrors={validationErrors}
                        onQuantityChange={handleFoodChange}
                    />
                );

            case 'dietary':
                return (
                    <DietaryStep
                        dietaryRestrictions={bookingData.booking_details.dietary_restrictions || ''}
                        onUpdate={updateDietaryRestrictions}
                    />
                );

            case 'emergency':
                return (
                    <EmergencyContactStep
                        emergencyContact={bookingData.booking_details.emergency_contact}
                        validationErrors={validationErrors}
                        onUpdate={updateEmergencyContact}
                    />
                );

            case 'review':
                return (
                    <ReviewStep
                        bookingData={bookingData}
                        event={event}
                        paymentStatus={paymentStatus}
                    />
                );
        }
    };

    // Helper function to get step index for progress bar
    function getStepIndex(currentStep: Step): number {
        const stepOrder: Record<Step, number> = {
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
        return stepOrder[currentStep];
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-deep-brown">Book Your Spot</h2>
                        <button
                            onClick={onClose}
                            className="text-deep-brown/50 hover:text-deep-brown transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (step === 'review') {
                            setIsSubmitting(true);
                            setError(null);
                            handleSubmit();
                        }
                    }} 
                    className="p-6 space-y-6"
                >
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (step === 'review') {
                                            handleSubmit();
                                        } else {
                                            handleNext();
                                        }
                                    }}
                                    disabled={loading || isSubmitting}
                                    className="inline-flex w-full justify-center rounded-lg bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                                >
                                    {loading || isSubmitting ? (
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBack();
                                    }}
                                    disabled={loading || isSubmitting}
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
                </form>
            </div>
        </div>
    );
}
