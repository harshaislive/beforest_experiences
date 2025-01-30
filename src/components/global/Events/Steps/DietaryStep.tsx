interface DietaryStepProps {
    dietaryRestrictions: string;
    onUpdate: (value: string) => void;
}

export default function DietaryStep({
    dietaryRestrictions,
    onUpdate
}: DietaryStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-deep-brown">
                Do you have any dietary restrictions?
            </h3>
            <textarea
                value={dietaryRestrictions}
                onChange={(e) => onUpdate(e.target.value)}
                placeholder="Tell us about any allergies or dietary restrictions"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracotta focus:border-transparent h-32"
            />
            <p className="text-sm text-deep-brown/70">
                This information helps us ensure your comfort and safety during the event.
            </p>
        </div>
    );
} 