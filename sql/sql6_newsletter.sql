-- Create newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    source TEXT CHECK (source IN ('footer', 'registration', 'other')),
    registration_id UUID REFERENCES registrations(id),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_subscriptions_registration ON newsletter_subscriptions(registration_id);

-- Create RLS policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (subscribe)
CREATE POLICY "Allow anonymous users to subscribe" ON newsletter_subscriptions
    FOR INSERT 
    WITH CHECK (true);

-- Allow service role to manage all
CREATE POLICY "Allow service role to manage all" ON newsletter_subscriptions
    USING (auth.role() = 'service_role'); 