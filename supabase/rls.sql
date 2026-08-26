-- Apply after the initial schema. These policies enforce authorization in PostgreSQL,
-- independent of route visibility or frontend role checks.
create schema if not exists private;
create or replace function private.current_role() returns public.user_role language sql stable security definer set search_path = public as $$ select role from public.profiles where id = auth.uid() $$;
create or replace function private.current_branch_id() returns uuid language sql stable security definer set search_path = public as $$ select branch_id from public.profiles where id = auth.uid() $$;
create or replace function private.current_organization_id() returns uuid language sql stable security definer set search_path = public as $$ select organization_id from public.profiles where id = auth.uid() $$;
create or replace function private.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select private.current_role() = 'ADMIN' $$;
create or replace function private.can_view_ticket(ticket public.tickets) returns boolean language sql stable security definer set search_path = public as $$
  select private.is_admin()
    or ticket.customer_id = auth.uid()
    or (ticket.organization_id is not null and ticket.organization_id = private.current_organization_id() and private.current_role() in ('DISTRIBUTOR', 'MECHANIC'))
    or (ticket.branch_id is not null and ticket.branch_id = private.current_branch_id() and private.current_role() = 'SUPPORT')
    or (ticket.assigned_to = auth.uid() and private.current_role() = 'TECHNICIAN')
$$;
create or replace function private.can_manage_ticket(ticket public.tickets) returns boolean language sql stable security definer set search_path = public as $$
  select private.is_admin()
    or (ticket.branch_id = private.current_branch_id() and private.current_role() = 'SUPPORT')
    or (ticket.assigned_to = auth.uid() and private.current_role() = 'TECHNICIAN')
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
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
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_attachments enable row level security;
alter table public.ticket_history enable row level security;
alter table public.ticket_assignments enable row level security;
alter table public.technical_visits enable row level security;
alter table public.visit_checklist_items enable row level security;
alter table public.notifications enable row level security;

