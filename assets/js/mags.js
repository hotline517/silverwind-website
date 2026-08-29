// ============================================
// Mags page: filter/sort logic with smooth rendering limit
// ============================================
(function () {
  const magRoot = document.getElementById('view-mags') || document;

  let MAG_ROWS = [];
  let MAG_BRANDS = [], MAG_DIAMETERS = [], MAG_HOLES = [];

  function normalize(s) {
    return (s == null ? '' : String(s)).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function deriveMagFilterLists() {
    MAG_BRANDS = [...new Set(MAG_ROWS.map(r => r.brand))].sort();
    MAG_DIAMETERS = [...new Set(MAG_ROWS.map(r => r.diameter))].sort((a, b) => a - b);
    MAG_HOLES = [...new Set(MAG_ROWS.flatMap(r => r.holes))].sort((a, b) => a - b);
  }

  const magState = {
    query: '',
    sort: 'default',
    selected: {
      brand: new Set(),
      holes: new Set(),
      rim: new Set(),
    },
  };

  const MAG_FILTER_CONFIG = {
    brand: { list: () => MAG_BRANDS, match: (r, v) => r.brand === v, label: v => v },
    holes: { list: () => MAG_HOLES, match: (r, v) => r.holes.includes(Number(v)), label: v => `${v}H` },
    rim: { list: () => MAG_DIAMETERS, match: (r, v) => String(r.diameter) === v, label: v => `${v}"` },
  };

  document.addEventListener('DOMContentLoaded', async () => {
    MAG_ROWS = (typeof DB !== 'undefined') ? await DB.loadMags() : (typeof window.MAG_ROWS !== 'undefined' ? window.MAG_ROWS : []);
    if (!MAG_ROWS.length) return;
    if (typeof DB !== 'undefined') MAG_ROWS = await DB.enrichWithInventory(MAG_ROWS);
    deriveMagFilterLists();
    window.CURRENT_MAG_ROWS = MAG_ROWS;
    buildMagFilterUI();
    bindMagEvents();
    renderMags();

    const bar = magRoot.querySelector('#filter-bar');
    window.addEventListener('scroll', () => {
      if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 220);
    }, { passive: true });
  });

  function buildMagFilterUI() {
    magRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      const key = dropdown.dataset.key;
      const cfg = MAG_FILTER_CONFIG[key];
      if (!cfg) return;
      const panel = dropdown.querySelector('.ms-panel');
      panel.innerHTML = cfg.list().map(v => `
        <label class="ms-option">
          <input type="checkbox" value="${v}" data-key="${key}">
          <span>${cfg.label(v)}</span>
        </label>
      `).join('');
    });
  }

  function bindMagEvents() {
    magRoot.querySelector('#search-input').addEventListener('input', (e) => {
      magState.query = normalize(e.target.value);
      renderMags();
    });
    magRoot.querySelector('#sort-select').addEventListener('change', (e) => {
      magState.sort = e.target.value; renderMags();
    });

    magRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      if (!MAG_FILTER_CONFIG[dropdown.dataset.key]) return;
      const trigger = dropdown.querySelector('.ms-trigger');
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('is-open');
        magRoot.querySelectorAll('.ms-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
        if (!isOpen) dropdown.classList.add('is-open');
      });
    });
    document.addEventListener('click', () => {
      magRoot.querySelectorAll('.ms-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    });

    magRoot.querySelector('#ms-row').addEventListener('change', (e) => {
      if (e.target.type !== 'checkbox') return;
      const key = e.target.dataset.key;
      if (!MAG_FILTER_CONFIG[key]) return;
      const val = e.target.value;
      if (e.target.checked) magState.selected[key].add(val);
      else magState.selected[key].delete(val);
      updateMagTriggerLabels();
      renderMags();
    });

    magRoot.querySelector('#ms-clear-all').addEventListener('click', () => {
      Object.values(magState.selected).forEach(set => set.clear());
      magRoot.querySelectorAll('.ms-panel input[type="checkbox"]').forEach(cb => cb.checked = false);
      updateMagTriggerLabels();
      renderMags();
    });
  }

  function updateMagTriggerLabels() {
    const labels = { brand: 'Brand', holes: 'Holes', rim: 'Rim Size' };
    let anySelected = false;
    magRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      const key = dropdown.dataset.key;
      if (!MAG_FILTER_CONFIG[key]) return;
      const count = magState.selected[key].size;
      if (count > 0) anySelected = true;
      const trigger = dropdown.querySelector('.ms-trigger');
      const chev = trigger.querySelector('.chev').outerHTML;
      trigger.classList.toggle('has-selection', count > 0);
      trigger.innerHTML = count > 0 ? `${labels[key]} (${count})${chev}` : `${labels[key]}${chev}`;
    });
    magRoot.querySelector('#ms-clear-all').style.display = anySelected ? '' : 'none';
  }

  function getFilteredMags() {
    let items = MAG_ROWS.filter(r => {
      if (magState.query) {
        const hay = normalize(`${r.brand} ${r.listedUnder || ''} ${r.model} ${r.finish} ${sizeLabel(r)} ${r.variant || ''}`);
        if (!hay.includes(magState.query)) return false;
      }
      for (const key of Object.keys(magState.selected)) {
        const set = magState.selected[key];
        if (set.size === 0) continue;
        const cfg = MAG_FILTER_CONFIG[key];
        const matchesAny = [...set].some(v => cfg.match(r, v));
        if (!matchesAny) return false;
      }
      return true;
    });

    if (magState.sort === 'low-high') items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (magState.sort === 'high-low') items.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    else if (magState.sort === 'brand') items.sort((a, b) => a.brand.localeCompare(b.brand));
    else if (magState.sort === 'holes-asc') items.sort((a, b) => Math.min(...a.holes) - Math.min(...b.holes));

    return items;
  }

  function renderMags() {
    const items = getFilteredMags();
    const list = magRoot.querySelector('#mag-list');
    const empty = magRoot.querySelector('#empty-state');
    const count = magRoot.querySelector('#results-count');

    count.textContent = `Showing ${items.length} of ${MAG_ROWS.length} mags`;

    if (!items.length) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    // Nilagyan ng limit (40 items muna) para hindi humaba nang husto at mabilis mag-load patungong footer
    const shown = items.slice(0, 40);

    list.classList.remove('list-refresh');
    void list.offsetWidth;
    list.innerHTML = shown.map(magRowHTML).join('');
    list.classList.add('list-refresh');
    [...list.children].forEach((row, i) => {
      row.style.setProperty('--i', Math.min(i, 12));
    });

    if (items.length > shown.length) {
      const more = document.createElement('div');
      more.className = 'results-count';
      more.style.padding = '18px 6px';
      more.textContent = `+ ${items.length - shown.length} more results hidden — use search or filters to narrow down.`;
      list.appendChild(more);
    }
  }

    function magRowHTML(r) {
    const size = sizeLabel(r);
    const priceHTML = r.price
      ? `<div class="tire-row-price">₱${r.price.toLocaleString()}</div>`
      : `<div class="tire-row-price" style="font-size:13px; color: var(--text-muted);">Contact for price</div>`;
    const listedNote = r.listedUnder
      ? ` <span class="listed-under">(via ${r.listedUnder})</span>` : '';
    const variantBadge = r.variant
      ? `<span class="tm-badge">${r.variant}</span>` : '';

    return `
      <div class="tire-row">
        <div class="tire-row-media" data-zoom-src="${r.img}" data-zoom-alt="${r.model} by ${r.brand}, ${r.finish}">
          <img src="${r.img}" alt="${r.brand} ${r.model} mag wheel" loading="lazy">
        </div>
        <div>
          <div class="tire-row-title">
            <span class="size-part">${r.model}</span>
            <span class="dash-sep">–</span> ${r.brand}${listedNote}
          </div>
          <div class="tm-badges">
            <span class="tm-badge cat">${r.holes.join('/')}H</span>
            <span class="tm-badge stock">${r.finish}</span>
            <span class="tm-badge brand">${size}</span>
            ${variantBadge}
          </div>
        </div>
        <div class="tire-row-right">
          ${priceHTML}
          <button class="contact-btn" data-inquire-mag-id="${r.id}">Contact Us</button>
        </div>
      </div>
    `;
  }

  function sizeLabel(r) {
    if (typeof magSizeLabel === 'function') return magSizeLabel(r);
    return r.size || `${r.diameter}"`;
  }
})();