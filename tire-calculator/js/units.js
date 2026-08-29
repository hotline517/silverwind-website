/* units.js
   Metric / imperial switching. All internal maths stays in mm.
*/

/* ============================================================
   units  →  units.js
   ============================================================ */
const unitSystems = {
  metric: {
    id:"metric",
    len:  v => ({ n: v,           u:"mm", dp:0 }),        // v in mm
    circ: v => ({ n: v/1000,      u:" m", dp:2 }),
    revs: circMm => 1000000 / circMm,
    revsLabel:"Revs per km",
    speedUnit:"km/h",
    speeds:[40,60,80,100,120]
  },
  imperial: {
    id:"imperial",
    len:  v => ({ n: v/25.4,      u:"\"", dp:1 }),
    circ: v => ({ n: v/25.4,      u:"\"", dp:1 }),
    revs: circMm => 63360 / (circMm/25.4),
    revsLabel:"Revs per mile",
    speedUnit:"mph",
    speeds:[20,30,40,50,60,70,80,90]
  }
};
let U = unitSystems.metric;
const fmtLen  = mm => { const x = U.len(mm);  return x.n.toFixed(x.dp) + x.u; };
const fmtCirc = mm => { const x = U.circ(mm); return x.n.toFixed(x.dp) + x.u; };
