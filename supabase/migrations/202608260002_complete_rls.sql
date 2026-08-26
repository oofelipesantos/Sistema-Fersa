-- Complete idempotent RLS baseline for projects provisioned only with migrations.
-- Registration/ticket policies are defined by the preceding migration.

alter table public.branches enable row level security;
alter table public.branch_languages enable row level security;
alter table public.branch_capabilities enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_documents enable row level security;
alter table public.product_videos enable row level security;
alter table public.issue_categories enable row level security;
alter table public.issue_category_translations enable row level security;
alter table public.known_issues enable row level security;
alter table public.known_issue_translations enable row level security;
alter table public.troubleshooting_steps enable row level security;
alter table public.troubleshooting_step_translations enable row level security;
alter table public.ticket_assignments enable row level security;
alter table public.technical_visits enable row level security;
alter table public.visit_checklist_items enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "branches staff read" on public.branches;
drop policy if exists "branches admins write" on public.branches;
create policy "branches staff read" on public.branches for select
using (private.is_internal());
create policy "branches admins write" on public.branches for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "branch languages staff read" on public.branch_languages;
drop policy if exists "branch languages admins write" on public.branch_languages;
create policy "branch languages staff read" on public.branch_languages for select
using (private.is_internal());
create policy "branch languages admins write" on public.branch_languages for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "branch capabilities staff read" on public.branch_capabilities;
drop policy if exists "branch capabilities admins write" on public.branch_capabilities;
create policy "branch capabilities staff read" on public.branch_capabilities for select
using (private.is_internal());
create policy "branch capabilities admins write" on public.branch_capabilities for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public active products" on public.products;
drop policy if exists "admins manage products" on public.products;
create policy "public active products" on public.products for select using (active);
create policy "admins manage products" on public.products for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public product translations" on public.product_translations;
drop policy if exists "admins manage product translations" on public.product_translations;
create policy "public product translations" on public.product_translations for select using (true);
create policy "admins manage product translations" on public.product_translations for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public active documents" on public.product_documents;
drop policy if exists "admins manage documents" on public.product_documents;
create policy "public active documents" on public.product_documents for select using (active);
create policy "admins manage documents" on public.product_documents for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public active videos" on public.product_videos;
drop policy if exists "admins manage videos" on public.product_videos;
create policy "public active videos" on public.product_videos for select using (active);
create policy "admins manage videos" on public.product_videos for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public categories" on public.issue_categories;
drop policy if exists "admins manage knowledge categories" on public.issue_categories;
create policy "public categories" on public.issue_categories for select using (active);
create policy "admins manage knowledge categories" on public.issue_categories for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public category translations" on public.issue_category_translations;
drop policy if exists "admins manage category translations" on public.issue_category_translations;
create policy "public category translations" on public.issue_category_translations for select using (true);
create policy "admins manage category translations" on public.issue_category_translations for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public known issues" on public.known_issues;
drop policy if exists "admins manage known issues" on public.known_issues;
create policy "public known issues" on public.known_issues for select using (active);
create policy "admins manage known issues" on public.known_issues for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public known issue translations" on public.known_issue_translations;
drop policy if exists "admins manage known issue translations" on public.known_issue_translations;
create policy "public known issue translations" on public.known_issue_translations for select using (true);
create policy "admins manage known issue translations" on public.known_issue_translations for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public troubleshooting" on public.troubleshooting_steps;
drop policy if exists "admins manage troubleshooting" on public.troubleshooting_steps;
create policy "public troubleshooting" on public.troubleshooting_steps for select using (true);
create policy "admins manage troubleshooting" on public.troubleshooting_steps for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public troubleshooting translations" on public.troubleshooting_step_translations;
drop policy if exists "admins manage troubleshooting translations" on public.troubleshooting_step_translations;
create policy "public troubleshooting translations" on public.troubleshooting_step_translations for select using (true);
create policy "admins manage troubleshooting translations" on public.troubleshooting_step_translations for all
using (private.is_admin()) with check (private.is_admin());

drop policy if exists "assignments authorized read" on public.ticket_assignments;
drop policy if exists "staff manages assignments" on public.ticket_assignments;
create policy "assignments authorized read" on public.ticket_assignments for select
using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "staff manages assignments" on public.ticket_assignments for all
using (private.current_role() in ('SUPPORT', 'ADMIN'))
with check (private.current_role() in ('SUPPORT', 'ADMIN'));

drop policy if exists "visits authorized read" on public.technical_visits;
drop policy if exists "staff manages visits" on public.technical_visits;
create policy "visits authorized read" on public.technical_visits for select
using (
  technician_id = auth.uid()
  or exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t))
);
create policy "staff manages visits" on public.technical_visits for all
using (technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))
with check (technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'));

drop policy if exists "checklist authorized read" on public.visit_checklist_items;
drop policy if exists "checklist authorized write" on public.visit_checklist_items;
create policy "checklist authorized read" on public.visit_checklist_items for select
using (
  exists (
    select 1 from public.technical_visits v
    where v.id = technical_visit_id
      and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))
  )
);
create policy "checklist authorized write" on public.visit_checklist_items for all
using (
  exists (
    select 1 from public.technical_visits v
    where v.id = technical_visit_id
      and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))
  )
)
with check (
  exists (
    select 1 from public.technical_visits v
    where v.id = technical_visit_id
      and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))
  )
);

drop policy if exists "notifications own" on public.notifications;
drop policy if exists "notifications update own" on public.notifications;
create policy "notifications own" on public.notifications for select
using (profile_id = auth.uid());
create policy "notifications update own" on public.notifications for update
using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table storage.objects enable row level security;
drop policy if exists "public product images" on storage.objects;
create policy "public product images" on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "authenticated avatars own folder" on storage.objects;
create policy "authenticated avatars own folder" on storage.objects for all to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "manuals admins write" on storage.objects;
create policy "manuals admins write" on storage.objects for all to authenticated
using (bucket_id = 'manuals' and private.is_admin())
with check (bucket_id = 'manuals' and private.is_admin());

drop policy if exists "technical visit files staff" on storage.objects;
create policy "technical visit files staff" on storage.objects for all to authenticated
using (bucket_id = 'technical-visits' and private.current_role() in ('TECHNICIAN', 'SUPPORT', 'ADMIN'))
with check (bucket_id = 'technical-visits' and private.current_role() in ('TECHNICIAN', 'SUPPORT', 'ADMIN'));
