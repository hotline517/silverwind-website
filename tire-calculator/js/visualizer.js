/* visualizer.js
   Draws the profile and front comparison views from two sizes.
*/

/* ============================================================
   visualizer  →  visualizer.js
   ============================================================ */
const C1 = "#6E7378", C2 = "#E5A900";

function drawProfile(s1, s2){
  const d1 = tireMath.diameter(s1), d2 = tireMath.diameter(s2);
  const S  = 196 / Math.max(d1, d2);
  const h1 = d1 * S, h2 = d2 * S, w1 = s1.width * S, w2 = s2.width * S;

  const baseY = 232, mL = 74, mR = 74, gap = 44;
  const x1 = mL, x2 = mL + w1 + gap;
  const vbW = Math.max(340, x2 + w2 + mR);

  document.getElementById("vizProfile").setAttribute("viewBox", `0 0 ${vbW} ${baseY + 72}`);
  document.getElementById("vizProfile").innerHTML = TireGraphic.defs() + [
    `<text x="${x1 + w1/2}" y="14" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.4" fill="${C1}">SIZE 1</text>`,
    `<text x="${x2 + w2/2}" y="14" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.4" fill="#8A6A00">SIZE 2</text>`,
    TireGraphic.profile({ x:x1, baseY, diameterPx:h1, widthPx:w1, label:"1" }),
    TireGraphic.profile({ x:x2, baseY, diameterPx:h2, widthPx:w2, label:"2" }),
    TireGraphic.vDim({ x:x1 - 30, y1:baseY - h1, y2:baseY, label:fmtLen(d1), color:C1, side:"left",  extendTo:x1 - 4 }),
    TireGraphic.vDim({ x:x2 + w2 + 30, y1:baseY - h2, y2:baseY, label:fmtLen(d2), color:C2, side:"right", extendTo:x2 + w2 + 4 }),
    TireGraphic.hDim({ y:baseY + 22, x1:x1, x2:x1 + w1, label:fmtLen(s1.width), color:C1, below:true, extendTo:baseY + 4 }),
    TireGraphic.hDim({ y:baseY + 22, x1:x2, x2:x2 + w2, label:fmtLen(s2.width), color:C2, below:true, extendTo:baseY + 4 }),
    `<text x="${x1 + w1/2}" y="${baseY + 62}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#777">${tireMath.format(s1)}</text>`,
    `<text x="${x2 + w2/2}" y="${baseY + 62}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#777">${tireMath.format(s2)}</text>`
  ].join("");
}

function drawFront(s1, s2){
  const d1 = tireMath.diameter(s1), d2 = tireMath.diameter(s2);
  const S  = 176 / Math.max(d1, d2);
  const R1 = d1 * S / 2, R2 = d2 * S / 2;
  const rim1 = tireMath.rimMm(s1) * S / 2, rim2 = tireMath.rimMm(s2) * S / 2;

  const baseY = 240, cy1 = baseY - R1, cy2 = baseY - R2;
  const mL = 34, mR = 34, gap = 46;
  const cx1 = mL + R1, cx2 = cx1 + R1 + gap + R2;
  const vbW = Math.max(340, cx2 + R2 + mR);
  const c1 = tireMath.circumference(s1), c2 = tireMath.circumference(s2);

  document.getElementById("vizFront").setAttribute("viewBox", `0 0 ${vbW} ${baseY + 52}`);
  document.getElementById("vizFront").innerHTML = TireGraphic.defs() + [
    TireGraphic.front({ cx:cx1, cy:cy1, outerR:R1, rimR:rim1, label:"1" }),
    TireGraphic.front({ cx:cx2, cy:cy2, outerR:R2, rimR:rim2, label:"2" }),
    TireGraphic.hDim({ y:cy1 - rim1 - 24, x1:cx1 - rim1, x2:cx1 + rim1, label:`${s1.rim}"`, color:C1, below:false, extendTo:cy1 - rim1 - 3 }),
    TireGraphic.hDim({ y:cy2 - rim2 - 24, x1:cx2 - rim2, x2:cx2 + rim2, label:`${s2.rim}"`, color:C2, below:false, extendTo:cy2 - rim2 - 3 }),
    TireGraphic.vDim({ x:cx1 + R1 + 16, y1:cy1 - R1, y2:cy1 - rim1, label:fmtLen(tireMath.sidewall(s1)), color:C1, side:"right" }),
    TireGraphic.vDim({ x:cx2 + R2 + 16, y1:cy2 - R2, y2:cy2 - rim2, label:fmtLen(tireMath.sidewall(s2)), color:C2, side:"right" }),
    TireGraphic.arcDim({ cx:cx1, cy:cy1, r:R1, label:fmtCirc(c1), color:C1, marker:"ar1", side:"left" }),
    TireGraphic.arcDim({ cx:cx2, cy:cy2, r:R2, label:fmtCirc(c2), color:C2, marker:"ar2", side:"right" }),
    TireGraphic.caption({ x:cx1, y:baseY + 26, color:C1, lines:[ U.revs(c1).toFixed(0) + " " + U.revsLabel.replace("Revs per ", "revs/") ] }),
    TireGraphic.caption({ x:cx2, y:baseY + 26, color:"#8A6A00", lines:[ U.revs(c2).toFixed(0) + " " + U.revsLabel.replace("Revs per ", "revs/") ] })
  ].join("");
}
