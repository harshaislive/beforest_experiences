create table public.phonepay_config (
  id uuid not null default extensions.uuid_generate_v4 (),
  merchant_id text not null,
  salt_key text not null,
  is_production boolean null default false,
  redirect_url text not null,
  callback_url text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint phonepay_config_pkey primary key (id)
) TABLESPACE pg_default;