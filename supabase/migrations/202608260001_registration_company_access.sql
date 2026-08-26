-- Incremental registration, company verification and tenant-isolation update.
-- This migration intentionally does not modify the historical initial schema.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type public.verification_status as enum ('PENDING', 'VERIFIED', 'BLOCKED');
  end if;
end $$;

alter table public.organizations
  add column if not exists tax_document text,
  add column if not exists country text,
  add column if not exists verification_status public.verification_status not null default 'PENDING',
  add column if not exists verification_requested_at timestamptz not null default timezone('utc', now()),
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references public.profiles(id) on delete set null;

alter table public.profiles
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists accepted_terms_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tickets_estimated_hours_positive_integer'
  ) then
    alter table public.tickets add constraint tickets_estimated_hours_positive_integer
      check (estimated_hours is null or (estimated_hours > 0 and estimated_hours = trunc(estimated_hours))) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'tickets_quantity_positive_integer'
  ) then
    alter table public.tickets add constraint tickets_quantity_positive_integer
      check (quantity is null or (quantity > 0 and quantity = trunc(quantity))) not valid;
  end if;
end $$;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email)) where email is not null;
create index if not exists organizations_verification_idx
  on public.organizations (verification_status, created_at desc);

update public.tickets t
set organization_id = p.organization_id
from public.profiles p
where t.customer_id = p.id
  and t.organization_id is null
  and p.organization_id is not null;

do $$
begin
  if not exists (select 1 from public.tickets where organization_id is null) then
    alter table public.tickets alter column organization_id set not null;
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_organization_id uuid;
  requested_type public.organization_type;
  requested_role public.user_role;
  requested_locale public.support_locale;
begin
  requested_type := case new.raw_user_meta_data->>'organization_type'
    when 'DISTRIBUTOR' then 'DISTRIBUTOR'::public.organization_type
    when 'CUSTOMER' then 'CUSTOMER'::public.organization_type
    else 'WORKSHOP'::public.organization_type
  end;
  requested_role := case requested_type
    when 'DISTRIBUTOR' then 'DISTRIBUTOR'::public.user_role
    when 'CUSTOMER' then 'CUSTOMER'::public.user_role
    else 'MECHANIC'::public.user_role
  end;
  requested_locale := case new.raw_user_meta_data->>'preferred_locale'
    when 'es' then 'es'::public.support_locale
    when 'en' then 'en'::public.support_locale
    else 'pt-BR'::public.support_locale
  end;

  insert into public.organizations (
    name, type, tax_document, country, default_locale,
    verification_status, verification_requested_at
  ) values (
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'organization_name'), ''), 'New company'), 160),
    requested_type,
    left(coalesce(new.raw_user_meta_data->>'tax_document', ''), 30),
    left(coalesce(new.raw_user_meta_data->>'country', ''), 80),
    requested_locale,
    'PENDING',
    timezone('utc', now())
  ) returning id into new_organization_id;

  insert into public.profiles (
    id, full_name, email, phone, role, organization_id,
    preferred_locale, accepted_terms_at
  ) values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'full_name', ''), 120),
    new.email,
    left(coalesce(new.raw_user_meta_data->>'phone', ''), 30),
    requested_role,
    new_organization_id,
    requested_locale,
    coalesce(
      nullif(new.raw_user_meta_data->>'accepted_terms_at', '')::timestamptz,
      timezone('utc', now())
    )
  );

  insert into public.organization_members (organization_id, profile_id)
  values (new_organization_id, new.id)
  on conflict (organization_id, profile_id) do nothing;
  return new;
end;
$$;

create or replace function public.set_ticket_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select organization_id into new.organization_id
  from public.profiles
  where id = new.customer_id and active;
  if new.organization_id is null then
    raise exception 'CUSTOMER_ORGANIZATION_REQUIRED';
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_set_organization on public.tickets;
create trigger tickets_set_organization
before insert or update of customer_id on public.tickets
for each row execute procedure public.set_ticket_organization();

create schema if not exists private;
create or replace function private.current_role()
returns public.user_role language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() and active $$;
create or replace function private.current_branch_id()
returns uuid language sql stable security definer set search_path = public
as $$ select branch_id from public.profiles where id = auth.uid() and active $$;
create or replace function private.current_organization_id()
returns uuid language sql stable security definer set search_path = public
as $$ select organization_id from public.profiles where id = auth.uid() and active $$;
create or replace function private.is_internal()
returns boolean language sql stable security definer set search_path = public
as $$ select private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN') $$;
create or replace function private.can_manage_organizations()
returns boolean language sql stable security definer set search_path = public
as $$ select private.current_role() in ('SUPPORT', 'ADMIN') $$;
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select private.current_role() = 'ADMIN' $$;
create or replace function private.current_account_can_open_ticket()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.organizations o on o.id = p.organization_id
    where p.id = auth.uid()
      and p.active
      and o.active
      and o.verification_status in ('PENDING', 'VERIFIED')
      and p.role in ('DISTRIBUTOR', 'MECHANIC', 'CUSTOMER')
  )
$$;
create or replace function private.can_view_ticket(ticket public.tickets)
returns boolean language sql stable security definer set search_path = public
as $$
  select private.current_role() in ('ADMIN', 'SUPPORT')
    or ticket.customer_id = auth.uid()
    or (
      private.current_role() = 'TECHNICIAN'
      and ticket.assigned_to = auth.uid()
    )
