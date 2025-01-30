-- Create newsletter_subscribers table
create table if not exists public.newsletter_subscribers (
    id bigint primary key generated always as identity,
    email text not null unique,
    source text,
    subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.newsletter_subscribers enable row level security;

-- Allow insert from authenticated and anonymous users
create policy "Allow anonymous insert" on public.newsletter_subscribers
    for insert
    with check (true);

-- Only allow select, update, delete from authenticated users
create policy "Allow authenticated select" on public.newsletter_subscribers
    for select
    using (auth.role() = 'authenticated');

create policy "Allow authenticated update" on public.newsletter_subscribers
    for update
    using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on public.newsletter_subscribers
    for delete
    using (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger to automatically update updated_at
create trigger handle_updated_at
    before update on public.newsletter_subscribers
    for each row
    execute function public.handle_updated_at(); 