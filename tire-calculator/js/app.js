/* app.js
   Wiring only: reads inputs, calls the services, paints the DOM.
*/

/* ============================================================
   UI
   ============================================================ */
const $ = id => document.getElementById(id);
let catalog = [], vehicles = [], selectedVehicle = null, current = null;

(async function init(){
  catalog  = await productService.loadProducts();
  vehicles = await vehicleService.load();
  fillSelect($("vYear"), vehicleService.years(vehicles), "Year");
  analytics.track("calculator_started");
})();

function fillSelect(el, values, placeholder){
  el.innerHTML = `<option value="">${placeholder}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join("");
  el.disabled = values.length === 0;
}
$("vYear").addEventListener("change", () => {
  fillSelect($("vMake"), vehicleService.makes(vehicles, $("vYear").value), "Make");
  fillSelect($("vModel"), [], "Model"); fillSelect($("vTrim"), [], "Trim");
});
$("vMake").addEventListener("change", () => {
  fillSelect($("vModel"), vehicleService.models(vehicles, $("vYear").value, $("vMake").value), "Model");
  fillSelect($("vTrim"), [], "Trim");
});
$("vModel").addEventListener("change", () => {
  fillSelect($("vTrim"), vehicleService.trims(vehicles, $("vYear").value, $("vMake").value, $("vModel").value).map(t => t.trim), "Trim");
});
$("vTrim").addEventListener("change", () => {
  const v = vehicleService.trims(vehicles, $("vYear").value, $("vMake").value, $("vModel").value).find(t => t.trim === $("vTrim").value);
  if (!v) return;
  selectedVehicle = v;
  $("w1").value = v.oem.width; $("a1").value = v.oem.aspect; $("r1").value = v.oem.rim;
  $("vHint").textContent = `Stock size for this vehicle: ${tireMath.format(v.oem)}`;
  analytics.track("vehicle_selected", { vehicle:`${v.year} ${v.make} ${v.model} ${v.trim}` });
});

function readSize(a,b,c){
  const wEl = $(a), aEl = $(b), cEl = $(c);
  if (wEl.value === "" || aEl.value === "" || cEl.value === "") return { s:null, reason:"missing" };
  const s = { width:+wEl.value, aspect:+aEl.value, rim:+cEl.value };
  if (![s.width, s.aspect, s.rim].every(Number.isFinite)) return { s:null, reason:"invalid" };
  if (s.width <= 0 || s.aspect <= 0 || s.rim <= 0) return { s:null, reason:"invalid" };
  if (s.width > 999 || s.aspect > 150 || s.rim > 60) return { s:null, reason:"range" };
  return { s, reason:null };
}
$("compareBtn").addEventListener("click", () => {
  const r1 = readSize("w1","a1","r1"), r2 = readSize("w2","a2","r2");
  if (!r1.s || !r2.s) {
    const reason = [r1.reason, r2.reason].includes("range") ? "range"
      : [r1.reason, r2.reason].includes("invalid") ? "invalid" : "missing";
    $("err").textContent = reason === "range"
      ? "Tire sizes look out of range — check width, ratio, and rim."
      : reason === "invalid"
        ? "Tire sizes must be positive numbers."
        : "Fill in all six numbers to compare.";
    return;
  }
  const s1 = r1.s, s2 = r2.s;
  $("err").textContent = "";
  current = { s1, s2 };
  render();
  $("results").hidden = false;
  $("results").scrollIntoView({ behavior:"smooth", block:"start" });
  analytics.track("tire_size_compared", { size1:tireMath.format(s1), size2:tireMath.format(s2) });
});

function setUnits(id){
  U = unitSystems[id];
  $("uMetric").setAttribute("aria-pressed", id === "metric");
  $("uImperial").setAttribute("aria-pressed", id === "imperial");
  if (current) render();
}
$("uMetric").addEventListener("click", () => setUnits("metric"));
$("uImperial").addEventListener("click", () => setUnits("imperial"));

function toneClass(pct){
  const a = Math.abs(pct), t = recommendationConfig.thresholds;
  return a <= t.good ? "flat" : a <= t.check ? "up" : "down";
}

function render(){
  const { s1, s2 } = current;
  const d1 = tireMath.diameter(s1), d2 = tireMath.diameter(s2);
  const c1 = tireMath.circumference(s1), c2 = tireMath.circumference(s2);
  const dPct = tireMath.pctDiff(d1, d2);

  drawProfile(s1, s2);
  drawFront(s1, s2);
  $("key1").textContent = "Size 1 · " + tireMath.format(s1);
  $("key2").textContent = "Size 2 · " + tireMath.format(s2);

  /* measurements */
  $("thOem").textContent = tireMath.format(s1);
  $("thNew").textContent = tireMath.format(s2);
  const rows = [
    ["Overall diameter", fmtLen(d1), fmtLen(d2), tireMath.pctDiff(d1, d2)],
    ["Section width",    fmtLen(s1.width), fmtLen(s2.width), tireMath.pctDiff(s1.width, s2.width)],
    ["Sidewall height",  fmtLen(tireMath.sidewall(s1)), fmtLen(tireMath.sidewall(s2)), tireMath.pctDiff(tireMath.sidewall(s1), tireMath.sidewall(s2))],
    ["Rim diameter",     `${s1.rim}"`, `${s2.rim}"`, tireMath.pctDiff(s1.rim, s2.rim)],
    ["Circumference",    fmtCirc(c1), fmtCirc(c2), tireMath.pctDiff(c1, c2)],
    [U.revsLabel,        U.revs(c1).toFixed(0), U.revs(c2).toFixed(0), tireMath.pctDiff(U.revs(c1), U.revs(c2))]
  ];
  $("specBody").innerHTML = rows.map(([l,a,b,p]) =>
    `<tr><td>${l}</td><td class="c1">${a}</td><td class="c2">${b}</td>
     <td class="diff ${toneClass(p)}">${p >= 0 ? "+" : ""}${p.toFixed(1)}%</td></tr>`).join("");

  /* speedometer */
  $("speedoBody").innerHTML = U.speeds.map(r => {
    const actual = tireMath.actualSpeed(r, s1, s2), off = actual - r;
    return `<tr><td>${r} ${U.speedUnit}</td><td>${actual.toFixed(1)} ${U.speedUnit}</td>
      <td class="diff ${toneClass(dPct)}">${off >= 0 ? "+" : ""}${off.toFixed(1)}</td></tr>`;
  }).join("");

  /* assessment */
  const a = assess(dPct);
  $("assessSizes").textContent = `${tireMath.format(s2)} compared with ${tireMath.format(s1)}`;
  $("badge").textContent = a.label;
  $("badge").style.color = a.tone;
  $("delta").textContent = `${dPct >= 0 ? "+" : ""}${dPct.toFixed(1)}% overall diameter`;
  $("marker").style.left = `${Math.min(100, Math.max(0, 50 + dPct * 5))}%`;
  $("assessBody").textContent = a.body;
  $("assessList").innerHTML = a.points.map(p => `<li>${p}</li>`).join("");

  renderRecommendations(s2);
}

const tireIcon = `<svg viewBox="0 0 40 40" width="38" height="38"><circle cx="20" cy="20" r="17" fill="none" stroke="#8A9099" stroke-width="5"/><circle cx="20" cy="20" r="9" fill="none" stroke="#B7BCC2" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#B7BCC2"/></svg>`;

function renderRecommendations(target){
  const { hasExact, items } = recommendationService.recommend(catalog, target);
  const vehicleLabel = selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : "";
  let html = "";
  if (!hasExact) html += `<div class="empty"><h3>No exact match</h3>
    <p>We don't currently carry ${tireMath.format(target)}. The closest sizes we do have are below — these are a different size from what you entered, so check fitment before buying.</p></div>`;

  html += items.map(({ product:p, rankLabel, reasons, exact, dPct }) => `
    <div class="card">
      <span class="rank ${rankLabel === "Best match" ? "rank-best" : "rank-other"}">${rankLabel}</span>
      <div class="card-top">
        <div class="thumb">${tireIcon}</div>
        <div style="min-width:0">
          <p class="card-brand">${p.brand}</p>
          <h3 class="card-model">${p.model}</h3>
          <p class="card-size">${p.width}/${p.aspect}R${p.rim} ${p.loadIndex}${p.speedRating}</p>
          <p class="card-tags">${p.tireType} · ${p.application.join(" / ")}</p>
          ${exact ? "" : `<p class="card-tags" style="color:var(--warn)">Different size from your entry (${dPct.toFixed(1)}% diameter difference)</p>`}
          <p class="price">₱${p.price.toLocaleString()}<span class="stock">${p.stock > 0 ? p.stock + " in stock" : "Order in"}</span></p>
        </div>
      </div>
      <div class="why"><p class="why-t">Why this one</p>
        <ul>${reasons.slice(0,5).map(r => `<li>${r}</li>`).join("")}</ul></div>
      <div class="card-actions">
        <button class="btn btn-ghost" data-view="${p.id}">View product</button>
        <button class="btn" data-inquire="${p.id}">Inquire now</button>
      </div>
    </div>`).join("");

  const recs = $("recs");
  recs.innerHTML = html;
  analytics.track("recommendation_viewed", { size:tireMath.format(target), count:items.length });
  recs.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => {
    const p = catalog.find(x => x.id === b.dataset.view);
    analytics.track("product_clicked", { product:p.id });
    alert("Opens product page:\n" + productService.productUrl(p));
  }));
  recs.querySelectorAll("[data-inquire]").forEach(b => b.addEventListener("click", () =>
    sendInquiry(catalog.find(x => x.id === b.dataset.inquire), target, vehicleLabel)));
}
