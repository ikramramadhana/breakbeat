-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text,
  file_url text not null,        -- public URL of the audio file (see README)
  duration_seconds integer,      -- optional, only used to show total time before it loads
  sort_order integer,            -- optional, lower numbers play first in normal (non-shuffle) order
  created_at timestamptz default now()
);

-- The app reads with the public anon key and never writes, so only SELECT needs to be open.
alter table public.songs enable row level security;

create policy "Public read access"
  on public.songs
  for select
  to anon
  using (true);
