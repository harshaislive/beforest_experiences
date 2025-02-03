-- Phase 2: Functions and Triggers

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check event capacity
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

-- Function to calculate registration amount
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

    -- Calculate food total if exists
    IF p_food_details IS NOT NULL AND jsonb_array_length(p_food_details) > 0 THEN
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

-- Function to create event registration
CREATE OR REPLACE FUNCTION create_event_registration(
    p_user_id UUID,
    p_event_id UUID,
    p_pricing_details JSONB,
    p_food_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_registration_id UUID;
    v_total_amount DECIMAL;
    r RECORD;
BEGIN
    -- Check capacity
    IF NOT check_event_capacity(p_event_id, p_pricing_details) THEN
        RAISE EXCEPTION 'Event capacity exceeded';
    END IF;

    -- Calculate amount
    v_total_amount := calculate_registration_amount(p_pricing_details, p_food_details);

    -- Create registration
    INSERT INTO registrations (
        user_id, event_id, total_amount, payment_status, booking_details
    ) VALUES (
        p_user_id,
        p_event_id,
        v_total_amount,
        'pending',
        jsonb_build_object(
            'pricing', p_pricing_details,
            'food', COALESCE(p_food_details, '[]'::jsonb)
        )
    )
    RETURNING id INTO v_registration_id;

    -- Insert pricing details
    FOR r IN SELECT * FROM jsonb_array_elements(p_pricing_details)
    LOOP
        INSERT INTO registration_pricing_details (
            registration_id, pricing_id, quantity, amount
        ) VALUES (
            v_registration_id,
            (r.value->>'pricing_id')::UUID,
            (r.value->>'quantity')::INTEGER,
            (r.value->>'amount')::DECIMAL
        );
    END LOOP;

    -- Insert food details if provided
    IF p_food_details IS NOT NULL AND jsonb_array_length(p_food_details) > 0 THEN
        FOR r IN SELECT * FROM jsonb_array_elements(p_food_details)
        LOOP
            INSERT INTO registration_food_details (
                registration_id, food_option_id, quantity, amount
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
$$ LANGUAGE plpgsql;

-- Function to populate confirmation template
CREATE OR REPLACE FUNCTION get_populated_confirmation_template(
    p_type TEXT,
    p_registration_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_template RECORD;
    v_registration RECORD;
    v_content JSONB;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM confirmation_templates
    WHERE type = p_type AND is_active = true
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found for type: %', p_type;
    END IF;

    -- Get registration details
    SELECT 
        r.*,
        e.title as event_title,
        e.start_date,
        l.name as location_name,
        u.full_name,
        u.email,
        pt.transaction_id
    INTO v_registration
    FROM registrations r
    JOIN events e ON e.id = r.event_id
    JOIN locations l ON l.id = e.location_id
    JOIN users u ON u.id = r.user_id
    LEFT JOIN payment_transactions pt ON pt.registration_id = r.id
    WHERE r.id = p_registration_id;

    -- Populate template variables
    v_content := v_template.content;
    v_content := jsonb_set(v_content, '{event_name}', to_jsonb(v_registration.event_title));
    v_content := jsonb_set(v_content, '{location}', to_jsonb(v_registration.location_name));
    v_content := jsonb_set(v_content, '{date}', to_jsonb(v_registration.start_date));
    v_content := jsonb_set(v_content, '{customer_name}', to_jsonb(v_registration.full_name));
    v_content := jsonb_set(v_content, '{booking_id}', to_jsonb(v_registration.id));
    v_content := jsonb_set(v_content, '{amount}', to_jsonb(v_registration.total_amount));
    v_content := jsonb_set(v_content, '{transaction_id}', to_jsonb(v_registration.transaction_id));
    v_content := jsonb_set(v_content, '{booking_details}', v_registration.booking_details);

    RETURN jsonb_build_object(
        'title', v_template.title,
        'content', v_content
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
    p_transaction_id TEXT,
    p_status TEXT,
    p_response JSONB
)
RETURNS VOID AS $$
DECLARE
    v_registration_id UUID;
BEGIN
    -- Update payment transaction
    UPDATE payment_transactions
    SET 
        status = p_status,
        payment_response = p_response,
        updated_at = NOW()
    WHERE transaction_id = p_transaction_id
    RETURNING registration_id INTO v_registration_id;

    -- Update registration
    IF v_registration_id IS NOT NULL THEN
        UPDATE registrations
        SET 
            payment_status = p_status,
            payment_date = CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END,
            updated_at = NOW()
        WHERE id = v_registration_id;

        -- Update event capacity if payment completed
        IF p_status = 'completed' THEN
            UPDATE events e
            SET current_participants = current_participants + (
                SELECT COALESCE(SUM(quantity), 0)
                FROM registration_pricing_details
                WHERE registration_id = v_registration_id
            )
            FROM registrations r
            WHERE r.id = v_registration_id
            AND e.id = r.event_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;