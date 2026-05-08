-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

-- 1. Create the history table
create table if not exists content_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null check (type in ('text', 'image')),
  prompt      text not null,
  result      text,
  metadata    jsonb default '{}',
  created_at  timestamptz default now()
);

-- 2. Enable Row Level Security (users only see their own rows)
alter table content_history enable row level security;

-- 3. RLS Policies
create policy "Users can view own history"
  on content_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on content_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own history"
  on content_history for delete
  using (auth.uid() = user_id);

-- 4. Index for fast user lookups
create index if not exists content_history_user_id_idx
  on content_history(user_id, created_at desc);
