-- Sample Data for Testing Based on Event Calendar

-- Sample Locations
INSERT INTO locations (id, slug, name, description, features, highlights, is_active) VALUES
(
    '8d2eb5c8-1c3d-4f58-a721-e6b62f7b7ef5',
    'hyderabad',
    'Beforest Hyderabad',
    'Experience sustainable living at our Hyderabad collective, featuring diverse activities from stargazing to farm volunteering.',
    jsonb_build_array(
        'Farm Activities',
        'Stargazing Area',
        'Cow Sanctuary',
        'Nursery'
    ),
    jsonb_build_array(
        jsonb_build_object(
            'title', 'Farm Volunteering',
            'description', 'Engage in hands-on farm work, from tending to cows to nursery activities'
        ),
        jsonb_build_object(
            'title', 'Astronomical Activities',
            'description', 'Perfect dark skies for stargazing and astrophotography sessions'
        )
    ),
    true
),
(
    'f6a7d829-4b2e-4f0b-9c1d-8a3b5e6c7d9e',
    'poomale-coorg',
    'Beforest Poomale, Coorg',
    'Discover the magic of Poomale in Coorg, featuring coffee plantations, stream-side experiences, and rich biodiversity.',
    jsonb_build_array(
        'Coffee Plantations',
        'Stream Access',
        'Butterfly Garden',
        'Nature Trails'
    ),
    jsonb_build_array(
        jsonb_build_object(
            'title', 'Coffee Experience',
            'description', 'Learn about coffee harvesting and sustainable cultivation'
        ),
        jsonb_build_object(
            'title', 'Nature Connection',
            'description', 'Butterfly walks and stream-side picnics in pristine surroundings'
        )
    ),
    true
);

-- Location Images
INSERT INTO location_images (id, location_id, image_url, is_hero, "order", alt_text) VALUES
(
    'a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6d',
    '8d2eb5c8-1c3d-4f58-a721-e6b62f7b7ef5',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    true,
    1,
    'Hyderabad farm and nursery'
),
(
    'b2c3d4e5-f6a7-5b6c-8d9e-2f3a4b5c6d7e',
    '8d2eb5c8-1c3d-4f58-a721-e6b62f7b7ef5',
    'https://images.unsplash.com/photo-1507499739999-097706ad8914',
    false,
    2,
    'Stargazing area at night'
),
(
    'c3d4e5f6-a7b8-6c7d-9e0f-3a4b5c6d7e8f',
    'f6a7d829-4b2e-4f0b-9c1d-8a3b5e6c7d9e',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf',
    true,
    1,
    'Poomale coffee plantation'
),
(
    'd4e5f6a7-b8c9-7d8e-0f1a-4b5c6d7e8f9a',
    'f6a7d829-4b2e-4f0b-9c1d-8a3b5e6c7d9e',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    false,
    2,
    'Stream side picnic area'
);

-- Events (Based on Event Calendar)
INSERT INTO events (id, location_id, slug, title, description, start_date, end_date, total_capacity, current_participants, is_featured, status) VALUES
(
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    '8d2eb5c8-1c3d-4f58-a721-e6b62f7b7ef5',
    'astrophotography-feb-2025',
    'Astrophotography Night',
    'Join us for an immersive astrophotography session. Learn to capture the night sky with expert guidance and professional equipment.',
    '2025-02-25 18:00:00+05:30',
    '2025-02-26 09:00:00+05:30',
    20,
    0,
    true,
    'upcoming'
),
(
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'f6a7d829-4b2e-4f0b-9c1d-8a3b5e6c7d9e',
    'coffee-harvesting-march-2025',
    'Coffee Harvesting Event',
    'Experience the art of coffee harvesting in our sustainable plantation. Perfect for prospects interested in learning about coffee cultivation.',
    '2025-03-07 09:00:00+05:30',
    '2025-03-07 17:00:00+05:30',
    15,
    0,
    true,
    'upcoming'
);

