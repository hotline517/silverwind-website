-- 0004_catalog.sql: Catalog items (tires, mags, fourxfour) and site settings
CREATE TABLE IF NOT EXISTS catalog_items (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('tire', 'mag', 'fourxfour')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_catalog_kind_sort ON catalog_items (kind, sort_order);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);