-- Required Environment Variables and previous table creation statements remain the same

-- Create function to check event capacity
CREATE OR REPLACE FUNCTION check_event_capacity(
    p_event_id UUID,
    p_pricing_details JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    v_total_participants INTEGER := 0;
    v_current_capacity INTEGER;
    v_max_capacity INTEGER;
    r RECORD;
BEGIN
    -- Calculate total new participants
    FOR r IN SELECT * FROM jsonb_array_elements(p_pricing_details)
    LOOP
        v_total_participants := v_total_participants + (r.value->>'quantity')::INTEGER;
    END LOOP;

    -- Get current and max capacity
    SELECT current_participants, total_capacity
    INTO v_current_capacity, v_max_capacity
    FROM events
    WHERE id = p_event_id;

    -- Check if capacity would be exceeded
    RETURN (v_current_capacity + v_total_participants) <= v_max_capacity;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate registration amount
CREATE OR REPLACE FUNCTION calculate_registration_amount(
    p_pricing_details JSONB,
    p_food_details JSONB
)
RETURNS DECIMAL AS $$
DECLARE
    v_total DECIMAL := 0;
    v_price DECIMAL;
    r RECORD;
BEGIN
    -- Calculate pricing total
    FOR r IN SELECT * FROM jsonb_array_elements(p_pricing_details)
    LOOP
        SELECT price INTO v_price
        FROM event_pricing
        WHERE id = (r.value->>'pricing_id')::UUID;

        v_total := v_total + v_price * (r.value->>'quantity')::INTEGER;
    END LOOP;

    -- Calculate food total
    IF p_food_details IS NOT NULL THEN
        FOR r IN SELECT * FROM jsonb_array_elements(p_food_details)
        LOOP
            SELECT price INTO v_price
            FROM event_food_options
            WHERE id = (r.value->>'food_option_id')::UUID;

            v_total := v_total + v_price * (r.value->>'quantity')::INTEGER;
        END LOOP;
    END IF;

    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to increment event participants
CREATE OR REPLACE FUNCTION increment_event_participants(
    p_event_id UUID,
    p_count INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE events
    SET current_participants = current_participants + p_count
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql;

-- Create registration function
CREATE OR REPLACE FUNCTION create_event_registration(
    p_user_id UUID,
    p_event_id UUID,
    p_pricing_details JSONB,
    p_food_details JSONB
)
RETURNS UUID AS $$
DECLARE
    v_registration_id UUID;
    v_total_amount DECIMAL := 0;
    r RECORD;
BEGIN
    -- Start transaction
    BEGIN
        -- Check event capacity
        IF NOT check_event_capacity(p_event_id, p_pricing_details) THEN
            RAISE EXCEPTION 'Event capacity exceeded';
        END IF;

        -- Calculate total amount
        v_total_amount := calculate_registration_amount(p_pricing_details, p_food_details);

        -- Create registration
        INSERT INTO registrations (
            user_id,
            event_id,
            total_amount,
            payment_status,
            booking_details
        ) VALUES (
            p_user_id,
            p_event_id,
            v_total_amount,
            'pending',
            jsonb_build_object(
                'pricing', p_pricing_details,
                'food', p_food_details
            )
        )
        RETURNING id INTO v_registration_id;

        -- Insert pricing details
        FOR r IN SELECT * FROM jsonb_array_elements(p_pricing_details)
        LOOP
            INSERT INTO registration_pricing_details (
                registration_id,
                pricing_id,
                quantity,
                amount
            ) VALUES (
                v_registration_id,
                (r.value->>'pricing_id')::UUID,
                (r.value->>'quantity')::INTEGER,
                (r.value->>'amount')::DECIMAL
            );
        END LOOP;

        -- Insert food details if any
        IF p_food_details IS NOT NULL THEN
            FOR r IN SELECT * FROM jsonb_array_elements(p_food_details)
            LOOP
                INSERT INTO registration_food_details (
                    registration_id,
                    food_option_id,
                    quantity,
                    amount
                ) VALUES (
                    v_registration_id,
                    (r.value->>'food_option_id')::UUID,
                    (r.value->>'quantity')::INTEGER,
                    (r.value->>'amount')::DECIMAL
                );
            END LOOP;
        END IF;

        RETURN v_registration_id;
    END;
END;
$$ LANGUAGE plpgsql;

-- Rest of the file (table creation, RLS policies, and sample data) remains the same