$$;
create or replace function private.can_manage_ticket(ticket public.tickets)
returns boolean language sql stable security definer set search_path = public
as $$
  select private.current_role() in ('ADMIN', 'SUPPORT')
    or (
      private.current_role() = 'TECHNICIAN'
      and ticket.assigned_to = auth.uid()
    )
$$;

create or replace function public.review_organization(
  target_organization_id uuid,
  next_status public.verification_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.can_manage_organizations() then
    raise exception 'ACCESS_DENIED';
  end if;
  if exists (
    select 1 from public.profiles
    where organization_id = target_organization_id
      and role in ('ADMIN', 'SUPPORT', 'TECHNICIAN')
  ) then
    raise exception 'PROTECTED_INTERNAL_ORGANIZATION';
  end if;
  update public.organizations
  set verification_status = next_status,
      active = next_status <> 'BLOCKED',
      verified_at = case when next_status = 'VERIFIED' then timezone('utc', now()) else null end,
      verified_by = auth.uid(),
      updated_at = timezone('utc', now())
  where id = target_organization_id;
  if not found then raise exception 'ORGANIZATION_NOT_FOUND'; end if;
  update public.profiles
  set active = next_status <> 'BLOCKED', updated_at = timezone('utc', now())
  where organization_id = target_organization_id;
end;
$$;

revoke all on function public.review_organization(uuid, public.verification_status) from public;
grant execute on function public.review_organization(uuid, public.verification_status) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_attachments enable row level security;
alter table public.ticket_history enable row level security;

drop policy if exists "profiles own or admin" on public.profiles;
drop policy if exists "profiles update own locale" on public.profiles;
create policy "profiles authorized read" on public.profiles for select
using (
  id = auth.uid()
  or private.can_manage_organizations()
);
create policy "profiles update own" on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name, phone, preferred_locale) on public.profiles to authenticated;

drop policy if exists "organizations members read" on public.organizations;
create policy "organizations authorized read" on public.organizations for select
using (id = private.current_organization_id() or private.can_manage_organizations());

drop policy if exists "organization members read own" on public.organization_members;
create policy "organization membership authorized read" on public.organization_members for select
using (
  profile_id = auth.uid()
  or private.can_manage_organizations()
);

drop policy if exists "ticket authorized read" on public.tickets;
drop policy if exists "customer creates own ticket" on public.tickets;
drop policy if exists "staff updates ticket" on public.tickets;
drop policy if exists "admins delete ticket" on public.tickets;
create policy "ticket authorized read" on public.tickets for select
using (private.can_view_ticket(tickets));
create policy "customer creates own ticket" on public.tickets for insert
with check (
  customer_id = auth.uid()
  and organization_id = private.current_organization_id()
  and private.current_account_can_open_ticket()
);
create policy "staff updates ticket" on public.tickets for update
using (private.can_manage_ticket(tickets))
with check (private.can_manage_ticket(tickets));
create policy "admins delete ticket" on public.tickets for delete
using (private.is_admin());

-- Relational rows inherit ticket visibility. Internal messages stay internal.
drop policy if exists "message authorized read" on public.ticket_messages;
drop policy if exists "message authorized write" on public.ticket_messages;
create policy "message authorized read" on public.ticket_messages for select
using (
  exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t))
  and (visibility = 'CUSTOMER' or private.is_internal())
);
create policy "message authorized write" on public.ticket_messages for insert
with check (
  author_id = auth.uid()
  and exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t))
  and (visibility = 'CUSTOMER' or private.is_internal())
);

drop policy if exists "attachments authorized read" on public.ticket_attachments;
drop policy if exists "attachments authorized write" on public.ticket_attachments;
create policy "attachments authorized read" on public.ticket_attachments for select
using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "attachments authorized write" on public.ticket_attachments for insert
with check (
  uploaded_by = auth.uid()
  and exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t))
);

-- Product manuals are public content, while ticket evidence stays private.
update storage.buckets set public = true where id = 'manuals';
drop policy if exists "manuals staff read" on storage.objects;
drop policy if exists "public manuals read" on storage.objects;
create policy "public manuals read" on storage.objects for select
using (bucket_id = 'manuals');

drop policy if exists "ticket files authorized read" on storage.objects;
drop policy if exists "ticket files authorized insert" on storage.objects;
drop policy if exists "ticket files authorized delete" on storage.objects;
create policy "ticket files authorized read" on storage.objects for select to authenticated
using (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1
    from public.ticket_attachments a
    join public.tickets t on t.id = a.ticket_id
    where a.storage_path = name and private.can_view_ticket(t)
  )
);
create policy "ticket files authorized insert" on storage.objects for insert to authenticated
with check (
  bucket_id = 'ticket-attachments'
  and (storage.foldername(name))[1] = private.current_organization_id()::text
  and exists (
    select 1 from public.tickets t
    where t.id::text = (storage.foldername(name))[2]
      and t.organization_id = private.current_organization_id()
      and private.can_view_ticket(t)
  )
);
create policy "ticket files authorized delete" on storage.objects for delete to authenticated
using (
  bucket_id = 'ticket-attachments'
  and exists (
    select 1 from public.tickets t
    where t.id::text = (storage.foldername(name))[2]
      and private.can_view_ticket(t)
  )
);

comment on function private.can_view_ticket(public.tickets) is
  'Common users can only read their own tickets. Support/admin can read all; technicians only assigned tickets.';
