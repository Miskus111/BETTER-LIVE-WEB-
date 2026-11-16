-- ════════════════════════════════════════════════════════════════════════════
-- Better Live with Biohacking — initial schema
-- Region: EU (Central EU / Frankfurt). RLS is enabled on EVERY table.
-- Health data (GDPR Art. 9) lives only in user-owned tables protected by RLS;
-- Supabase encrypts storage at rest (AES-256).
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── helpers ──────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- PROFILE, GOALS, PREFERENCES, CONSENTS
-- ════════════════════════════════════════════════════════════════════════════
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text check (char_length(display_name) <= 60),
  birth_date    date,
  sex           text check (sex in ('female', 'male')),
  height_cm     numeric(5,1) check (height_cm between 120 and 250),
  weight_kg     numeric(5,1) check (weight_kg between 30 and 300),
  experience    text check (experience in ('beginner', 'intermediate', 'advanced', 'athlete')),
  locale        text not null default 'cs' check (locale in ('cs', 'en')),
  units         text not null default 'metric' check (units in ('metric', 'imperial')),
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- adults only (18+): enforced server-side, not just in the UI
create or replace function public.check_adult() returns trigger
language plpgsql as $$
begin
  if new.birth_date is not null and new.birth_date > (current_date - interval '18 years') then
    raise exception 'User must be 18 or older' using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger profiles_adult before insert or update of birth_date on public.profiles
  for each row execute function public.check_adult();
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  goal       text not null check (goal in ('fat_loss','muscle','performance','health','longevity','pain_relief','appearance')),
  priority   smallint not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, goal)
);

create table public.preferences (
  user_id          uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  sports           text[] not null default '{}',
  training_days    smallint check (training_days between 0 and 7),
  session_minutes  smallint check (session_minutes between 10 and 240),
  equipment        text[] not null default '{}',
  diet_type        text check (diet_type in ('omnivore','vegetarian','vegan','pescatarian','keto','other')),
  allergies        text[] not null default '{}',
  dislikes         text[] not null default '{}',
  budget           text check (budget in ('low','medium','high')),
  pain_areas       text[] not null default '{}',
  -- free text, used ONLY for supplement/medication safety checks
  medications      text check (char_length(medications) <= 1000),
  sleep_hours      numeric(3,1) check (sleep_hours between 0 and 16),
  work_pattern     text check (work_pattern in ('desk','standing','physical','shift')),
  updated_at       timestamptz not null default now()
);
create trigger preferences_updated before update on public.preferences
  for each row execute function public.set_updated_at();

-- Consent log (append-only). Health-data consent is separate from terms (GDPR Art. 9(2)(a)).
create table public.consents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('health_data','terms','marketing')),
  granted     boolean not null,
  version     text not null,
  created_at  timestamptz not null default now()
);
create index consents_user_kind on public.consents (user_id, kind, created_at desc);

-- current consent state per user and kind
create or replace view public.current_consents with (security_invoker = true) as
  select distinct on (user_id, kind) user_id, kind, granted, version, created_at
  from public.consents
  order by user_id, kind, created_at desc;

-- ════════════════════════════════════════════════════════════════════════════
-- TRAIN
-- ════════════════════════════════════════════════════════════════════════════
-- owner_id null = global library row (read-only for users); otherwise a custom exercise
create table public.exercises (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid references auth.users (id) on delete cascade,
  slug               text not null,
  name_cs            text not null,
  name_en            text not null,
  category           text not null,
  primary_muscles    text[] not null default '{}',
  secondary_muscles  text[] not null default '{}',
  equipment          text[] not null default '{}',
  instructions       jsonb not null default '[]',
  mistakes           jsonb not null default '[]',
  regressions        text[] not null default '{}',
  progressions       text[] not null default '{}',
  unilateral         boolean not null default false,
  created_at         timestamptz not null default now(),
  unique nulls not distinct (owner_id, slug)
);

create table public.routines (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name           text not null,
  folder         text,
  notes          text,
  -- programs over weeks: routines that share program_name, ordered by week/day
  program_name   text,
  program_week   smallint,
  program_day    smallint,
  source         text not null default 'manual' check (source in ('manual','coach','template')),
  sort           integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger routines_updated before update on public.routines
  for each row execute function public.set_updated_at();

create table public.routine_exercises (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  routine_id      uuid not null references public.routines (id) on delete cascade,
  exercise_id     uuid not null references public.exercises (id),
  position        smallint not null,
  superset_group  smallint,
  target_sets     smallint,
  target_reps     text,
  target_weight_kg numeric(6,2),
  rest_seconds    smallint,
  notes           text
);

-- client_id: generated on the device so offline-queued writes are idempotent on sync
create table public.workouts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id    uuid unique,
  routine_id   uuid references public.routines (id) on delete set null,
  name         text not null,
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  notes        text,
  created_at   timestamptz not null default now()
);
create index workouts_user_started on public.workouts (user_id, started_at desc);

create table public.workout_sets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id       uuid unique,
  workout_id      uuid not null references public.workouts (id) on delete cascade,
  exercise_id     uuid not null references public.exercises (id),
  position        smallint not null,
  set_index       smallint not null,
  set_type        text not null default 'normal' check (set_type in ('warmup','normal','drop','failure')),
  reps            smallint check (reps between 0 and 1000),
  weight_kg       numeric(6,2) check (weight_kg >= 0),
  rpe             numeric(3,1) check (rpe between 1 and 10),
  rir             smallint check (rir between 0 and 10),
  superset_group  smallint,
  completed       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index workout_sets_user_exercise on public.workout_sets (user_id, exercise_id, created_at desc);

create table public.sport_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id     uuid unique,
  sport         text not null,
  started_at    timestamptz not null default now(),
  duration_min  smallint check (duration_min between 1 and 1440),
  distance_km   numeric(7,2) check (distance_km >= 0),
  avg_hr        smallint check (avg_hr between 30 and 230),
  hr_zones      jsonb,
  rpe           numeric(3,1) check (rpe between 1 and 10),
  notes         text,
  created_at    timestamptz not null default now()
);

create table public.personal_records (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  exercise_id     uuid not null references public.exercises (id),
  kind            text not null check (kind in ('e1rm','max_weight','max_reps','max_volume')),
  value           numeric(8,2) not null,
  achieved_at     timestamptz not null,
  workout_set_id  uuid references public.workout_sets (id) on delete set null,
  unique (user_id, exercise_id, kind)
);

create table public.body_measurements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  measured_at  date not null default current_date,
  weight_kg    numeric(5,1),
  waist_cm     numeric(5,1),
  hips_cm      numeric(5,1),
  chest_cm     numeric(5,1),
  arm_cm       numeric(5,1),
  thigh_cm     numeric(5,1),
  notes        text
);

create table public.progress_photos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  taken_at      date not null default current_date,
  storage_path  text not null,
  pose          text check (pose in ('front','side','back','other')),
  notes         text
);

-- ════════════════════════════════════════════════════════════════════════════
-- EAT
-- ════════════════════════════════════════════════════════════════════════════
create table public.foods (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid references auth.users (id) on delete cascade,
  source         text not null check (source in ('usda','off','custom')),
  source_id      text,
  slug           text,
  name_cs        text not null,
  name_en        text not null,
  brand          text,
  barcode        text,
  -- per 100 g
  kcal           numeric(6,1) not null,
  protein_g      numeric(6,2) not null default 0,
  fat_g          numeric(6,2) not null default 0,
  carbs_g        numeric(6,2) not null default 0,
  fiber_g        numeric(6,2) not null default 0,
  micros         jsonb not null default '{}',
  serving_sizes  jsonb not null default '[]',
  created_at     timestamptz not null default now(),
  unique nulls not distinct (owner_id, slug)
);
create index foods_barcode on public.foods (barcode) where barcode is not null;

