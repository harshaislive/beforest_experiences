# Components Organization

This directory contains both global reusable components and page-specific components.

## Global Components (`/global`)

These components are designed to be reused across different pages and features:

### Layout Components (`/global/layout`)
- `Header`: Main navigation header
  - Responsive navigation menu
  - Authentication state handling
  - Dynamic upcoming event display
- `Footer`: Site-wide footer
  - Destination links
  - Social media links
  - Newsletter signup
  - Used in MainLayout for consistent page structure

### Events Components (`/global/Events`)
- `EventCard`: Displays event information in various layouts
  - Used in: events listing page, homepage sections, location pages
  - Props support different variants and display options

### Locations Components (`/global/Locations`)
- `LocationCard`: Displays location information
  - Used in: homepage, location listings, search results
  - Supports events integration

### Registration Components (`/global/Registration`)
- `PricingSelector`: Handles event pricing selection
- `FoodOptions`: Manages food preferences
- `Summary`: Shows booking summary
- Used across the event booking flow

### Confirmation Components (`/global/Confirmation`)
- `TemplateRenderer`: Renders dynamic confirmation templates
- Used in: success pages, emails, notifications

## Page-Specific Components

These components are designed for specific pages or sections:

### Homepage Components (`/homepage`)
- Layout components specific to the homepage design
- Includes: HeroSection, ExperienceSection, etc.
- While these are page-specific, they use global components internally

## Best Practices

1. **Component Reusability**:
   - Before creating a new component, check if an existing one can be adapted
   - Use props to make components flexible and reusable

2. **Component Organization**:
   - Global components go in feature-specific directories under `/global`
   - Page-specific components go in page directories (e.g., `/homepage`)

3. **Type Safety**:
   - All components should use TypeScript interfaces for props
   - Import types from `@/lib/types.ts`

4. **Styling**:
   - Use Tailwind CSS classes
   - Keep styles consistent across different usages of the same component
   - Use variants prop for different visual styles

5. **Data Fetching**:
   - Components should receive data as props
   - Data fetching logic belongs in page components or server components
   - Use loading states and error handling

6. **Layout Components**:
   - Use MainLayout for consistent page structure
   - Header and Footer components handle their own state
   - Responsive design considerations built-in
