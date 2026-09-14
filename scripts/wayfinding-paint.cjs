/* Paints the wayfinding plan into tiles: route line pieces, floor signposts,
   and "you are here" map boards. Appends to the tileset atlas and returns
   lookups convert.cjs uses to place them. */
"use strict";
const { Sprite, font, hex } = require("./paint.cjs");
const GOLD = "#e9b949", CARD = "#141318", INK = "#ece5d3";

function tri(s, pts, c, a) {   /* filled triangle, scanline */
  const ys = pts.map(p => p[1]), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
  for (let y = y0; y <= y1; y++) {
    const xs = [];
    for (let i = 0; i < 3; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 3]; if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + (y - ay) * (bx - ax) / (by - ay)); }
    if (xs.length >= 2) { xs.sort((p, q) => p - q); s.rect(Math.round(xs[0]), y, Math.max(1, Math.round(xs[xs.length - 1] - xs[0])), 1, c, a); }
  }
}
function arrow(s, x, y, dir, c) {   /* a 7 by 7 arrow glyph */
  const g = new Sprite(7, 7);
  g.rect(0, 3, 4, 1, c); for (let i = 0; i < 4; i++) g.rect(3 + i, i, 1, 7 - 2 * i, c);
  let out = g;
  if (dir === "W") out = g.flipH();
  if (dir === "N" || dir === "S") { const r = new Sprite(7, 7); for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) { const k = (i * 7 + j) * 4, m = (j * 7 + i) * 4; for (let q = 0; q < 4; q++) r.px[m + q] = g.px[k + q]; } out = dir === "N" ? r.flipV() : r; }
  s.blit(out, x, y);
}

module.exports = function paintWayfinding(TS, P, M) {
  const A = TS.atlas, cache = new Map();

  function lineId(t) {
    const k = [t.color, t.edges, t.chev, t.dot].join("|");
    if (cache.has(k)) return cache.get(k);
    const s = new Sprite(32, 32), dark = "#0b0b0e", c = t.color, B = P.BIT;
    const arms = [[B.N, [12, 0, 8, 17], [13, 0, 6, 16]], [B.S, [12, 15, 8, 17], [13, 16, 6, 16]], [B.W, [0, 12, 17, 8], [0, 13, 16, 6]], [B.E, [15, 12, 17, 8], [16, 13, 16, 6]]];
    for (const [bit, o] of arms) if (t.edges & bit) s.rect(...o, dark, 120);
    for (const [bit, , m] of arms) if (t.edges & bit) s.rect(...m, c, 225);
    if (t.edges) s.rect(13, 13, 6, 6, c, 225);
    if (t.dot) { s.circle(16, 16, 7, dark, 140); s.circle(16, 16, 6, c, 240); s.circle(16, 16, 2, dark, 160); }
    if (t.chev) {
      const P3 = { N: [[16, 5], [8, 19], [24, 19]], S: [[16, 27], [8, 13], [24, 13]], E: [[27, 16], [13, 8], [13, 24]], W: [[5, 16], [19, 8], [19, 24]] }[t.chev];
      tri(s, P3.map(([x, y]) => [x + (x - 16) * 0.12, y + (y - 16) * 0.12]), dark, 140); tri(s, P3, c, 245);
    }
    const id = A.one(s); cache.set(k, id); return id;
  }

  function signpostGrid(sp) {
    const lines = [];
    for (const r of sp.rows) r.labels.forEach((t, i) => lines.push({ dir: i === 0 ? r.dir : null, text: t }));
    lines.length = Math.min(lines.length, 9);
    const tw = Math.max(...lines.map(l => font.width(l.text))), w = Math.min(92, tw + 20), h = lines.length * 9 + 8;
    const s = new Sprite(96, 96), x0 = (96 - w) >> 1, y0 = (96 - h) >> 1;
    s.rect(x0 + 2, y0 + 2, w, h, "#000000", 90).rect(x0, y0, w, h, CARD, 215).frame(x0, y0, w, h, GOLD, 210).frame(x0 + 1, y0 + 1, w - 2, h - 2, GOLD, 60);
    lines.forEach((l, i) => {
      const y = y0 + 5 + i * 9;
      if (l.dir) arrow(s, x0 + 5, y - 1, l.dir, GOLD);
      s.text(x0 + 15, y, l.text, { color: l.dir ? INK : "#b8b09c" });
    });
    return A.add(s);
  }

  /* the building's silhouette, shared by every board */
  const all = Object.values(P.cellsByZone).flat();
  const bx0 = Math.min(...all.map(c => c[0])), by0 = Math.min(...all.map(c => c[1])), bx1 = Math.max(...all.map(c => c[0])), by1 = Math.max(...all.map(c => c[1]));
  const AW = 88, AH = 40, sc = Math.min(AW / (bx1 - bx0 + 1), AH / (by1 - by0 + 1));
  const pw = Math.round((bx1 - bx0 + 1) * sc), ph = Math.round((by1 - by0 + 1) * sc), ox = 4 + ((AW - pw) >> 1), oy = 12 + ((AH - ph) >> 1);
  const zoneAtCell = new Map(); for (const z in P.cellsByZone) for (const [x, y] of P.cellsByZone[z]) zoneAtCell.set(x + "," + y, z);
  function boardGrid(b) {
    const s = new Sprite(96, 64);
    s.rect(2, 3, 92, 58, "#000000", 90).rect(3, 3, 90, 57, CARD).frame(3, 3, 90, 57, GOLD, 235);
    s.text(48, 5, "MUSEUM MAP", { align: "center", color: GOLD });
    for (let py = 0; py < ph; py++) for (let px = 0; px < pw; px++) {
      const cx0 = bx0 + Math.floor(px / sc), cy0 = by0 + Math.floor(py / sc), cx1 = bx0 + Math.floor((px + 1) / sc), cy1 = by0 + Math.floor((py + 1) / sc);
      let z = null; for (let y = cy0; y <= Math.max(cy0, cy1 - 1) && !z; y++) for (let x = cx0; x <= Math.max(cx0, cx1 - 1) && !z; x++) z = zoneAtCell.get(x + "," + y) || null;
      if (z) { const c = hex((M.ZONES[z] || {}).color || GOLD); s.put(ox + px, oy + py, [c[0] * 0.75, c[1] * 0.75, c[2] * 0.75]); }
    }
    const dx = ox + (b.at[0] - bx0) * sc, dy = oy + (b.at[1] - by0) * sc;
    s.ring(dx, dy, 4, "#ffffff", 230, 1); s.circle(dx, dy, 2, "#ff3b30");
    s.text(48, 55, "YOU ARE HERE", { align: "center", color: "#ff6b61" });
    return A.add(s);
  }

  return { lineId, signpostGrid, boardGrid };
};
