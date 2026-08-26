-- Run against a disposable local Supabase database after migrations.
-- The transaction is rolled back and proves that RLS hides another user's ticket.
begin;

do $$
declare
  user_a uuid := gen_random_uuid();
  user_b uuid := gen_random_uuid();
  org_a uuid := gen_random_uuid();
  org_b uuid := gen_random_uuid();
  product uuid;
  ticket_b uuid;
  visible_count integer;
begin
  select id into product from public.products limit 1;
  if product is null then
    raise notice 'Isolation test skipped: seed at least one product first.';
    return;
  end if;

  insert into auth.users (id, aud, role, email, encrypted_password)
  values
    (user_a, 'authenticated', 'authenticated', 'rls-a@fersa.test', ''),
    (user_b, 'authenticated', 'authenticated', 'rls-b@fersa.test', '');
  select organization_id into org_a from public.profiles where id = user_a;
  select organization_id into org_b from public.profiles where id = user_b;
  update public.organizations set verification_status = 'VERIFIED' where id in (org_a, org_b);
  insert into public.tickets (
    customer_id, organization_id, product_id, locale, customer_language, description
  ) values (
    user_b, org_b, product, 'en', 'en', 'RLS isolation test ticket'
  ) returning id into ticket_b;

  perform set_config('request.jwt.claim.sub', user_a::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  execute 'set local role authenticated';
  select count(*) into visible_count from public.tickets where id = ticket_b;
  if visible_count <> 0 then
    raise exception 'RLS isolation failed: user A can see user B ticket';
  end if;
end $$;

rollback;