create table public.recipes (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references auth.users (id) on delete cascade,
  name         text not null,
  servings     smallint not null default 1,
  ingredients  jsonb not null default '[]',
  steps        jsonb not null default '[]',
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create table public.food_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id   uuid unique,
  logged_on   date not null default current_date,
  meal        text not null check (meal in ('breakfast','lunch','dinner','snack')),
  food_id     uuid references public.foods (id) on delete set null,
  recipe_id   uuid references public.recipes (id) on delete set null,
  title       text not null,
  grams       numeric(7,1) not null check (grams > 0),
  -- snapshot so history doesn't change if a food is edited
  kcal        numeric(7,1) not null,
  protein_g   numeric(6,2) not null default 0,
  fat_g       numeric(6,2) not null default 0,
  carbs_g     numeric(6,2) not null default 0,
  fiber_g     numeric(6,2) not null default 0,
  created_at  timestamptz not null default now()
);
create index food_logs_user_day on public.food_logs (user_id, logged_on);

create table public.meal_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  starts_on   date not null default current_date,
  days        smallint not null check (days between 1 and 28),
  targets     jsonb not null default '{}',
  source      text not null default 'manual' check (source in ('manual','coach','template')),
  created_at  timestamptz not null default now()
);

create table public.meal_plan_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  meal_plan_id  uuid not null references public.meal_plans (id) on delete cascade,
  day           smallint not null,
  meal          text not null check (meal in ('breakfast','lunch','dinner','snack')),
  title         text not null,
  recipe_id     uuid references public.recipes (id) on delete set null,
  ingredients   jsonb not null default '[]',
  macros        jsonb not null default '{}'
);

-- ════════════════════════════════════════════════════════════════════════════
-- SUPPLEMENTS (no prescription drugs, steroids, SARMs, peptides or research chemicals)
-- ════════════════════════════════════════════════════════════════════════════
create table public.supplements (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name_cs       text not null,
  name_en       text not null,
  evidence      text not null check (evidence in ('established','plausible','preliminary')),
  summary       jsonb not null default '{}',
  typical_dose  jsonb not null default '{}',
  upper_limit   jsonb,
  interactions  jsonb not null default '[]',
  avoid_if      jsonb not null default '[]',
  created_at    timestamptz not null default now()
);

create table public.user_supplements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  supplement_id  uuid not null references public.supplements (id),
  dose_amount    numeric(8,2),
  dose_unit      text,
  timing         text,
  reminder_time  time,
  rationale      text,
  source         text not null default 'manual' check (source in ('manual','coach')),
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create table public.supplement_logs (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null default auth.uid() references auth.users (id) on delete cascade,
  user_supplement_id  uuid not null references public.user_supplements (id) on delete cascade,
  taken_at            timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- MOBILITY, PAIN, RECOVERY
-- ════════════════════════════════════════════════════════════════════════════
create table public.mobility_exercises (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users (id) on delete cascade,
  slug          text not null,
  name_cs       text not null,
  name_en       text not null,
  target_areas  text[] not null default '{}',
  kind          text not null check (kind in ('stretch','mobility','activation','strength')),
  instructions  jsonb not null default '[]',
  video_url     text,
  default_seconds smallint,
  default_reps  smallint,
  unique nulls not distinct (owner_id, slug)
);

create table public.mobility_routines (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users (id) on delete cascade,
  slug        text,
  name_cs     text not null,
  name_en     text not null,
  kind        text not null,
  items       jsonb not null default '[]',
  source      text not null default 'template' check (source in ('template','coach','manual')),
  created_at  timestamptz not null default now()
);

create table public.pain_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  region       text not null,
  reported_at  timestamptz not null default now(),
  score        smallint not null check (score between 0 and 10),
  answers      jsonb not null default '{}',
  red_flags    text[] not null default '{}'
);
create index pain_reports_user_region on public.pain_reports (user_id, region, reported_at);

create table public.sleep_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  night_of      date not null,
  bedtime       timestamptz,
  wake_time     timestamptz,
  duration_min  smallint check (duration_min between 0 and 1440),
  quality       smallint check (quality between 1 and 5),
  unique (user_id, night_of)
);

