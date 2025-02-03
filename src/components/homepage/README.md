# Homepage Components

This directory contains all the components for the Beforest homepage, organized into sections and individual components.

## Section Components

Each section is a self-contained unit that includes its own data and styling:

- `HeroSection`: Full-width hero with background video/image
- `ExperienceSection`: Showcases core experiences using ExperienceCard components
- `CommunitySection`: Grid layout of daily community activities
- `LocationsSection`: Grid of available locations with dynamic event data
- `SeasonalSection`: Interactive section showing activities across seasons
- `TestimonialSection`: Carousel of community testimonials
- `CallToAction`: Final section encouraging user engagement

## Individual Components

Reusable components used within sections:

- `ExperienceCard`: Card component for showcasing experiences
- `CommunityGlimpses`: Grid layout for community activities
- `SeasonalActivities`: Interactive seasonal activities display

## Data Management

- Static content is maintained within each component for better encapsulation
- Dynamic data (events, locations, testimonials) is fetched within respective sections
- Each section handles its own loading and error states

## Styling

- Uses Tailwind CSS for consistent styling
- Maintains a cohesive color scheme with variables:
  - `deep-brown`
  - `terracotta`
  - `soft-beige`
- Responsive design with mobile-first approach

## Usage

Import section components directly in page.tsx:

```tsx
import {
    HeroSection,
    ExperienceSection,
    CommunitySection,
    LocationsSection,
    SeasonalSection,
    TestimonialSection,
    CallToAction
} from '@/components/homepage';

export default function HomePage() {
    return (
        <MainLayout>
            <HeroSection />
            <ExperienceSection />
            <CommunitySection />
            <LocationsSection />
            <SeasonalSection />
            <TestimonialSection />
            <CallToAction />
        </MainLayout>
    );
}
