/* recommendationService.js
   Size assessment + product matching. Our own catalog only —
   this file never returns another brand.
*/

/* ============================================================
   assessment  →  recommendationService.js (part 1)
   ============================================================ */
function assess(pct) {
  const a = Math.abs(pct), t = recommendationConfig.thresholds;
  if (a <= t.good) return { tone:"var(--ok)", label:"Good match",
    body:"The new size sits very close to your original overall diameter.",
    points:["Speedometer stays close to actual speed","Ride height and ground clearance barely change","Wheel-speed sensors keep reading familiar values"] };
  if (a <= t.check) return { tone:"var(--warn)", label:"Check fitment",
    body:"The size differs enough from the original to be worth checking before you commit.",
    points:["Confirm clearance at full lock and full suspension travel","Check the load rating still meets your vehicle's requirement","Expect a small but noticeable speedometer shift"] };
  return { tone:"var(--bad)", label:"Not recommended",
    body:"The difference from the original size is significant.",
    points:["Speedometer and odometer readings will be noticeably off","Ride height and ground clearance change","Handling and steering feel change","ABS and traction-control behaviour can be affected"] };
}

/* ============================================================
   recommendationService  →  recommendationService.js (part 2)
   Own catalog only.
   ============================================================ */
const recommendationService = {
  score(p, target) {
    const w = recommendationConfig.weights, reasons = [];
    let score = 0;
    const exact = p.width===target.width && p.aspect===target.aspect && p.rim===target.rim;
    if (exact) { score += w.exactSize; reasons.push("Exact match for the size you entered"); }
    if (p.rim === target.rim) { score += w.rimMatch; if (!exact) reasons.push(`Fits your ${target.rim}" rim`); }
    const dPct = Math.abs(tireMath.pctDiff(tireMath.diameter(target), tireMath.diameter(p)));
    score += Math.max(0, w.diameter - dPct * 4);
    if (!exact && dPct <= recommendationConfig.thresholds.good) reasons.push(`Overall diameter within ${dPct.toFixed(1)}% of your size`);
    if (p.loadIndex >= 90) { score += w.loadIndex; reasons.push(`Load index ${p.loadIndex}`); }
    if (p.speedRating)     { score += w.speedRating; reasons.push(`Speed rating ${p.speedRating}`); }
    if (target.application && p.application.includes(target.application)) { score += w.application; reasons.push(`Built for ${target.application.toLowerCase()} use`); }
    score += w.category;
    if (p.stock > 0) { score += w.availability; reasons.push("In stock now"); }
    score += Math.max(0, w.price - p.price / 1500);
    return { product:p, score, exact, dPct, reasons };
  },
  recommend(products, target) {
    const ranked = products.map(p => recommendationService.score(p, target)).sort((a,b) => b.score - a.score);
    const exacts = ranked.filter(r => r.exact);
    const pool = exacts.length ? exacts.concat(ranked.filter(r => !r.exact)) : ranked;
    const labels = ["Best match","Value option","Alternative"];
    return { hasExact: exacts.length > 0,
      items: pool.slice(0, recommendationConfig.maxRecommendations).map((r,i) => ({ ...r, rankLabel: labels[i] || "Alternative" })) };
  }
};
