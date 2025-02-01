create table public.users (
  id uuid not null default extensions.uuid_generate_v4 (),
  email text not null,
  full_name text not null,
  phone text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
) TABLESPACE pg_default;