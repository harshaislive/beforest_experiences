create table public.confirmation_variables (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  description text null,
  example_value text null,
  created_at timestamp with time zone null default now(),
  constraint confirmation_variables_pkey primary key (id)
) TABLESPACE pg_default;