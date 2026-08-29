-- SACI / Silverwind Dealer Application — schema
-- Plain PostgreSQL. No Supabase-specific features (no auth.uid(), no RLS —
-- authorization happens in the API layer instead, since the app has no
-- database-level session context to key RLS policies off of).

create extension if not exists pgcrypto; -- gen_random_uuid()

create type application_status as enum (
  'NEW', 'UNDER_REVIEW', 'CONTACTED', 'QUALIFIED', 'APPROVED', 'REJECTED'
);

create type property_status as enum ('OWNED', 'RENTED');

create type agent_role as enum ('agent', 'admin');

-- Internal staff only. Applicants never get a row here — they don't need
-- an account per the current spec (public wizard, no login).
create table agents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  role agent_role not null default 'agent',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table dealer_applications (
  id uuid primary key default gen_random_uuid(),
  application_reference text unique not null,   -- assigned atomically on submit, e.g. SWD-2026-000001
  status application_status not null default 'NEW',
  assigned_agent_id uuid references agents(id),

  -- Step 1 — Business Information
  business_name text not null,
  business_type text,
  contact_person text not null,
  contact_position text,
  business_address text not null,
  city text not null,
  province text not null,
  postal_code text,
  contact_number text not null,
  email text not null,
  website text,
  facebook_page text,
  years_in_business text,

  -- Step 2 — Business / Property Information
  store_address text,
  property_status property_status,
  store_size text,
  operation_info text,
  location_notes text,

  -- Step 5 — Declaration
  declaration_accepted boolean not null default false,
  declaration_accepted_at timestamptz,
  declaration_text_version text,   -- 'PENDING' while DECLARATION_TEXT is not yet supplied

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz not null default now()
);
create index on dealer_applications (status);
create index on dealer_applications (assigned_agent_id);

-- One row per uploaded file. stored_filename is a random name on disk —
-- never trust or reuse the client-supplied original_filename for storage.
create table application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references dealer_applications(id) on delete cascade,
  document_type text not null,        -- BUSINESS_PERMIT, VALID_ID, STORE_PHOTO, OTHER
  original_filename text not null,
  stored_filename text not null unique,
  mime_type text not null,
  file_size integer not null,
  uploaded_at timestamptz not null default now()
);
create index on application_documents (application_id);

create table application_references (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references dealer_applications(id) on delete cascade,
  position smallint not null,
  reference_name text not null,
  company text,
  contact_number text,
  email text,
  relationship text,
  years_known text,
  notes text
);
create index on application_references (application_id);

create table application_status_history (
  id bigserial primary key,
  application_id uuid not null references dealer_applications(id) on delete cascade,
  agent_id uuid references agents(id),
  from_status application_status,
  to_status application_status not null,
  created_at timestamptz not null default now()
);

-- Internal only. The applicant has no account and no route that could ever
-- read this table — enforced in the API layer (no public endpoint touches it).
create table application_notes (
  id bigserial primary key,
  application_id uuid not null references dealer_applications(id) on delete cascade,
  agent_id uuid not null references agents(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table application_counters (
  year int primary key,
  last_seq int not null default 0
);

-- Atomic reference number. Never max(...)+1 — two concurrent submits
-- would collide.
create or replace function next_application_reference() returns text
language plpgsql as $$
declare y int := extract(year from now())::int; n int;
begin
  insert into application_counters (year, last_seq) values (y, 1)
  on conflict (year) do update set last_seq = application_counters.last_seq + 1
  returning last_seq into n;
  return 'SWD-' || y || '-' || lpad(n::text, 6, '0');
end $$;
