-- Homepage Statistics Table
CREATE TABLE homepage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR,
    icon_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact Metrics Table
CREATE TABLE impact_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR,
    description TEXT,
    icon_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles Table
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta_title VARCHAR,
    meta_description TEXT,
    tags TEXT[]
);

-- Sample Data for Homepage Stats
INSERT INTO homepage_stats (title, value, unit, icon_url, order_index) VALUES
('Forest Area', 1000, 'acres', 'https://source.unsplash.com/100x100/?forest', 1),
('Communities', 5, null, 'https://source.unsplash.com/100x100/?community', 2),
('Residents', 250, 'families', 'https://source.unsplash.com/100x100/?family', 3),
('Organic Farms', 15, null, 'https://source.unsplash.com/100x100/?farm', 4);

-- Sample Data for Impact Metrics
INSERT INTO impact_metrics (category, value, unit, description, icon_url, order_index) VALUES
('Carbon Offset', 5000, 'tons', 'Annual carbon dioxide offset through our forest preservation efforts', 'https://source.unsplash.com/100x100/?carbon', 1),
('Water Conservation', 1000000, 'liters', 'Water saved annually through sustainable farming practices', 'https://source.unsplash.com/100x100/?water', 2),
('Organic Produce', 25, 'tons', 'Organic produce grown annually across all communities', 'https://source.unsplash.com/100x100/?organic', 3),
('Wildlife Species', 100, null, 'Different wildlife species protected in our forests', 'https://source.unsplash.com/100x100/?wildlife', 4);

-- Sample Articles
INSERT INTO articles (title, slug, summary, content, image_url, is_featured, status, published_at) VALUES
('Living in Harmony with Nature', 'living-in-harmony-with-nature', 
'Discover how our community members are building sustainable lifestyles in harmony with nature.', 
'[Insert detailed article content here...]',
'https://source.unsplash.com/800x600/?nature', 
true, 'published', NOW()),

('Sustainable Farming Practices', 'sustainable-farming-practices',
'Learn about the organic farming methods we use to grow healthy, sustainable produce.',
'[Insert detailed article content here...]',
'https://source.unsplash.com/800x600/?farming',
true, 'published', NOW()),

('Building Community Through Nature', 'building-community-through-nature',
'How shared values and connection to nature strengthen our community bonds.',
'[Insert detailed article content here...]',
'https://source.unsplash.com/800x600/?community',
true, 'published', NOW());

-- Update function for timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for timestamp updates
CREATE TRIGGER update_homepage_stats_timestamp
    BEFORE UPDATE ON homepage_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_impact_metrics_timestamp
    BEFORE UPDATE ON impact_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_articles_timestamp
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Add RLS policies
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users
CREATE POLICY "Allow read access for all users" ON homepage_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON impact_metrics
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Allow read access for all users" ON articles
    FOR SELECT USING (status = 'published');

-- Write access only for authenticated admins
CREATE POLICY "Allow write access for admins" ON homepage_stats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Allow write access for admins" ON impact_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Allow write access for admins" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );
