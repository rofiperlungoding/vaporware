create table if not exists ideas (
  id text primary key,
  one_liner text not null,
  tagline text not null default '',
  category text not null default 'Wildcard',
  price text not null default '$5/mo',
  source text not null default 'user' check (source in ('seed', 'user')),
  base_said_yes integer not null default 0,
  base_said_no integer not null default 0,
  base_did_click integer not null default 0,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id bigint generated always as identity primary key,
  idea_id text not null references ideas (id) on delete cascade,
  said_yes boolean not null,
  did_pay boolean,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists votes_idea_id_idx on votes (idea_id);

alter table ideas enable row level security;
alter table votes enable row level security;
