// ============================================
// 4x4 page: filter/sort logic with smooth rendering limit
// ============================================
(function () {
  const root = document.getElementById('view-x4') || document;

  let ROWS = [];
  let BRANDS = [], CATEGORIES = [], VEHICLES = [];

  const FILTER_CONFIG = {
    vehicle:  { list: () => VEHICLES,   match: (r, v) => (r.fits || []).includes(v), label: v => v },
    brand:    { list: () => BRANDS,     match: (r, v) => r.brand === v,    label: v => v },
    category: { list: () => CATEGORIES, match: (r, v) => r.category === v, label: v => v },
  };

  const state = { query: '', sort: 'default',
    selected: { vehicle: new Set(), brand: new Set(), category: new Set() } };

  function normalize(s) {
    return (s == null ? '' : String(s)).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    ROWS = (typeof DB !== 'undefined' && DB.loadFourXFour) ? await DB.loadFourXFour() : [];
    if (!ROWS.length && typeof X4_ROWS !== 'undefined') ROWS = X4_ROWS;
    if (!ROWS.length) return;
    if (typeof DB !== 'undefined' && DB.enrichWithInventory) ROWS = await DB.enrichWithInventory(ROWS);

    BRANDS = [...new Set(ROWS.map(r => r.brand))].sort();
    CATEGORIES = [...new Set(ROWS.map(r => r.category))].sort();
    VEHICLES = [...new Set(ROWS.flatMap(r => r.fits || []))].sort();
    window.CURRENT_X4_ROWS = ROWS;

    buildFilterUI();
    bindEvents();
    render();

    const bar = root.querySelector('#filter-bar');
    window.addEventListener('scroll', () => {
      if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 220);
    }, { passive: true });
  });

  function buildFilterUI() {
    root.querySelectorAll('.ms-dropdown').forEach(d => {
      const cfg = FILTER_CONFIG[d.dataset.key];
      if (!cfg) return;
      d.querySelector('.ms-panel').innerHTML = cfg.list().map(v => `
        <label class="ms-option">
          <input type="checkbox" value="${v}" data-key="${d.dataset.key}">
          <span>${cfg.label(v)}</span>
        </label>`).join('');
    });
  }

  function bindEvents() {
    const searchInput = root.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.query = normalize(e.target.value); render();
      });
    }
    const sortSelect = root.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        state.sort = e.target.value; render();
      });
    }

    root.querySelectorAll('.ms-dropdown').forEach(d => {
      if (!FILTER_CONFIG[d.dataset.key]) return;
      d.querySelector('.ms-trigger').addEventListener('click', e => {
        e.stopPropagation();
        const open = d.classList.contains('is-open');
        root.querySelectorAll('.ms-dropdown.is-open').forEach(x => x.classList.remove('is-open'));
        if (!open) d.classList.add('is-open');
      });
    });
    document.addEventListener('click', () => {
      root.querySelectorAll('.ms-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    });

    const msRow = root.querySelector('#ms-row');
    if (msRow) {
      msRow.addEventListener('change', e => {
        if (e.target.type !== 'checkbox') return;
        const key = e.target.dataset.key;
        if (!FILTER_CONFIG[key]) return;
        if (e.target.checked) state.selected[key].add(e.target.value);
        else state.selected[key].delete(e.target.value);
        updateLabels(); render();
      });
    }

    const clearBtn = root.querySelector('#ms-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        Object.values(state.selected).forEach(s => s.clear());
        root.querySelectorAll('.ms-panel input[type="checkbox"]').forEach(cb => cb.checked = false);
        updateLabels(); render();
      });
    }
  }

  function updateLabels() {
    const labels = { vehicle: 'Vehicle', brand: 'Brand', category: 'Category' };
    let any = false;
    root.querySelectorAll('.ms-dropdown').forEach(d => {
      const key = d.dataset.key;
      if (!FILTER_CONFIG[key]) return;
      const n = state.selected[key].size;
      if (n > 0) any = true;
      const t = d.querySelector('.ms-trigger');
      const chev = t.querySelector('.chev').outerHTML;
      t.classList.toggle('has-selection', n > 0);
      t.innerHTML = n > 0 ? `${labels[key]} (${n})${chev}` : `${labels[key]}${chev}`;
    });
    const clearBtn = root.querySelector('#ms-clear-all');
    if (clearBtn) clearBtn.style.display = any ? '' : 'none';
  }

  function getFiltered() {
    let items = ROWS.filter(r => {
      if (state.query) {
        const hay = normalize(`${r.brand} ${r.model} ${r.category} ${r.spec} ${r.vehicle || ''} ${(r.fits || []).join(' ')}`);
        if (!hay.includes(state.query)) return false;
      }
      for (const key of Object.keys(state.selected)) {
        const set = state.selected[key];
        if (!set.size) continue;
        if (![...set].some(v => FILTER_CONFIG[key].match(r, v))) return false;
      }
      return true;
    });

    if (state.sort === 'low-high') items = items.slice().sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (state.sort === 'high-low') items = items.slice().sort((a,b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    else if (state.sort === 'brand') items = items.slice().sort((a,b) => a.brand.localeCompare(b.brand));
    return items;
  }

  function render() {
    const items = getFiltered();
    const list = root.querySelector('#x4-list') || root.querySelector('#tire-list');
    const empty = root.querySelector('#empty-state');
    const resultsCount = root.querySelector('#results-count');
    
    if (resultsCount) resultsCount.textContent = `Showing ${items.length} of ${ROWS.length} items`;

    if (!list) return;

    if (!items.length) { list.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';

    const shown = items.slice(0, 40);
    list.classList.remove('list-refresh');
    void list.offsetWidth;

    if (state.selected.vehicle.size) {
      const groups = {};
      shown.forEach(r => { (groups[r.category] = groups[r.category] || []).push(r); });
      list.innerHTML = Object.keys(groups).sort().map(cat => `
        <div class="x4-group">
          <div class="x4-group-head">${cat} <span class="x4-group-count">${groups[cat].length}</span></div>
          ${groups[cat].map(rowHTML).join('')}
        </div>`).join('');
    } else {
      list.innerHTML = shown.map(rowHTML).join('');
    }

    list.classList.add('list-refresh');
    [...list.querySelectorAll('.tire-row')].forEach((row, i) => row.style.setProperty('--i', Math.min(i, 12)));

    if (items.length > shown.length) {
      const more = document.createElement('div');
      more.className = 'results-count';
      more.style.padding = '18px 6px';
      more.textContent = `+ ${items.length - shown.length} more results hidden — use search or filters to narrow down.`;
      list.appendChild(more);
    }
  }

  function rowHTML(r) {
    const price = r.price
      ? `<div class="tire-row-price">₱${Number(r.price).toLocaleString()}</div>`
      : `<div class="tire-row-price" style="font-size:13px; color: var(--text-muted);">Contact for price</div>`;
    
    const imgTag = r.img 
      ? `<div class="tire-row-media" data-zoom-src="${r.img}" data-zoom-alt="${r.brand} ${r.model}"><img src="${r.img}" alt="${r.model}" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'"></div>` 
      : '';

    return `
      <div class="tire-row x4-row ${r.img ? 'x4-has-image' : ''}">
        ${imgTag}
        <div style="min-width: 0;">
          <div class="tire-row-title"><span class="size-part">${r.model}</span> ${r.brand}</div>
          <div class="x4-spec">${r.spec}</div>
          <div class="tm-badges">
            <span class="tm-badge cat">${r.category}</span>
            ${r.vehicle ? `<span class="tm-badge stock">${r.vehicle}</span>` : ''}
          </div>
        </div>
        <div class="tire-row-right">
          ${price}
          <button class="contact-btn" data-inquire-x4-id="${r.id}">Contact Us</button>
        </div>
      </div>`;
  }
})();