/* tireGraphic.js
   Generic SVG tire artwork + dimension lines. No brands or logos.
*/

/* ============================================================
   TireGraphic  →  tireGraphic.js
   Generic tire artwork built from real dimensions. No brands,
   no logos, no product photos — pure geometry + shading.
   ============================================================ */
const TireGraphic = {

  /* --- shared gradient / marker defs, emitted once per SVG --- */
  defs(){
    return `<defs>
      <linearGradient id="rubberH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#141618"/>
        <stop offset="14%"  stop-color="#2B2F33"/>
        <stop offset="40%"  stop-color="#3B4046"/>
        <stop offset="62%"  stop-color="#373C41"/>
        <stop offset="86%"  stop-color="#25292D"/>
        <stop offset="100%" stop-color="#121416"/>
      </linearGradient>
      <radialGradient id="rubberR" cx="38%" cy="32%" r="72%">
        <stop offset="0%"   stop-color="#43484E"/>
        <stop offset="55%"  stop-color="#2C3035"/>
        <stop offset="100%" stop-color="#131518"/>
      </radialGradient>
      <linearGradient id="alloy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#F2F4F6"/>
        <stop offset="45%"  stop-color="#C8CED4"/>
        <stop offset="100%" stop-color="#9AA1A9"/>
      </linearGradient>
      <marker id="ar1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill="#6E7378"/>
      </marker>
      <marker id="ar2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill="#E5A900"/>
      </marker>
    </defs>`;
  },

  /* --- PROFILE VIEW: tire standing up, tread facing the viewer --- */
  profile({ x, baseY, diameterPx, widthPx, label }){
    const h = diameterPx, w = widthPx, y = baseY - h;
    const rx = Math.min(w * 0.36, h * 0.17);
    const cid = "pc" + label;

    const rows = Math.max(7, Math.round(h / 15));
    const step = h / rows;
    let art = "";

    // shoulder lugs — chunky blocks along both edges
    for (let i = -1; i < rows + 1; i++){
      const ty = y + i * step;
      art += `<rect x="${x + w*0.015}" y="${ty + step*0.16}" width="${w*0.175}" height="${step*0.60}" rx="${step*0.16}" fill="#4C5259" opacity=".55"/>`;
      art += `<rect x="${x + w*0.810}" y="${ty + step*0.16}" width="${w*0.175}" height="${step*0.60}" rx="${step*0.16}" fill="#4C5259" opacity=".55"/>`;
    }
    // centre tread blocks — two staggered columns
    for (let i = -1; i < rows + 1; i++){
      const ty = y + i * step;
      art += `<rect x="${x + w*0.245}" y="${ty + step*0.10}" width="${w*0.225}" height="${step*0.66}" rx="${step*0.14}" fill="#525860" opacity=".5"/>`;
      art += `<rect x="${x + w*0.530}" y="${ty + step*0.48}" width="${w*0.225}" height="${step*0.66}" rx="${step*0.14}" fill="#525860" opacity=".5"/>`;
      // sipes
      art += `<line x1="${x + w*0.245}" y1="${ty + step*0.42}" x2="${x + w*0.470}" y2="${ty + step*0.42}" stroke="#16181A" stroke-width=".9"/>`;
      art += `<line x1="${x + w*0.530}" y1="${ty + step*0.80}" x2="${x + w*0.755}" y2="${ty + step*0.80}" stroke="#16181A" stroke-width=".9"/>`;
    }
    // circumferential grooves
    [0.215, 0.50, 0.785].forEach(f => {
      art += `<rect x="${x + w*f - w*0.018}" y="${y}" width="${w*0.036}" height="${h}" fill="#0E1012" opacity=".92"/>`;
    });

    const num = Math.min(w * 0.44, 27);
    return `
      <clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#rubberH)"/>
      <g clip-path="url(#${cid})">${art}</g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="#0C0E10" stroke-width="1.2"/>
      <text x="${x + w/2}" y="${y + h*0.52 + num*0.35}" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="${num}" font-weight="700" font-style="italic" fill="#FFFFFF">${label}</text>`;
  },

  /* --- FRONT VIEW: tire + generic alloy wheel --- */
  front({ cx, cy, outerR, rimR, label }){
    const cid = "fc" + label;
    let art = "";

    // tread lugs around the outer edge
    const n = 44, rOut = outerR, rIn = outerR - Math.max(3, outerR * 0.085);
    for (let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2, sp = (Math.PI * 2 / n) * 0.42;
      const p = (r, ang) => `${cx + Math.cos(ang)*r},${cy + Math.sin(ang)*r}`;
      art += `<path d="M${p(rIn,a-sp)} L${p(rOut,a-sp+0.02)} L${p(rOut,a+sp+0.02)} L${p(rIn,a+sp)} z" fill="#565C64" opacity=".45"/>`;
    }
    // sidewall rings
    art += `<circle cx="${cx}" cy="${cy}" r="${outerR*0.90}" fill="none" stroke="#5A6068" stroke-width="1" opacity=".3"/>`;
    art += `<circle cx="${cx}" cy="${cy}" r="${outerR*0.80}" fill="none" stroke="#5A6068" stroke-width="1" opacity=".2"/>`;

    // alloy spokes
    const spokes = 10, hubR = rimR * 0.34, tipR = rimR * 0.86;
    let wheel = "";
    for (let i = 0; i < spokes; i++){
      const a = (i / spokes) * Math.PI * 2 - Math.PI/2;
      const wi = 0.17, wo = 0.085;
      const p = (r, ang) => `${cx + Math.cos(ang)*r},${cy + Math.sin(ang)*r}`;
      wheel += `<path d="M${p(hubR, a-wi)} L${p(tipR, a-wo)} L${p(tipR, a+wo)} L${p(hubR, a+wi)} z"
                      fill="url(#alloy)" stroke="#8B9199" stroke-width=".6" stroke-linejoin="round"/>`;
    }

    const num = Math.min(rimR * 0.75, 22);
    return `
      <clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${outerR}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="url(#rubberR)"/>
      <g clip-path="url(#${cid})">${art}</g>
      <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="#0C0E10" stroke-width="1.2"/>
      <circle cx="${cx}" cy="${cy}" r="${rimR}" fill="#191C1F"/>
      <circle cx="${cx}" cy="${cy}" r="${rimR}" fill="none" stroke="url(#alloy)" stroke-width="${Math.max(2, rimR*0.13)}"/>
      ${wheel}
      <circle cx="${cx}" cy="${cy}" r="${hubR}" fill="#1C1F22" stroke="#9AA1A9" stroke-width="1"/>
      <text x="${cx}" y="${cy + num*0.36}" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="${num}" font-weight="700" font-style="italic" fill="#FFFFFF">${label}</text>`;
  },

  /* --- dimension lines: thin engineering brackets --- */
  vDim({ x, y1, y2, label, color, side, extendTo }){
    const t = 6, tx = side === "left" ? x - 9 : x + 9;
    const ext = extendTo === undefined ? "" :
      `<line x1="${x}" y1="${y1}" x2="${extendTo}" y2="${y1}" stroke="${color}" stroke-width=".6" opacity=".55"/>
       <line x1="${x}" y1="${y2}" x2="${extendTo}" y2="${y2}" stroke="${color}" stroke-width=".6" opacity=".55"/>`;
    return `${ext}
      <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="1"/>
      <line x1="${x-t}" y1="${y1}" x2="${x+t}" y2="${y1}" stroke="${color}" stroke-width="1"/>
      <line x1="${x-t}" y1="${y2}" x2="${x+t}" y2="${y2}" stroke="${color}" stroke-width="1"/>
      <text x="${tx}" y="${(y1+y2)/2 + 4}" text-anchor="${side === "left" ? "end" : "start"}"
            font-family="IBM Plex Mono, monospace" font-size="12" fill="${color}">${label}</text>`;
  },
  hDim({ y, x1, x2, label, color, below, extendTo }){
    const t = 6, ty = below ? y + 17 : y - 9;
    const ext = extendTo === undefined ? "" :
      `<line x1="${x1}" y1="${y}" x2="${x1}" y2="${extendTo}" stroke="${color}" stroke-width=".6" opacity=".55"/>
       <line x1="${x2}" y1="${y}" x2="${x2}" y2="${extendTo}" stroke="${color}" stroke-width=".6" opacity=".55"/>`;
    return `${ext}
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1"/>
      <line x1="${x1}" y1="${y-t}" x2="${x1}" y2="${y+t}" stroke="${color}" stroke-width="1"/>
      <line x1="${x2}" y1="${y-t}" x2="${x2}" y2="${y+t}" stroke="${color}" stroke-width="1"/>
      <text x="${(x1+x2)/2}" y="${ty}" text-anchor="middle"
            font-family="IBM Plex Mono, monospace" font-size="12" fill="${color}">${label}</text>`;
  },
  /* circumference: curved arrow hugging the tread, label set on the arc */
  arcDim({ cx, cy, r, label, color, marker, side }){
    const id = "arc" + side + Math.round(r);
    const a1 = side === "left" ? 205 : 335, a2 = side === "left" ? 145 : 25;
    const rad = d => d * Math.PI / 180;
    const R = r + 10;
    const p1 = `${cx + Math.cos(rad(a1))*R},${cy + Math.sin(rad(a1))*R}`;
    const p2 = `${cx + Math.cos(rad(a2))*R},${cy + Math.sin(rad(a2))*R}`;
    const sweep = side === "left" ? 0 : 1;
    return `
      <path id="${id}" d="M${p1} A${R},${R} 0 0,${sweep} ${p2}" fill="none"
            stroke="${color}" stroke-width="1" marker-start="url(#${marker})" marker-end="url(#${marker})"/>
      <text font-family="IBM Plex Mono, monospace" font-size="11" fill="${color}" dy="-5">
        <textPath href="#${id}" startOffset="50%" text-anchor="middle">${label}</textPath>
      </text>`;
  },
  caption({ x, y, lines, color }){
    return lines.map((l, i) =>
      `<text x="${x}" y="${y + i*15}" text-anchor="middle" font-family="IBM Plex Mono, monospace"
             font-size="11" fill="${i === 0 ? color : "#777777"}">${l}</text>`).join("");
  }
};
