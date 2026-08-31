-- Central inventory — one authoritative product/stock/price record that
-- the Admin Panel, website, and (later) chatbot all read from. Real CSV
-- exports inspected before writing this: 'Item Code' is the natural key,
-- stock is tracked per warehouse (tire export spans 7 warehouses), and
-- neither export has a price column — price is admin-entered only and
-- CSV import must never blank out an existing price.

DO $$ BEGIN
  create type inventory_change_field as enum ('stock', 'price');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create type inventory_change_source as enum ('CSV_IMPORT', 'ADMIN_MANUAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

create table if not exists inventory_products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,              -- CSV "Item Code"
  name text not null,                    -- CSV "Item Name"
  item_type text,                        -- CSV "Type", stored as-is (Magwheels, AMP Tires, Oil, ...)
  brand text,
  size text,                             -- e.g. "20x9"
  holes text,
  color text,
  pcd text,
  "offset" text,
  bore text,
  specifications text,
  price numeric(10,2),                   -- nullable — no source data in the CSVs; admin sets this by hand
  total_stock integer not null default 0, -- sum of inventory_stock_by_warehouse, kept in sync on write
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inventory_products_item_type_idx on inventory_products (item_type);

create table if not exists inventory_stock_by_warehouse (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references inventory_products(id) on delete cascade,
  warehouse text not null,
  quantity integer not null default 0,
  unique (product_id, warehouse)
);

-- One row per field change, so "what changed and why" is always visible —
-- covers both CSV-driven stock updates and admin manual price/stock edits.
create table if not exists inventory_change_history (
  id bigserial primary key,
  product_id uuid not null references inventory_products(id) on delete cascade,
  field inventory_change_field not null,
  old_value text,
  new_value text,
  source inventory_change_source not null,
  changed_by uuid references agents(id),
  created_at timestamptz not null default now()
);
create index if not exists inventory_change_history_product_id_created_at_idx on inventory_change_history (product_id, created_at);
