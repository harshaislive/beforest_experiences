interface WelcomeStepProps {
    eventTitle: string;
    onNext: () => void;
}

export default function WelcomeStep({ eventTitle, onNext }: WelcomeStepProps) {
    return (
        <div className="text-center">
            <h3 className="text-3xl font-bold text-deep-brown mb-6">
                Welcome to {eventTitle}
            </h3>
            <p className="text-lg text-deep-brown/70 mb-8">
                Let&apos;s get you signed up for this amazing experience. It&apos;ll take just a few minutes.
            </p>
            <button
                onClick={onNext}
                className="btn-primary text-lg px-8 py-4"
            >
                Let&apos;s Begin
            </button>
        </div>
    );
} 