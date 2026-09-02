// ============================================================
// Data layer — connected to Render backend & PostgreSQL database
// ============================================================

const DB = (() => {
  const API_BASE = window.SILVERWIND_API_BASE || 'https://silverwind-website.onrender.com';

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

  // ---------- public loaders / database fetchers ----------
  async function loadTires() {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/public?type=tire`, { credentials: 'include' });
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
      throw new Error('empty');
    } catch {
      return (typeof TIRE_ROWS !== 'undefined') ? TIRE_ROWS : [];
    }
  }

  async function loadMags() {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/public?type=mag`, { credentials: 'include' });
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
      throw new Error('empty');
    } catch {
      return (typeof MAG_ROWS !== 'undefined') ? MAG_ROWS : [];
    }
  }

  async function loadFourXFour() {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/public?type=4x4`, { credentials: 'include' });
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
      throw new Error('empty');
    } catch {
      return (typeof FOURXFOUR_ROWS !== 'undefined') ? FOURXFOUR_ROWS : (typeof X4_ROWS !== 'undefined' ? X4_ROWS : []);
    }
  }

  async function loadCamping() {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/public?type=camping`, { credentials: 'include' });
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data;
      throw new Error('empty');
    } catch {
      return (typeof CAMPING_ROWS !== 'undefined') ? CAMPING_ROWS : [];
    }
  }

  async function loadSettings() {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { credentials: 'include' });
      if (!res.ok) return { ...SETTING_DEFAULTS };
      const data = await res.json();
      return { ...SETTING_DEFAULTS, ...data };
    } catch { return { ...SETTING_DEFAULTS }; }
  }

  async function enrichWithInventory(rows) {
    const skus = [...new Set(rows.map(r => r.inventorySku).filter(Boolean))];
    if (!skus.length) return rows;

    let live = {};
    try {
      const res = await fetch(`${API_BASE}/api/inventory/public/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus })
      });
      if (!res.ok) return rows;
      ({ products: live } = await res.json());
    } catch {
      return rows;
    }

    return rows.map(r => {
      if (!r.inventorySku || !live[r.inventorySku]) return r;
      const item = live[r.inventorySku];
      return {
        ...r,
        price: item.price != null ? item.price : r.price,
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
  async function addRow(table, row) {
    try {
      const res = await fetch(`${API_BASE}/api/${table}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row)
      });
      if (!res.ok) throw new Error('Failed to add item');
      return await res.json();
    } catch (e) { alert(e.message); }
  }

  async function updateRow(table, id, patch) {
    try {
      const res = await fetch(`${API_BASE}/api/${table}/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      if (!res.ok) throw new Error('Failed to update item');
      return true;
    } catch (e) { alert(e.message); return false; }
  }

  async function deleteRow(table, id) {
    try {
      const res = await fetch(`${API_BASE}/api/${table}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete item');
      return true;
    } catch (e) { alert(e.message); return false; }
  }

  async function saveSettings(patch) {
    try {
      await fetch(`${API_BASE}/api/settings`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
    } catch (e) { console.error(e); }
  }

  return {
    loadTires, loadMags, loadFourXFour, loadCamping, loadSettings, applySettings,
    enrichWithInventory,
    addRow, updateRow, deleteRow, saveSettings,
    SETTING_DEFAULTS,
  };
})();