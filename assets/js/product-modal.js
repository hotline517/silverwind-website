// Contact/inquiry modal — Tire Manila's flow is inquiry-based, not cart-based.
// Clicking "Contact Us" on a row shows the tire details and how to reach the shop.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof TIRE_ROWS === 'undefined' && typeof MAG_ROWS === 'undefined') return;

  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.id = 'product-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="product-modal-backdrop" data-close="1"></div>
    <div class="product-modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="product-modal-close" data-close="1" aria-label="Close">✕</button>
      <div class="product-modal-media inquiry-modal-media">
        <img id="modal-img" src="" alt="">
        <span class="product-badge" id="modal-badge"></span>
      </div>
      <div class="product-modal-body">
        <div class="product-brand" id="modal-brand"></div>
        <h3 id="modal-title"></h3>
        <p class="product-modal-count" id="modal-count"></p>
        <div class="product-modal-table-wrap" style="padding: 18px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-family: var(--font-mono); font-size: 14px;">Call/Text: <b>0916-XXX-XXXX</b></div>
          <div style="font-family: var(--font-mono); font-size: 14px;">Landline: <b>8XXX-XXXX</b></div>
          <div style="font-size: 13px; color: var(--ink-soft);">Mention the size and model above when you reach out — we'll confirm stock and installation schedule.</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.addEventListener('click', (e) => {
    const tireTrigger = e.target.closest('[data-inquire-id]');
    if (tireTrigger) {
      openModal(tireTrigger.dataset.inquireId, 'tire');
      return;
    }
    const magTrigger = e.target.closest('[data-inquire-mag-id]');
    if (magTrigger) {
      openModal(magTrigger.dataset.inquireMagId, 'mag');
      return;
    }
    const x4Trigger = e.target.closest('[data-inquire-x4-id]');
    if (x4Trigger) {
      openModal(x4Trigger.dataset.inquireX4Id, 'x4');
      return;
    }
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function openModal(id, kind) {
    let r, title, badge, priceText;
    if (kind === 'x4') {
      const rows = window.CURRENT_X4_ROWS || (typeof X4_ROWS !== 'undefined' ? X4_ROWS : []);
      r = rows.find(x => x.id === id);
      if (!r) return;
      title = r.model;
      badge = r.category;
      priceText = r.price ? `₱${Number(r.price).toLocaleString()} SRP` : 'Contact for price';
    } else if (kind === 'mag') {
      const rows = window.CURRENT_MAG_ROWS || (typeof MAG_ROWS !== 'undefined' ? MAG_ROWS : []);
      r = rows.find(x => x.id === id);
      if (!r) return;
      const magSize = (typeof magSizeLabel === 'function') ? magSizeLabel(r) : (r.size || `${r.diameter}"`);
      title = `${r.model} — ${magSize}`;
      badge = `${r.holes.join('/')}H`;
      priceText = r.price ? `₱${r.price.toLocaleString()} SRP` : 'Contact for price';
    } else {
      const rows = window.CURRENT_TIRE_ROWS || (typeof TIRE_ROWS !== 'undefined' ? TIRE_ROWS : []);
      r = rows.find(x => x.id === id);
      if (!r) return;
      title = `${r.model} — ${r.size}`;
      badge = r.category;
      priceText = `₱${r.price.toLocaleString()} SRP`;
    }

    const imgEl = document.getElementById('modal-img');
    const mediaEl = imgEl.closest('.product-modal-media');
    if (r.img) {
      imgEl.src = r.img;
      imgEl.alt = `${r.brand} ${title}`;
      if (mediaEl) mediaEl.style.display = '';
    } else {
      imgEl.removeAttribute('src');
      if (mediaEl) mediaEl.style.display = 'none';
    }
    document.getElementById('modal-badge').textContent = badge;
    document.getElementById('modal-brand').textContent = r.brand;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-count').textContent = `${priceText} · On Stock`;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});
