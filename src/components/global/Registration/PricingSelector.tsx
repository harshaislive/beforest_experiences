'use client';

import { useState, useCallback } from 'react';

interface PricingItem {
    id: string;
    category: 'adult' | 'child' | 'camping_gear';
    price: number;
    description?: string;
    max_quantity?: number;
}

export interface PricingSelectorProps {
    pricing: PricingItem[];
    onSubmit: (pricing: Array<{ id: string; quantity: number }>) => Promise<void>;
    loading: boolean;
}

export default function PricingSelector({ pricing, onSubmit, loading }: PricingSelectorProps) {
    const [quantities, setQuantities] = useState<Record<string, number>>(
        Object.fromEntries(pricing.map(p => [p.id, 0]))
    );

    const handleQuantityChange = useCallback((id: string, delta: number) => {
        setQuantities(prev => {
            const item = pricing.find(p => p.id === id);
            const newQuantity = Math.max(0, prev[id] + delta);
            
            // Don't exceed max_quantity if set
            if (item?.max_quantity !== undefined && newQuantity > item.max_quantity) {
                return prev;
            }

            return {
                ...prev,
                [id]: newQuantity
            };
        });
    }, [pricing]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const selectedPricing = Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({ id, quantity }));

        if (selectedPricing.length === 0) {
            return; // Don't submit if no tickets selected
        }

        onSubmit(selectedPricing);
    }, [quantities, onSubmit]);

    const totalAmount = pricing.reduce(
        (sum, price) => sum + (price.price * (quantities[price.id] || 0)),
        0
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {pricing.map(price => (
                    <div 
                        key={price.id}
                        className="flex items-center justify-between p-4 bg-soft-beige rounded-lg"
                    >
                        <div>
                            <h3 className="font-medium text-deep-brown">
                                {price.category.charAt(0).toUpperCase() + price.category.slice(1).replace('_', ' ')}
                            </h3>
                            {price.description && (
                                <p className="text-sm text-deep-brown/70 mt-1">
                                    {price.description}
                                </p>
                            )}
                            <p className="text-terracotta font-medium mt-2">
                                ₹{price.price.toLocaleString()}
                            </p>
                            {price.max_quantity && (
                                <p className="text-xs text-deep-brown/60 mt-1">
                                    Max {price.max_quantity} per booking
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(price.id, -1)}
                                disabled={quantities[price.id] === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-deep-brown/20 hover:border-deep-brown/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-medium">
                                {quantities[price.id]}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(price.id, 1)}
                                disabled={price.max_quantity !== undefined && quantities[price.id] >= price.max_quantity}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-deep-brown/20 hover:border-deep-brown/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-deep-brown/10">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-deep-brown">Total Amount</span>
                    <span className="text-lg font-semibold text-deep-brown">
                        ₹{totalAmount.toLocaleString()}
                    </span>
                </div>
                <button
                    type="submit"
                    disabled={loading || totalAmount === 0}
                    className="w-full py-3 px-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Continue'}
                </button>
            </div>
        </form>
    );
}
