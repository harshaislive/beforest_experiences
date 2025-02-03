create table public.payment_transactions (
  id uuid not null default extensions.uuid_generate_v4 (),
  registration_id uuid not null,
  transaction_id text not null,
  amount numeric not null,
  status text not null default 'pending'::text,
  payment_response jsonb null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint payment_transactions_pkey primary key (id),
  constraint payment_transactions_transaction_id_key unique (transaction_id),
  constraint payment_transactions_registration_id_fkey foreign KEY (registration_id) references registrations (id) on delete CASCADE,
  constraint payment_transactions_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'completed'::text,
          'failed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_payment_transactions_registration on public.payment_transactions using btree (registration_id) TABLESPACE pg_default;

create index IF not exists idx_payment_transactions_transaction_id on public.payment_transactions using btree (transaction_id) TABLESPACE pg_default;

create index IF not exists idx_payment_transactions_status on public.payment_transactions using btree (status) TABLESPACE pg_default;

create trigger update_payment_transactions_updated_at BEFORE
update on payment_transactions for EACH row
execute FUNCTION update_updated_at_column ();