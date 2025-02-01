create table public.newsletter_subscriptions (
  id uuid not null default extensions.uuid_generate_v4 (),
  email text not null,
  is_active boolean null default true,
  source text null,
  registration_id uuid null,
  subscribed_at timestamp with time zone null default now(),
  unsubscribed_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint newsletter_subscriptions_pkey primary key (id),
  constraint newsletter_subscriptions_email_key unique (email),
  constraint newsletter_subscriptions_registration_id_fkey foreign KEY (registration_id) references registrations (id),
  constraint newsletter_subscriptions_source_check check (
    (
      source = any (
        array[
          'footer'::text,
          'registration'::text,
          'other'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_newsletter_subscriptions_email on public.newsletter_subscriptions using btree (email) TABLESPACE pg_default;

create index IF not exists idx_newsletter_subscriptions_registration on public.newsletter_subscriptions using btree (registration_id) TABLESPACE pg_default;