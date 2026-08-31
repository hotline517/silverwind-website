-- Supports Admin's Agents tab: last-login visibility, and disabling an
-- agent takes effect immediately (requireAgent already re-checks `active`
-- on every request, so no session-table/revocation-list is needed).
alter table agents add column if not exists last_login_at timestamptz;