-- Event Images
INSERT INTO event_images (id, event_id, image_url, is_hero, "order", alt_text) VALUES
(
    'a7b8c9d0-e1f2-0a1b-3c4d-7e8f9a0b1c2d',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e',
    true,
    1,
    'Night sky perfect for astrophotography'
),
(
    'b8c9d0e1-f2a3-1b2c-4d5e-8f9a0b1c2d3e',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45',
    false,
    2,
    'Camera setup for night photography'
),
(
    'c9d0e1f2-a3b4-2c3d-5e6f-9a0b1c2d3e4f',
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb',
    true,
    1,
    'Coffee harvesting process'
),
(
    'd0e1f2a3-b4c5-3d4e-6f7a-0b1c2d3e4f5a',
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
    false,
    2,
    'Coffee beans processing'
);

-- Event Pricing
INSERT INTO event_pricing (id, event_id, category, price, description, max_quantity) VALUES
(
    'e1f2a3b4-c5d6-4e5f-7a8b-1c2d3e4f5a6b',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'adult',
    2500,
    'Adult ticket includes photography session, dinner, and breakfast',
    4
),
(
    'f2a3b4c5-d6e7-5f6a-8b9c-2d3e4f5a6b7c',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'camping_gear',
    500,
    'Camera mount and basic equipment rental',
    2
),
(
    'a3b4c5d6-e7f8-6a7b-9c0d-3e4f5a6b7c8d',
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'adult',
    1800,
    'Full day experience with lunch and coffee tasting',
    5
),
(
    'b4c5d6e7-f8a9-7b8c-0d1e-4f5a6b7c8d9e',
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'child',
    900,
    'Child ticket (8-15 years) with lunch',
    5
);

-- Event Food Options
INSERT INTO event_food_options (id, event_id, name, description, price, max_quantity, is_vegetarian) VALUES
(
    'c5d6e7f8-a9b0-8c9d-1e2f-5a6b7c8d9e0f',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'Vegetarian Meals Package',
    'Dinner and breakfast - vegetarian options',
    500,
    10,
    true
),
(
    'd6e7f8a9-b0c1-9d0e-2f3a-6b7c8d9e0f1a',
    'e5f6a7b8-c9d0-8e9f-1a2b-5c6d7e8f9a0b',
    'Non-Vegetarian Meals Package',
    'Dinner and breakfast - non-vegetarian options',
    700,
    10,
    false
),
(
    'e7f8a9b0-c1d2-0e1f-3a4b-7c8d9e0f1a2b',
    'f6a7b8c9-d0e1-9f0a-2b3c-6d7e8f9a0b1c',
    'Traditional Karnataka Thali',
    'Authentic local cuisine with fresh coffee',
    400,
    20,
    true
);

-- Sample Users
INSERT INTO users (id, email, full_name, phone) VALUES
(
    'f8a9b0c1-d2e3-1f2a-4b5c-8d9e0f1a2b3c',
    'test.user1@example.com',
    'Test User One',
    '+919876543210'
),
(
    'a9b0c1d2-e3f4-2a3b-5c6d-9e0f1a2b3c4d',
    'test.user2@example.com',
    'Test User Two',
    '+919876543211'
);

-- Confirmation Templates
INSERT INTO confirmation_templates (id, type, title, content, is_active) VALUES
(
    'b0c1d2e3-f4a5-3b4c-6d7e-0f1a2b3c4d5e',
    'success_page',
    'Booking Confirmed!',
    jsonb_build_object(
        'event_name', null,
        'location', null,
        'date', null,
        'booking_id', null,
        'transaction_id', null,
        'amount', null,
        'customer_name', null,
        'booking_details', jsonb_build_object('pricing', '[]'::jsonb, 'food', '[]'::jsonb)
    ),
    true
),
(
    'c1d2e3f4-a5b6-4c5d-7e8f-1a2b3c4d5e6f',
    'failure_page',
    'Payment Failed',
    jsonb_build_object(
        'event_name', null,
        'event_slug', null,
        'booking_id', null,
        'transaction_id', null,
        'error_message', null
    ),
    true
);

-- PhonePe Configuration (Test Mode)
INSERT INTO phonepay_config (id, merchant_id, salt_key, is_production, redirect_url, callback_url) VALUES
(
    'd2e3f4a5-b6c7-5d6e-8f9a-2b3c4d5e6f7a',
    'M2282MICTQDNO',
    '025d030a-b6e3-4d2c-913a-22b850698c5a',
    false,
    'http://localhost:3000/payment/redirect',
    'http://localhost:3000/api/payment/callback'
);
