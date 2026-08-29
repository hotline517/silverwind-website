// ============================================
// Shop (Tire) page: filter/sort logic with smooth rendering limit
// ============================================
(function () {
  const shopRoot = document.getElementById('view-tire') || document;

  let TIRE_ROWS = [];
  let BRANDS = [], CATEGORIES = [], DIAMETERS = [], WIDTHS = [], ASPECTS = [], SIZES = [];

  function normalize(s) {
    return (s == null ? '' : String(s)).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function deriveFilterLists() {
    BRANDS = [...new Set(TIRE_ROWS.map(r => r.brand))].sort();
    CATEGORIES = [...new Set(TIRE_ROWS.map(r => r.category))].sort();
    DIAMETERS = [...new Set(TIRE_ROWS.map(r => r.diameter))].sort((a, b) => a - b);
    WIDTHS = [...new Set(TIRE_ROWS.map(r => r.width))].sort((a, b) => a - b);
    ASPECTS = [...new Set(TIRE_ROWS.map(r => r.aspect).filter(a => a !== null))].sort((a, b) => a - b);
    SIZES = [...new Set(TIRE_ROWS.map(r => r.size))].sort((a, b) => {
      const pa = a.match(/^(\d+(?:\.\d+)?)/), pb = b.match(/^(\d+(?:\.\d+)?)/);
      return parseFloat(pa[1]) - parseFloat(pb[1]);
    });
  }

  const state = {
    query: '',
    sort: 'default',
    selected: {
      brand: new Set(),
      category: new Set(),
      width: new Set(),
      aspect: new Set(),
      rim: new Set(),
      size: new Set(),
    },
  };

  const FILTER_CONFIG = {
    brand: { list: () => BRANDS, match: (r, v) => r.brand === v, label: v => v },
    category: { list: () => CATEGORIES, match: (r, v) => r.category === v, label: v => v },
    width: { list: () => WIDTHS, match: (r, v) => String(r.width) === v, label: v => v },
    aspect: { list: () => ASPECTS, match: (r, v) => String(r.aspect) === v, label: v => v },
    rim: { list: () => DIAMETERS, match: (r, v) => String(r.diameter) === v, label: v => `${v}"` },
    size: { list: () => SIZES, match: (r, v) => r.size === v, label: v => v },
  };

  document.addEventListener('DOMContentLoaded', async () => {
    TIRE_ROWS = (typeof DB !== 'undefined') ? await DB.loadTires() : (typeof window.TIRE_ROWS !== 'undefined' ? window.TIRE_ROWS : []);
    if (!TIRE_ROWS.length) return;
    if (typeof DB !== 'undefined') TIRE_ROWS = await DB.enrichWithInventory(TIRE_ROWS);
    deriveFilterLists();
    window.CURRENT_TIRE_ROWS = TIRE_ROWS;
    buildFilterUI();
    bindEvents();
    render();

    const bar = shopRoot.querySelector('#filter-bar');
    window.addEventListener('scroll', () => {
      if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 220);
    }, { passive: true });
  });

  function buildFilterUI() {
    shopRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      const key = dropdown.dataset.key;
      const cfg = FILTER_CONFIG[key];
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

  function bindEvents() {
    const searchInput = shopRoot.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
      state.query = normalize(e.target.value);
      render();
    });
    shopRoot.querySelector('#sort-select').addEventListener('change', (e) => {
      state.sort = e.target.value; render();
    });

    shopRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      if (!FILTER_CONFIG[dropdown.dataset.key]) return;
      const trigger = dropdown.querySelector('.ms-trigger');
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('is-open');
        shopRoot.querySelectorAll('.ms-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
        if (!isOpen) dropdown.classList.add('is-open');
      });
    });
    document.addEventListener('click', () => {
      shopRoot.querySelectorAll('.ms-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    });

    shopRoot.querySelector('#ms-row').addEventListener('change', (e) => {
      if (e.target.type !== 'checkbox') return;
      const key = e.target.dataset.key;
      if (!FILTER_CONFIG[key]) return;
      const val = e.target.value;
      if (e.target.checked) state.selected[key].add(val);
      else state.selected[key].delete(val);
      updateTriggerLabels();
      render();
    });

    shopRoot.querySelector('#ms-clear-all').addEventListener('click', () => {
      Object.values(state.selected).forEach(set => set.clear());
      shopRoot.querySelectorAll('.ms-panel input[type="checkbox"]').forEach(cb => cb.checked = false);
      updateTriggerLabels();
      render();
    });
  }

  function updateTriggerLabels() {
    const labels = { brand: 'Brand', category: 'Category', width: 'Tread', aspect: 'Sidewall', rim: 'Rim Size', size: 'Size' };
    let anySelected = false;
    shopRoot.querySelectorAll('.ms-dropdown').forEach(dropdown => {
      const key = dropdown.dataset.key;
      if (!FILTER_CONFIG[key]) return;
      const count = state.selected[key].size;
      if (count > 0) anySelected = true;
      const trigger = dropdown.querySelector('.ms-trigger');
      const chev = trigger.querySelector('.chev').outerHTML;
      trigger.classList.toggle('has-selection', count > 0);
      trigger.innerHTML = count > 0 ? `${labels[key]} (${count})${chev}` : `${labels[key]}${chev}`;
    });
    shopRoot.querySelector('#ms-clear-all').style.display = anySelected ? '' : 'none';
  }

  function parseSizeParts(sizeStr) {
    const m = sizeStr.match(/^(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?R(\d+)/);
    if (!m) return { width: 0, aspect: 0, rim: 0 };
    return {
      width: parseFloat(m[1]) || 0,
      aspect: m[2] ? parseFloat(m[2]) : 0,
      rim: parseInt(m[3], 10) || 0,
    };
  }

  function getFiltered() {
    let items = TIRE_ROWS.filter(r => {
      if (state.query) {
        const hay = normalize(`${r.brand} ${r.model} ${r.size} ${r.category}`);
        if (!hay.includes(state.query)) return false;
      }
      for (const key of Object.keys(state.selected)) {
        const set = state.selected[key];
        if (set.size === 0) continue;
        const cfg = FILTER_CONFIG[key];
        const matchesAny = [...set].some(v => cfg.match(r, v));
        if (!matchesAny) return false;
      }
      return true;
    });

    if (state.sort === 'low-high') items.sort((a, b) => a.price - b.price);
    else if (state.sort === 'high-low') items.sort((a, b) => b.price - a.price);
    else if (state.sort === 'brand') items.sort((a, b) => a.brand.localeCompare(b.brand));
    else if (state.sort === 'size-asc') {
      items.sort((a, b) => {
        const pa = parseSizeParts(a.size), pb = parseSizeParts(b.size);
        return (pa.width - pb.width) || (pa.aspect - pb.aspect) || (pa.rim - pb.rim);
      });
    }

    return items;
  }

  function render() {
    const items = getFiltered();
    const list = shopRoot.querySelector('#tire-list');
    const empty = shopRoot.querySelector('#empty-state');
    const count = shopRoot.querySelector('#results-count');

    count.textContent = `Showing ${items.length} of ${TIRE_ROWS.length} tires`;

    if (!items.length) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    // Limit sa 40 items para mabilis mag-load at hindi humaba nang husto ang page
    const shown = items.slice(0, 40);

    list.classList.remove('list-refresh');
    void list.offsetWidth;
    list.innerHTML = shown.map(rowHTML).join('');
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

  function stockBadge(r) {
    if (!r.liveStatus) return `<span class="tm-badge stock">On Stock</span>`;
    if (r.liveStatus === 'OUT_OF_STOCK') return `<span class="tm-badge stock" style="background:#fceded;color:#b3261e;">Out of Stock</span>`;
    if (r.liveStatus === 'LOW_STOCK') return `<span class="tm-badge stock" style="background:#fdf3e4;color:#9a5b00;">Low Stock — ${r.liveStock} left</span>`;
    return `<span class="tm-badge stock">On Stock</span>`;
  }

  function rowHTML(r) {
    return `
      <div class="tire-row">
        <div class="tire-row-media" data-zoom-src="${r.img}" data-zoom-alt="${r.brand} ${r.model}, ${r.size}">
          <img src="${r.img}" alt="${r.brand} ${r.model} tire" loading="lazy">
        </div>
        <div>
          <div class="tire-row-title"><span class="size-part">${r.size}</span> ${r.brand} ${r.model}</div>
          <div class="tm-badges">
            <span class="tm-badge cat">${r.category}</span>
            ${stockBadge(r)}
            <span class="tm-badge brand">${r.brand}</span>
          </div>
        </div>
        <div class="tire-row-right">
          <div class="tire-row-price">₱${r.price.toLocaleString()}</div>
          <button class="contact-btn" data-inquire-id="${r.id}">Contact Us</button>
        </div>
      </div>
    `;
  }
})();