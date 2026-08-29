# Silverwind Website — Complete Summary

Last updated: 6 August 2026

---

## What the site is

A dealer-facing catalog website for the mags, tires, and 4x4 business.
Four sections in the nav: **Mags · 4x4 · Tire**, plus a hamburger menu
holding **Home** and **Contact**.

Everything is plain HTML/CSS/JavaScript — no server, no database, no
build step. Upload the files to any hosting and it works.

---

## Catalog contents

| Section | Items | Source |
|---|---|---|
| **Tires** | 329 sizes | 7 brand pricelist PDFs |
| **Mags** | 69 rows | 4 brand pricelists + photo folders |
| **4x4** | 141 items | 8 supplier pricelist spreadsheets |
| **Product photos** | 99 images | Extracted from PDFs + Drive folders |

### Tires — 7 brands, 329 sizes
Winrun · Sumaxx · Forceland · Lenso · Raiden · Maxtrek · AMP

Every individual size is its own row with its real price from the
supplier pricelist. Filters: Tread (width), Sidewall (aspect ratio),
Rim Size, Size (full size string), Brand, Category.

### Mags — 69 rows
| Brand | Notes |
|---|---|
| Black Mamba | 15 models (Kenzo, Swagg, Helix, GR6, JTBM1, KF926, N2412, SRFF123/124/125, FBX388 Strata, 5840 Devastator, F22318 Aomori, 5774 Frostbite, SR102) |
| 305 Forged Wheels | 5 models (UF140, UF151, UF175, UF179, FT124) |
| TSR | 12 models (TS07, DX035, TSR09, ADVAN, TE37, CTWGT, TSR15, XY09, XY66, DX541, TSR18) |
| TWG / Ion | 3 models (Ion 146, TR93, 8303) |
| Rep Wheels | 13 models incl. RAYS/Volk replicas (TE37XT, TE37P2, ZE40X, GR, FBX377, 509, SR97, SR99, SR17, SR118, TE37SL Sonic) |
| On Sale | 20+ items across Raffa, AD Wheels, Kalon, Vortek |

Filters: Brand, **Holes (bolt pattern)**, Rim Size. Holes is a primary
filter because mag pricing depends on it.

### 4x4 — 141 items, 8 brands
| Brand | Products |
|---|---|
| Option 4WD | Front/rear bumpers, upper control arms, side steps, roof racks, UVP skid plates |
| Explorer | Suspension — Comfort 2.0, Compact 8-Way, GT Series Monotube |
| Gearmate | Modularis canopies, kitchen shelves, roller lid, trifold cover |
| TJM | Seeker driving lights, air compressor, aluminum canopy, exhaust, recovery straps, Wolf mag wheel |
| T-MAX | E-Boards for ~18 vehicles, EW winches, recovery gear, jerry cans |
| WARN | ZEON / VR EVO / Tabor / AXON / M8274 winches, Epic recovery kits |
| Oledone | Hyaline, Meteor, Hubble, Blacknight, Origin light bars |
| Journey Tires | Digger, Claw XTR extreme mud terrain, X-Razor RT |

Filters: Brand, Category (22 categories). These rows are text-first —
the supplier pricelists had no product photos.

---

## Features

- **Search** on every catalog page — matches brand, model, size, spec
- **Multi-select filter dropdowns** (checkbox style)
- **Sort** by price, brand, or size (smallest to largest)
- **Click any product photo to zoom** — full-size lightbox
- **Contact Us button** on every row — opens an inquiry popup with the
  product details and your phone numbers
- **Mobile responsive** — nav, search, and filters all sized for phones
- **Animations** — page entrance, staggered row reveals, hover effects.
  Respects the "reduce motion" accessibility setting.

---

## Admin panel

**File:** `admin.html` → visit `yoursite.com/admin.html`
**Sign in:** your admin **email + password** (a real account, checked by
the backend — there is no shared site-wide password any more).

Six tabs:
1. **Tires** — add / edit / delete
2. **Mags** — add / edit / delete
3. **4x4** — add / edit / delete
4. **Site text & contact** — phone numbers, page titles, hero text
5. **Inventory** — central stock/price, CSV import, change history
6. **Agents** — create / disable / reset agent accounts

Also includes **Download backup** / **Restore from backup** / **Reset to
original catalog**.

### Admin accounts
Accounts live in the database with bcrypt-hashed passwords — never in
source code. Create the first admin with:

```
cd dealer-backend
npm run create-agent -- --email=you@example.com --password='<choose one>' --name="Your Name" --role=admin
```

After that, further agent accounts are created from the Admin Panel's
**Agents** tab. To change a password, use **Reset password** there.

### Important limitation
There is no server or database. The admin panel saves everything to
**the browser you're using**. That means:

- Edits made on your laptop show up on that browser.
- Clearing your browser's site data, or switching to a different
  browser/computer, starts you back at the original catalog.
- **Download a backup after every editing session** (button in the
  Site text & contact tab) and keep the file somewhere safe.

If the business outgrows this, a real database (e.g. Supabase, free to
start) can be added later — the current Tires/Mags/4x4/Settings
structure carries over directly without rebuilding the site.

---

## How to upload to your hosting (Namecheap)

1. Log in at **ap.www.namecheap.com** → open **cPanel**
2. Open **File Manager** → go to **`public_html`**
3. **Delete everything already in `public_html`** (there were old files
   from a previous project causing conflicts)
4. Click **Upload** → upload `silverwind-portfolio.zip`
5. Right-click the zip → **Extract**
6. Open the extracted `silverwind-portfolio` folder, select all its
   contents, and **Move** them up into `public_html` itself — not left
   inside the subfolder. Then delete the empty folder and the zip.
7. Visit your domain to check. Then check `yoursite.com/admin.html`.
8. If the browser shows "Not Secure", enable free SSL in
   cPanel → **SSL/TLS Status** or **AutoSSL**.

---

## Files in this folder

| File | What it is |
|---|---|
| `index.html` | Home page (hero + category tiles + contact) |
| `mags.html` | Mags catalog |
| `shop.html` | Tire catalog |
| `4x4.html` | 4x4 catalog |
| `admin.html` | Admin panel |
| `styles.css` | All site styling |
| `admin.css` | Admin panel styling |
| `products.js` | Tire catalog data |
| `mags-data.js` | Mag catalog data |
| `x4-data.js` | 4x4 catalog data |
| `db.js` | Data layer (loads + saves the catalog) |
| `shop.js` / `mags.js` / `x4.js` | Catalog page logic |
| `motion.js` | Animations + nav menu |
| `product-modal.js` | Contact Us inquiry popup |
| `image-zoom.js` | Click-to-zoom lightbox |
| `assets/` | All product photos |
| `SETUP.md` | Admin panel setup notes |

---

## Still to do

- **Real contact numbers** — currently placeholders
  (`0916-XXX-XXXX` / `8XXX-XXXX`). Change them in the admin panel under
  **Site text & contact**, or edit the HTML directly.
- **4x4 product photos** — none available in the supplier pricelists.
  If there's a separate photo folder, they can be added.
- **On Sale / Rep Wheels** — a few more Drive images may still exist;
  Google Drive's search only returns 10 files per query, so deep
  folders need repeated passes.
- **Some mag sizes** show `?` (e.g. `17x?`) where the pricelist didn't
  specify a width — these can be filled in via the admin panel.
