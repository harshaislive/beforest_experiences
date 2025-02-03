'use client';

import { useState, useCallback } from 'react';

export interface FoodOptionsProps {
    foodOptions: Array<{
        id: string;
        name: string;
        price: number;
        description?: string;
    }>;
    onSubmit: (food: Array<{ id: string; quantity: number }>) => Promise<void>;
    onBack: () => void;
    loading: boolean;
}

export default function FoodOptions({ foodOptions, onSubmit, onBack, loading }: FoodOptionsProps) {
    const [quantities, setQuantities] = useState<Record<string, number>>(
        Object.fromEntries(foodOptions.map(f => [f.id, 0]))
    );

    const handleQuantityChange = useCallback((id: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, prev[id] + delta)
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const selectedFood = Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({ id, quantity }));

        onSubmit(selectedFood);
    }, [quantities, onSubmit]);

    const totalAmount = foodOptions.reduce(
        (sum, food) => sum + (food.price * (quantities[food.id] || 0)),
        0
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {foodOptions.map(food => (
                    <div 
                        key={food.id}
                        className="flex items-center justify-between p-4 bg-soft-beige rounded-lg"
                    >
                        <div>
                            <h3 className="font-medium text-deep-brown">
                                {food.name}
                            </h3>
                            {food.description && (
                                <p className="text-sm text-deep-brown/70 mt-1">
                                    {food.description}
                                </p>
                            )}
                            <p className="text-terracotta font-medium mt-2">
                                ₹{food.price.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(food.id, -1)}
                                disabled={quantities[food.id] === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-deep-brown/20 hover:border-deep-brown/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-medium">
                                {quantities[food.id]}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(food.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-deep-brown/20 hover:border-deep-brown/40"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-deep-brown/10">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-deep-brown">Food Total</span>
                    <span className="text-lg font-semibold text-deep-brown">
                        ₹{totalAmount.toLocaleString()}
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
                        {loading ? 'Processing...' : 'Continue'}
                    </button>
                </div>
                <p className="text-sm text-deep-brown/70 text-center mt-4">
                    Food selection is optional. You can continue without selecting any food items.
                </p>
            </div>
        </form>
    );
}
