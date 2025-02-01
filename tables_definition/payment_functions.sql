CREATE OR REPLACE FUNCTION public.update_payment_status(
    p_transaction_id uuid,
    p_status text,
    p_payment_response jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update payment transaction
    UPDATE public.payment_transactions
    SET 
        status = p_status,
        payment_response = p_payment_response,
        updated_at = NOW()
    WHERE id = p_transaction_id;

    -- Update registration
    UPDATE public.registrations r
    SET 
        payment_status = p_status,
        payment_date = CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END,
        updated_at = NOW()
    FROM public.payment_transactions pt
    WHERE pt.id = p_transaction_id
    AND r.id = pt.registration_id;

    -- Insert into payment_status_logs
    INSERT INTO public.payment_status_logs (
        transaction_id,
        status,
        response_data
    ) VALUES (
        p_transaction_id,
        p_status,
        p_payment_response
    );
END;
$$; 