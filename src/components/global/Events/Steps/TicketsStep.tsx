import { Event } from '@/lib/types';

interface TicketsStepProps {
    event: Event;
    selectedPricing: Record<string, number>;
    validationErrors: Record<string, string>;
    totalAmount: number;
    onQuantityChange: (id: string, quantity: number) => void;
}

export default function TicketsStep({
    event,
    selectedPricing,
    validationErrors,
    totalAmount,
    onQuantityChange
}: TicketsStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-deep-brown mb-4">
                How many tickets would you like?
            </h3>
            {event.pricing_options.length === 0 ? (
                <div className="bg-sage-50 p-4 rounded-lg">
                    <p className="text-deep-brown/70">No ticket options available at the moment.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {event.pricing_options.map((option) => (
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
                                        type="button"
                                        onClick={() => {
                                            const currentQuantity = selectedPricing[option.id] || 0;
                                            onQuantityChange(option.id, Math.max(0, currentQuantity - 1));
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-beige text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                                        aria-label={`Decrease quantity for ${option.category}`}
                                        disabled={!selectedPricing[option.id]}
                                    >
                                        <span className="text-xl">−</span>
                                    </button>
                                    <span className="w-12 text-center text-lg font-medium text-deep-brown">
                                        {selectedPricing[option.id] || 0}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentQuantity = selectedPricing[option.id] || 0;
                                            onQuantityChange(option.id, Math.min(option.max_quantity, currentQuantity + 1));
                                        }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-beige text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                                        aria-label={`Increase quantity for ${option.category}`}
                                        disabled={selectedPricing[option.id] === option.max_quantity}
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
                    {Object.entries(selectedPricing).length > 0 && (
                        <div className="mt-6 p-6 bg-sage-50 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-deep-brown font-medium">Total Amount</span>
                                <span className="text-2xl font-semibold text-terracotta">
                                    ₹{totalAmount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 