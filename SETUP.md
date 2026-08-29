# Silverwind — Admin Panel

No account, no database setup needed. Everything is built into the site.

## How to use it

1. Upload the whole site (all files) to your hosting, keeping them in the
   same folder together.
2. Go to `yoursite.com/admin.html`.
3. Sign in with your admin email and password (see "Dealer Application &
   Agents" below — admin sign-in is now a real, server-checked account,
   not a shared password).
4. Add, edit, or delete anything under the **Tires**, **Mags**, **4x4**,
   and **Site text & contact** tabs. Changes appear on the live site as
   soon as you refresh the page.

## Dealer Application & Agents

The **Dealer Application** (`dealer-application/`) and its internal review
side (`dealer-portal/` + the Admin Panel's **Agents** tab) are a separate
system from the Tires/Mags/4x4/Settings tabs above — they run on a real
backend and a real Postgres database (`dealer-backend/`), not the browser's
storage.

- **Admin sign-in** (`admin.html`) now checks against that same backend —
  create your first admin account with `dealer-backend/scripts/create-agent.js
  --role=admin` (see `dealer-backend/README` if present, or ask for help).
- **Agent accounts** (staff who only review dealer applications, not the
  rest of the site) are created from the Admin Panel's **Agents** tab. They
  sign in separately at `dealer-portal/index.html` — they never see this
  Admin Panel.
- The backend needs `dealer-backend/.env` filled in with your real
  `DATABASE_URL` and it needs to actually be running somewhere that can
  execute Node.js (your static hosting can't) before any of this is live.
  See `dealer-backend/.env.example`.

## The one important limitation

There's no server or database — the admin panel saves everything to
**the browser you're using**. That means:

- If you edit from your laptop, those edits show up on your laptop's
  browser and on the **live site for everyone**, because the site pages
  read the same saved data. ✅
- BUT if you clear your browser's site data/cookies, or switch to a
  different browser/computer to make edits, you won't see your previous
  edits there — it starts back at the original catalog.
- **Always download a backup** after making edits (button in the
  **Site text & contact** tab → "⬇ Download backup"). Keep that file
  somewhere safe. If anything resets, use "⬆ Restore from backup" to
  bring it all back instantly.

## If you outgrow this later

If the business grows and you want the admin panel to work from *any*
device/browser (not just the one you set it up on), the next step is a
real database (e.g. Supabase — free to start). Just ask, and it can be
added without rebuilding the site from scratch — the current
Tires/Mags/4x4/Settings structure carries over directly.
