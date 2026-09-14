/* Renders the museum's floor plan for the placard panel: every hall in its
   colour and named, exhibits as gold dots, doors, the three route lines, and
   a "you are here" pin per map board. Writes placards/map/<id>.png, a plain
   placards/map/museum.png, and placards/map.html which picks one by ?at=. */
"use strict";
const fs = require("fs"), path = require("path");
const { Sprite, font, hex, encodePNG } = require("./paint.cjs");
const GOLD = "#e9b949", INK = "#ece5d3";
const C = 7;

module.exports = function writeFloorplans(M, P, outDir, spawn) {
  const G = M.composed.MAP, GW = M.composed.MW, GH = M.composed.MH;
  const cell = (x, y) => (x >= 0 && y >= 0 && x < GW && y < GH) ? G[y][x] : "#";
  const floors = [];
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (cell(x, y) === ".") floors.push([x, y]);
  const bx0 = Math.min(...floors.map(c => c[0])) - 2, by0 = Math.min(...floors.map(c => c[1])) - 2;
  const bx1 = Math.max(...floors.map(c => c[0])) + 2, by1 = Math.max(...floors.map(c => c[1])) + 9;
  const W = (bx1 - bx0 + 1) * C, H = (by1 - by0 + 1) * C + 40;
  const px = x => (x - bx0) * C, py = y => (y - by0) * C + 40;
  const base = new Sprite(W, H);
  base.rect(0, 0, W, H, "#0b0b0e");
  base.text(12, 12, "THE MUSEUM OF AI SAFETY · FLOOR PLAN", { scale: 2, color: GOLD });
  const near = (x, y) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (cell(x + i, y + j) === ".") return true; return false; };
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
    const ch = cell(x, y);
    if (ch === ".") { const z = P.zone(x, y), c = hex((M.ZONES[z] || {}).color || GOLD); base.rect(px(x), py(y), C, C, [26 + c[0] * 0.33, 26 + c[1] * 0.33, 30 + c[2] * 0.33]); }
    else if (ch === "*") base.rect(px(x), py(y), C, C, "#5a8fb0");
    else if (near(x, y)) base.rect(px(x), py(y), C, C, "#3a3742");
    if (M.exhibits[ch] && near(x, y)) base.rect(px(x) + 2, py(y) + 2, 3, 3, GOLD);
  }
  for (const a of P.arrivals) base.rect(px(a.door[0]) + 1, py(a.door[1]) + 1, C - 2, C - 2, "#f4f2ec", 160);
  for (const R of P.ROUTES) for (const t of R.targets) {
    if (!P.rep[t]) continue;
    const pts = P.walk(spawn, t), off = (R.lane - 1) * 2;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      const x0 = Math.min(px(ax), px(bx)) + 2 + off, y0 = Math.min(py(ay), py(by)) + 2 + off;
      base.rect(x0, y0, Math.abs(px(bx) - px(ax)) + 3, Math.abs(py(by) - py(ay)) + 3, R.color, 230);
    }
  }
  /* hall names, largest halls first, nudged apart so none overlap */
  const boxes = [], hit = (b) => boxes.some(o => b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
  for (const z of Object.keys(P.rep).sort((a, b) => P.cellsByZone[b].length - P.cellsByZone[a].length)) {
    const cells = P.cellsByZone[z], t = P.LABEL[z] || z, w = font.width(t, 2);
    const mx = cells.reduce((a, c) => a + c[0], 0) / cells.length, my = cells.reduce((a, c) => a + c[1], 0) / cells.length;
    const cx = Math.round(px(mx) + C / 2);
    let placed = null;
    for (const dy of [0, 18, -18, 36, -36, 54, -54]) {
      const y = py(my) + dy, b = { x0: Math.max(2, cx - w / 2 - 5), y0: y - 4, x1: Math.min(W - 2, cx + w / 2 + 5), y1: y + 13 };
      if (!hit(b)) { placed = { y, b }; break; }
    }
    if (!placed) { const y = py(my); placed = { y, b: { x0: cx - w / 2 - 5, y0: y - 4, x1: cx + w / 2 + 5, y1: y + 13 } }; }
    boxes.push(placed.b);
    base.rect(Math.round(placed.b.x0), placed.b.y0, Math.round(placed.b.x1 - placed.b.x0), 17, "#0b0b0e", 185);
    base.text(Math.min(W - w / 2 - 6, Math.max(w / 2 + 6, cx)), placed.y, t, { scale: 2, align: "center", color: INK });
  }
  let ly = H - 50;
  base.text(12, ly, "LINES ON THE FLOOR", { scale: 2, color: "#9a927e" });
  let lx = 12 + font.width("LINES ON THE FLOOR", 2) + 20;
  for (const R of P.ROUTES) { base.rect(lx, ly + 3, 22, 5, R.color); base.text(lx + 30, ly, R.name, { scale: 2, color: INK }); lx += 52 + font.width(R.name, 2); }
  ly += 24;
  base.rect(12, ly + 2, 6, 6, GOLD); base.text(26, ly, "EXHIBIT", { scale: 2, color: INK });
  base.rect(120, ly + 1, 8, 8, "#f4f2ec", 160); base.text(136, ly, "DOOR TO THE NEXT WING", { scale: 2, color: INK });

  const dir = path.join(outDir, "map"); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "museum.png"), encodePNG(base.px, W, H));
  const boards = [...P.boards];
  if (!boards.some(b => b.id === "foyer")) boards.push({ id: "foyer", at: spawn });
  for (const b of boards) {
    const s = new Sprite(W, H); base.px.copy(s.px);
    const x = px(b.at[0]) + C / 2, y = py(b.at[1]) + C / 2;
    s.circle(x, y, 14, "#ff3b30", 70); s.circle(x, y, 9, "#ffffff"); s.circle(x, y, 7, "#ff3b30");
    const t = "YOU ARE HERE", w = font.width(t, 2);
    const spots = [[x + 18, y - 8], [x - 18 - w, y - 8], [x - w / 2, y + 20], [x - w / 2, y - 36], [x + 18, y + 14], [x - 18 - w, y + 14]];
    let [tx, ty] = spots[0];
    for (const [sx, sy] of spots) { const b = { x0: sx - 6, y0: sy - 5, x1: sx + w + 6, y1: sy + 15 }; if (b.x0 > 2 && b.x1 < W - 2 && b.y0 > 40 && !hit(b)) { tx = sx; ty = sy; break; } }
    s.rect(Math.round(tx - 6), Math.round(ty - 5), w + 12, 20, "#ff3b30"); s.text(Math.round(tx), Math.round(ty), t, { scale: 2, color: "#ffffff" });
    fs.writeFileSync(path.join(dir, b.id + ".png"), encodePNG(s.px, W, H));
  }
  const halls = Object.keys(P.rep).map(z => `<li><span style="background:${(M.ZONES[z] || {}).color || GOLD}"></span>${(P.LABEL[z] || z).toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase())}</li>`).join("");
  const routes = P.ROUTES.map(R => `<li><i style="background:${R.color}"></i>${R.name.toLowerCase().replace(/(^|[\s,])\S/g, m => m.toUpperCase())}</li>`).join("");
  fs.writeFileSync(path.join(outDir, "map.html"), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Floor plan · The Museum of AI Safety</title>
<style>
:root{--gold:#e9b949;--ink:#ece5d3;--dim:#9a927e;--bg:#0b0b0e;--card:#141318}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font-family:"Avenir Next",Avenir,"Helvetica Neue",Arial,sans-serif}
body{padding:18px 16px 36px}.card{max-width:1100px;margin:0 auto;background:var(--card);border:1px solid #2b2a30;outline:1px solid rgba(233,185,73,.28);outline-offset:6px;padding:24px 26px}
.chip{font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);font-weight:600}h1{font-size:26px;font-weight:500;margin:8px 0 6px}
p{color:#cfc9bb;line-height:1.6;margin:6px 0 14px;max-width:70ch}img{width:100%;display:block;border:1px solid #2b2a30;image-rendering:pixelated;image-rendering:crisp-edges}
.cols{display:flex;gap:28px;flex-wrap:wrap;margin-top:16px}ul{list-style:none;padding:0;margin:0;columns:2;column-gap:22px;font-size:14px}li{margin:0 0 6px;break-inside:avoid;display:flex;align-items:center;gap:8px}
li span{width:11px;height:11px;display:inline-block}li i{width:20px;height:5px;display:inline-block}h2{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);margin:0 0 10px;font-weight:600}
a{color:var(--gold)}
</style></head><body><div class="card">
<div class="chip">Floor plan</div><h1 id="title">You are here</h1>
<p>Follow the coloured lines on the floor to reach the far wings, and read the floor signposts at every doorway: each one lists what lies in each direction. Close this panel to return to the museum.</p>
<img id="plan" src="map/museum.png" alt="Floor plan of the Museum of AI Safety with every hall named">
<div class="cols"><div><h2>Lines on the floor</h2><ul style="columns:1">${routes}</ul></div><div style="flex:1;min-width:280px"><h2>Halls</h2><ul>${halls}</ul></div></div>
<p style="margin-top:18px"><a href="index.html">Museum directory</a></p>
</div>
<script>
(function(){var at=new URLSearchParams(location.search).get("at");var img=document.getElementById("plan");
if(at&&/^[a-z]+$/.test(at)){img.onerror=function(){img.onerror=null;img.src="map/museum.png";document.getElementById("title").textContent="Floor plan";};img.src="map/"+at+".png";}
else document.getElementById("title").textContent="Floor plan";})();
</script></body></html>
`);
  return { boards: boards.length, size: W + "x" + H };
};
