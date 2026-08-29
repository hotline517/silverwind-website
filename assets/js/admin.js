// ============================================================
// Admin panel — catalog/settings tabs still edit localStorage
// directly (no account needed for that data). The login gate
// itself now checks against the real dealer-backend, and only
// admits accounts with role 'admin' — an 'agent' account is
// refused here and pointed at the Dealer Application Portal.
// ============================================================

const ADMIN_API_BASE = window.SILVERWIND_API_BASE || (window.adminAuthConfig && window.adminAuthConfig.apiBaseUrl) || 'http://localhost:4100';

let currentTab = 'tires';
let cache = { tires: [], mags: [], fourxfour: [] };
let editing = { table: null, row: null }; // row=null means "new"[cite: 15]

const TABLE_CONFIGS = {
  tires: {
    columns: ['img', 'brand', 'model', 'size', 'category', 'price', 'inStock'],
    headers: ['Photo', 'Brand', 'Model', 'Size', 'Category', 'Price', 'Stock', ''],
    fields: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'model', label: 'Model', type: 'text', required: true },
      { key: 'size', label: 'Size — e.g. 175/70R13', type: 'text', required: true },
      { key: 'width', label: 'Width — the 175 in 175/70R13', type: 'number' },
      { key: 'aspect', label: 'Aspect ratio — the 70 in 175/70R13', type: 'number' },
      { key: 'diameter', label: 'Rim diameter — the 13 in 175/70R13', type: 'number' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'price', label: 'Price (₱)', type: 'number', required: true },
      { key: 'inStock', label: 'In stock', type: 'checkbox' },
      { key: 'inventorySku', label: 'Linked inventory SKU (optional) — look it up in the Inventory tab. When set, the site shows this SKU\'s live price/stock instead of the values above.', type: 'text' },
      { key: 'img', label: 'Photo URL or path', type: 'image', full: true },
    ],
  },
  mags: {
    columns: ['img', 'brand', 'model', 'magSize', 'holes', 'price', 'inStock'],
    headers: ['Photo', 'Brand', 'Model', 'Size', 'Holes', 'Price', 'Stock', ''],
    fields: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'model', label: 'Model', type: 'text', required: true },
      { key: 'finish', label: 'Finish / colour', type: 'text' },
      { key: 'diameter', label: 'Rim diameter (inches)', type: 'number', required: true },
      { key: 'width', label: 'Rim width — leave blank if unknown', type: 'text' },
      { key: 'holes', label: 'Holes — comma separated, e.g. 5,6', type: 'holesArray' },
      { key: 'price', label: 'Price (₱) — blank means "Contact for price"', type: 'number' },
      { key: 'variant', label: 'Variant label (optional)', type: 'text' },
      { key: 'listedUnder', label: 'Listed under (optional)', type: 'text' },
      { key: 'inStock', label: 'In stock', type: 'checkbox' },
      { key: 'inventorySku', label: 'Linked inventory SKU (optional) — look it up in the Inventory tab. When set, the site shows this SKU\'s live price/stock instead of the values above.', type: 'text' },
      { key: 'img', label: 'Photo URL or path', type: 'image', full: true },
    ],
  },
  fourxfour: {
    columns: ['img', 'brand', 'model', 'category', 'spec', 'price', 'inStock'],
    headers: ['Photo', 'Brand', 'Model', 'Category', 'Spec', 'Price', 'Stock', ''],
    fields: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'model', label: 'Model / name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'spec', label: 'Spec / description', type: 'textarea', full: true },
      { key: 'vehicle', label: 'Fits which vehicles', type: 'text', full: true },
      { key: 'price', label: 'Price (₱)', type: 'number' },
      { key: 'inStock', label: 'In stock', type: 'checkbox' },
      { key: 'inventorySku', label: 'Linked inventory SKU (optional) — look it up in the Inventory tab. When set, the site shows this SKU\'s live price/stock instead of the values above.', type: 'text' },
      { key: 'img', label: 'Photo URL or path', type: 'image', full: true },
    ],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  checkAdminSession();

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try { await fetch(`${ADMIN_API_BASE}/api/agent/logout`, { method: 'POST', credentials: 'include' }); } catch {}
    location.reload();
  });

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.add, null));
  });
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeEditModal);
  });
  document.getElementById('save-item').addEventListener('click', saveItem);
  document.getElementById('delete-item').addEventListener('click', deleteItem);

  ['tires', 'mags', 'fourxfour'].forEach(t => {
    document.getElementById(`${t}-search`).addEventListener('input', () => renderTable(t));
  });

  document.getElementById('save-settings').addEventListener('click', saveSettings);

  document.getElementById('export-btn').addEventListener('click', doExport);
  document.getElementById('import-file').addEventListener('change', doImport);
  document.getElementById('reset-btn').addEventListener('click', doReset);
});

