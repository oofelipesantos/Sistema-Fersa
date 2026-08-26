-- Fersa Support core schema. Apply with: supabase db push
create extension if not exists "pgcrypto";

create type public.user_role as enum ('DISTRIBUTOR', 'MECHANIC', 'SUPPORT', 'TECHNICIAN', 'ADMIN');
create type public.ticket_status as enum ('NEW', 'WAITING_SUPPORT', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'WAITING_TECHNICIAN', 'TECHNICIAN_ASSIGNED', 'VISIT_REQUIRED', 'VISIT_SCHEDULED', 'RESOLVED', 'CANCELLED');
create type public.ticket_priority as enum ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
create type public.message_visibility as enum ('CUSTOMER', 'INTERNAL');
create type public.organization_type as enum ('DISTRIBUTOR', 'WORKSHOP', 'CUSTOMER');
create type public.support_locale as enum ('pt-BR', 'es', 'en');

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = timezone('utc', now()); return new; end; $$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null, type public.organization_type not null,
  default_locale public.support_locale not null default 'pt-BR', active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.branches (
  id uuid primary key default gen_random_uuid(), name text not null, country text not null, state text, city text,
  latitude numeric(9,6), longitude numeric(9,6), active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, full_name text not null default '', role public.user_role not null default 'MECHANIC',
  organization_id uuid references public.organizations(id) on delete set null, preferred_locale public.support_locale not null default 'pt-BR', branch_id uuid references public.branches(id) on delete set null,
  active boolean not null default true, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.organization_members (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade, created_at timestamptz not null default timezone('utc', now()), unique(organization_id, profile_id)
);
create table public.branch_languages (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references public.branches(id) on delete cascade,
  locale public.support_locale not null, active boolean not null default true, unique(branch_id, locale)
);
create table public.branch_capabilities (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references public.branches(id) on delete cascade,
  product_family text, issue_category_id uuid, skill text, active boolean not null default true, created_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(), part_number text not null unique, family text not null, image_url text, active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.product_translations (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, locale public.support_locale not null,
  name text not null, description text not null default '', application text not null default '', features jsonb not null default '[]'::jsonb, unique(product_id, locale)
);
create table public.product_documents (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, locale public.support_locale not null,
  title text not null, file_url text not null, document_type text not null check (document_type in ('MANUAL', 'TECHNICAL_SHEET', 'INSTALLATION')),
  version text not null, active boolean not null default true, created_at timestamptz not null default timezone('utc', now()), unique(product_id, locale, title, version)
);
create table public.product_videos (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, locale public.support_locale not null,
  title text not null, video_url text not null, active boolean not null default true, created_at timestamptz not null default timezone('utc', now())
);
create table public.issue_categories (
  id uuid primary key default gen_random_uuid(), code text not null unique, active boolean not null default true, created_at timestamptz not null default timezone('utc', now())
);
alter table public.branch_capabilities add constraint branch_capabilities_issue_category_id_fkey foreign key (issue_category_id) references public.issue_categories(id) on delete set null;
create table public.issue_category_translations (
  id uuid primary key default gen_random_uuid(), issue_category_id uuid not null references public.issue_categories(id) on delete cascade, locale public.support_locale not null, name text not null, unique(issue_category_id, locale)
);
create table public.known_issues (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, issue_category_id uuid not null references public.issue_categories(id) on delete restrict,
  active boolean not null default true, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.known_issue_translations (
  id uuid primary key default gen_random_uuid(), known_issue_id uuid not null references public.known_issues(id) on delete cascade, locale public.support_locale not null,
  title text not null, description text not null default '', unique(known_issue_id, locale)
);
create table public.troubleshooting_steps (
  id uuid primary key default gen_random_uuid(), known_issue_id uuid not null references public.known_issues(id) on delete cascade, step_order integer not null check (step_order > 0),
  image_url text, video_url text, document_id uuid references public.product_documents(id) on delete set null, requires_confirmation boolean not null default false, unique(known_issue_id, step_order)
);
create table public.troubleshooting_step_translations (
  id uuid primary key default gen_random_uuid(), troubleshooting_step_id uuid not null references public.troubleshooting_steps(id) on delete cascade, locale public.support_locale not null,
  title text not null, description text not null default '', unique(troubleshooting_step_id, locale)
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(), number bigint generated always as identity unique, customer_id uuid not null references public.profiles(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete set null, product_id uuid not null references public.products(id) on delete restrict,
  issue_category_id uuid references public.issue_categories(id) on delete set null, status public.ticket_status not null default 'NEW', priority public.ticket_priority not null default 'MEDIUM',
  locale public.support_locale not null, customer_language public.support_locale not null, description text not null check (char_length(description) between 10 and 2000),
  equipment text, application text, model text, serial_number text, lot text, estimated_hours numeric(12,2) check (estimated_hours >= 0), quantity numeric(12,2) check (quantity > 0),
  country text, state text, city text, postal_code text, address text, latitude numeric(9,6), longitude numeric(9,6),
  branch_id uuid references public.branches(id) on delete set null, assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), resolved_at timestamptz
);
create table public.ticket_messages (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade, author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 5000), visibility public.message_visibility not null default 'CUSTOMER', locale public.support_locale not null,
  created_at timestamptz not null default timezone('utc', now())
);
create table public.ticket_attachments (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade, uploaded_by uuid not null references public.profiles(id) on delete restrict,
  storage_path text not null unique, file_name text not null, content_type text, size_bytes bigint check (size_bytes >= 0), created_at timestamptz not null default timezone('utc', now())
);
create table public.ticket_history (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade, actor_id uuid references public.profiles(id) on delete set null,
  action text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default timezone('utc', now())
);
create table public.ticket_assignments (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade, profile_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null, active boolean not null default true, created_at timestamptz not null default timezone('utc', now()), ended_at timestamptz
);
create unique index ticket_assignments_one_active on public.ticket_assignments(ticket_id) where active;
create table public.technical_visits (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.tickets(id) on delete cascade, technician_id uuid not null references public.profiles(id) on delete restrict,
  scheduled_at timestamptz, address text, latitude numeric(9,6), longitude numeric(9,6), diagnosis text, solution text, notes text, status text not null default 'PLANNED' check (status in ('PLANNED', 'SCHEDULED', 'COMPLETED', 'CANCELLED')),
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.visit_checklist_items (
  id uuid primary key default gen_random_uuid(), technical_visit_id uuid not null references public.technical_visits(id) on delete cascade, item_key text not null,
  completed boolean not null default false, notes text, unique(technical_visit_id, item_key)
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profiles(id) on delete cascade, type text not null, title text not null, body text not null,
  ticket_id uuid references public.tickets(id) on delete cascade, read_at timestamptz, created_at timestamptz not null default timezone('utc', now())
);

create index tickets_customer_idx on public.tickets(customer_id); create index tickets_org_idx on public.tickets(organization_id); create index tickets_branch_status_idx on public.tickets(branch_id, status); create index tickets_assigned_idx on public.tickets(assigned_to); create index tickets_locale_idx on public.tickets(locale); create index ticket_messages_ticket_idx on public.ticket_messages(ticket_id, created_at); create index technical_visits_technician_idx on public.technical_visits(technician_id, scheduled_at);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id, full_name, preferred_locale) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce((new.raw_user_meta_data->>'preferred_locale')::public.support_locale, 'pt-BR')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create trigger organizations_set_updated_at before update on public.organizations for each row execute procedure public.set_updated_at();
create trigger branches_set_updated_at before update on public.branches for each row execute procedure public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute procedure public.set_updated_at();
create trigger known_issues_set_updated_at before update on public.known_issues for each row execute procedure public.set_updated_at();
create trigger tickets_set_updated_at before update on public.tickets for each row execute procedure public.set_updated_at();
create trigger technical_visits_set_updated_at before update on public.technical_visits for each row execute procedure public.set_updated_at();

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false), ('product-images', 'product-images', true), ('manuals', 'manuals', false), ('ticket-attachments', 'ticket-attachments', false), ('technical-visits', 'technical-visits', false) on conflict (id) do nothing;
alter publication supabase_realtime add table public.tickets, public.ticket_messages, public.notifications;
