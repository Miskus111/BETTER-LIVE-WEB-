-- Hardening from the Supabase advisors (2026-11-21). Safe to re-run.

-- 1) Trigger functions: fixed search_path (lint 0011). Bodies only use now()/current_date (pg_catalog).
alter function public.set_updated_at() set search_path = '';
alter function public.check_adult() set search_path = '';

-- 2) handle_new_user is a SECURITY DEFINER trigger on auth.users; nobody should call it via /rest/v1/rpc
--    (lints 0028/0029). Triggers fire regardless of EXECUTE privilege.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 3) Covering indexes for foreign keys (lint 0001). Most are user_id, which every RLS policy filters on.
create index if not exists body_composition_report_id_idx on public.body_composition (report_id);
create index if not exists body_composition_user_id_idx on public.body_composition (user_id);
create index if not exists body_measurements_user_id_idx on public.body_measurements (user_id);
create index if not exists coach_conversations_user_id_idx on public.coach_conversations (user_id);
create index if not exists coach_messages_conversation_id_idx on public.coach_messages (conversation_id);
create index if not exists coach_messages_user_id_idx on public.coach_messages (user_id);
create index if not exists food_logs_food_id_idx on public.food_logs (food_id);
create index if not exists food_logs_recipe_id_idx on public.food_logs (recipe_id);
create index if not exists lab_reports_user_id_idx on public.lab_reports (user_id);
create index if not exists lab_values_report_id_idx on public.lab_values (report_id);
create index if not exists meal_plan_items_meal_plan_id_idx on public.meal_plan_items (meal_plan_id);
create index if not exists meal_plan_items_recipe_id_idx on public.meal_plan_items (recipe_id);
create index if not exists meal_plan_items_user_id_idx on public.meal_plan_items (user_id);
create index if not exists meal_plans_user_id_idx on public.meal_plans (user_id);
create index if not exists mobility_routines_owner_id_idx on public.mobility_routines (owner_id);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists personal_records_exercise_id_idx on public.personal_records (exercise_id);
create index if not exists personal_records_workout_set_id_idx on public.personal_records (workout_set_id);
create index if not exists progress_photos_user_id_idx on public.progress_photos (user_id);
create index if not exists recipes_owner_id_idx on public.recipes (owner_id);
create index if not exists routine_exercises_exercise_id_idx on public.routine_exercises (exercise_id);
create index if not exists routine_exercises_routine_id_idx on public.routine_exercises (routine_id);
create index if not exists routine_exercises_user_id_idx on public.routine_exercises (user_id);
create index if not exists routines_user_id_idx on public.routines (user_id);
create index if not exists sport_sessions_user_id_idx on public.sport_sessions (user_id);
create index if not exists supplement_logs_user_id_idx on public.supplement_logs (user_id);
create index if not exists supplement_logs_user_supplement_id_idx on public.supplement_logs (user_supplement_id);
create index if not exists user_supplements_supplement_id_idx on public.user_supplements (supplement_id);
create index if not exists user_supplements_user_id_idx on public.user_supplements (user_id);
create index if not exists workout_sets_exercise_id_idx on public.workout_sets (exercise_id);
create index if not exists workout_sets_workout_id_idx on public.workout_sets (workout_id);
create index if not exists workouts_routine_id_idx on public.workouts (routine_id);