async function checkAdminSession() {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/agent/me`, { credentials: 'include' });
    if (!res.ok) throw new Error();
    const { agent } = await res.json();
    if (agent.role !== 'admin') {
      // A real, valid login — just not for this panel. Sign the session
      // out rather than leaving a half-authenticated agent sitting here.
      await fetch(`${ADMIN_API_BASE}/api/agent/logout`, { method: 'POST', credentials: 'include' });
      document.getElementById('login-gate').style.display = 'flex';
      document.getElementById('login-error').textContent =
        'This account is an Agent account — sign in at the Dealer Application Portal instead.';
      return;
    }
    showPanel();
  } catch {
    document.getElementById('login-gate').style.display = 'flex';
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  if (!email || !password) { errEl.textContent = 'Enter your email and password.'; return; }

  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/agent/login`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { errEl.textContent = data.error || 'Incorrect email or password.'; return; }
    if (data.agent.role !== 'admin') {
      await fetch(`${ADMIN_API_BASE}/api/agent/logout`, { method: 'POST', credentials: 'include' });
      errEl.textContent = 'This account is an Agent account — sign in at the Dealer Application Portal instead.';
      return;
    }
    showPanel();
  } catch {
    errEl.textContent = "We couldn't sign you in right now. Please check your connection and try again.";
  }
}

async function showPanel() {
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  await loadAllTables();
  await loadSettingsForm();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-section').forEach(s => s.hidden = true);
  document.getElementById(`tab-${tab}`).hidden = false;
}

// ---------- LOAD + RENDER TABLES ----------
async function loadAllTables() {
  cache.tires = await DB.loadTires();
  cache.mags = await DB.loadMags();
  cache.fourxfour = await DB.loadFourXFour();
  renderTable('tires');
  renderTable('mags');
  renderTable('fourxfour');
}

function renderTable(table) {
  const cfg = TABLE_CONFIGS[table];
  const rawSearch = document.getElementById(`${table}-search`).value;
  
  // SMART SEARCH: Tinatanggal ang lahat ng spaces at ginagawang lowercase para gumana kahit walang space o magkaiba ang casing
  const search = rawSearch.toLowerCase().replace(/\s+/g, '');

  let rows = cache[table];
  if (search) {
    rows = rows.filter(r => {
      const rowString = JSON.stringify(r).toLowerCase().replace(/\s+/g, '');
      return rowString.includes(search);
    });
  }

  document.getElementById(`${table}-count`).textContent = `${rows.length} item${rows.length === 1 ? '' : 's'}`;

  const el = document.getElementById(`${table}-table`);
  const thead = `<thead><tr>${cfg.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
  const tbody = rows.map(r => {
    const cells = cfg.columns.map(col => {
      if (col === 'img') return `<td>${r.img ? `<img src="${r.img}" alt="">` : '—'}</td>`;
      if (col === 'inStock') return `<td><span class="stock-pill ${r.inStock !== false ? 'in' : 'out'}">${r.inStock !== false ? 'In stock' : 'Out'}</span></td>`;
      if (col === 'price') return `<td>${r.price != null ? '₱' + Number(r.price).toLocaleString() : '—'}</td>`;
      if (col === 'holes') return `<td>${Array.isArray(r.holes) ? r.holes.join('/') + 'H' : '—'}</td>`;
      if (col === 'magSize') {
        const s = r.width ? `${r.diameter}x${r.width}` : (r.diameter ? `${r.diameter}"` : '—');
        return `<td>${s}</td>`;
      }
      return `<td>${r[col] ?? '—'}</td>`;
    }).join('');
    return `<tr>${cells}<td><button class="row-edit" data-edit="${table}:${r.id}">Edit</button></td></tr>`;
  }).join('');
  el.innerHTML = thead + `<tbody>${tbody || `<tr><td colspan="${cfg.headers.length}" style="text-align:center; color:var(--ink-soft); padding:24px;">No items found.</td></tr>`}</tbody>`;

  el.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [t, id] = btn.dataset.edit.split(':');
      const row = cache[t].find(r => String(r.id) === id);
      openEditModal(t, row);
    });
  });
}

