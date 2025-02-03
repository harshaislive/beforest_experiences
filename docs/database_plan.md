Here's a detailed database schema for Beforest's website, designed to support their CMS requirements with flexibility for customizable events and locations:

```sql
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    features JSONB,
    highlights JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location_images (
    image_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    is_hero BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    total_capacity INT NOT NULL,
    current_participants INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_images (
    image_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    is_hero BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_pricing (
    pricing_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('adult', 'child', 'camping_gear')),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    max_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_food_options (
    food_option_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    max_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration_pricing_details (
    detail_id SERIAL PRIMARY KEY,
    registration_id INT REFERENCES registrations(registration_id) ON DELETE CASCADE,
    pricing_id INT REFERENCES event_pricing(pricing_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration_food_details (
    detail_id SERIAL PRIMARY KEY,
    registration_id INT REFERENCES registrations(registration_id) ON DELETE CASCADE,
    food_option_id INT REFERENCES event_food_options(food_option_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**

1. **Flexible Event Configuration**
- Multiple pricing categories (adult/child/camping)
- Custom food options with quantity limits
- Dynamic capacity management with participant tracking

2. **Media Management**
- 5+ images per location/event with hero image support
- Separate tables for location and event images

3. **Payment Integration**
- PhonePe transaction tracking
- Payment status management
- Detailed price calculation tracking

4. **Customizable Registration**
- Multiple pricing options per registration
- Food selection tracking
- Capacity validation through application logic

5. **Analytics Support**
- User participation tracking
- Revenue tracking through pricing details
- Event popularity metrics

**CMS Structure Overview**

1. **Locations CMS**
- Manage location details, features, and images
- Capacity for rich text descriptions and highlights
- SEO-friendly slugs for URLs

2. **Events CMS**
- Event creation with multiple configurable options:
  - Pricing tiers (adult/child/camping)
  - Food options with individual pricing
  - Image galleries with hero image selection
  - Capacity management
  - Date/time configuration

3. **Registration System**
- Dynamic price calculation based on selections
- Payment gateway integration points
- Confirmation page generation with transaction details

**Implementation Notes:**

1. **Capacity Management**
- Use database triggers or application logic to update `current_participants`
- Implement concurrency control for registration transactions

2. **Payment Flow**
- Generate payment links dynamically based on selected options
- Handle webhooks from PhonePe for payment confirmation
- Update registration status and send confirmation emails

3. **Image Handling**
- Implement CDN integration for image storage
- Add ordering field for image display sequence
- Support multiple image formats and optimizations

4. **Security Considerations**
- Encrypt sensitive payment information
- Implement rate limiting on registration endpoints
- Use prepared statements to prevent SQL injection

This schema provides a robust foundation for building a flexible events management system while maintaining scalability and supporting Beforest's unique requirements for regenerative community events.