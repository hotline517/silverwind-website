/* dealer-portal.js
   Standalone Agent-facing app. Deliberately NOT part of admin.html — an
   agent account (role 'agent') can sign in here, but is refused entry to
   the main Admin Panel. Only an admin creates these accounts, from the
   Admin Panel's own Agents tab.
*/
(function () {
  const API_BASE = window.SILVERWIND_API_BASE || (window.dealerPortalConfig && window.dealerPortalConfig.apiBaseUrl) || 'http://localhost:4100';
  const STATUS_LABELS = { NEW:'New', UNDER_REVIEW:'Under Review', CONTACTED:'Contacted', QUALIFIED:'Qualified', APPROVED:'Approved', REJECTED:'Rejected' };
  const STATUSES = Object.keys(STATUS_LABELS);

  let currentAgent = null;
  let applications = [];

  const $ = (id) => document.getElementById(id);
  const esc = (v) => v == null ? '' : String(v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: opts.body instanceof FormData ? undefined : { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    let data = {};
    try { data = await res.json(); } catch { /* no body */ }
    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
    return data;
  }

  async function checkSession() {
    try {
      const { agent } = await api('/api/agent/me');
      currentAgent = agent;
      showApp();
    } catch {
      currentAgent = null;
      showLogin();
    }
  }

  function showLogin() {
    $('portal-login-gate').style.display = '';
    $('portal-app').style.display = 'none';
  }
  function showApp() {
    $('portal-login-gate').style.display = 'none';
    $('portal-app').style.display = '';
    $('portal-whoami').textContent = `Signed in as ${currentAgent.full_name} (${currentAgent.role})`;
    $('portal-welcome').textContent = `Welcome, ${currentAgent.full_name}`;
    loadStats();
    loadApplications();
  }

  // Dashboard counts always reflect ALL applications, independent of
  // whatever filter is currently applied to the table below.
  async function loadStats() {
    try {
      const { applications: all } = await api('/api/admin/applications');
      const counts = Object.fromEntries(STATUSES.map(s => [s, 0]));
      all.forEach(a => { if (counts[a.status] != null) counts[a.status]++; });
      $('portal-stats').innerHTML = STATUSES.map(s => `
        <div class="portal-stat-card">
          <div class="portal-stat-count">${counts[s]}</div>
          <div class="portal-stat-label">${STATUS_LABELS[s]}</div>
        </div>`).join('');
    } catch {
      $('portal-stats').innerHTML = '';
    }
  }

  $('portal-login-btn').addEventListener('click', async () => {
    const email = $('portal-email').value.trim();
    const password = $('portal-password').value;
    const errEl = $('portal-login-error');
    errEl.textContent = '';
    if (!email || !password) { errEl.textContent = 'Enter your email and password.'; return; }
    try {
      const { agent } = await api('/api/agent/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      currentAgent = agent;
      showApp();
    } catch (e) {
      errEl.textContent = e.status === 401 ? e.message : "We couldn't sign you in right now. Please check your connection and try again.";
    }
  });

  $('portal-logout-btn').addEventListener('click', async () => {
    try { await api('/api/agent/logout', { method: 'POST' }); } catch { /* clear client state regardless */ }
    currentAgent = null;
    showLogin();
  });

  async function loadApplications() {
    const status = $('portal-status-filter').value;
    const q = $('portal-search').value.trim();
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    try {
      const { applications: rows } = await api(`/api/admin/applications?${params}`);
      applications = rows;
      renderTable();
    } catch (e) {
      $('portal-table').innerHTML = `<tr><td>Couldn't load applications (${esc(e.message)}).</td></tr>`;
    }
  }
  $('portal-search').addEventListener('input', debounce(loadApplications, 300));
  $('portal-status-filter').addEventListener('change', loadApplications);
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  function renderTable() {
    $('portal-count').textContent = `${applications.length} application${applications.length === 1 ? '' : 's'}`;
    if (!applications.length) {
      $('portal-table').innerHTML = '<tr><td class="muted">No applications match.</td></tr>';
      return;
    }
    $('portal-table').innerHTML = `
      <thead><tr><th>Reference</th><th>Business</th><th>Contact</th><th>Location</th><th>Submitted</th><th>Status</th><th>Agent</th><th></th></tr></thead>
      <tbody>${applications.map(a => `
        <tr>
          <td class="mono">${esc(a.application_reference)}</td>
          <td>${esc(a.business_name)}</td>
          <td>${esc(a.contact_person)}</td>
          <td>${esc(a.city)}, ${esc(a.province)}</td>
          <td>${new Date(a.submitted_at).toLocaleDateString()}</td>
          <td><span class="status-badge status-${a.status}">${STATUS_LABELS[a.status]}</span></td>
          <td>${esc(a.assigned_agent_name) || '<span class="muted">Unassigned</span>'}</td>
          <td><button class="btn btn-outline-dark" data-view-app="${a.id}">View</button></td>
        </tr>`).join('')}</tbody>`;
    document.querySelectorAll('[data-view-app]').forEach(btn =>
      btn.addEventListener('click', () => openDetail(btn.dataset.viewApp)));
  }

  const modal = $('portal-detail-modal');
  document.querySelectorAll('[data-portal-modal-close]').forEach(el =>
    el.addEventListener('click', () => modal.classList.remove('is-open')));

  async function openDetail(id) {
    modal.classList.add('is-open');
    $('portal-detail-body').innerHTML = '<p class="muted">Loading…</p>';
    try {
      const { application: a, documents, references, notes, history } = await api(`/api/admin/applications/${id}`);
      $('portal-detail-title').textContent = `${a.business_name} — ${a.application_reference}`;
      $('portal-detail-body').innerHTML = renderDetail(a, documents, references, notes, history);
      wireDetail(a);
    } catch (e) {
      $('portal-detail-body').innerHTML = `<p class="err">Couldn't load this application (${esc(e.message)}).</p>`;
    }
  }

  function renderDetail(a, documents, references, notes, history) {
    const businessRows = [
      ['Business name', a.business_name], ['Type', a.business_type], ['Contact person', a.contact_person],
      ['Position', a.contact_position], ['Address', a.business_address], ['City', a.city], ['Province', a.province],
      ['Postal code', a.postal_code], ['Contact number', a.contact_number], ['Email', a.email],
      ['Website', a.website], ['Facebook', a.facebook_page], ['Years in business', a.years_in_business]
    ].filter(([, v]) => v);
    const propertyRows = [
      ['Store address', a.store_address], ['Property status', a.property_status], ['Store size', a.store_size],
      ['Operation info', a.operation_info], ['Location notes', a.location_notes]
    ].filter(([, v]) => v);

    return `
      <div class="da-detail-grid">
        <div>
          <h3>Business Information</h3>
          <dl class="da-dl">${businessRows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          <h3>Business / Property Information</h3>
          <dl class="da-dl">${propertyRows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('') || '<dd class="muted">Nothing entered</dd>'}</dl>
          <h3>Documents</h3>
          ${documents.length ? `<ul class="da-doc-list">${documents.map(d => `
            <li><a href="${API_BASE}/api/admin/applications/${a.id}/documents/${d.id}/download" target="_blank" rel="noopener">
              ${esc(d.document_type)} — ${esc(d.original_filename)}</a> <span class="muted">(${(d.file_size/1024).toFixed(0)} KB)</span></li>`).join('')}</ul>`
            : '<p class="muted">No documents uploaded.</p>'}
          <h3>References</h3>
          ${references.length ? references.map(r => `
            <dl class="da-dl"><dt>Name</dt><dd>${esc(r.reference_name)}</dd>
            <dt>Company</dt><dd>${esc(r.company) || '—'}</dd>
            <dt>Contact</dt><dd>${esc(r.contact_number) || '—'} ${esc(r.email) || ''}</dd>
            <dt>Relationship</dt><dd>${esc(r.relationship) || '—'}</dd></dl>`).join('')
            : '<p class="muted">None.</p>'}
        </div>
        <div>
          <h3>Status</h3>
          <select class="admin-search" id="portal-status-select">
            ${STATUSES.map(s => `<option value="${s}" ${s === a.status ? 'selected' : ''}>${STATUS_LABELS[s]}</option>`).join('')}
          </select>
          <button class="btn btn-primary" id="portal-status-save" style="margin-top:8px;width:100%;justify-content:center;">Update status</button>
          <p class="err" id="portal-status-error"></p>

          ${currentAgent.role === 'admin' ? `
            <h3 style="margin-top:18px;">Assigned agent</h3>
            <p class="muted" style="font-size:12.5px;">${esc(a.assigned_agent_name) || 'Unassigned'}</p>
            <button class="btn btn-outline-dark" id="portal-assign-me" style="width:100%;justify-content:center;">Assign to me</button>
          ` : ''}

          <h3 style="margin-top:18px;">Internal notes <span class="muted" style="font-weight:400;">(never shown to the applicant)</span></h3>
          <div id="portal-notes-list" class="da-notes-list">
            ${notes.map(n => `<div class="da-note"><b>${esc(n.agent_name)}</b> <span class="muted">${new Date(n.created_at).toLocaleString()}</span><p>${esc(n.body)}</p></div>`).join('') || '<p class="muted">No notes yet.</p>'}
          </div>
          <textarea id="portal-note-input" rows="3" placeholder="Add an internal note…" style="width:100%;margin-top:8px;font-family:inherit;padding:8px;border:1px solid #ddd;border-radius:6px;"></textarea>
          <button class="btn btn-primary" id="portal-note-save" style="margin-top:6px;width:100%;justify-content:center;">Add note</button>
          <p class="err" id="portal-note-error"></p>

          <h3 style="margin-top:18px;">History</h3>
          <ul class="da-history">${history.map(h => `<li>${h.from_status ? esc(h.from_status) + ' → ' : ''}${esc(h.to_status)} <span class="muted">— ${new Date(h.created_at).toLocaleString()}${h.agent_name ? ' by ' + esc(h.agent_name) : ''}</span></li>`).join('')}</ul>
        </div>
      </div>`;
  }

  function wireDetail(a) {
    $('portal-status-save').addEventListener('click', async () => {
      const status = $('portal-status-select').value;
      const errEl = $('portal-status-error');
      try {
        await api(`/api/admin/applications/${a.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
        errEl.textContent = '';
        loadStats();
        loadApplications();
        openDetail(a.id);
      } catch (e) { errEl.textContent = e.message; }
    });

    const assignBtn = $('portal-assign-me');
    if (assignBtn) {
      assignBtn.addEventListener('click', async () => {
        try {
          await api(`/api/admin/applications/${a.id}/assign`, { method: 'PATCH', body: JSON.stringify({ agent_id: currentAgent.id }) });
          loadApplications();
          openDetail(a.id);
        } catch (e) { alert(e.message); }
      });
    }

    $('portal-note-save').addEventListener('click', async () => {
      const body = $('portal-note-input').value.trim();
      const errEl = $('portal-note-error');
      if (!body) { errEl.textContent = 'Note cannot be empty.'; return; }
      try {
        await api(`/api/admin/applications/${a.id}/notes`, { method: 'POST', body: JSON.stringify({ body }) });
        errEl.textContent = '';
        openDetail(a.id);
      } catch (e) { errEl.textContent = e.message; }
    });
  }

  checkSession();
})();
