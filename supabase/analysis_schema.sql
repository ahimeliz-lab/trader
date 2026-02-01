-- Analysis runs and evaluation tables

create table if not exists analysis_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  symbol text not null,
  timeframes text[] not null,
  lookback int not null,
  snapshot_meta jsonb not null,
  output jsonb not null,
  model_version text not null,
  config jsonb not null,
  notes text
);

create index if not exists analysis_runs_symbol_created_at_idx
  on analysis_runs (symbol, created_at desc);

create table if not exists analysis_evals (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references analysis_runs(id) on delete cascade,
  eval_created_at timestamp with time zone default now(),
  horizon_minutes int not null,
  realized jsonb not null,
  score_total int not null,
  score_breakdown jsonb not null,
  label text not null,
  calibration jsonb not null
);

create index if not exists analysis_evals_run_idx
  on analysis_evals (analysis_run_id);

create index if not exists analysis_evals_created_at_idx
  on analysis_evals (eval_created_at desc);

create table if not exists session_stats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  symbol text not null,
  session_name text not null,
  transition_type text not null,
  timeframe text not null,
  lookback_days int not null,
  window_minutes int not null,
  day_type text not null,
  stats jsonb not null,
  sample_size int not null,
  confidence text not null
);

alter table if exists session_stats
  add column if not exists session_name text,
  add column if not exists day_type text,
  add column if not exists confidence text;

create index if not exists session_stats_key_idx
  on session_stats (symbol, session_name, day_type, transition_type, timeframe, lookback_days, window_minutes, created_at desc);
