-- Enable RLS on all relevant tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to all tables
CREATE POLICY "service_role_locations_policy" ON locations 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_events_policy" ON events 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_registrations_policy" ON registrations 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_users_policy" ON users 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Allow anonymous access for test registration
CREATE POLICY "anon_test_locations_policy" ON locations 
    FOR SELECT 
    USING (true);

CREATE POLICY "anon_test_events_policy" ON events 
    FOR SELECT 
    USING (true);

CREATE POLICY "anon_test_registrations_policy" ON registrations 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "anon_test_users_policy" ON users 
    FOR SELECT 
    USING (true);

-- Grant necessary permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO service_role; 