// ---------- EDIT MODAL ----------
function openEditModal(table, row) {
  editing = { table, row };
  const cfg = TABLE_CONFIGS[table];
  document.getElementById('edit-title').textContent = row ? `Edit ${table}` : `Add new ${table === 'fourxfour' ? '4x4 item' : table.slice(0, -1)}`;
  document.getElementById('edit-error').textContent = '';
  document.getElementById('delete-item').style.display = row ? '' : 'none';

  const fieldsEl = document.getElementById('edit-fields');
  fieldsEl.innerHTML = cfg.fields.map(f => {
    let val = row ? row[f.key] : '';
    if (f.type === 'holesArray' && Array.isArray(val)) val = val.join(',');
    if (val == null) val = '';
    const fullClass = f.full ? 'full' : '';
    if (f.type === 'checkbox') {
      const checked = row ? (row[f.key] !== false) : true;
      return `<label class="fld ${fullClass}"><span>${f.label}</span>
        <input type="checkbox" data-field="${f.key}" ${checked ? 'checked' : ''} style="width:auto;"></label>`;
    }
    if (f.type === 'textarea') {
      return `<label class="fld ${fullClass}"><span>${f.label}</span><textarea data-field="${f.key}">${val}</textarea></label>`;
    }
    if (f.type === 'image') {
      return `<label class="fld ${fullClass}"><span>${f.label}</span>
        <input type="text" data-field="${f.key}" value="${val}" placeholder="assets/... or https://...">
        ${val ? `<img class="img-preview" src="${val}" alt="">` : ''}</label>`;
    }
    const numType = f.type === 'number' ? 'number' : 'text';
    return `<label class="fld ${fullClass}"><span>${f.label}</span>
      <input type="${numType}" data-field="${f.key}" value="${val}"></label>`;
  }).join('');

  document.getElementById('edit-modal').classList.add('is-open');
  document.getElementById('edit-modal').setAttribute('aria-hidden', 'false');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('is-open');
  document.getElementById('edit-modal').setAttribute('aria-hidden', 'true');
}

function saveItem() {
  const { table, row } = editing;
  const cfg = TABLE_CONFIGS[table];
  const errEl = document.getElementById('edit-error');
  const payload = {};

  for (const f of cfg.fields) {
    const inputEl = document.querySelector(`[data-field="${f.key}"]`);
    if (f.type === 'checkbox') { payload[f.key] = inputEl.checked; continue; }
    let v = inputEl.value.trim();
    if (f.required && !v) { errEl.textContent = `"${f.label}" is required.`; return; }
    if (f.type === 'number') { payload[f.key] = v === '' ? null : Number(v); continue; }
    if (f.type === 'holesArray') { payload[f.key] = v ? v.split(',').map(x => parseInt(x.trim(), 10)).filter(n => !isNaN(n)) : []; continue; }
    payload[f.key] = v === '' ? null : v;
  }

  if (row) DB.updateRow(table, row.id, payload);
  else DB.addRow(table, payload);

  closeEditModal();
  showToast(row ? 'Saved.' : 'Added.');
  loadAllTables();
}

function deleteItem() {
  const { table, row } = editing;
  if (!row) return;
  if (!confirm("Delete this item? This can't be undone.")) return;
  DB.deleteRow(table, row.id);
  closeEditModal();
  showToast('Deleted.');
  loadAllTables();
}

// ---------- SETTINGS TAB ----------
const SETTINGS_LABELS = {
  contact_mobile: 'Mobile number',
  contact_landline: 'Landline',
  contact_location: 'Location line',
  hero_subtitle: 'Home hero — subtitle',
  mags_page_title: 'Mags page title',
  mags_page_subtitle: 'Mags page subtitle',
  tire_page_title: 'Tire page title',
  tire_page_subtitle: 'Tire page subtitle',
  x4_page_title: '4x4 page title',
  x4_page_subtitle: '4x4 page subtitle',
};

async function loadSettingsForm() {
  const settings = await DB.loadSettings();
  const el = document.getElementById('settings-form');
  el.innerHTML = Object.entries(SETTINGS_LABELS).map(([key, label]) => `
    <label class="fld">
      <span>${label}</span>
      <input type="text" data-setting-field="${key}" value="${(settings[key] || '').replace(/"/g, '&quot;')}">
    </label>
  `).join('');
}

function saveSettings() {
  const inputs = document.querySelectorAll('[data-setting-field]');
  const patch = {};
  inputs.forEach(inp => { patch[inp.dataset.settingField] = inp.value; });
  DB.saveSettings(patch);
  const noteEl = document.getElementById('settings-saved');
  noteEl.style.color = '#15803D';
  noteEl.textContent = 'Saved ✓';
  setTimeout(() => { noteEl.textContent = ''; }, 2500);
}

// ---------- BACKUP: export / import / reset ----------
function doExport() {
  const data = DB.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `silverwind-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded.');
}

function doImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      DB.importAll(data);
      showToast('Backup restored.');
      loadAllTables();
      loadSettingsForm();
    } catch (err) {
      alert('Could not read that file: ' + err.message);
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function doReset() {
  if (!confirm('Reset everything back to the original catalog? Any edits you made will be lost (download a backup first if unsure).')) return;
  DB.resetToDefaults();
  showToast('Reset to defaults.');
  loadAllTables();
  loadSettingsForm();
}

// ---------- TOAST ----------
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2200);
}