create policy "profiles own or admin" on public.profiles for select using (id = auth.uid() or private.is_admin());
create policy "profiles update own locale" on public.profiles for update using (id = auth.uid() or private.is_admin()) with check (id = auth.uid() or private.is_admin());
create policy "organizations members read" on public.organizations for select using (id = private.current_organization_id() or private.is_admin());
create policy "organization members read own" on public.organization_members for select using (profile_id = auth.uid() or organization_id = private.current_organization_id() or private.is_admin());
create policy "branches staff read" on public.branches for select using (private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN'));
create policy "branches admins write" on public.branches for all using (private.is_admin()) with check (private.is_admin());
create policy "branch languages staff read" on public.branch_languages for select using (private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN'));
create policy "branch languages admins write" on public.branch_languages for all using (private.is_admin()) with check (private.is_admin());
create policy "branch capabilities staff read" on public.branch_capabilities for select using (private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN'));
create policy "branch capabilities admins write" on public.branch_capabilities for all using (private.is_admin()) with check (private.is_admin());

create policy "public active products" on public.products for select using (active);
create policy "admins manage products" on public.products for all using (private.is_admin()) with check (private.is_admin());
create policy "public product translations" on public.product_translations for select using (true);
create policy "admins manage product translations" on public.product_translations for all using (private.is_admin()) with check (private.is_admin());
create policy "public active documents" on public.product_documents for select using (active);
create policy "admins manage documents" on public.product_documents for all using (private.is_admin()) with check (private.is_admin());
create policy "public active videos" on public.product_videos for select using (active);
create policy "admins manage videos" on public.product_videos for all using (private.is_admin()) with check (private.is_admin());
create policy "public categories" on public.issue_categories for select using (active);
create policy "public category translations" on public.issue_category_translations for select using (true);
create policy "public known issues" on public.known_issues for select using (active);
create policy "public known issue translations" on public.known_issue_translations for select using (true);
create policy "public troubleshooting" on public.troubleshooting_steps for select using (true);
create policy "public troubleshooting translations" on public.troubleshooting_step_translations for select using (true);
create policy "admins manage knowledge categories" on public.issue_categories for all using (private.is_admin()) with check (private.is_admin());
create policy "admins manage category translations" on public.issue_category_translations for all using (private.is_admin()) with check (private.is_admin());
create policy "admins manage known issues" on public.known_issues for all using (private.is_admin()) with check (private.is_admin());
create policy "admins manage known issue translations" on public.known_issue_translations for all using (private.is_admin()) with check (private.is_admin());
create policy "admins manage troubleshooting" on public.troubleshooting_steps for all using (private.is_admin()) with check (private.is_admin());
create policy "admins manage troubleshooting translations" on public.troubleshooting_step_translations for all using (private.is_admin()) with check (private.is_admin());

create policy "ticket authorized read" on public.tickets for select using (private.can_view_ticket(tickets));
create policy "customer creates own ticket" on public.tickets for insert with check (customer_id = auth.uid() and private.current_role() in ('DISTRIBUTOR', 'MECHANIC'));
create policy "staff updates ticket" on public.tickets for update using (private.can_manage_ticket(tickets)) with check (private.can_manage_ticket(tickets));
create policy "admins delete ticket" on public.tickets for delete using (private.is_admin());
create policy "message authorized read" on public.ticket_messages for select using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)) and (visibility = 'CUSTOMER' or private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN')));
create policy "message authorized write" on public.ticket_messages for insert with check (author_id = auth.uid() and exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)) and (visibility = 'CUSTOMER' or private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN')));
create policy "attachments authorized read" on public.ticket_attachments for select using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "attachments authorized write" on public.ticket_attachments for insert with check (uploaded_by = auth.uid() and exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "history authorized read" on public.ticket_history for select using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "staff writes history" on public.ticket_history for insert with check (actor_id = auth.uid() and exists (select 1 from public.tickets t where t.id = ticket_id and private.can_manage_ticket(t)));
create policy "assignments authorized read" on public.ticket_assignments for select using (exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "staff manages assignments" on public.ticket_assignments for all using (private.current_role() in ('SUPPORT', 'ADMIN')) with check (private.current_role() in ('SUPPORT', 'ADMIN'));
create policy "visits authorized read" on public.technical_visits for select using (technician_id = auth.uid() or exists (select 1 from public.tickets t where t.id = ticket_id and private.can_view_ticket(t)));
create policy "staff manages visits" on public.technical_visits for all using (technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN')) with check (technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'));
create policy "checklist authorized read" on public.visit_checklist_items for select using (exists (select 1 from public.technical_visits v where v.id = technical_visit_id and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))));
create policy "checklist authorized write" on public.visit_checklist_items for all using (exists (select 1 from public.technical_visits v where v.id = technical_visit_id and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN')))) with check (exists (select 1 from public.technical_visits v where v.id = technical_visit_id and (v.technician_id = auth.uid() or private.current_role() in ('SUPPORT', 'ADMIN'))));
create policy "notifications own" on public.notifications for select using (profile_id = auth.uid());
create policy "notifications update own" on public.notifications for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

alter table storage.objects enable row level security;
create policy "public product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "authenticated avatars own folder" on storage.objects for all to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "ticket files authorized read" on storage.objects for select to authenticated using (bucket_id = 'ticket-attachments' and exists (select 1 from public.ticket_attachments a join public.tickets t on t.id = a.ticket_id where a.storage_path = name and private.can_view_ticket(t)));
create policy "ticket files authorized insert" on storage.objects for insert to authenticated with check (bucket_id = 'ticket-attachments' and (storage.foldername(name))[1] = private.current_organization_id()::text);
create policy "manuals staff read" on storage.objects for select to authenticated using (bucket_id = 'manuals' and private.current_role() in ('SUPPORT', 'TECHNICIAN', 'ADMIN'));
create policy "manuals admins write" on storage.objects for all to authenticated using (bucket_id = 'manuals' and private.is_admin()) with check (bucket_id = 'manuals' and private.is_admin());
create policy "technical visit files staff" on storage.objects for all to authenticated using (bucket_id = 'technical-visits' and private.current_role() in ('TECHNICIAN', 'SUPPORT', 'ADMIN')) with check (bucket_id = 'technical-visits' and private.current_role() in ('TECHNICIAN', 'SUPPORT', 'ADMIN'));
