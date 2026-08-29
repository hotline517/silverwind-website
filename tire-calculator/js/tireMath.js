/* tireMath.js
   Pure tire geometry. No DOM, no globals — safe to unit-test.
*/

/* ============================================================
   tireMath  →  tireMath.js   (all internal units are mm)
   ============================================================ */
const tireMath = {
  sidewall:      s => s.width * s.aspect / 100,
  rimMm:         s => s.rim * 25.4,
  diameter:      s => tireMath.rimMm(s) + 2 * tireMath.sidewall(s),
  circumference: s => Math.PI * tireMath.diameter(s),
  pctDiff:  (a,b) => ((b - a) / a) * 100,
  actualSpeed: (reading, s1, s2) => reading * (tireMath.diameter(s2) / tireMath.diameter(s1)),
  format: s => `${s.width}/${s.aspect}R${s.rim}`
};
