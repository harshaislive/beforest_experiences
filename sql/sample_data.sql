-- Sample data based on Event Calendar

-- Locations
INSERT INTO locations (id, slug, name, description, features, highlights, is_active) VALUES
(
    'df89c1f0-6a0f-4164-a4e7-dc6ff4871d2b',
    'hyderabad',
    'Beforest Hyderabad',
    'Experience sustainable living at our Hyderabad collective with a diverse range of activities from stargazing to farm volunteering.',
    jsonb_build_array(
        'Farm Activities',
        'Stargazing Area',
        'Cow Sanctuary',
        'Nursery'
    ),
    jsonb_build_array(
        jsonb_build_object(
            'title', 'Farm Volunteering',
            'description', 'Engage in hands-on farm activities, from tending to cows to nursery work'
        ),
        jsonb_build_object(
            'title', 'Astronomical Experiences',
            'description', 'Perfect dark skies for stargazing and astrophotography'
        )
    ),
    true
),
(
    '7a6c8e2d-4b5f-4e3a-8d1c-9b2e3f4c5d6a',
    'coorg',
    'Beforest Coorg',
    'Discover the magic of Poomale and Hammiyala in Coorg, featuring coffee plantations and pristine streams.',
    jsonb_build_array(
        'Coffee Plantations',
        'Stream Access',
        'Butterfly Garden',
        'Nature Trails'
    ),
    jsonb_build_array(
        jsonb_build_object(
            'title', 'Coffee Experience',
            'description', 'Learn about coffee harvesting and processing in our sustainable plantations'
        ),
        jsonb_build_object(
            'title', 'Stream Side Activities',
            'description', 'Enjoy picnics and activities by pristine mountain streams'
        )
    ),
    true
);

-- Location Images
INSERT INTO location_images (id, location_id, image_url, is_hero, "order", alt_text) VALUES
(
    'img_hyd_1',
    'df89c1f0-6a0f-4164-a4e7-dc6ff4871d2b',
    'https://images.unsplash.com/photo-1530076886461-ce58ea8abe24',
    true,
    1,
    'Hyderabad collective farm view'
),
(
    'img_hyd_2',
    'df89c1f0-6a0f-4164-a4e7-dc6ff4871d2b',
    'https://images.unsplash.com/photo-1500076656116-558758c991c1',
    false,
    2,
    'Stargazing area at night'
),
(
    'img_coorg_1',
    '7a6c8e2d-4b5f-4e3a-8d1c-9b2e3f4c5d6a',
    'https://images.unsplash.com/photo-1598322974025-2692520ee86f',
    true,
    1,
    'Coorg coffee plantation'
),
(
    'img_coorg_2',
    '7a6c8e2d-4b5f-4e3a-8d1c-9b2e3f4c5d6a',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
    false,
    2,
    'Stream side picnic area'
);

-- Events
INSERT INTO events (id, location_id, slug, title, description, start_date, end_date, total_capacity, current_participants, is_featured, status) VALUES
(
    'evt_stargazing',
    'df89c1f0-6a0f-4164-a4e7-dc6ff4871d2b',
    'stargazing-night-february',
    'Stargazing Night',
    'Camp under the stars and learn constellations with an expert guide. Perfect for families and astronomy enthusiasts. Experience the beauty of the night sky while enjoying comfortable camping facilities.',
    '2024-02-01 18:00:00+05:30',
    '2024-02-02 09:00:00+05:30',
    30,
    0,
    true,
    'upcoming'
),
(
    'evt_coffee',
    '7a6c8e2d-4b5f-4e3a-8d1c-9b2e3f4c5d6a',
    'coffee-harvesting-february',
    'Coffee Harvesting Event',
    'Join us for a unique coffee harvesting experience at our Coorg collective. Learn about sustainable coffee cultivation, harvesting techniques, and enjoy freshly brewed coffee.',
    '2024-02-07 09:00:00+05:30',
    '2024-02-07 17:00:00+05:30',
    20,
    0,
    true,
    'upcoming'
);

-- Event Images
INSERT INTO event_images (id, event_id, image_url, is_hero, "order", alt_text) VALUES
(
    'img_star_1',
    'evt_stargazing',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    true,
    1,
    'Starry night sky view'
),
(
    'img_star_2',
    'evt_stargazing',
    'https://images.unsplash.com/photo-1532978379173-523e16f371f9',
    false,
    2,
    'Camping setup under stars'
),
(
    'img_coffee_1',
    'evt_coffee',
    'https://images.unsplash.com/photo-1611174243622-4f7a6898f847',
    true,
    1,
    'Coffee harvesting activity'
),
(
    'img_coffee_2',
    'evt_coffee',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    false,
    2,
    'Coffee processing demonstration'
);

