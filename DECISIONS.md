# Decisions — Better Live with Biohacking (BLWB)

Short, dated records of choices made while building. Newest first within each phase.

## Phase 1 — scaffold, rename, i18n, auth, onboarding, schema (2026-11-16)

- **Built on the existing FLX app, not a fresh repo.** Anatomy, nutrient, food, absorption and looksmaxing modules
  already exist and are tested; the new app lives alongside them. Work happens on branch `blwb-app` so the live site
  on `main` (better-live-web.vercel.app) is untouched until the app is ready.
- **Route groups.** `(site)` = public, indexable education pages with the site nav/footer; `(app)` = signed-in app
  with sidebar (desktop) and bottom tabs (mobile); `(auth)` = login; `(onboarding)` = onboarding wizard. URLs are
  unchanged for existing pages.
- **No own store (owner decision).** The spec's organic store was replaced earlier by affiliate links (BrainMarket,
  Vilgain) and the owner chose to keep it that way. "Store" in the sidebar is labelled "Where to buy" and points to the
  affiliate catalogue. `products` holds the affiliate catalogue; `orders` exists but is unused.
- **Supabase in the cloud (EU, Frankfurt).** Docker/Supabase CLI are not installed on the dev machine, so there is no
  local Supabase. Migrations are plain SQL in `supabase/migrations/` and are applied through the SQL editor (or
  `supabase db push` later). Until env vars are set, app routes show a setup screen instead of failing.
- **i18n with next-intl, locale in a cookie, no locale in URLs.** Czech is the default; English via the switch (or
  the browser's `Accept-Language` on first visit). Public education content in `src/data` is still Czech-only — it
  will get English fields when it is ported into the app modules (phase 2).
- **Auth:** email + password and Google OAuth via `@supabase/ssr` (cookie sessions, middleware refresh). Google needs
  an OAuth client configured in Google Cloud + Supabase (README). Magic links were skipped to keep one flow.
- **Adults only, enforced twice:** zod validation in onboarding and a database trigger (`check_adult`) that rejects
  birth dates under 18.
- **Health-data consent (GDPR Art. 9)** is a separate checkbox from terms, stored in an append-only `consents` log
  (users can insert and read, never update/delete). The app requires the latest `health_data` consent to be granted;
  withdrawing it in Settings sends the user back to the consent step.
- **Data minimisation:** medications are a single free-text field used only for safety checks; no IP addresses or
  device data are stored with consents.
- **RLS everywhere.** Every table has RLS enabled. User tables carry `user_id default auth.uid()` so policies are a
  single `user_id = auth.uid()` check (also on child tables, which keeps offline sync simple). Shared libraries
  (exercises, foods, recipes, mobility) use `owner_id null` for global rows plus user-owned custom rows.
  `ai_usage` and `subscriptions` are server-written only. Verified by `npm run test:rls` against the real project.
- **Offline-ready ids:** `client_id` columns (unique) on workouts, sets, sport sessions and food logs so writes queued
  offline can be replayed idempotently (phase 8).
- **Account deletion** uses the service role to delete storage files and the auth user; all user tables cascade.
- **Unit tests with Vitest** (node environment); e2e stays on Playwright with a separate `.next-test` build folder.
- **Database types** are hand-written for the tables used so far; regenerate with `supabase gen types` once the
  project is linked.