create table public.recovery_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  logged_on      date not null default current_date,
  hrv_ms         smallint check (hrv_ms between 5 and 300),
  resting_hr     smallint check (resting_hr between 25 and 150),
  stress         smallint check (stress between 1 and 5),
  last_caffeine  time,
  cold_min       smallint,
  heat_min       smallint,
  sunlight_min   smallint,
  steps          integer check (steps between 0 and 150000),
  water_ml       integer check (water_ml between 0 and 15000),
  source         text not null default 'manual',
  unique (user_id, logged_on)
);

-- ════════════════════════════════════════════════════════════════════════════
-- LABS & BODY COMPOSITION
-- ════════════════════════════════════════════════════════════════════════════
create table public.lab_reports (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind          text not null check (kind in ('blood','inbody')),
  taken_on      date,
  lab_name      text,
  storage_path  text,
  status        text not null default 'uploaded' check (status in ('uploaded','extracted','confirmed')),
  created_at    timestamptz not null default now()
);

-- a value is only used for charts/coach once the user has confirmed it
create table public.lab_values (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  report_id  uuid not null references public.lab_reports (id) on delete cascade,
  marker     text not null,
  value      numeric(12,4) not null,
  unit       text not null,
  ref_low    numeric(12,4),
  ref_high   numeric(12,4),
  ref_text   text,
  flag       text check (flag in ('low','normal','high','critical')),
  confirmed  boolean not null default false,
  taken_on   date
);
create index lab_values_user_marker on public.lab_values (user_id, marker, taken_on);

create table public.body_composition (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null default auth.uid() references auth.users (id) on delete cascade,
  report_id           uuid references public.lab_reports (id) on delete set null,
  measured_on         date not null,
  weight_kg           numeric(5,1),
  skeletal_muscle_kg  numeric(5,1),
  body_fat_pct        numeric(4,1),
  visceral_fat_level  numeric(4,1),
  segmental           jsonb,
  confirmed           boolean not null default false
);

-- ════════════════════════════════════════════════════════════════════════════
-- COACH & USAGE
-- ════════════════════════════════════════════════════════════════════════════
create table public.coach_conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger coach_conversations_updated before update on public.coach_conversations
  for each row execute function public.set_updated_at();

create table public.coach_messages (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  conversation_id  uuid not null references public.coach_conversations (id) on delete cascade,
  role             text not null check (role in ('user','assistant','tool')),
  content          text not null default '',
  tool_calls       jsonb,
  attachments      jsonb,
  created_at       timestamptz not null default now()
);

-- written only by the server (service role); users can read their own usage
create table public.ai_usage (
  user_id        uuid not null references auth.users (id) on delete cascade,
  day            date not null default current_date,
  messages       integer not null default 0,
  input_tokens   integer not null default 0,
  output_tokens  integer not null default 0,
  primary key (user_id, day)
);

-- ════════════════════════════════════════════════════════════════════════════
-- BILLING & COMMERCE
-- ════════════════════════════════════════════════════════════════════════════
create table public.subscriptions (
  user_id                   uuid primary key references auth.users (id) on delete cascade,
  plan                      text not null default 'free' check (plan in ('free','pro')),
  status                    text not null default 'active',
  provider                  text not null default 'none' check (provider in ('none','mock','stripe')),
  provider_customer_id      text,
  provider_subscription_id  text,
  current_period_end        timestamptz,
  updated_at                timestamptz not null default now()
);

-- affiliate catalogue (no own store — see DECISIONS.md)
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  retailer    text not null check (retailer in ('brainmarket','vilgain')),
  name        text not null,
  url         text not null check (url like 'https://%'),
  kind        text not null check (kind in ('supplement','category','food')),
  nutrient    text,
  why         text,
  note        text,
  active      boolean not null default true
);

