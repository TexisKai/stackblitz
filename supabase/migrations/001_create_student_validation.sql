-- student validation logic (NOT EXECUTED)
create table if not exists public.user_profiles (
  user_id uuid primary key,
  full_name text,
  college text,
  course text,
  year text,
  interests text[],
  skills text[],
  teams text[],
  du_id_url text,
  is_verified boolean default false,
  restricted_mode boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.id_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  file_url text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
