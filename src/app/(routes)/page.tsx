import {
    HeroSection,
    NearestEventSection,
    ExperienceSection,
    CommunitySection,
    LocationsSection,
    UpcomingExperiencesSection,
    SeasonalSection,
    TestimonialSection,
    CallToAction
} from '@/components/homepage';
import { siteConfig } from '@/lib/config';

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            {siteConfig.homepage.showNearestEvent && <NearestEventSection />}
            <LocationsSection />
            <UpcomingExperiencesSection />
            <ExperienceSection />
            <CommunitySection />
            <SeasonalSection />
            <TestimonialSection />
            <CallToAction />
        </main>
    );
}
