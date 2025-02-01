CREATE TABLE public.payment_status_logs (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    transaction_id uuid NOT NULL,
    status text NOT NULL,
    response_data jsonb NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT payment_status_logs_pkey PRIMARY KEY (id),
    CONSTRAINT payment_status_logs_transaction_id_fkey FOREIGN KEY (transaction_id)
        REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
    CONSTRAINT payment_status_logs_status_check CHECK (
        status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text])
    )
) TABLESPACE pg_default;

CREATE INDEX idx_payment_status_logs_transaction ON public.payment_status_logs
    USING btree (transaction_id) TABLESPACE pg_default;

CREATE INDEX idx_payment_status_logs_created_at ON public.payment_status_logs
    USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX idx_payment_status_logs_status ON public.payment_status_logs
    USING btree (status) TABLESPACE pg_default;

CREATE TRIGGER update_payment_status_logs_updated_at BEFORE
UPDATE ON payment_status_logs FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.payment_status_logs IS 'Logs of payment status changes for audit and debugging'; 