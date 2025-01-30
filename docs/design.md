# Design System Documentation

## Color Palette

### Primary Colors
```css
--deep-brown: #2C1810    /* Primary text, buttons */
--terracotta: #A0522D    /* Accents, highlights */
--forest-green: #004D2C  /* Nature elements */
--soft-beige: #F5F1EA    /* Backgrounds */
```

### Secondary Colors
```css
--deep-brown-light: #3D251C    /* Hover states */
--terracotta-light: #C26B3D    /* Secondary accents */
--forest-green-light: #006B3D  /* Secondary nature elements */
--text-primary: #2C1810        /* Main text */
--text-secondary: #635D57      /* Secondary text */
```

## Typography

### Headings
```css
.heading-xl {
  font-size: 3rem;      /* 48px */
  line-height: 1.2;
  font-weight: 700;
  @media (min-width: 768px) {
    font-size: 4.5rem;  /* 72px */
  }
}

.heading-lg {
  font-size: 2.25rem;   /* 36px */
  font-weight: 700;
}

.heading-md {
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
}
```

### Body Text
```css
.body-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.7;
}

.body-md {
  font-size: 1rem;      /* 16px */
  line-height: 1.7;
}
```

## Components

### Buttons
```css
.btn-primary {
  background: var(--deep-brown);
  color: var(--soft-beige);
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-secondary {
  background: var(--soft-beige);
  color: var(--deep-brown);
  border: 2px solid var(--deep-brown);
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

## Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

## Assets

### Fonts
- Primary: Inter
- Headings: Clash Display
- Accents: Playfair Display

### Icons
- Using Phosphor Icons
- Consistent 24px size
- Stroke width: 2px

## Best Practices

1. **Consistency**
   - Use design tokens for colors
   - Maintain consistent spacing
   - Follow typography scale

2. **Accessibility**
   - Maintain WCAG 2.1 AA standards
   - Ensure sufficient color contrast
   - Provide focus states

3. **Performance**
   - Optimize images
   - Minimize CSS
   - Use system fonts when possible 