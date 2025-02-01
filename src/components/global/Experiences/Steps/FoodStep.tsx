import { Event } from '@/lib/types';

interface FoodStepProps {
    event: Event;
    selectedFood: Record<string, number>;
    validationErrors: Record<string, string>;
    onQuantityChange: (id: string, quantity: number, price: number) => void;
}

export default function FoodStep({
    event,
    selectedFood,
    validationErrors,
    onQuantityChange
}: FoodStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-deep-brown">
                Would you like to add any food items?
            </h3>
            <div className="space-y-4">
                {event.food_options.map((option) => (
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
                                onClick={() => {
                                    const currentQuantity = selectedFood[option.id] || 0;
                                    onQuantityChange(option.id, Math.max(0, currentQuantity - 1), option.price);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-deep-brown border border-gray-200"
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{selectedFood[option.id] || 0}</span>
                            <button
                                onClick={() => {
                                    const currentQuantity = selectedFood[option.id] || 0;
                                    onQuantityChange(option.id, Math.min(option.max_quantity, currentQuantity + 1), option.price);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-deep-brown border border-gray-200"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
                {validationErrors.food && (
                    <p className="text-red-500 text-sm">{validationErrors.food}</p>
                )}
            </div>
        </div>
    );
} 