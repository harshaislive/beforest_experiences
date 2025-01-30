-- Phase 1: Basic Setup and Tables
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    features JSONB,
    highlights JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE location_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_hero BOOLEAN DEFAULT false,
    "order" INTEGER,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    total_capacity INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_hero BOOLEAN DEFAULT false,
    "order" INTEGER,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('adult', 'child', 'camping_gear')),
    price DECIMAL NOT NULL,
    description TEXT,
    max_quantity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_food_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    max_quantity INTEGER,
    is_vegetarian BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    total_amount DECIMAL NOT NULL,
    phonepay_transaction_id TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_date TIMESTAMPTZ,
    booking_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE registration_pricing_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    pricing_id UUID REFERENCES event_pricing(id) ON DELETE CASCADE,
    quantity INTEGER CHECK (quantity > 0),
    amount DECIMAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE registration_food_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    food_option_id UUID REFERENCES event_food_options(id) ON DELETE CASCADE,
    quantity INTEGER CHECK (quantity > 0),
    amount DECIMAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE confirmation_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('success_page', 'failure_page', 'email')),
    title TEXT NOT NULL,
    content JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE confirmation_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    example_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE phonepay_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id TEXT NOT NULL,
    salt_key TEXT NOT NULL,
    is_production BOOLEAN DEFAULT false,
    redirect_url TEXT NOT NULL,
    callback_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    transaction_id TEXT UNIQUE NOT NULL,
    amount DECIMAL NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
    payment_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_location ON events(location_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_payment_transactions_registration ON payment_transactions(registration_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);