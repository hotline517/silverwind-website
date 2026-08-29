/* admin-inventory.js
   "Inventory" tab — the one authoritative product/stock/price record,
   shared by this panel, the website, and (later) the chatbot. Admin-only,
   backed by the real dealer-backend + Postgres (never localStorage —
   deliberately not the same storage as the Tires/Mags/4x4 tabs).
*/
(function () {
  const API_BASE = window.SILVERWIND_API_BASE || (window.adminAuthConfig && window.adminAuthConfig.apiBaseUrl) || 'http://localhost:4100';
  const STATUS_LABELS = { IN_STOCK: 'In Stock', LOW_STOCK: 'Low Stock', OUT_OF_STOCK: 'Out of Stock' };
  let products = [];
  let editingId = null;

  const $ = (id) => document.getElementById(id);
  const esc = (v) => v == null ? '' : String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (v) => v == null ? '<span class="muted">Not set</span>' : `₱${Number(v).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: opts.body instanceof FormData ? undefined : { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
    return data;
  }

  async function loadProducts() {
    const q = $('inv-search').value.trim();
    const type = $('inv-type-filter').value;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type) params.set('type', type);
    try {
      const { products: rows } = await api(`/api/admin/inventory?${params}`);
      products = rows;
      renderTypeFilter();
      renderTable();
    } catch (e) {
      $('inv-table').innerHTML = `<tr><td>Couldn't load inventory (${esc(e.message)}).</td></tr>`;
    }
  }
  $('inv-search').addEventListener('input', debounce(loadProducts, 300));
  $('inv-type-filter').addEventListener('change', loadProducts);
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  function renderTypeFilter() {
    const sel = $('inv-type-filter');
    const current = sel.value;
    const types = [...new Set(products.map(p => p.item_type).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">All types</option>' + types.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    sel.value = current;
  }

  function renderTable() {
    $('inv-count').textContent = `${products.length} product${products.length === 1 ? '' : 's'}`;
    if (!products.length) {
      $('inv-table').innerHTML = '<tr><td class="muted">No products match. Import a CSV to get started.</td></tr>';
      return;
    }
    $('inv-table').innerHTML = `
      <thead><tr><th>Product</th><th>SKU</th><th>Type</th><th>Size</th><th>Stock</th><th>Price</th><th>Status</th><th>Updated</th><th></th></tr></thead>
      <tbody>${products.map(p => `
        <tr>
          <td>${esc(p.name)}</td>
          <td class="mono">${esc(p.sku)}</td>
          <td>${esc(p.item_type) || '<span class="muted">—</span>'}</td>
          <td>${esc(p.size) || '<span class="muted">—</span>'}</td>
          <td>${p.total_stock}</td>
          <td>${money(p.price)}</td>
          <td><span class="status-badge status-${p.status === 'IN_STOCK' ? 'APPROVED' : p.status === 'LOW_STOCK' ? 'UNDER_REVIEW' : 'REJECTED'}">${STATUS_LABELS[p.status]}</span></td>
          <td>${new Date(p.updated_at).toLocaleDateString()}</td>
          <td style="white-space:nowrap;">
            <button class="btn btn-outline-dark" data-inv-view="${p.id}">History</button>
            <button class="btn btn-outline-dark" data-inv-edit="${p.id}">Edit</button>
          </td>
        </tr>`).join('')}</tbody>`;
    document.querySelectorAll('[data-inv-edit]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.invEdit)));
    document.querySelectorAll('[data-inv-view]').forEach(b => b.addEventListener('click', () => openDetail(b.dataset.invView)));
  }

  /* ---- manual price/stock edit ---- */
  const editModal = $('inv-edit-modal');
  function openEdit(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    $('inv-edit-title').textContent = p.name;
    $('inv-edit-sku').textContent = p.sku;
    $('inv-edit-price').value = p.price ?? '';
    $('inv-edit-stock').value = p.total_stock;
    $('inv-edit-error').textContent = '';
    editModal.classList.add('is-open');
  }
  document.querySelectorAll('[data-inv-edit-close]').forEach(el => el.addEventListener('click', () => editModal.classList.remove('is-open')));

  $('inv-edit-save-btn').addEventListener('click', async () => {
    const errEl = $('inv-edit-error');
    const priceRaw = $('inv-edit-price').value.trim();
    const stockRaw = $('inv-edit-stock').value.trim();
    const body = {};
    if (priceRaw !== '') body.price = Number(priceRaw);
    if (stockRaw !== '') body.total_stock = Number(stockRaw);
    if (priceRaw !== '' && (!Number.isFinite(body.price) || body.price < 0)) { errEl.textContent = 'Price must be a positive number.'; return; }
    if (stockRaw !== '' && (!Number.isInteger(body.total_stock) || body.total_stock < 0)) { errEl.textContent = 'Stock must be a positive whole number.'; return; }
    try {
      await api(`/api/admin/inventory/${editingId}`, { method: 'PATCH', body: JSON.stringify(body) });
      editModal.classList.remove('is-open');
      loadProducts();
    } catch (e) { errEl.textContent = e.message; }
  });

  /* ---- history detail ---- */
  const detailModal = $('inv-detail-modal');
  document.querySelectorAll('[data-inv-detail-close]').forEach(el => el.addEventListener('click', () => detailModal.classList.remove('is-open')));

  async function openDetail(id) {
    detailModal.classList.add('is-open');
    $('inv-detail-body').innerHTML = '<p class="muted">Loading…</p>';
    try {
      const { product, warehouses, history } = await api(`/api/admin/inventory/${id}`);
      $('inv-detail-title').textContent = `${product.name} — ${product.sku}`;
      $('inv-detail-body').innerHTML = `
        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--admin-muted);margin:0 0 8px;">Stock by warehouse</h3>
        <ul class="da-doc-list">${warehouses.map(w => `<li>${esc(w.warehouse)} — ${w.quantity} pcs</li>`).join('') || '<li class="muted">No warehouse breakdown.</li>'}</ul>
        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--admin-muted);margin:16px 0 8px;">Change history</h3>
        <ul class="da-history">${history.map(h => `
          <li><b>${h.field === 'price' ? 'Price' : 'Stock'}:</b> ${h.field === 'price' ? money(h.old_value) : (h.old_value ?? '—')} → ${h.field === 'price' ? money(h.new_value) : h.new_value}
            <span class="muted"> — ${h.source === 'CSV_IMPORT' ? 'CSV import' : `manual, ${esc(h.changed_by_name) || 'admin'}`}, ${new Date(h.created_at).toLocaleString()}</span></li>
        `).join('') || '<li class="muted">No changes recorded yet.</li>'}</ul>`;
    } catch (e) {
      $('inv-detail-body').innerHTML = `<p class="err">Couldn't load this product (${esc(e.message)}).</p>`;
    }
  }

  /* ---- CSV import ---- */
  $('inv-import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const statusEl = $('inv-import-status');
    statusEl.style.color = '';
    statusEl.textContent = 'Importing…';
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await api('/api/admin/inventory/import', { method: 'POST', body: fd });
      statusEl.textContent = `Imported ${result.rowsRead} rows — ${result.productsCreated} new, ${result.productsUpdated} updated, ${result.stockChanges} stock change(s). ` +
        (result.priceColumnDetected ? `Price column "${result.priceColumnName}" applied.` : 'No price column found — prices left unchanged.');
      loadProducts();
    } catch (err) {
      statusEl.style.color = '#ff3b30';
      statusEl.textContent = err.message;
    } finally {
      e.target.value = '';
    }
  });

  let loaded = false;
  document.querySelector('[data-tab="inventory"]').addEventListener('click', () => {
    if (!loaded) { loaded = true; loadProducts(); }
  });
})();
