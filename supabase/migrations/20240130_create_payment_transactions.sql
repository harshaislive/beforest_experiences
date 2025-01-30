-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    registration_id UUID NOT NULL REFERENCES public.registrations(id),
    transaction_id TEXT NOT NULL,
    status TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_response JSONB NOT NULL,
    
    CONSTRAINT fk_registration
        FOREIGN KEY(registration_id) 
        REFERENCES public.registrations(id)
        ON DELETE CASCADE
);

-- Create index on registration_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_registration_id ON public.payment_transactions(registration_id);

-- Create index on transaction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.payment_transactions
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.payment_transactions
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.payment_transactions
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated'); 