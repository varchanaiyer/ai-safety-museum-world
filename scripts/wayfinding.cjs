/* Wayfinding for the whole building, computed once from the composed grid:
   coloured route lines on the floor from the Foyer to the far wings, floor
   signposts at decision points listing what lies in each direction, and the
   spots for "you are here" map boards. convert.cjs paints the result into
   each map; this module only decides where things go. */
"use strict";
const DIRS = [[0, -1, "N"], [1, 0, "E"], [0, 1, "S"], [-1, 0, "W"]];
const BIT = { N: 1, E: 2, S: 4, W: 8 }, OPP = { N: "S", S: "N", E: "W", W: "E" };
const LABEL = { foyer: "THE FOYER", fail: "FAILURES", gov: "ROTUNDA", origins: "ORIGINS HALL", interp: "GLASS BRAIN", align: "GENIE ROOM", forecast: "FORECASTS",
  office: "OLD OFFICE", shop: "GIFT SHOP", finale: "LAST ROOM", newwing: "NEW WING", arcade: "ARCADE", mirrors: "HALL OF MIRRORS", midway: "MIDWAY", workbench: "WORKBENCH",
  officefloor: "OFFICE FLOOR", highstreet: "HIGH STREET", waiting: "WAITING ROOM", memory: "MEMORY WING", verify: "VERIFICATION", offswitch: "OFF SWITCH" };
const ROUTES = [
  { key: "south", name: "SOUTH WINGS", color: "#e9b949", lane: 1, targets: ["offswitch"] },
  { key: "west", name: "NEW WING, ARCADE, MIRRORS", color: "#63d6d0", lane: 0, targets: ["arcade", "mirrors"] },
  { key: "east", name: "THE MIDWAY", color: "#e59fd0", lane: 2, targets: ["midway"] }
];

