-- Phase 3: Security Policies and Roles

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_pricing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_food_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE phonepay_config ENABLE ROW LEVEL SECURITY;

-- Location Policies
CREATE POLICY "Public can view active locations"
    ON locations FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin can manage locations"
    ON locations FOR ALL
    USING (auth.role() = 'admin');

CREATE POLICY "Public can view location images"
    ON location_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM locations
            WHERE locations.id = location_images.location_id
            AND locations.is_active = true
        )
    );

CREATE POLICY "Admin can manage location images"
    ON location_images FOR ALL
    USING (auth.role() = 'admin');

-- Event Policies
CREATE POLICY "Public can view upcoming events"
    ON events FOR SELECT
    USING (status = 'upcoming' OR start_date > NOW());

CREATE POLICY "Admin can manage events"
    ON events FOR ALL
    USING (auth.role() = 'admin');

CREATE POLICY "Public can view event images"
    ON event_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_images.event_id
            AND events.status = 'upcoming'
        )
    );

CREATE POLICY "Admin can manage event images"
    ON event_images FOR ALL
    USING (auth.role() = 'admin');

CREATE POLICY "Public can view event pricing"
    ON event_pricing FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_pricing.event_id
            AND events.status = 'upcoming'
        )
    );

CREATE POLICY "Admin can manage event pricing"
    ON event_pricing FOR ALL
    USING (auth.role() = 'admin');

CREATE POLICY "Public can view food options"
    ON event_food_options FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_food_options.event_id
            AND events.status = 'upcoming'
        )
    );

CREATE POLICY "Admin can manage food options"
    ON event_food_options FOR ALL
    USING (auth.role() = 'admin');

-- User Policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can create profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can manage users"
    ON users FOR ALL
    USING (auth.role() = 'admin');

-- Registration Policies
CREATE POLICY "Users can view own registrations"
    ON registrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations"
    ON registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage registrations"
    ON registrations FOR ALL
    USING (auth.role() = 'admin');

CREATE POLICY "Users can view own registration details"
    ON registration_pricing_details FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM registrations
            WHERE registrations.id = registration_pricing_details.registration_id
            AND registrations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own food details"
    ON registration_food_details FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM registrations
            WHERE registrations.id = registration_food_details.registration_id
            AND registrations.user_id = auth.uid()
        )
    );

-- Payment Policies
CREATE POLICY "Users can view own payments"
    ON payment_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM registrations
            WHERE registrations.id = payment_transactions.registration_id
            AND registrations.user_id = auth.uid()
        )
    );

CREATE POLICY "System can create payments"
    ON payment_transactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update payments"
    ON payment_transactions FOR UPDATE
    USING (true);

CREATE POLICY "Admin can manage payments"
    ON payment_transactions FOR ALL
    USING (auth.role() = 'admin');

-- Template Policies
CREATE POLICY "Public can view active templates"
    ON confirmation_templates FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admin can manage templates"
    ON confirmation_templates FOR ALL
    USING (auth.role() = 'admin');

-- PhonePe Config Policies
CREATE POLICY "System can view phonepay config"
    ON phonepay_config FOR SELECT
    USING (true);

CREATE POLICY "Admin can manage phonepay config"
    ON phonepay_config FOR ALL
    USING (auth.role() = 'admin');

-- Create Roles
-- Note: These need to be run as superuser
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role;
    END IF;
END
$$;

-- Grant Permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO admin;

GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT ON locations, events, event_images, event_pricing, event_food_options TO authenticated;
GRANT SELECT, INSERT ON registrations, registration_pricing_details, registration_food_details TO authenticated;
GRANT SELECT ON payment_transactions, confirmation_templates TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
