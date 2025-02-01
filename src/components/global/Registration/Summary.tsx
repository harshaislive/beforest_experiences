'use client';

import { useCallback } from 'react';

export interface SummaryProps {
    event: {
        title: string;
        start_date: string;
        location: {
            name: string;
        };
        experience_pricing: Array<{
            id: string;
            category: string;
            price: number;
            description: string;
            max_quantity: number;
        }>;
        experience_food_options: Array<{
            id: string;
            name: string;
            description: string;
            price: number;
            max_quantity: number;
            is_vegetarian: boolean;
        }>;
    };
    pricing: Array<{
        id: string;
        quantity: number;
    }>;
    food: Array<{
        id: string;
        quantity: number;
    }>;
    onSubmit: () => Promise<void>;
    onBack: () => void;
    loading: boolean;
}

export default function Summary({ 
    event, 
    pricing, 
    food, 
    onSubmit, 
    onBack,
    loading 
}: SummaryProps) {
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit();
    }, [onSubmit]);

    const pricingTotal = pricing.reduce((sum, item) => {
        const price = event.experience_pricing.find(p => p.id === item.id);
        return sum + (price ? price.price * item.quantity : 0);
    }, 0);

    const foodTotal = food.reduce((sum, item) => {
        const foodOption = event.experience_food_options.find(f => f.id === item.id);
        return sum + (foodOption ? foodOption.price * item.quantity : 0);
    }, 0);

    const total = pricingTotal + foodTotal;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Summary */}
            <div>
                <h3 className="font-medium text-deep-brown mb-2">
                    Event Details
                </h3>
                <div className="bg-soft-beige rounded-lg p-4">
                    <p className="text-lg font-medium text-deep-brown mb-1">
                        {event.title}
                    </p>
                    <p className="text-deep-brown/80">
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                        {' at '}
                        {new Date(event.start_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </p>
                    <p className="text-deep-brown/80 mt-1">
                        {event.location.name}
                    </p>
                </div>
            </div>

            {/* Pricing Summary */}
            <div>
                <h3 className="font-medium text-deep-brown mb-2">
                    Ticket Details
                </h3>
                <div className="space-y-2">
                    {pricing.map(item => {
                        const price = event.experience_pricing.find(p => p.id === item.id);
                        if (!price) return null;
                        
                        return (
                            <div 
                                key={item.id}
                                className="flex justify-between items-center bg-soft-beige rounded-lg p-4"
                            >
                                <div>
                                    <p className="font-medium text-deep-brown">
                                        {price.category}
                                    </p>
                                    <p className="text-sm text-deep-brown/70">
                                        ₹{price.price.toLocaleString()} × {item.quantity}
                                    </p>
                                </div>
                                <p className="font-medium text-deep-brown">
                                    ₹{(price.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Food Summary */}
            {food.length > 0 && (
                <div>
                    <h3 className="font-medium text-deep-brown mb-2">
                        Food Details
                    </h3>
                    <div className="space-y-2">
                        {food.map(item => {
                            const foodOption = event.experience_food_options.find(f => f.id === item.id);
                            if (!foodOption) return null;
                            
                            return (
                                <div 
                                    key={item.id}
                                    className="flex justify-between items-center bg-soft-beige rounded-lg p-4"
                                >
                                    <div>
                                        <p className="font-medium text-deep-brown">
                                            {foodOption.name}
                                        </p>
                                        <p className="text-sm text-deep-brown/70">
                                            ₹{foodOption.price.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium text-deep-brown">
                                        ₹{(foodOption.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="pt-6 border-t border-deep-brown/10">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium text-deep-brown">Total Amount</span>
                    <span className="text-xl font-semibold text-deep-brown">
                        ₹{total.toLocaleString()}
                    </span>
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-white border border-deep-brown/20 text-deep-brown rounded-lg hover:bg-soft-beige disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </form>
    );
}