module.exports = function planWayfinding(M, { spawn = [19, 33], blocked = new Set() } = {}) {
  const G = M.composed.MAP, GW = M.composed.MW, GH = M.composed.MH, rects = M.composed.ROOMRECTS;
  const cell = (x, y) => (x >= 0 && y >= 0 && x < GW && y < GH) ? G[y][x] : "#";
  const isFloor = (x, y) => cell(x, y) === ".";
  const region = (x, y) => {
    const ex = M.exhibits[cell(x, y)];
    if (ex && rects.some(r => r.key === ex.wing)) return ex.wing;
    for (const r of rects) if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return r.key;
    return "core";
  };
  const zone = (x, y) => { const r = region(x, y); return r === "core" ? M.zoneAt(x, y) : r; };
  const idx = (x, y) => y * GW + x, key = (x, y) => x + "," + y;

  /* reachable floor, by zone */
  const reach = new Uint8Array(GW * GH), q = [spawn]; reach[idx(...spawn)] = 1;
  for (let i = 0; i < q.length; i++) for (const [dx, dy] of DIRS) { const nx = q[i][0] + dx, ny = q[i][1] + dy; if (isFloor(nx, ny) && !reach[idx(nx, ny)]) { reach[idx(nx, ny)] = 1; q.push([nx, ny]); } }
  const cellsByZone = {};
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (reach[idx(x, y)]) (cellsByZone[zone(x, y)] = cellsByZone[zone(x, y)] || []).push([x, y]);
  const rep = {};
  for (const z in cellsByZone) {
    const c = cellsByZone[z], mx = c.reduce((a, p) => a + p[0], 0) / c.length, my = c.reduce((a, p) => a + p[1], 0) / c.length;
    rep[z] = c.reduce((b, p) => Math.hypot(p[0] - mx, p[1] - my) < Math.hypot(b[0] - mx, b[1] - my) ? p : b);
  }

  /* a distance field per destination */
  const field = {};
  for (const z in rep) {
    const d = new Int32Array(GW * GH).fill(-1), qq = [rep[z]]; d[idx(...rep[z])] = 0;
    for (let i = 0; i < qq.length; i++) for (const [dx, dy] of DIRS) { const nx = qq[i][0] + dx, ny = qq[i][1] + dy; if (isFloor(nx, ny) && d[idx(nx, ny)] < 0) { d[idx(nx, ny)] = d[idx(...qq[i])] + 1; qq.push([nx, ny]); } }
    field[z] = d;
  }
  /* walk downhill toward a destination, keeping the current heading when it also descends, so lines turn rarely */
  function walk(from, z, maxSteps = 1e9) {
    const d = field[z], path = [from]; let [x, y] = from, heading = null;
    for (let s = 0; s < maxSteps && d[idx(x, y)] > 0; s++) {
      const here = d[idx(x, y)];
      const order = heading ? [DIRS.find(D => D[2] === heading), ...DIRS.filter(D => D[2] !== heading)] : DIRS;
      const step = order.find(([dx, dy]) => isFloor(x + dx, y + dy) && d[idx(x + dx, y + dy)] === here - 1);
      if (!step) break;
      x += step[0]; y += step[1]; heading = step[2]; path.push([x, y]);
    }
    return path;
  }
  function heading(from, z) {
    const p = walk(from, z, 6), [x1, y1] = p[p.length - 1], dx = x1 - from[0], dy = y1 - from[1];
    if (!dx && !dy) return null;
    return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? "E" : "W") : (dy > 0 ? "S" : "N");
  }

  /* route lines: per cell, tiles inside its 3 by 3 block with edge masks */
  const lineTiles = new Map();   /* "cx,cy" -> Map("tx,ty,color" -> {tx,ty,color,edges,chev,dot}) */
  const routeCells = new Set();
  function addTile(cx, cy, tx, ty, color, edges, extra = {}) {
    const ck = key(cx, cy); if (!lineTiles.has(ck)) lineTiles.set(ck, new Map());
    const m = lineTiles.get(ck), tk = tx + "," + ty + "," + color, t = m.get(tk) || { tx, ty, color, edges: 0, chev: null, dot: false };
    t.edges |= edges; if (extra.chev) t.chev = extra.chev; if (extra.dot) t.dot = true; m.set(tk, t);
  }
  const edgeTile = (edge, L) => edge === "N" ? [L, 0] : edge === "S" ? [L, 2] : edge === "W" ? [0, L] : [2, L];
  function segment(cx, cy, from, to, color, firstEdge, lastEdge) {   /* from and to are tile coords on one row or column */
    const steps = Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]), sx = Math.sign(to[0] - from[0]), sy = Math.sign(to[1] - from[1]);
    const fwd = sx > 0 ? "E" : sx < 0 ? "W" : sy > 0 ? "S" : "N";
    for (let i = 0; i <= steps; i++) {
      let e = 0;
      if (i === 0 && firstEdge) e |= BIT[firstEdge];
      if (i > 0) e |= BIT[OPP[fwd]];
      if (i < steps) e |= BIT[fwd];
      if (i === steps && lastEdge) e |= BIT[lastEdge];
      addTile(cx, cy, from[0] + sx * i, from[1] + sy * i, color, e);
    }
  }
  for (const R of ROUTES) for (const target of R.targets) {
    if (!rep[target]) continue;
    const path = walk(spawn, target), L = R.lane;
    path.forEach(([cx, cy], i) => {
      routeCells.add(key(cx, cy));
      const prev = path[i - 1], next = path[i + 1];
      const mv = (a, b) => b[0] > a[0] ? "E" : b[0] < a[0] ? "W" : b[1] > a[1] ? "S" : "N";
      const inEdge = prev ? OPP[mv(prev, [cx, cy])] : null, outEdge = next ? mv([cx, cy], next) : null, corner = [L, L];
      if (inEdge) segment(cx, cy, edgeTile(inEdge, L), corner, R.color, inEdge, null);
      if (outEdge) segment(cx, cy, corner, edgeTile(outEdge, L), R.color, null, outEdge);
      if (!prev || !next) addTile(cx, cy, L, L, R.color, 0, { dot: true });
      else if (i % 4 === 2 && (inEdge === OPP[outEdge])) addTile(cx, cy, L, L, R.color, 0, { chev: outEdge });
    });
  }

  /* signposts: the spawn, one step inside every door, and the middle of every boundary between halls */
  const facing = new Set();
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const ch = cell(x, y); if (!(M.exhibits[ch] || M.SHOP[ch] || ch === "Y")) continue;
    for (const [dx, dy] of DIRS) { if (isFloor(x + dx, y + dy)) facing.add(key(x + dx, y + dy)); else if (cell(x + dx, y + dy) === "*" && isFloor(x + 2 * dx, y + 2 * dy)) facing.add(key(x + 2 * dx, y + 2 * dy)); }
  }
  const cands = [{ at: spawn, why: "spawn" }], arrivals = [];
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (!reach[idx(x, y)]) continue;
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const nx = x + dx, ny = y + dy; if (!reach[idx(nx, ny)]) continue;
      if (region(x, y) !== region(nx, ny)) {
        for (const [m, t] of [[[x, y], [nx, ny]], [[nx, ny], [x, y]]]) {
          const ix = m[0] + (m[0] - t[0]), iy = m[1] + (m[1] - t[1]);
          const inward = reach[idx(ix, iy)] && region(ix, iy) === region(...m) ? [ix, iy] : m;
          arrivals.push({ door: t, mine: m, arrive: inward, region: region(...m), from: region(...t) });
          cands.push({ at: inward, why: "door" });
        }
      }
    }
  }
  const pairs = {};
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (!reach[idx(x, y)]) continue;
    for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy; if (!reach[idx(nx, ny)] || region(x, y) !== region(nx, ny)) continue; const a = zone(x, y), b = zone(nx, ny); if (a !== b) (pairs[a + ">" + b] = pairs[a + ">" + b] || []).push([x, y]); }
  }
  for (const k in pairs) { const c = pairs[k].sort((p, q2) => p[0] - q2[0] || p[1] - q2[1]); cands.push({ at: c[c.length >> 1], why: "boundary" }); }
  const signposts = [], taken = [];
  for (const c of cands) {
    let at = c.at;
    if (facing.has(key(...at)) || blocked.has(key(...at))) {
      const alt = DIRS.map(([dx, dy]) => [at[0] + dx, at[1] + dy]).find(p => reach[idx(...p)] && zone(...p) === zone(...at) && !facing.has(key(...p)) && !blocked.has(key(...p)));
      if (!alt) continue; at = alt;
    }
    if (taken.some(t => region(...t) === region(...at) && Math.max(Math.abs(t[0] - at[0]), Math.abs(t[1] - at[1])) < 3)) continue;
    const here = zone(...at), groups = {};
    for (const z in rep) { if (z === here || !field[z]) continue; const h = heading(at, z); if (!h) continue; (groups[h] = groups[h] || []).push({ z, d: field[z][idx(...at)] }); }
    const rows = ["N", "E", "S", "W"].filter(h => groups[h]).map(h => ({ dir: h, labels: groups[h].sort((a, b) => a.d - b.d).slice(0, 2).map(g => LABEL[g.z] || g.z) }));
    if (!rows.length) continue;
    taken.push(at); signposts.push({ at, zone: here, region: region(...at), rows, why: c.why });
  }

  /* map boards: one per hall, at its first signpost */
  const boards = [], boarded = new Set();
  for (const s of signposts) { if (boarded.has(s.zone)) continue; boarded.add(s.zone); boards.push({ id: s.zone, zone: s.zone, region: s.region, at: s.at }); }

  return { ROUTES, LABEL, BIT, rep, cellsByZone, zone, region, reach: (x, y) => !!reach[idx(x, y)], lineTiles, routeCells, signposts, boards, arrivals, walk };
};
