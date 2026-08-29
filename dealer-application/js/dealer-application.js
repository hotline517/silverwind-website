/* dealer-application.js
   Five-step public dealer application wizard. Plain JS, no framework —
   matches the rest of the site's stack. Non-file fields auto-save to
   sessionStorage (cleared on submit/tab close — this form asks for
   business info, not something that belongs in permanent localStorage);
   selected File objects live only in memory for the tab's lifetime,
   since a File can't be serialized into Storage at all.
*/
(function () {
  const DRAFT_KEY = 'sw_dealer_application_draft';
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MOBILE_RE = /^(?:\+63|0)9\d{9}$/;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $all = (sel, root = document) => [...root.querySelectorAll(sel)];

  let currentStep = 1;
  let submitting = false;
  const documents = {}; // documentType -> File

  const state = loadDraft() ?? {
    business: {}, property: { same_as_business: true }, references: [{}], declaration_accepted: false
  };
  if (!state.references || !state.references.length) state.references = [{}];

  function loadDraft() {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function saveDraft() {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch { /* private mode etc — non-fatal */ }
  }

  /* ============================================================
     STEP 1 & 2 — plain field binding
     ============================================================ */
  const BUSINESS_FIELDS = ['business_name','business_type','contact_person','contact_position','business_address','city','province','postal_code','contact_number','email','website','facebook_page','years_in_business'];
  const PROPERTY_FIELDS = ['store_address','property_status','store_size','operation_info','location_notes'];

  function bindField(id, obj, key) {
    const el = $(`#${id}`);
    if (!el) return;
    if (obj[key] != null) el.value = obj[key];
    el.addEventListener('input', () => { obj[key] = el.value; saveDraft(); });
    el.addEventListener('change', () => { obj[key] = el.value; saveDraft(); });
  }
  BUSINESS_FIELDS.forEach(f => bindField(f, state.business, f));
  PROPERTY_FIELDS.forEach(f => bindField(f, state.property, f));

  const sameAsBusiness = $('#same_as_business');
  const storeAddressField = $('#storeAddressField');
  function applySameAsBusiness() {
    state.property.same_as_business = sameAsBusiness.checked;
    storeAddressField.hidden = sameAsBusiness.checked;
    saveDraft();
  }
  sameAsBusiness.checked = state.property.same_as_business !== false;
  storeAddressField.hidden = sameAsBusiness.checked;
  sameAsBusiness.addEventListener('change', applySameAsBusiness);

  /* ============================================================
     STEP 3 — documents
     ============================================================ */
  $all('[data-doc-input]').forEach(input => {
    const type = input.dataset.docInput;
    input.addEventListener('change', () => {
      const file = input.files[0];
      const nameEl = $(`[data-doc-name="${type}"]`);
      const errEl = $(`[data-doc-err="${type}"]`);
      errEl.textContent = '';
      if (!file) { delete documents[type]; nameEl.textContent = ''; return; }

      if (!ALLOWED_TYPES.includes(file.type)) {
        errEl.textContent = 'Only PDF, JPG, or PNG files are accepted.';
        input.value = ''; nameEl.textContent = ''; delete documents[type]; return;
      }
      if (file.size > MAX_FILE_BYTES) {
        errEl.textContent = 'File is too large — 10MB max.';
        input.value = ''; nameEl.textContent = ''; delete documents[type]; return;
      }
      documents[type] = file;
      nameEl.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    });
  });

  /* ============================================================
     STEP 4 — references (1..5)
     ============================================================ */
  const REFERENCE_FIELDS = ['reference_name','company','contact_number','email','relationship','years_known','notes'];
  const referencesList = $('#referencesList');

  function renderReferences() {
    referencesList.innerHTML = state.references.map((r, i) => `
      <div class="reference-card" data-ref-index="${i}">
        <div class="ref-title">Reference ${i + 1}</div>
        ${state.references.length > 1 ? `<button type="button" class="ref-remove" data-remove-ref="${i}">Remove</button>` : ''}
        <div class="row-2">
          <div class="field"><label>Name *</label><input data-ref-field="reference_name" data-ref-index="${i}" value="${esc(r.reference_name)}"></div>
          <div class="field"><label>Company</label><input data-ref-field="company" data-ref-index="${i}" value="${esc(r.company)}"></div>
        </div>
        <div class="row-2">
          <div class="field"><label>Contact number</label><input data-ref-field="contact_number" data-ref-index="${i}" value="${esc(r.contact_number)}"></div>
          <div class="field"><label>Email</label><input type="email" data-ref-field="email" data-ref-index="${i}" value="${esc(r.email)}"></div>
        </div>
        <div class="row-2">
          <div class="field"><label>Relationship</label><input data-ref-field="relationship" data-ref-index="${i}" placeholder="Supplier, partner..." value="${esc(r.relationship)}"></div>
          <div class="field"><label>Years known</label><input data-ref-field="years_known" data-ref-index="${i}" value="${esc(r.years_known)}"></div>
        </div>
      </div>`).join('');

    $all('[data-ref-field]', referencesList).forEach(el => {
      el.addEventListener('input', () => {
        const i = +el.dataset.refIndex, f = el.dataset.refField;
        state.references[i][f] = el.value;
        saveDraft();
      });
    });
    $all('[data-remove-ref]', referencesList).forEach(btn => {
      btn.addEventListener('click', () => {
        state.references.splice(+btn.dataset.removeRef, 1);
        saveDraft(); renderReferences();
      });
    });
  }
  function esc(v) { return v == null ? '' : String(v).replace(/"/g, '&quot;'); }

  $('#addReferenceBtn').addEventListener('click', () => {
    if (state.references.length >= 5) return;
    state.references.push({});
    saveDraft(); renderReferences();
  });
  renderReferences();

  /* ============================================================
     VALIDATION — mirrors the server; blocks "Continue" client-side,
     the server re-checks everything regardless.
     ============================================================ */
  function validateStep(step) {
    const errors = [];
    const setInvalid = (id, bad) => { const el = $(`#${id}`); if (el) el.setAttribute('aria-invalid', String(!!bad)); };

    if (step === 1) {
      const b = state.business;
      ['business_name','contact_person','business_address','city','province'].forEach(f => setInvalid(f, false));
      if (!b.business_name?.trim()) { errors.push('Business name is required.'); setInvalid('business_name', true); }
      if (!b.contact_person?.trim()) { errors.push('Contact person is required.'); setInvalid('contact_person', true); }
      if (!b.business_address?.trim()) { errors.push('Business address is required.'); setInvalid('business_address', true); }
      if (!b.city?.trim()) { errors.push('City is required.'); setInvalid('city', true); }
      if (!b.province?.trim()) { errors.push('Province is required.'); setInvalid('province', true); }
      const mobile = (b.contact_number || '').replace(/[\s-]/g, '');
      if (!mobile) { errors.push('Contact number is required.'); setInvalid('contact_number', true); }
      else if (!MOBILE_RE.test(mobile)) { errors.push('Enter a valid PH mobile number, e.g. 09XX XXX XXXX.'); setInvalid('contact_number', true); }
      if (!b.email?.trim()) { errors.push('Email is required.'); setInvalid('email', true); }
      else if (!EMAIL_RE.test(b.email.trim())) { errors.push('Enter a valid email address.'); setInvalid('email', true); }
    }

    if (step === 3) {
      if (!documents.BUSINESS_PERMIT) errors.push('Business Permit is required.');
      if (!documents.VALID_ID) errors.push('A valid government ID is required.');
    }

    if (step === 4) {
      if (!state.references.some(r => r.reference_name?.trim())) errors.push('At least one reference with a name is required.');
    }

    if (step === 5) {
      if (!state.declaration_accepted) errors.push('You must confirm the declaration to submit.');
    }

    return errors;
  }

  /* ============================================================
     STEP NAVIGATION
     ============================================================ */
  const steps = $all('.step');
  const pills = $all('.step-pill');
  const backBtn = $('#backBtn');
  const continueBtn = $('#continueBtn');
  const submitBtn = $('#submitBtn');

  function showStep(n) {
    currentStep = n;
    steps.forEach(s => s.hidden = +s.dataset.step !== n);
    pills.forEach(p => {
      const s = +p.dataset.step;
      p.classList.toggle('is-current', s === n);
      p.classList.toggle('is-done', s < n);
    });
    backBtn.hidden = n === 1;
    continueBtn.hidden = n === 5;
    submitBtn.hidden = n !== 5;
    if (n === 5) renderReview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToStep(n) {
    const errEl = $(`[data-err-for="${currentStep}"]`);
    if (n > currentStep) {
      const errors = validateStep(currentStep);
      if (errors.length) { errEl.textContent = errors.join(' '); return; }
    }
    if (errEl) errEl.textContent = '';
    showStep(n);
  }

  continueBtn.addEventListener('click', () => goToStep(Math.min(5, currentStep + 1)));
  backBtn.addEventListener('click', () => goToStep(Math.max(1, currentStep - 1)));
  pills.forEach(p => p.addEventListener('click', () => goToStep(+p.dataset.step)));
  $all('[data-edit-step]').forEach(btn => btn.addEventListener('click', () => goToStep(+btn.dataset.editStep)));

  $('#declaration_accepted').addEventListener('change', (e) => { state.declaration_accepted = e.target.checked; });

  /* ============================================================
     REVIEW
     ============================================================ */
  const BUSINESS_LABELS = { business_name:'Business name', business_type:'Business type', contact_person:'Contact person', contact_position:'Position', business_address:'Address', city:'City', province:'Province', postal_code:'Postal code', contact_number:'Contact number', email:'Email', website:'Website', facebook_page:'Facebook', years_in_business:'Years in business' };
  const PROPERTY_LABELS = { store_address:'Store address', property_status:'Property status', store_size:'Store size', operation_info:'Operation info', location_notes:'Location notes' };
  const DOC_LABELS = { BUSINESS_PERMIT:'Business Permit', VALID_ID:'Valid ID', STORE_PHOTO:'Store Photo', OTHER:'Other document' };

  function renderDl(target, obj, labels) {
    const rows = Object.entries(labels)
      .filter(([k]) => obj[k])
      .map(([k, label]) => `<dt>${label}</dt><dd>${esc(obj[k])}</dd>`).join('');
    $(target).innerHTML = rows || '<dd class="review-empty">Nothing entered</dd>';
  }

  function renderReview() {
    renderDl('#reviewBusiness', state.business, BUSINESS_LABELS);
    const propertyView = { ...state.property };
    if (state.property.same_as_business) propertyView.store_address = state.business.business_address;
    renderDl('#reviewProperty', propertyView, PROPERTY_LABELS);

    const docRows = Object.keys(DOC_LABELS)
      .map(type => `<dt>${DOC_LABELS[type]}</dt><dd>${documents[type] ? esc(documents[type].name) : '<span class="review-empty">Not uploaded</span>'}</dd>`)
      .join('');
    $('#reviewDocuments').innerHTML = docRows;

    $('#reviewReferences').innerHTML = state.references
      .filter(r => r.reference_name?.trim())
      .map(r => `<dl class="review-list" style="margin-bottom:10px"><dt>Name</dt><dd>${esc(r.reference_name)}</dd>
        <dt>Company</dt><dd>${esc(r.company) || '—'}</dd></dl>`).join('') || '<p class="review-empty">None added</p>';
  }

  /* ============================================================
     SUBMIT
     ============================================================ */
  const form = $('#dealerForm');
  const submitResult = $('#submitResult');

  submitBtn.addEventListener('click', async () => {
    if (submitting) return; // synchronous re-entrancy guard, not just the disabled attribute
    const errors = validateStep(5);
    const errEl = $('[data-err-for="5"]');
    if (errors.length) { errEl.textContent = errors.join(' '); return; }
    errEl.textContent = '';

    submitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    submitResult.innerHTML = '';

    try {
      const business = { ...state.business };
      const property = { ...state.property };
      if (property.same_as_business) property.store_address = business.business_address;
      delete property.same_as_business;

      const payload = {
        business,
        property,
        references: state.references.filter(r => r.reference_name?.trim()),
        declaration_accepted: true
      };

      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));
      Object.entries(documents).forEach(([type, file]) => fd.append(type, file));

      const res = await fetch(`${dealerAppConfig.apiBaseUrl}/api/applications/submit`, {
        method: 'POST', body: fd
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        errEl.textContent = data.error || "We couldn't submit your application right now. Please try again.";
        return;
      }

      sessionStorage.removeItem(DRAFT_KEY);
      form.hidden = true;
      $('#stepRail').hidden = true;
      const success = $('#successScreen');
      success.hidden = false;
      $('#successRef').textContent = data.applicationReference;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      errEl.textContent = "We couldn't submit your application right now. Please check your connection and try again.";
    } finally {
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

  showStep(1);
})();
