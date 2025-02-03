# Brand Colors Integration Plan

## Phase 1: Setup (Foundation)

### 1. Global CSS Variables
- Create `styles/variables.css`
- Define all brand colors as CSS variables
- Import in `globals.css`
- Add color opacity variants (e.g., `--terracotta-90`, `--deep-brown-80`)

### 2. Tailwind Configuration
- Update `tailwind.config.js`
- Add brand colors to the theme
- Create semantic color mappings (e.g., `primary`, `secondary`, `accent`)
- Add opacity variants

## Phase 2: Component Updates

### 1. Navigation & Header
- Primary navigation: Deep Brown
- Active states: Terracotta
- Dropdown menus: White with Soft Beige accents
- Mobile menu: Deep Brown background

### 2. Hero Sections
- Location Hero: Forest Green gradient with Sage accents
- Event Hero: Deep Brown gradient with Soft Beige text
- Homepage Hero: Navy with Sky Blue accents

### 3. Cards & Content
- Event Cards:
  - Background: White
  - Title: Deep Brown
  - Description: Dark Brown (80% opacity)
  - CTAs: Terracotta
  
- Location Cards:
  - Background: White
  - Title: Deep Brown
  - Features: Forest Green
  - Accents: Sage

### 4. Interactive Elements
- Primary Buttons:
  - Default: Terracotta
  - Hover: Dark Terracotta
  - Disabled: Gray
  
- Secondary Buttons:
  - Default: Deep Brown
  - Hover: Dark Brown
  - Outline variant: Current color with transparency

- Forms:
  - Input borders: Deep Brown (20% opacity)
  - Focus states: Terracotta
  - Success: Forest Green
  - Error: Coral

## Phase 3: Page-Specific Updates

### 1. Homepage
- Hero section: Navy + Sky Blue
- Featured events: White + Terracotta CTAs
- Location showcase: Forest Green + Sage
- Newsletter: Deep Brown + Soft Beige

### 2. Events Pages
- Listing page: Soft Beige background
- Event details: White sections
- Booking modal: White + Terracotta
- Success states: Sage
- Error states: Coral

### 3. Location Pages
- Overview: Forest Green + Sage
- Features: White cards
- Events section: Soft Beige background
- Gallery: Deep Brown overlays

## Phase 4: Implementation Strategy

### 1. Component Audit
- List all components
- Document current color usage
- Identify components for update

### 2. Update Priority
1. Global styles & variables
2. Primary CTAs & navigation
3. Hero sections
4. Cards & content blocks
5. Forms & interactive elements
6. Page-specific styles

### 3. Testing Checklist
- Color contrast (WCAG compliance)
- Dark/Light mode compatibility
- Mobile responsiveness
- Cross-browser testing
- A11y validation

### 4. Documentation Updates
- Update component documentation
- Add color usage examples
- Create color combination guidelines
- Document accessibility considerations

## Phase 5: Quality Assurance

### 1. Visual Regression Testing
- Capture before/after screenshots
- Compare layouts
- Verify spacing and hierarchy

### 2. Accessibility Testing
- Color contrast ratios
- Text readability
- Focus states
- Screen reader compatibility

### 3. Performance Impact
- CSS bundle size
- Runtime performance
- Loading performance

## Rollout Strategy

1. Create feature branch
2. Implement changes component by component
3. Regular visual reviews
4. Staged deployments
5. Gradual rollout to production 