create table public.support_tickets (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'pending'::text,
  ticket_number text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint support_tickets_pkey primary key (id),
  constraint support_tickets_ticket_number_key unique (ticket_number),
  constraint support_tickets_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'in_progress'::text,
          'resolved'::text,
          'closed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger set_ticket_number BEFORE INSERT on support_tickets for EACH row
execute FUNCTION generate_ticket_number ();