-- Create event_itinerary table to store event schedules
CREATE TABLE event_itinerary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    time TIME NOT NULL,
    activity TEXT NOT NULL,
    description TEXT,
    duration INTERVAL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster event_id lookups
CREATE INDEX idx_event_itinerary_event ON event_itinerary(event_id);

-- Itinerary for Astrophotography Night
INSERT INTO event_itinerary (event_id, time, activity, description, "order") VALUES
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '18:00'::time, 
    'Arrival and Setup', 
    'Equipment check and initial camera settings', 
    1
),
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '19:00'::time, 
    'Introduction to Astrophotography', 
    'Expert-led session on night sky photography techniques', 
    2
),
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '20:00'::time, 
    'Practical Shooting Session', 
    'Hands-on photography with professional guidance', 
    3
),
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '22:00'::time, 
    'Image Processing Workshop', 
    'Learn post-processing techniques for astrophotography', 
    4
),
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '00:30'::time, 
    'Night Sky Observation', 
    'Telescope viewing and constellation identification', 
    5
),
(
    (SELECT id FROM events WHERE slug = 'astrophotography-jan-2024'),
    '02:30'::time, 
    'Wrap-up and Q&A', 
    'Final discussion and photography review', 
    6
);

-- Itinerary for Coffee Harvesting Event
INSERT INTO event_itinerary (event_id, time, activity, description, "order") VALUES
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '09:00'::time, 
    'Welcome and Introduction', 
    'Meet local farmers and learn about coffee cultivation', 
    1
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '09:30'::time, 
    'Farm Tour', 
    'Guided tour of coffee plantations', 
    2
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '11:00'::time, 
    'Harvesting Demonstration', 
    'Hands-on coffee bean picking techniques', 
    3
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '13:00'::time, 
    'Lunch Break', 
    'Traditional Karnataka Thali', 
    4
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '14:30'::time, 
    'Coffee Processing Workshop', 
    'Learn about coffee processing from bean to cup', 
    5
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '16:00'::time, 
    'Coffee Tasting', 
    'Cupping session with local coffee experts', 
    6
),
(
    (SELECT id FROM events WHERE slug = 'coffee-harvesting-february-2024'),
    '17:00'::time, 
    'Closing Remarks', 
    'Wrap-up and farewell', 
    7
);