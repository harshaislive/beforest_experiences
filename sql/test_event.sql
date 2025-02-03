-- Declare variables to store UUIDs
DO $$ 
DECLARE 
    event_id UUID;
    img1_id UUID;
    img2_id UUID;
    price1_id UUID;
    price2_id UUID;
    price3_id UUID;
    food1_id UUID;
    food2_id UUID;
BEGIN

-- Generate UUIDs
event_id := uuid_generate_v4();
img1_id := uuid_generate_v4();
img2_id := uuid_generate_v4();
price1_id := uuid_generate_v4();
price2_id := uuid_generate_v4();
price3_id := uuid_generate_v4();
food1_id := uuid_generate_v4();
food2_id := uuid_generate_v4();

-- Insert test event for Hyderabad location
INSERT INTO events (
    id,
    location_id,
    slug,
    title,
    description,
    start_date,
    end_date,
    total_capacity,
    current_participants,
    is_featured,
    status
) VALUES (
    event_id,
    '8d2eb5c8-1c3d-4f58-a721-e6b62f7b7ef5', -- Hyderabad location ID
    'star-gazing-workshop-feb-2025',
    'Star Gazing Workshop Under Dark Skies',
    'Join us for an immersive star gazing workshop under the pristine dark skies of Hyderabad BeForest. Learn constellation spotting, telescope handling, and capture the beauty of the night sky.',
    '2025-02-15 19:00:00+05:30',  -- Future date
    '2025-02-16 06:00:00+05:30',
    25,
    0,
    true,
    'upcoming'  -- Explicitly set as upcoming
);

-- Add event images
INSERT INTO event_images (
    id,
    event_id,
    image_url,
    is_hero,
    "order",
    alt_text
) VALUES 
(
    img1_id,
    event_id,
    'https://images.unsplash.com/photo-1539593395743-7da5ee10ff07',
    true,
    1,
    'Beautiful night sky with stars'
),
(
    img2_id,
    event_id,
    'https://images.unsplash.com/photo-1520034475321-cbe63696469a',
    false,
    2,
    'Telescope setup for stargazing'
);

-- Add event pricing
INSERT INTO event_pricing (
    id,
    event_id,
    category,
    price,
    description,
    max_quantity
) VALUES 
(
    price1_id,
    event_id,
    'adult',
    2500,
    'Adult ticket includes guided session, dinner, and breakfast',
    4
),
(
    price2_id,
    event_id,
    'child',
    1500,
    'Child ticket (8-15 years) includes guided session and meals',
    4
),
(
    price3_id,
    event_id,
    'camping_gear',
    500,
    'Sleeping bag and camping mat rental',
    2
);

-- Add food options
INSERT INTO event_food_options (
    id,
    event_id,
    name,
    description,
    price,
    max_quantity,
    is_vegetarian
) VALUES 
(
    food1_id,
    event_id,
    'Vegetarian Dinner & Breakfast Package',
    'Traditional Indian vegetarian thali for dinner and breakfast',
    600,
    10,
    true
),
(
    food2_id,
    event_id,
    'Non-Vegetarian Dinner & Breakfast Package',
    'Traditional Indian non-vegetarian thali for dinner and breakfast',
    800,
    10,
    false
);

END $$;
