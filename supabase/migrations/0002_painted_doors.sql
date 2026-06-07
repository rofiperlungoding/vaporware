create table if not exists painted_doors (
  token text primary key,
  idea_id text not null references ideas (id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists painted_doors_idea_id_idx on painted_doors (idea_id);

alter table painted_doors enable row level security;