-- kept for a possible own store later; unused while BLWB is affiliate-only
create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  status      text not null default 'draft',
  total_czk   numeric(10,2),
  items       jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- NEW USER → profile + free subscription
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════════
alter table public.profiles            enable row level security;
alter table public.goals               enable row level security;
alter table public.preferences         enable row level security;
alter table public.consents            enable row level security;
alter table public.exercises           enable row level security;
alter table public.routines            enable row level security;
alter table public.routine_exercises   enable row level security;
alter table public.workouts            enable row level security;
alter table public.workout_sets        enable row level security;
alter table public.sport_sessions      enable row level security;
alter table public.personal_records    enable row level security;
alter table public.body_measurements   enable row level security;
alter table public.progress_photos     enable row level security;
alter table public.foods               enable row level security;
alter table public.recipes             enable row level security;
alter table public.food_logs           enable row level security;
alter table public.meal_plans          enable row level security;
alter table public.meal_plan_items     enable row level security;
alter table public.supplements         enable row level security;
alter table public.user_supplements    enable row level security;
alter table public.supplement_logs     enable row level security;
alter table public.mobility_exercises  enable row level security;
alter table public.mobility_routines   enable row level security;
alter table public.pain_reports        enable row level security;
alter table public.sleep_logs          enable row level security;
alter table public.recovery_logs       enable row level security;
alter table public.lab_reports         enable row level security;
alter table public.lab_values          enable row level security;
alter table public.body_composition    enable row level security;
alter table public.coach_conversations enable row level security;
alter table public.coach_messages      enable row level security;
alter table public.ai_usage            enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.products            enable row level security;
alter table public.orders              enable row level security;

-- profiles: own row only (no insert — created by trigger; no delete — deleting the auth user cascades)
create policy "profiles: read own"   on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profiles: update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- user-owned tables: full CRUD on own rows
do $$
declare t text;
begin
  foreach t in array array[
    'goals','preferences','routines','routine_exercises','workouts','workout_sets','sport_sessions',
    'personal_records','body_measurements','progress_photos','food_logs','meal_plans','meal_plan_items',
    'user_supplements','supplement_logs','pain_reports','sleep_logs','recovery_logs','lab_reports',
    'lab_values','body_composition','coach_conversations','coach_messages','orders'
  ] loop
    execute format('create policy "%1$s: own rows" on public.%1$I for all to authenticated
                    using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;

-- consents: append-only log (insert + read own; never update/delete from the client)
create policy "consents: read own"   on public.consents for select to authenticated using (user_id = (select auth.uid()));
create policy "consents: insert own" on public.consents for insert to authenticated with check (user_id = (select auth.uid()));

-- shared libraries: global rows (owner_id null) readable by everyone signed in; custom rows only by owner
do $$
declare t text;
begin
  foreach t in array array['exercises','foods','recipes','mobility_exercises','mobility_routines'] loop
    execute format('create policy "%1$s: read global or own" on public.%1$I for select to authenticated
                    using (owner_id is null or owner_id = (select auth.uid()))', t);
    execute format('create policy "%1$s: insert own" on public.%1$I for insert to authenticated
                    with check (owner_id = (select auth.uid()))', t);
    execute format('create policy "%1$s: update own" on public.%1$I for update to authenticated
                    using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()))', t);
    execute format('create policy "%1$s: delete own" on public.%1$I for delete to authenticated
                    using (owner_id = (select auth.uid()))', t);
  end loop;
end $$;

-- reference data: read-only for everyone (incl. anonymous visitors of public pages)
create policy "supplements: read all" on public.supplements for select to anon, authenticated using (true);
create policy "products: read active" on public.products for select to anon, authenticated using (active);

-- server-managed: users may only read their own row
create policy "ai_usage: read own"      on public.ai_usage      for select to authenticated using (user_id = (select auth.uid()));
create policy "subscriptions: read own" on public.subscriptions for select to authenticated using (user_id = (select auth.uid()));

-- ════════════════════════════════════════════════════════════════════════════
-- STORAGE: private buckets, files under "<user id>/..."
-- ════════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('progress-photos', 'progress-photos', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic']),
  ('lab-reports',     'lab-reports',     false, 20971520, array['application/pdf','image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do nothing;

create policy "storage: own files read" on storage.objects for select to authenticated
  using (bucket_id in ('progress-photos','lab-reports') and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "storage: own files insert" on storage.objects for insert to authenticated
  with check (bucket_id in ('progress-photos','lab-reports') and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "storage: own files delete" on storage.objects for delete to authenticated
  using (bucket_id in ('progress-photos','lab-reports') and (storage.foldername(name))[1] = (select auth.uid())::text);
