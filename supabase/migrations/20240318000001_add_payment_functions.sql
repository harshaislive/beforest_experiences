-- Create function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
    p_transaction_id TEXT,
    p_status TEXT,
    p_response JSONB
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_registration_id UUID;
    v_experience_id UUID;
    v_total_tickets INTEGER;
BEGIN
    -- Start transaction
    BEGIN
        -- Get registration ID and lock the payment transaction
        SELECT registration_id 
        INTO v_registration_id
        FROM payment_transactions
        WHERE transaction_id = p_transaction_id
        FOR UPDATE;

        IF v_registration_id IS NULL THEN
            RAISE EXCEPTION 'Payment transaction not found';
        END IF;

        -- Get experience ID and total tickets from registration
        SELECT 
            r.experience_id,
            (
                SELECT COALESCE(SUM((p->>'quantity')::INTEGER), 0)
                FROM jsonb_array_elements(r.booking_details->'pricing') p
            )
        INTO v_experience_id, v_total_tickets
        FROM registrations r
        WHERE r.id = v_registration_id
        FOR UPDATE;

        -- Update payment transaction
        UPDATE payment_transactions
        SET 
            status = p_status,
            payment_response = p_response,
            updated_at = NOW()
        WHERE transaction_id = p_transaction_id;

        -- Update registration
        UPDATE registrations
        SET 
            payment_status = p_status,
            payment_date = CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END,
            updated_at = NOW()
        WHERE id = v_registration_id;

        -- Update experience capacity if payment completed
        IF p_status = 'completed' THEN
            -- Lock the experience row for update
            UPDATE experiences
            SET current_participants = current_participants + v_total_tickets
            WHERE id = v_experience_id;

            -- Log successful payment
            INSERT INTO payment_status_logs (
                transaction_id,
                status,
                response_data
            ) VALUES (
                p_transaction_id,
                'completed',
                jsonb_build_object(
                    'message', 'Payment completed successfully',
                    'tickets_added', v_total_tickets
                )
            );
        ELSIF p_status = 'failed' THEN
            -- Log failed payment
            INSERT INTO payment_status_logs (
                transaction_id,
                status,
                response_data
            ) VALUES (
                p_transaction_id,
                'failed',
                jsonb_build_object(
                    'message', 'Payment failed',
                    'error', p_response
                )
            );
        END IF;

        -- Commit transaction
        COMMIT;
    EXCEPTION WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$; 