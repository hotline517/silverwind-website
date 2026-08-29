// Click-to-zoom: clicking any product thumbnail (.tire-row-media) opens a
// full-size lightbox view of that photo. Separate from the Contact Us inquiry modal.
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.id = 'image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="image-lightbox-backdrop" data-zoom-close="1"></div>
    <button class="image-lightbox-close" data-zoom-close="1" aria-label="Close">✕</button>
    <img class="image-lightbox-img" id="lightbox-img" src="" alt="">
  `;
  document.body.appendChild(lightbox);

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-zoom-src]');
    if (trigger) {
      openLightbox(trigger.dataset.zoomSrc, trigger.dataset.zoomAlt || '');
      return;
    }
    if (e.target.closest('[data-zoom-close]')) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function openLightbox(src, alt) {
    const img = document.getElementById('lightbox-img');
    img.src = src;
    img.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});
