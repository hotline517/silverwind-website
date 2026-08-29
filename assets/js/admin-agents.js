/* admin-agents.js
   "Agents" tab — admin-only management of Dealer Application Portal
   accounts. All calls hit /api/admin/agents, which is itself gated
   requireAgent+requireAdmin server-side (never trust the tab being
   hidden client-side as the actual protection).
*/
(function () {
  const API_BASE = window.SILVERWIND_API_BASE || (window.adminAuthConfig && window.adminAuthConfig.apiBaseUrl) || 'http://localhost:4100';
  let agents = [];
  let editingId = null; // null = creating new

  const $ = (id) => document.getElementById(id);
  const esc = (v) => v == null ? '' : String(v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
    return data;
  }

  async function loadAgents() {
    try {
      const { agents: rows } = await api('/api/admin/agents');
      agents = rows;
      renderTable();
    } catch (e) {
      document.getElementById('agents-table').innerHTML = `<tr><td>Couldn't load agents (${esc(e.message)}).</td></tr>`;
    }
  }

  function renderTable() {
    $('agents-count').textContent = `${agents.length} account${agents.length === 1 ? '' : 's'}`;
    $('agents-table').innerHTML = `
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th><th>Last login</th><th></th></tr></thead>
      <tbody>${agents.map(a => `
        <tr>
          <td>${esc(a.full_name)}</td>
          <td class="mono">${esc(a.email)}</td>
          <td>${a.role === 'admin' ? 'Admin' : 'Agent'}</td>
          <td><span class="status-badge ${a.active ? 'status-APPROVED' : 'status-REJECTED'}">${a.active ? 'Active' : 'Disabled'}</span></td>
          <td>${new Date(a.created_at).toLocaleDateString()}</td>
          <td>${a.last_login_at ? new Date(a.last_login_at).toLocaleString() : '<span class="muted">Never</span>'}</td>
          <td style="white-space:nowrap;">
            <button class="btn btn-outline-dark" data-edit-agent="${a.id}">Edit</button>
            <button class="btn btn-outline-dark" data-toggle-agent="${a.id}">${a.active ? 'Disable' : 'Enable'}</button>
            <button class="btn btn-outline-dark" data-reset-agent="${a.id}">Reset password</button>
            <button class="btn btn-danger" data-delete-agent="${a.id}">Delete</button>
          </td>
        </tr>`).join('')}</tbody>`;

    document.querySelectorAll('[data-edit-agent]').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.editAgent)));
    document.querySelectorAll('[data-toggle-agent]').forEach(b => b.addEventListener('click', () => toggleActive(b.dataset.toggleAgent)));
    document.querySelectorAll('[data-reset-agent]').forEach(b => b.addEventListener('click', () => openReset(b.dataset.resetAgent)));
    document.querySelectorAll('[data-delete-agent]').forEach(b => b.addEventListener('click', () => removeAgent(b.dataset.deleteAgent)));
  }

  /* ---- create / edit modal ---- */
  const modal = $('agent-modal');
  function openCreate() {
    editingId = null;
    $('agent-modal-title').textContent = 'Add agent';
    $('agent-name').value = ''; $('agent-email').value = ''; $('agent-password').value = ''; $('agent-role').value = 'agent';
    $('agent-password-field').style.display = '';
    $('agent-modal-error').textContent = '';
    modal.classList.add('is-open');
  }
  function openEdit(id) {
    const a = agents.find(x => x.id === id);
    if (!a) return;
    editingId = id;
    $('agent-modal-title').textContent = 'Edit agent';
    $('agent-name').value = a.full_name; $('agent-email').value = a.email; $('agent-role').value = a.role;
    $('agent-password-field').style.display = 'none'; // password changes go through Reset password
    $('agent-modal-error').textContent = '';
    modal.classList.add('is-open');
  }
  $('add-agent-btn').addEventListener('click', openCreate);
  document.querySelectorAll('[data-agent-modal-close]').forEach(el => el.addEventListener('click', () => modal.classList.remove('is-open')));

  $('agent-save-btn').addEventListener('click', async () => {
    const errEl = $('agent-modal-error');
    errEl.textContent = '';
    const full_name = $('agent-name').value.trim();
    const email = $('agent-email').value.trim();
    const role = $('agent-role').value;
    try {
      if (editingId) {
        await api(`/api/admin/agents/${editingId}`, { method: 'PATCH', body: JSON.stringify({ full_name, email, role }) });
      } else {
        const password = $('agent-password').value;
        if (!full_name || !email || !password) { errEl.textContent = 'Name, email, and password are required.'; return; }
        if (password.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; return; }
        await api('/api/admin/agents', { method: 'POST', body: JSON.stringify({ full_name, email, password, role }) });
      }
      modal.classList.remove('is-open');
      loadAgents();
    } catch (e) { errEl.textContent = e.message; }
  });

  /* ---- disable / enable ---- */
  async function toggleActive(id) {
    const a = agents.find(x => x.id === id);
    if (!a) return;
    try {
      await api(`/api/admin/agents/${id}`, { method: 'PATCH', body: JSON.stringify({ active: !a.active }) });
      loadAgents();
    } catch (e) { alert(e.message); }
  }

  /* ---- reset password ---- */
  const resetModal = $('agent-reset-modal');
  let resettingId = null;
  function openReset(id) {
    const a = agents.find(x => x.id === id);
    if (!a) return;
    resettingId = id;
    $('agent-reset-name').textContent = `${a.full_name} — ${a.email}`;
    $('agent-reset-password').value = '';
    $('agent-reset-error').textContent = '';
    resetModal.classList.add('is-open');
  }
  document.querySelectorAll('[data-agent-reset-close]').forEach(el => el.addEventListener('click', () => resetModal.classList.remove('is-open')));
  $('agent-reset-save-btn').addEventListener('click', async () => {
    const errEl = $('agent-reset-error');
    const password = $('agent-reset-password').value;
    if (!password || password.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; return; }
    try {
      await api(`/api/admin/agents/${resettingId}/reset-password`, { method: 'POST', body: JSON.stringify({ password }) });
      resetModal.classList.remove('is-open');
    } catch (e) { errEl.textContent = e.message; }
  });

  /* ---- delete ---- */
  async function removeAgent(id) {
    const a = agents.find(x => x.id === id);
    if (!a) return;
    if (!confirm(`Delete ${a.full_name}? This can't be undone.`)) return;
    try {
      await api(`/api/admin/agents/${id}`, { method: 'DELETE' });
      loadAgents();
    } catch (e) { alert(e.message); }
  }

  // Load once, the first time the Agents tab is actually opened.
  let loaded = false;
  document.querySelector('[data-tab="agents"]').addEventListener('click', () => {
    if (!loaded) { loaded = true; loadAgents(); }
  });
})();
