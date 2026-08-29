# Silverwind / DubShop

Wheels, tires, and 4x4 parts — customer website, dealer application, and
internal admin/agent tools.

## Structure

```
/
├── index.html              Home
├── shop.html               Tires
├── mags.html               Mags / wheels
├── 4x4.html                4x4 parts
├── contact.html            Contact
├── admin.html              Admin Panel (admin accounts only)
│
├── assets/
│   ├── css/                Stylesheets
│   ├── js/                 Frontend scripts + catalog data
│   └── images/             Product photography and brand assets
│
├── tire-calculator/        Tire size comparison tool
├── dealer-application/     Public 5-step dealer application
├── dealer-portal/          Agent-facing application review
│
└── dealer-backend/         Express + PostgreSQL API
    ├── src/
    │   ├── routes/         API endpoints
    │   ├── lib/            db, auth, validation helpers
    │   └── middleware/     Authorization
    ├── migrations/         SQL schema (run in filename order)
    └── scripts/            migrate, create-agent
```

## Who uses what

| Surface | Who | Auth |
|---|---|---|
| Website, Tire Calculator, Dealer Application, chatbot | Customers | none |
| Dealer Application Portal (`dealer-portal/`) | Agents | email + password |
| Admin Panel (`admin.html`) | Admins only | email + password |

Agent accounts are created by an admin in the Admin Panel's **Agents** tab.
There is no public sign-up.

## Running locally

**1. Backend**

```bash
cd dealer-backend
cp .env.example .env        # then fill in the values
npm install
npm run migrate             # applies migrations/*.sql in order
npm start                   # listens on PORT (default 4100)
```

Create the first admin account:

```bash
npm run create-agent -- --email=you@example.com --password='<choose one>' --name="Your Name" --role=admin
```

**2. Frontend** — any static file server from the project root:

```bash
python3 -m http.server 8901
```

Then open `http://localhost:8901`.

## Environment variables

Backend only (`dealer-backend/.env`). Never commit this file; never expose
these to frontend code.

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `JWT_SECRET` | yes | Long random string; signs agent session tokens |
| `ALLOWED_ORIGINS` | yes | Comma-separated origins allowed to call the API |
| `DATABASE_SSL` | no | `true` if your provider requires SSL |
| `PORT` | no | Defaults to 4100 |
| `NODE_ENV` | no | `production` enables secure cookies |

**Backend requires Node.js 16 or newer** (the `pg`, `helmet`, and
`express-rate-limit` packages all declare `>= 16`).

## API base URL

The frontend resolves the API from one place: `assets/js/api-config.js`.
It auto-detects the environment — localhost uses the local backend, any
real domain uses production. To go live, set `PRODUCTION_API_BASE` there.
That is the only line that changes between environments.

## Central inventory

Stock and price live in one place: the `inventory_products` table, managed
in the Admin Panel's **Inventory** tab (CSV import, manual edits, and full
change history). A website product opts into live data by setting its
**Linked inventory SKU**; unlinked products use their own stored values.

## Notes

- Catalog data for the storefront (`assets/js/products.js`,
  `mags-data.js`, `x4-data.js`) is browser-side and edited via the Admin
  Panel; it is separate from the central inventory above.
- Uploaded dealer documents are stored outside the repo and served only
  through authenticated endpoints.
