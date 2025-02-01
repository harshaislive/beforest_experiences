-- Rename phonepay_transaction_id to transaction_id in registrations table
ALTER TABLE public.registrations 
    RENAME COLUMN phonepay_transaction_id TO transaction_id;

-- Add unique constraint to transaction_id in registrations
ALTER TABLE public.registrations 
    ADD CONSTRAINT registrations_transaction_id_key UNIQUE (transaction_id);

-- Create index for transaction_id in registrations
CREATE INDEX IF NOT EXISTS idx_registrations_transaction 
    ON public.registrations USING btree (transaction_id);

-- Update nullable timestamps to not null in registrations
UPDATE public.registrations 
    SET created_at = NOW() 
    WHERE created_at IS NULL;

UPDATE public.registrations 
    SET updated_at = NOW() 
    WHERE updated_at IS NULL;

ALTER TABLE public.registrations 
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

-- Update payment_transactions table
ALTER TABLE public.payment_transactions 
    ALTER COLUMN registration_id SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'pending'::text,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

-- Create status index for payment_transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status 
    ON public.payment_transactions USING btree (status);

-- Add trigger for payment_transactions
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
    BEFORE UPDATE ON public.payment_transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update payment_status_logs table
ALTER TABLE public.payment_status_logs 
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone,
    ALTER COLUMN created_at SET NOT NULL;

UPDATE public.payment_status_logs 
    SET updated_at = created_at 
    WHERE updated_at IS NULL;

ALTER TABLE public.payment_status_logs 
    ALTER COLUMN updated_at SET NOT NULL,
    ALTER COLUMN updated_at SET DEFAULT NOW();

-- Create status index for payment_status_logs
CREATE INDEX IF NOT EXISTS idx_payment_status_logs_status 
    ON public.payment_status_logs USING btree (status);

-- Add trigger for payment_status_logs
DROP TRIGGER IF EXISTS update_payment_status_logs_updated_at ON public.payment_status_logs;
CREATE TRIGGER update_payment_status_logs_updated_at 
    BEFORE UPDATE ON public.payment_status_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 