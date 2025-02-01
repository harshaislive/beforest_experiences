create table public.registration_pricing_details (
  id uuid not null default extensions.uuid_generate_v4 (),
  registration_id uuid null,
  pricing_id uuid null,
  quantity integer null,
  amount numeric not null,
  created_at timestamp with time zone null default now(),
  constraint registration_pricing_details_pkey primary key (id),
  constraint registration_pricing_details_pricing_id_fkey foreign KEY (pricing_id) references experience_pricing (id) on delete CASCADE,
  constraint registration_pricing_details_registration_id_fkey foreign KEY (registration_id) references registrations (id) on delete CASCADE,
  constraint registration_pricing_details_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;