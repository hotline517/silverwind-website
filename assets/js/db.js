// ============================================================
// Data layer — everything lives in the browser's localStorage on
// THIS device/browser. No server, no account, no setup needed.
//
// On first visit, it's seeded with the current catalog (all tires,
// mags, 4x4, and camping/overland items already on the site) so the
// admin panel starts full, not empty. From then on, admin.html edits
// read/write here directly, and every public page reads from here too.
//
// IMPORTANT LIMITATION: because there's no server, changes made in
// admin.html only show up in the browser/device where you made them.
// Use the Export/Import backup in admin.html to move data to another
// device, or to keep a safety copy.
// ============================================================

const DB = (() => {
  // Bump this whenever the bundled catalog (products.js / mags-data.js /
  // x4-data.js / cg-data.js) changes. Stored data carrying an older stamp
  // is refreshed automatically — otherwise a browser that loaded the site
  // once would keep showing the old catalog forever.
  const DATA_VERSION = '2026-08-23-l'; // <-- bumped: added WePro Japan lugnuts, hub rings, and tire valves

  const KEYS = {
    tires: 'sw_tires',
    mags: 'sw_mags',
    fourxfour: 'sw_fourxfour',
    camping: 'sw_camping',
    settings: 'sw_settings',
    version: 'sw_data_version',
  };

  // Some sandboxed preview contexts block localStorage entirely (throws on
  // access). Detect that up front and fall back to an in-memory store so
  // the site still works for that session — it just won't persist across
  // reloads in that specific sandboxed context. On a real hosted page,
  // localStorage works normally and persists as expected.
  let storageOK = true;
  try {
    const t = '__sw_test__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
  } catch (e) {
    storageOK = false;
    console.warn('localStorage is unavailable in this context — using an in-memory fallback for this session only.');
  }
  const memoryStore = {};

  const SETTING_DEFAULTS = {
    contact_mobile: '0916-XXX-XXXX',
    contact_landline: '8XXX-XXXX',
    contact_location: 'Philippines — nationwide inquiries welcome.',
    hero_subtitle: "Silverwind sources rims, 4x4 parts, and tires — straight fitment advice, straight pricing, no upselling you into something your ride doesn't need.",
    mags_page_title: 'Shop Rims',
    mags_page_subtitle: 'Rims by size, holes (bolt pattern), and finish — straight from the price list.',
    tire_page_title: 'Shop Tires',
    tire_page_subtitle: 'Every size, every brand, straight from the price list.',
    x4_page_title: '4x4',
    x4_page_subtitle: 'Off-road and overland parts.',
    cg_page_title: 'Camping / Overland',
    cg_page_subtitle: 'Roll covers, awnings, rooftop tents, and overland gear — straight from the price list.',
  };

  function read(key, fallback) {
    try {
      const raw = storageOK ? localStorage.getItem(key) : (memoryStore[key] ?? null);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('Storage read failed for', key, e);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (storageOK) localStorage.setItem(key, raw);
      else memoryStore[key] = raw;
      return true;
    } catch (e) {
      console.warn('Storage write failed for', key, e);
      return false;
    }
  }

  function removeKey(key) {
    try {
      if (storageOK) localStorage.removeItem(key);
      else delete memoryStore[key];
    } catch (e) { /* ignore */ }
  }

  function keyExists(key) {
    try {
      return storageOK ? localStorage.getItem(key) !== null : (key in memoryStore);
    } catch (e) {
      return false;
    }
  }

  // ---------- seed on first run, on empty data, or when the bundled catalog changed ----------
  function needsSeed(key, versionChanged) {
    if (versionChanged) return true;
    if (!keyExists(key)) return true;
    const parsed = read(key, null);
    return Array.isArray(parsed) && parsed.length === 0;
  }

  function ensureSeeded() {
    const storedVersion = read(KEYS.version, null);
    const versionChanged = storedVersion !== DATA_VERSION;

    if (needsSeed(KEYS.tires, versionChanged) && typeof TIRE_ROWS !== 'undefined' && TIRE_ROWS.length) {
      write(KEYS.tires, TIRE_ROWS.map(r => ({ ...r, inStock: true })));
    }
    if (needsSeed(KEYS.mags, versionChanged) && typeof MAG_ROWS !== 'undefined' && MAG_ROWS.length) {
      write(KEYS.mags, MAG_ROWS.map(r => ({ ...r, inStock: true })));
    }
    if (needsSeed(KEYS.fourxfour, versionChanged) && typeof X4_ROWS !== 'undefined' && X4_ROWS.length) {
      write(KEYS.fourxfour, X4_ROWS.map(r => ({ ...r, inStock: true })));
    } else if (!keyExists(KEYS.fourxfour)) {
      write(KEYS.fourxfour, []);
    }
    if (needsSeed(KEYS.camping, versionChanged) && typeof CG_ROWS !== 'undefined' && CG_ROWS.length) {
      write(KEYS.camping, CG_ROWS.map(r => ({ ...r, inStock: true })));
    } else if (!keyExists(KEYS.camping)) {
      write(KEYS.camping, []);
    }
    if (!keyExists(KEYS.settings)) {
      write(KEYS.settings, { ...SETTING_DEFAULTS });
    }
    if (versionChanged) write(KEYS.version, DATA_VERSION);
  }
  ensureSeeded();

  // ---------- public loaders (used by shop.js / mags.js / public pages) ----------
  async function loadTires() { return read(KEYS.tires, []); }
  async function loadMags() { return read(KEYS.mags, []); }
  async function loadFourXFour() { return read(KEYS.fourxfour, []); }
  async function loadCamping() { return read(KEYS.camping, []); }
  async function loadSettings() { return { ...SETTING_DEFAULTS, ...read(KEYS.settings, {}) }; }

  // ---------- central inventory overlay (public pages only — admin.html
  // never calls this, so the edit form always shows the raw stored values,
  // never a live price silently substituted in) ----------
  // Products opt in via an admin-set "inventorySku" field. Unlinked
  // products (the vast majority) pass through completely untouched — this
  // never removes or invents data, only overlays live price/stock where an
  // admin explicitly linked one.
  const INVENTORY_API_BASE = window.SILVERWIND_API_BASE || 'http://localhost:4100';
  // production example: INVENTORY_API_BASE = 'https://api.silverwind.website'

  async function enrichWithInventory(rows) {
    const skus = [...new Set(rows.map(r => r.inventorySku).filter(Boolean))];
    if (!skus.length) return rows;

    let live = {};
    try {
      const res = await fetch(`${INVENTORY_API_BASE}/api/inventory/public/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus })
      });
      if (!res.ok) return rows; // fail closed to the static catalog, never break the page
      ({ products: live } = await res.json());
    } catch {
      return rows; // offline / backend down — static catalog still works
    }

    return rows.map(r => {
      if (!r.inventorySku || !live[r.inventorySku]) return r;
      const item = live[r.inventorySku];
      return {
        ...r,
        price: item.price != null ? item.price : r.price, // never overwrite with a blank price
        inStock: item.status !== 'OUT_OF_STOCK',
        liveStock: item.stock,
        liveStatus: item.status
      };
    });
  }

  function applySettings(settings, root = document) {
    root.querySelectorAll('[data-setting]').forEach(el => {
      const key = el.dataset.setting;
      if (settings[key] != null) el.textContent = settings[key];
    });
  }

  // ---------- admin write helpers ----------
  function nextId(rows) {
    return rows.reduce((max, r) => Math.max(max, Number((r.id || '').toString().replace(/\D/g, '')) || 0), 0) + 1;
  }

  const TABLE_PREFIX = {
    tires: 'tire',
    mags: 'mag',
    fourxfour: 'x4',
    camping: 'cg',
  };

  function addRow(table, row) {
    const rows = read(KEYS[table], []);
    const prefix = TABLE_PREFIX[table] || table;
    row.id = `${prefix}-${nextId(rows)}`;
    rows.push(row);
    write(KEYS[table], rows);
    return row;
  }

  function updateRow(table, id, patch) {
    const rows = read(KEYS[table], []);
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return false;
    rows[idx] = { ...rows[idx], ...patch };
    write(KEYS[table], rows);
    return true;
  }

  function deleteRow(table, id) {
    const rows = read(KEYS[table], []);
    const next = rows.filter(r => r.id !== id);
    write(KEYS[table], next);
    return next.length !== rows.length;
  }

  function saveSettings(patch) {
    const current = read(KEYS.settings, { ...SETTING_DEFAULTS });
    write(KEYS.settings, { ...current, ...patch });
  }

  function exportAll() {
    return {
      tires: read(KEYS.tires, []),
      mags: read(KEYS.mags, []),
      fourxfour: read(KEYS.fourxfour, []),
      camping: read(KEYS.camping, []),
      settings: read(KEYS.settings, {}),
      exportedAt: new Date().toISOString(),
    };
  }

  function importAll(data) {
    if (data.tires) write(KEYS.tires, data.tires);
    if (data.mags) write(KEYS.mags, data.mags);
    if (data.fourxfour) write(KEYS.fourxfour, data.fourxfour);
    if (data.camping) write(KEYS.camping, data.camping);
    if (data.settings) write(KEYS.settings, data.settings);
  }

  function resetToDefaults() {
    removeKey(KEYS.tires);
    removeKey(KEYS.mags);
    removeKey(KEYS.fourxfour);
    removeKey(KEYS.camping);
    removeKey(KEYS.settings);
    removeKey(KEYS.version);
    ensureSeeded();
  }

  return {
    loadTires, loadMags, loadFourXFour, loadCamping, loadSettings, applySettings,
    enrichWithInventory,
    addRow, updateRow, deleteRow, saveSettings,
    exportAll, importAll, resetToDefaults,
    SETTING_DEFAULTS,
  };
})();