-- Event Pricing
INSERT INTO event_pricing (id, event_id, category, price, description, max_quantity) VALUES
(
    'price_star_adult',
    'evt_stargazing',
    'adult',
    2500,
    'Adult ticket includes dinner, breakfast, and camping gear',
    4
),
(
    'price_star_child',
    'evt_stargazing',
    'child',
    1500,
    'Child ticket (8-15 years) includes meals and activities',
    4
),
(
    'price_coffee_adult',
    'evt_coffee',
    'adult',
    1800,
    'Full day experience with lunch and coffee tasting',
    5
),
(
    'price_coffee_child',
    'evt_coffee',
    'child',
    900,
    'Child ticket (8-15 years) with lunch',
    5
);

-- Event Food Options
INSERT INTO event_food_options (id, event_id, name, description, price, max_quantity, is_vegetarian) VALUES
(
    'food_star_veg',
    'evt_stargazing',
    'Vegetarian Meals Package',
    'Dinner and breakfast - vegetarian options',
    500,
    10,
    true
),
(
    'food_star_nonveg',
    'evt_stargazing',
    'Non-Vegetarian Meals Package',
    'Dinner and breakfast - non-vegetarian options',
    700,
    10,
    false
),
(
    'food_coffee_lunch',
    'evt_coffee',
    'Traditional Karnataka Thali',
    'Authentic local cuisine with coffee',
    400,
    20,
    true
);

-- Sample Users
INSERT INTO users (id, email, full_name, phone) VALUES
(
    'usr_john',
    'john.doe@example.com',
    'John Doe',
    '+91123456789'
),
(
    'usr_jane',
    'jane.smith@example.com',
    'Jane Smith',
    '+91987654321'
);

-- Confirmation Templates
INSERT INTO confirmation_templates (id, type, title, content, is_active) VALUES
(
    'tmpl_success',
    'success_page',
    'Booking Confirmed!',
    jsonb_build_object(
        'event_name', '',
        'location', '',
        'date', '',
        'booking_id', '',
        'transaction_id', '',
        'amount', '',
        'customer_name', '',
        'booking_details', jsonb_build_object('pricing', '[]'::jsonb, 'food', '[]'::jsonb)
    ),
    true
),
(
    'tmpl_failure',
    'failure_page',
    'Payment Failed',
    jsonb_build_object(
        'event_name', '',
        'event_slug', '',
        'booking_id', '',
        'transaction_id', '',
        'error_message', ''
    ),
    true
);

-- PhonePe Configuration
INSERT INTO phonepay_config (id, merchant_id, salt_key, is_production, redirect_url, callback_url) VALUES
(
    'phonepe_config_1',
    'BEFORESTTEST',
    'test_salt_key',
    false,
    'http://localhost:3000/payment/redirect',
    'http://localhost:3000/api/payment/callback'
);

-- Sample Registrations (Optional - only if you want to test with existing bookings)
INSERT INTO registrations (id, user_id, event_id, total_amount, payment_status, booking_details) VALUES
(
    'reg_sample',
    'usr_john',
    'evt_stargazing',
    3700,
    'completed',
    jsonb_build_object(
        'pricing', jsonb_build_array(
            jsonb_build_object(
                'pricing_id', 'price_star_adult',
                'quantity', 1,
                'amount', 2500
            )
        ),
        'food', jsonb_build_array(
            jsonb_build_object(
                'food_option_id', 'food_star_veg',
                'quantity', 1,
                'amount', 500
            ),
            jsonb_build_object(
                'food_option_id', 'food_star_nonveg',
                'quantity', 1,
                'amount', 700
            )
        )
    )
);

-- Sample Payment Transaction
INSERT INTO payment_transactions (id, registration_id, transaction_id, amount, status, payment_response) VALUES
(
    'tr_sample',
    'reg_sample',
    'PHONEPE_123456',
    3700,
    'completed',
    jsonb_build_object(
        'code', 'PAYMENT_SUCCESS',
        'message', 'Payment successful',
        'transactionId', 'PHONEPE_123456'
    )
);

-- Insert registration details
INSERT INTO registration_pricing_details (registration_id, pricing_id, quantity, amount) VALUES
('reg_sample', 'price_star_adult', 1, 2500);

INSERT INTO registration_food_details (registration_id, food_option_id, quantity, amount) VALUES
('reg_sample', 'food_star_veg', 1, 500),
('reg_sample', 'food_star_nonveg', 1, 700);