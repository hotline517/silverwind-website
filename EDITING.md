# Editing the Silverwind site

Two ways to change what's on the site. Pick whichever suits the job.

---

## Option 1 — the admin panel (easiest)

Go to `yoursite.com/admin.html` and sign in with your admin email and
password (a real account — there is no shared site-wide password).

Six tabs: **Tires**, **Mags**, **4x4**, **Site text & contact**,
**Inventory**, **Agents**.
Each row has an **Edit** button; each tab has an **+ Add** button.

Good for: changing a price, marking something out of stock, adding a
handful of products, updating your phone numbers or page headings.

**Remember the limitation:** the admin panel saves to *the browser
you're using*. Download a backup (button in the Site text & contact
tab) after every session. If you clear your browser data or switch
computers, restore from that backup.

---

## Option 2 — editing the data files (for bulk changes)

Better when you're adding a whole new brand or a long price list —
much faster than clicking through the admin panel 40 times.

| File | Holds |
|---|---|
| `products.js` | Tires |
| `mags-data.js` | Mag wheels |
| `x4-data.js` | 4x4 parts |

Open the file in any text editor. Each product is one line. Copy a
line, change the values, give it a new `id`. Every file has full field
instructions in a comment block at the top.

### The one rule that trips people up

After editing any data file, open **`db.js`** and change this line:

```js
const DATA_VERSION = '2026-08-06-c';
```

Change it to anything new — `'2026-08-07-a'`, `'v2'`, today's date.

**Why:** the site remembers its catalog in each visitor's browser so it
loads fast. It only refreshes that copy when this version string
changes. Skip this step and your edits won't appear — not for you, not
for anyone who has visited before.

---

## Adding product photos

1. Put the image file in the right folder:
   - Tires → `assets/tires/<Brand>/`
   - Mags → `assets/mags/<Brand>/`
2. Reference it in the data file:
   `img: "assets/mags/BlackMamba/blackmamba_20.jpg"`

Keep photos around 900px on the long edge — bigger just slows the site
down without looking better.

You can also paste a full `https://...` URL instead. Google Drive links
do **not** work for this; Drive serves a viewer page, not the image.

---

## File map

**Pages**
- `index.html` — home page
- `mags.html` / `shop.html` / `4x4.html` — the three catalogs
- `admin.html` — admin panel

**Data** (the files you'll actually edit)
- `products.js` · `mags-data.js` · `x4-data.js`

**Styling**
- `styles.css` — everything except the home page. Colours and sizes
  live in the `:root` block at the top; change them there rather than
  hunting through the file.
- `home.css` — the Apple-style home page only
- `admin.css` — admin panel only

**Behaviour**
- `db.js` — loads and saves the catalog (and holds `DATA_VERSION`)
- `shop.js` / `mags.js` / `x4.js` — one per catalog page: filters,
  search, sorting, row rendering
- `motion.js` — animations and the nav menu
- `product-modal.js` — the Contact Us popup
- `image-zoom.js` — click-a-photo-to-enlarge

---

## Two things worth knowing before you change CSS

Both of these were real bugs; the code has comments where they live, so
don't undo them by accident.

1. **`.ms-row` must keep `overflow: visible`.** It's the row of filter
   chips. Give it `overflow-x: auto` and the filter dropdowns get
   clipped to a 30px-tall strip and become invisible on phones.

2. **Colours come from `:root`.** `styles.css` defines the palette once
   at the top (`--ink`, `--bg-light`, `--orange`, and so on). Change a
   colour there and it updates everywhere consistently.
