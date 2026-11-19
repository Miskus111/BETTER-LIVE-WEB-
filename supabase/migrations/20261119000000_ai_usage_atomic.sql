-- Atomic AI-usage accounting: reserve a daily slot and add tokens without read-modify-write races.
-- Called only by the server with the service role (users can read ai_usage but never write it).

create or replace function public.reserve_ai_call(p_user uuid, p_day date, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  used integer;
begin
  insert into public.ai_usage (user_id, day, messages)
  values (p_user, p_day, 0)
  on conflict (user_id, day) do nothing;

  update public.ai_usage
     set messages = messages + 1
   where user_id = p_user and day = p_day and messages < p_limit
  returning messages into used;

  return used is not null;
end $$;

create or replace function public.add_ai_tokens(p_user uuid, p_day date, p_input integer, p_output integer)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.ai_usage (user_id, day, input_tokens, output_tokens)
  values (p_user, p_day, p_input, p_output)
  on conflict (user_id, day) do update
    set input_tokens  = ai_usage.input_tokens  + excluded.input_tokens,
        output_tokens = ai_usage.output_tokens + excluded.output_tokens;
$$;

revoke all on function public.reserve_ai_call(uuid, date, integer) from public, anon, authenticated;
revoke all on function public.add_ai_tokens(uuid, date, integer, integer) from public, anon, authenticated;
grant execute on function public.reserve_ai_call(uuid, date, integer) to service_role;
grant execute on function public.add_ai_tokens(uuid, date, integer, integer) to service_role;
