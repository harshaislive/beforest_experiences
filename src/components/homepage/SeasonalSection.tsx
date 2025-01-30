import { SeasonalActivities } from '@/components/homepage';

export default function SeasonalSection() {
    return (
        <section className="py-20 bg-soft-beige">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-deep-brown mb-16">
                    Experience Every Season
                </h2>
                <SeasonalActivities />
            </div>
        </section>
    );
}
