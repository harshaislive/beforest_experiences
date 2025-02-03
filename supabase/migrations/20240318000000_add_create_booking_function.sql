-- Create the stored procedure for atomic booking creation
CREATE OR REPLACE FUNCTION create_booking(
    p_experience_id UUID,
    p_user_email TEXT,
    p_user_full_name TEXT,
    p_user_phone TEXT,
    p_total_amount DECIMAL,
    p_total_tickets INTEGER,
    p_booking_details JSONB
) RETURNS TABLE (
    id UUID,
    user_id UUID,
    experience_id UUID,
    total_amount NUMERIC,
    payment_status TEXT,
    booking_details JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
    v_current_capacity INTEGER;
    v_total_capacity INTEGER;
    v_registration_id UUID;
BEGIN
    -- Lock the experience row for update to prevent concurrent bookings
    SELECT experiences.total_capacity, experiences.current_participants
    INTO v_total_capacity, v_current_capacity
    FROM experiences
    WHERE experiences.id = p_experience_id
    FOR UPDATE SKIP LOCKED;

    -- If we couldn't get a lock, someone else is booking
    IF v_total_capacity IS NULL THEN
        RAISE EXCEPTION 'Experience is currently being booked by another user'
            USING HINT = 'Please try again in a few moments';
    END IF;

    -- Check capacity
    IF (v_current_capacity + p_total_tickets) > v_total_capacity THEN
        RAISE EXCEPTION 'Not enough capacity available'
            USING HINT = 'The requested number of tickets exceeds available capacity';
    END IF;

    -- Get or create user
    SELECT users.id INTO v_user_id
    FROM users
    WHERE users.email = p_user_email;

    IF v_user_id IS NULL THEN
        INSERT INTO users (email, full_name, phone)
        VALUES (p_user_email, p_user_full_name, p_user_phone)
        RETURNING users.id INTO v_user_id;
    END IF;

    -- Create registration
    INSERT INTO registrations (
        user_id,
        experience_id,
        total_amount,
        payment_status,
        booking_details
    ) VALUES (
        v_user_id,
        p_experience_id,
        p_total_amount,
        'pending',
        p_booking_details
    )
    RETURNING registrations.id INTO v_registration_id;

    -- Return the registration record with explicit table references
    RETURN QUERY
    SELECT 
        registrations.id,
        registrations.user_id,
        registrations.experience_id,
        registrations.total_amount,
        registrations.payment_status,
        registrations.booking_details,
        registrations.created_at
    FROM registrations
    WHERE registrations.id = v_registration_id;
END;
$$; 