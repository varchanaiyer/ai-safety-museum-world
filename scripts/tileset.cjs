/* Paints the museum's tileset from the content: floors and wall faces tinted
   per hall, an exhibit kiosk for every placard (title on the wall, the
   artifact from "in the case" under glass), light pools, thresholds and hall
   plaques, benches and plants, painted visitors, the office diorama, the
   gift shop counter, and the museum's name across the title wall.
   Exported as a function of the museum index so the converter can place
   what it paints. Everything is generated, so it is CC0. */
"use strict";
const path = require("path"), fs = require("fs");
const { Sprite, Atlas, font, mulberry, SIZE } = require("./paint.cjs");
const scenes = require("./scenes.cjs");
const GOLD = "#e9b949", GOLD_DIM = "#96793c", INK = "#ece5d3", INK_DIM = "#9a927e", CARD = "#141318";

module.exports = function buildTileset(M) {
  const A = new Atlas(16);
  const T = {};
  const blank = () => new Sprite(SIZE, SIZE);
  T.EMPTY = A.one(blank()); T.COLLIDE = A.one(blank()); T.ZONE = A.one(blank()); T.START = A.one(blank());

  /* ---------- floors ---------- */
  function marble(base, grout, tint, seed, veins) {
    const s = new Sprite(SIZE, SIZE), b = hexMix(base, tint, 0.08);
    s.rect(0, 0, SIZE, SIZE, b).rect(0, 0, SIZE, 1, grout).rect(0, 0, 1, SIZE, grout);
    const R = mulberry(seed);
    for (let v = 0; v < veins; v++) { let x = R() * SIZE, y = R() * SIZE; for (let k = 0; k < 16; k++) { s.put(x | 0, y | 0, "#6a6470", 60); x += R() * 3 - 1.5; y += R() * 3 - 1.5; } }
    return s.grain(4, seed);
  }
  function hexMix(a, b, t) { const A2 = hx(a), B2 = hx(b); return [A2[0] + (B2[0] - A2[0]) * t, A2[1] + (B2[1] - A2[1]) * t, A2[2] + (B2[2] - A2[2]) * t]; }
  function hx(c) { if (Array.isArray(c)) return c; const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  const floors = {};
  for (const key in M.ZONES) {
    const z = M.ZONES[key], col = z.color || "#c9a06a";
    if (key === "office") { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#4a3c30"); for (let i = 0; i < SIZE; i += 8) s.rect(i, 0, 1, SIZE, "#3a2e24"); s.rect(0, 16, SIZE, 1, "#3a2e24"); s.grain(6, 41); floors[key] = [A.one(s), A.one(s.grain(0, 0))]; continue; }
    if (key === "shop") { floors[key] = [A.one(marble("#3a3229", "#241f19", col, 31, 1)), A.one(marble("#3c342b", "#241f19", col, 32, 2))]; continue; }
    if (key === "gov") { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#2e2c33").rect(0, 0, SIZE, 1, "#1e1c22").rect(0, 0, 1, SIZE, "#1e1c22"); const R = mulberry(21); for (let i = 0; i < 16; i++) s.put((R() * 30) | 0, (R() * 30) | 0, GOLD, 140); s.grain(5, 3); const s2 = new Sprite(SIZE, SIZE); s2.blit(s, 0, 0); s2.grain(4, 4); floors[key] = [A.one(s), A.one(s2)]; continue; }
    floors[key] = [A.one(marble("#2a282d", "#1c1b1f", col, 11 + key.length, 2)), A.one(marble("#2c2a2f", "#1c1b1f", col, 23 + key.length, 3))];
  }
  floors.core = floors.foyer;
  const floorStyles = {};
  { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#4a3c30"); for (let i = 0; i < SIZE; i += 8) s.rect(i, 0, 1, SIZE, "#3a2e24"); s.rect(0, 16, SIZE, 1, "#3a2e24"); s.grain(6, 41); const s2 = new Sprite(SIZE, SIZE); s2.blit(s, 0, 0).grain(5, 43); floorStyles.wood = [A.one(s), A.one(s2)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#46525e"); const R = mulberry(seed); for (let j = 0; j < SIZE; j += 2) for (let i = (j / 2) % 2; i < SIZE; i += 2) s.put(i, j, "#3e4a55", 160); for (let k = 0; k < 40; k++) s.put((R() * 32) | 0, (R() * 32) | 0, "#56636f", 120); return A.one(s.grain(3, seed)); }; floorStyles.carpet = [mk(61), mk(62)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#c9c0ad"); s.rect(0, 0, 16, 16, "#b3aa96"); s.rect(16, 16, 16, 16, "#b3aa96"); s.rect(0, 0, SIZE, 1, "#9a917f", 120); s.rect(0, 0, 1, SIZE, "#9a917f", 120); return A.one(s.grain(5, seed)); }; floorStyles.lino = [mk(71), mk(72)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#8e8b84"); const R = mulberry(seed); for (const [x, y] of [[0, 0], [16, 0], [0, 16], [16, 16]]) { const l = R() * 10 - 5; s.rect(x + 1, y + 1, 14, 14, [142 + l, 139 + l, 132 + l]); } for (let k = 0; k < 30; k++) s.put((R() * 32) | 0, (R() * 32) | 0, "#7a776f", 150); return A.one(s.grain(4, seed)); }; floorStyles.pavement = [mk(91), mk(92)]; }
  { const mk = (seed, line) => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#3a3a3e"); const R = mulberry(seed); for (let k = 0; k < 50; k++) s.put((R() * 32) | 0, (R() * 32) | 0, R() < 0.5 ? "#45454a" : "#333338", 200); if (line) s.rect(14, 4, 4, 12, "#d8d2b8", 210); return A.one(s.grain(5, seed)); }; floorStyles.road = [mk(101, true), mk(102, false)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#3f5a38"); const R = mulberry(seed); for (let k = 0; k < 70; k++) { const x = (R() * 32) | 0, y = (R() * 32) | 0; s.put(x, y, R() < 0.5 ? "#4a6a40" : "#35502f"); s.put(x, y - 1, "#4a6a40", 120); } return A.one(s.grain(4, seed)); }; floorStyles.grass = [mk(111), mk(112)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#2c2f36"); const R = mulberry(seed); for (let j = 0; j < 32; j += 8) for (let i = ((j / 8) % 2) * 4; i < 32; i += 8) { const l = R() * 8 - 4; s.rect(i, j, 7, 7, [50 + l, 54 + l, 62 + l]); } return A.one(s.grain(3, seed)); }; floorStyles.tile = [mk(121), mk(122)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#4a4030"); const R = mulberry(seed); for (let k = 0; k < 40; k++) s.put((R() * 32) | 0, (R() * 32) | 0, "#564a38", 160); for (let j = 4; j < 32; j += 10) s.rect(0, j, 32, 1, "#3c3427", 140); return A.one(s.grain(5, seed)); }; floorStyles.parquet = [mk(131), mk(132)]; }
  { const mk = seed => { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#5b5b60"); const R = mulberry(seed); for (let k = 0; k < 60; k++) s.put((R() * 32) | 0, (R() * 32) | 0, R() < 0.5 ? "#6a6a70" : "#4e4e53", 200); s.rect(0, 0, SIZE, 1, "#45454a", 160); s.rect(0, 0, 1, SIZE, "#45454a", 160); return A.one(s.grain(4, seed)); }; floorStyles.concrete = [mk(81), mk(82)]; }

  /* ---------- walls ---------- */
  { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#15141a").rect(0, 0, SIZE, 1, "#2a2831").rect(0, 0, 1, SIZE, "#2a2831").grain(4, 71); T.WALL_TOP = A.one(s); }
  const wallFaces = {};
  function wallFace(rgb) {
    const s = new Sprite(SIZE, SIZE);
    s.gradient(0, 0, SIZE, SIZE, [rgb[0] + 10, rgb[1] + 10, rgb[2] + 10], [rgb[0] - 4, rgb[1] - 4, rgb[2] - 4]);
    s.frame(2, 3, 28, 22, "#000000", 90).frame(3, 4, 28, 22, "#ffffff", 12);
    s.rect(0, 27, SIZE, 5, "#000000", 115).rect(0, 27, SIZE, 1, GOLD, 140).rect(0, 1, SIZE, 1, "#ffffff", 16);
    return s.grain(7, rgb[0] * 3 + rgb[2]);
  }
  for (const key in M.ZONES) wallFaces[key] = A.one(wallFace(M.ZONES[key].rgb || [42, 36, 27]));
  wallFaces.core = wallFaces.foyer;
  { const s = new Sprite(SIZE, SIZE); s.rect(0, 0, SIZE, SIZE, "#2a282d").rect(0, 0, SIZE, SIZE, "#7ec3e8", 95).rect(0, 0, SIZE, 2, "#2c98d6", 200).rect(0, 30, SIZE, 2, "#2c98d6", 200); for (let i = 0; i < SIZE; i++) s.put(i, 31 - i, "#ffffff", 90); T.GLASS = A.one(s); }
  { const s = marble("#2a282d", "#1c1b1f", GOLD, 13, 1); for (let i = 2; i < 30; i += 4) { s.rect(i, 2, 2, 1, GOLD); s.rect(i, 29, 2, 1, GOLD); s.rect(2, i, 1, 2, GOLD); s.rect(29, i, 1, 2, GOLD); } T.DOOR = A.one(s); }

  /* ---------- light, shadow, thresholds ---------- */
  const pool = (alpha) => { const s = new Sprite(96, 96); s.radial(48, 48, 46, "#ffefc8", alpha); return A.add(s); };
  const LIGHT = pool(120), LIGHT_SOFT = pool(55);
  const shadowStrip = (dir) => { const s = dir === "N" || dir === "S" ? new Sprite(96, 32) : new Sprite(32, 96); const n = 9; for (let k = 0; k < n; k++) { const a = 70 * (1 - k / n); if (dir === "N") s.rect(0, k, 96, 1, "#000000", a); if (dir === "S") s.rect(0, 31 - k, 96, 1, "#000000", a); if (dir === "W") s.rect(k, 0, 1, 96, "#000000", a); if (dir === "E") s.rect(31 - k, 0, 1, 96, "#000000", a); } return A.add(s); };
  const SHADOW = { N: shadowStrip("N"), S: shadowStrip("S"), E: shadowStrip("E"), W: shadowStrip("W") };
  const threshold = (dir) => { const h = dir === "N" || dir === "S"; const s = h ? new Sprite(96, 32) : new Sprite(32, 96); const band = (x, y, w, hh) => { s.rect(x, y, w, hh, "#0e0d11", 200); for (let k = 3; k < (h ? 96 : 96); k += 8) { if (h) s.rect(k, y + 2, 4, hh - 4, GOLD, 170); else s.rect(x + 2, k, hh - 4, 4, GOLD, 170); } }; if (dir === "N") band(0, 0, 96, 7); if (dir === "S") band(0, 25, 96, 7); if (dir === "W") band(0, 0, 7, 96); if (dir === "E") band(25, 0, 7, 96); return A.add(s); };
  const THRESH = { N: threshold("N"), S: threshold("S"), E: threshold("E"), W: threshold("W") };

  /* ---------- the artifacts, small enough for a case, scaled for a plinth ---------- */
  const ART = {
    clip: (s, x, y, k) => { s.ring(x - 2 * k, y, 5 * k, "#c9ccd4", 255, 2 * k); s.rect(x - 7 * k, y - 2 * k, 2 * k, 10 * k, "#c9ccd4"); s.rect(x + 1 * k, y - 8 * k, 2 * k, 9 * k, "#c9ccd4"); },
    trophy: (s, x, y, k) => { s.ellipse(x, y - 2 * k, 6 * k, 5 * k, GOLD); s.rect(x - 1 * k, y + 2 * k, 2 * k, 4 * k, GOLD); s.rect(x - 5 * k, y + 6 * k, 10 * k, 2 * k, GOLD); s.ring(x - 8 * k, y - 3 * k, 3 * k, GOLD, 255, k); s.ring(x + 8 * k, y - 3 * k, 3 * k, GOLD, 255, k); },
    mirror: (s, x, y, k) => { s.ellipse(x, y, 6 * k, 8 * k, GOLD); s.ellipse(x, y, 4 * k, 6 * k, "#a9d3f0"); s.line(x - 2 * k, y - 4 * k, x + 1 * k, y + 2 * k, "#ffffff", 200); },
    book: (s, x, y, k) => { s.rect(x - 9 * k, y - 5 * k, 18 * k, 11 * k, "#4a6ea8"); s.rect(x - 9 * k, y - 5 * k, 18 * k, 2 * k, "#3a5a8c"); s.rect(x - 6 * k, y - 1 * k, 12 * k, 3 * k, "#f4f2ec"); },
    chip: (s, x, y, k) => { s.ellipse(x, y + 5 * k, 11 * k, 4 * k, "#8c2f2a"); s.rect(x - 6 * k, y - 6 * k, 12 * k, 12 * k, CARD); s.rect(x - 4 * k, y - 4 * k, 8 * k, 8 * k, "#3c3a44"); for (let i = -5; i <= 5; i += 3) { s.rect(x + i * k, y - 8 * k, k, 2 * k, "#c9ccd4"); s.rect(x + i * k, y + 6 * k, k, 2 * k, "#c9ccd4"); } },
    neuron: (s, x, y, k) => { s.circle(x, y, 8 * k, "#7a8ce8", 140); s.circle(x, y, 6 * k, "#78d6d0"); s.circle(x - 2 * k, y - 2 * k, 2 * k, "#ffffff", 230); },
    watch: (s, x, y, k) => { s.circle(x, y, 7 * k, GOLD); s.circle(x, y, 5 * k, "#f4f2ec"); s.line(x, y, x, y - 4 * k, "#26232c"); s.line(x, y, x + 3 * k, y + 1 * k, "#26232c"); s.ring(x + 8 * k, y + 5 * k, 3 * k, GOLD, 255, k); },
    scope: (s, x, y, k) => { s.rect(x - 1 * k, y - 9 * k, 3 * k, 8 * k, GOLD); s.line(x - 3 * k, y - 2 * k, x + 2 * k, y + 5 * k, GOLD); s.rect(x - 7 * k, y + 6 * k, 14 * k, 2 * k, GOLD); s.rect(x - 3 * k, y + 2 * k, 6 * k, 2 * k, GOLD); },
    panda: (s, x, y, k) => { for (const dx of [-7, 5]) { s.rect(x + dx * k - 5 * k, y - 6 * k, 10 * k, 12 * k, "#60785a"); s.circle(x + dx * k, y + 1 * k, 3 * k, "#f4f2ec"); s.circle(x + dx * k - 1.5 * k, y, k, "#181618"); s.circle(x + dx * k + 1.5 * k, y, k, "#181618"); } s.text(x - k, y - 2 * k, "+", { color: INK_DIM }); },
    reel: (s, x, y, k) => { s.circle(x, y, 8 * k, "#26232c"); s.ring(x, y, 8 * k, "#8a8f9a", 255, k); s.circle(x, y, 2 * k, "#8a8f9a"); for (let i = 0; i < 3; i++) { const a = i * 2.09; s.circle(x + Math.cos(a) * 5 * k, y + Math.sin(a) * 5 * k, k, "#8a8f9a"); } },
    coin: (s, x, y, k) => { s.circle(x, y, 7 * k, GOLD); s.ring(x, y, 5 * k, GOLD_DIM, 255, k); s.ellipse(x - 2 * k, y - 3 * k, 2 * k, 3 * k, "#fff4c8", 220); },
    dial: (s, x, y, k) => { s.ellipse(x, y + 3 * k, 10 * k, 7 * k, "#f4f2ec"); s.rect(x - 11 * k, y + 3 * k, 22 * k, 6 * k, "#302b2f"); s.line(x, y + 3 * k, x + 6 * k, y - 4 * k, "#8c2f2a"); s.ring(x, y + 3 * k, 10 * k, GOLD, 255, k); },
    ramps: (s, x, y, k) => { for (let i = 0; i < 14 * k; i++) s.rect(x - 16 * k + i, y + 6 * k - (i * 8 / 14) | 0, 1, (i * 8 / 14) | 0 + 1, "#8a8f9a"); for (let i = 0; i < 12 * k; i++) s.rect(x + 3 * k + i, y + 6 * k - i * 1.4 | 0, 1, i * 1.4 + 1 | 0, "#8c2f2a"); },
    alarm: (s, x, y, k) => { s.rect(x - 7 * k, y - 7 * k, 14 * k, 14 * k, "#b8332a"); s.frame(x - 7 * k, y - 7 * k, 14 * k, 14 * k, "#f4f2ec"); s.text(x, y - 2 * k, "!", { align: "center", color: "#f4f2ec" }); },
    tablet: (s, x, y, k) => { s.rect(x - 7 * k, y - 8 * k, 14 * k, 16 * k, "#9c7a4e"); s.rect(x - 6 * k, y - 9 * k, 12 * k, 1 * k, "#9c7a4e"); for (let i = -5; i < 7; i += 3) s.rect(x - 4 * k, y + i * k, 8 * k, k, "#5e4614"); },
    paper: (s, x, y, k) => { for (let i = 0; i < 6; i++) s.rect(x - 9 * k + i, y + 6 * k - i * 2 * k, 18 * k, 2 * k, "#f4f2ec"); s.rect(x - 9 * k, y + 8 * k, 18 * k, k, "#000000", 60); },
    buttons: (s, x, y, k) => { s.rect(x - 11 * k, y - 4 * k, 9 * k, 9 * k, "#3f9e5f"); s.rect(x + 2 * k, y - 4 * k, 9 * k, 9 * k, "#8c2f2a"); s.text(x - 7 * k, y - 2 * k, "+", { align: "center", color: "#ffffff" }); s.text(x + 6 * k, y - 2 * k, "-", { align: "center", color: "#ffffff" }); },
    empty: (s, x, y, k) => { s.ellipse(x, y + 2 * k, 9 * k, 4 * k, "#cfc9bb", 90); s.ellipse(x, y, 7 * k, 3 * k, "#ffffff", 40); },
    ticket: (s, x, y, k) => { s.rect(x - 10 * k, y - 4 * k, 20 * k, 9 * k, "#f4f2ec"); s.rect(x - 10 * k, y - 4 * k, 20 * k, 2 * k, GOLD); for (let i = -8; i < 9; i += 3) s.rect(x + i * k, y + 1 * k, 2 * k, k, INK_DIM); s.circle(x - 10 * k, y, k, CARD); s.circle(x + 10 * k, y, k, CARD); },
    vault: (s, x, y, k) => { s.circle(x, y, 9 * k, "#5a5f6a"); s.ring(x, y, 9 * k, "#c9ccd4", 255, k); s.ring(x, y, 4 * k, "#c9ccd4", 255, k); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; s.line(x + Math.cos(a) * 4 * k, y + Math.sin(a) * 4 * k, x + Math.cos(a) * 8 * k, y + Math.sin(a) * 8 * k, "#c9ccd4"); } s.rect(x - 4 * k, y + 11 * k, 8 * k, 2 * k, "#f4f2ec"); },
    photo: (s, x, y, k) => { s.rect(x - 10 * k, y - 7 * k, 20 * k, 14 * k, "#f4f2ec"); s.rect(x - 8 * k, y - 5 * k, 16 * k, 10 * k, "#2f4a2f"); for (let i = 0; i < 5; i++) s.rect(x - 7 * k + i * 3 * k, y - 4 * k + (i % 2) * 2 * k, 2 * k, 7 * k, "#1f331f"); s.text(x, y + 7 * k - 5 * k, "?", { align: "center", color: "#f4f2ec" }); },
    flags: (s, x, y, k) => { const cols = ["#3a6ea5", "#c1440e", "#4f772d", "#e9c46a", "#8e7dbe", "#118ab2", "#ef476f"]; for (let i = 0; i < 7; i++) { s.rect(x - 12 * k + i * 4 * k, y - 6 * k, k, 12 * k, "#c9ccd4"); s.rect(x - 11 * k + i * 4 * k, y - 6 * k, 3 * k, 3 * k, cols[i]); } s.rect(x - 12 * k, y + 6 * k, 26 * k, 2 * k, "#5a4630"); },
    wire: (s, x, y, k) => { s.line(x - 12 * k, y, x + 12 * k, y, GOLD); s.rect(x - 13 * k, y - 4 * k, 2 * k, 8 * k, "#8a8f9a"); s.rect(x + 11 * k, y - 4 * k, 2 * k, 8 * k, "#8a8f9a"); s.line(x - 12 * k, y + 1, x + 12 * k, y + 1, GOLD, 120); },
    phone: (s, x, y, k) => { s.rect(x - 8 * k, y - 2 * k, 16 * k, 8 * k, "#b8332a"); s.ellipse(x, y - 5 * k, 9 * k, 3 * k, "#b8332a"); s.rect(x - 3 * k, y, 6 * k, 4 * k, "#f4f2ec", 200); },
    wheel: (s, x, y, k) => { s.ring(x, y, 8 * k, "#26232c", 255, 2 * k); s.circle(x, y, 2 * k, "#26232c"); for (let i = 0; i < 3; i++) { const a = i * 2.09 + 1.57; s.line(x, y, x + Math.cos(a) * 7 * k, y + Math.sin(a) * 7 * k, "#26232c"); } },
    robot: (s, x, y, k) => { s.ellipse(x, y + 2 * k, 9 * k, 5 * k, "#c9ccd4"); s.rect(x - 4 * k, y - 4 * k, 8 * k, 6 * k, "#8a8f9a"); s.circle(x + 2 * k, y - 2 * k, k, "#3f9e5f"); s.rect(x - 12 * k, y + 5 * k, 6 * k, 2 * k, "#7ec3e8", 200); },
    camera: (s, x, y, k) => { s.rect(x - 8 * k, y - 4 * k, 16 * k, 10 * k, "#26232c"); s.circle(x, y + 1 * k, 4 * k, "#c9ccd4"); s.circle(x, y + 1 * k, 2 * k, "#2c98d6"); s.rect(x - 4 * k, y - 6 * k, 6 * k, 2 * k, "#26232c"); s.circle(x + 6 * k, y - 3 * k, k, "#b8332a"); },
    punch: (s, x, y, k) => { s.rect(x - 9 * k, y - 8 * k, 18 * k, 16 * k, "#4a4f52"); s.circle(x, y - 2 * k, 5 * k, "#f4f2ec"); s.line(x, y - 2 * k, x, y - 6 * k, "#26232c"); s.line(x, y - 2 * k, x + 3 * k, y - 1 * k, "#26232c"); s.rect(x - 3 * k, y + 5 * k, 6 * k, 6 * k, "#f4f2ec"); s.rect(x - 2 * k, y + 7 * k, 4 * k, 1 * k, "#26232c"); },
    copier: (s, x, y, k) => { s.rect(x - 11 * k, y - 4 * k, 22 * k, 12 * k, "#d9d4c8"); s.rect(x - 11 * k, y - 4 * k, 22 * k, 3 * k, "#c6c1b4"); s.rect(x - 8 * k, y - 7 * k, 14 * k, 4 * k, "#c6c1b4"); s.rect(x - 6 * k, y + 1 * k, 8 * k, 2 * k, "#8a94a4"); s.circle(x + 8 * k, y + 2 * k, 1.2 * k, "#e0993f"); },
    fax: (s, x, y, k) => { s.rect(x - 10 * k, y - 3 * k, 20 * k, 10 * k, "#e2dccb"); s.rect(x - 8 * k, y - 1 * k, 8 * k, 6 * k, "#8a94a4"); for (let i = 0; i < 6; i++) s.rect(x + 2 * k + (i % 3) * 2.5 * k, y + (i < 3 ? 0 : 3) * k, 1.5 * k, 1.5 * k, "#4a4f52"); s.rect(x - 6 * k, y - 9 * k, 12 * k, 7 * k, "#f4f2ec"); s.rect(x - 6 * k, y - 9 * k, 12 * k, 1 * k, "#9a927e"); },
    mug: (s, x, y, k) => { s.rect(x - 6 * k, y - 4 * k, 12 * k, 12 * k, "#f2e9d8"); s.ring(x + 8 * k, y + 1 * k, 4 * k, "#f2e9d8", 255, 2 * k); s.rect(x - 6 * k, y - 4 * k, 12 * k, 2 * k, "#5a3a20"); s.rect(x - 4 * k, y + 0 * k, 8 * k, 2 * k, "#b8332a"); for (let i = 0; i < 3; i++) s.line(x - 3 * k + i * 3 * k, y - 6 * k, x - 2 * k + i * 3 * k, y - 10 * k, "#c9ccd4", 120); },
    tray: (s, x, y, k) => { for (const [dy, c] of [[4, "#c9ccd4"], [-4, "#c9ccd4"]]) { s.frame(x - 12 * k, y + dy * k - 3 * k, 24 * k, 6 * k, c); } s.rect(x - 10 * k, y - 6 * k, 20 * k, 2 * k, "#f4f2ec"); s.rect(x - 10 * k, y - 9 * k, 20 * k, 2 * k, "#f4f2ec"); s.rect(x - 10 * k, y + 3 * k, 20 * k, 2 * k, "#f4f2ec"); s.text(x - 8 * k, y - 2 * k, "IN", { color: "#26232c" }); },
    projector: (s, x, y, k) => { s.rect(x - 9 * k, y + 2 * k, 18 * k, 7 * k, "#8a8f9a"); s.rect(x - 7 * k, y + 1 * k, 14 * k, 2 * k, "#c9ccd4"); s.rect(x + 5 * k, y - 10 * k, 2 * k, 12 * k, "#4a4f52"); s.rect(x + 2 * k, y - 11 * k, 8 * k, 3 * k, "#4a4f52"); s.circle(x + 4 * k, y - 8 * k, 1.5 * k, "#a9d3f0"); s.rect(x - 6 * k, y - 5 * k, 6 * k, 6 * k, "#ffffff", 120); },
    nameplate: (s, x, y, k) => { s.rect(x - 11 * k, y - 3 * k, 22 * k, 8 * k, GOLD); s.rect(x - 10 * k, y - 2 * k, 20 * k, 6 * k, "#c8922e"); for (let i = 0; i < 4; i++) s.rect(x - 8 * k + i * 4.5 * k, y, 3 * k, 2 * k, "#5e4614"); s.rect(x - 11 * k, y + 5 * k, 22 * k, 1 * k, "#5e4614"); },
    rack: (s, x, y, k) => { s.rect(x - 7 * k, y - 10 * k, 14 * k, 20 * k, "#26232c"); s.frame(x - 7 * k, y - 10 * k, 14 * k, 20 * k, "#4a4f52"); for (let r = 0; r < 5; r++) { s.rect(x - 5 * k, y - 8 * k + r * 4 * k, 10 * k, 2 * k, "#3a3a44"); s.put(x + 3 * k, y - 7 * k + r * 4 * k, r % 2 ? "#3f9e5f" : "#e0993f"); s.put(x + 1 * k, y - 7 * k + r * 4 * k, "#3f9e5f"); } },
    slots: (s, x, y, k) => { s.rect(x - 12 * k, y - 8 * k, 24 * k, 16 * k, "#5a4630"); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { s.rect(x - 11 * k + c * 6 * k, y - 7 * k + r * 5 * k, 5 * k, 4 * k, "#3b2d1e"); if ((r * 4 + c) % 5 === 1) s.rect(x - 10 * k + c * 6 * k, y - 5 * k + r * 5 * k, 3 * k, 1.5 * k, "#f4f2ec"); } },
    box: (s, x, y, k) => { s.rect(x - 8 * k, y - 5 * k, 16 * k, 12 * k, "#7a5c34"); s.rect(x - 8 * k, y - 5 * k, 16 * k, 2 * k, "#9a7a48"); s.rect(x - 5 * k, y - 3 * k, 10 * k, 1.5 * k, "#26232c"); s.circle(x, y + 3 * k, 1.5 * k, GOLD); },
    key: (s, x, y, k) => { s.ring(x - 6 * k, y, 4 * k, GOLD, 255, 2 * k); s.rect(x - 2 * k, y - 1 * k, 12 * k, 2 * k, GOLD); s.rect(x + 6 * k, y + 1 * k, 2 * k, 3 * k, GOLD); s.rect(x + 2 * k, y + 1 * k, 2 * k, 2 * k, GOLD); },
    videotape: (s, x, y, k) => { s.rect(x - 11 * k, y - 6 * k, 22 * k, 13 * k, "#26232c"); s.rect(x - 9 * k, y - 4 * k, 18 * k, 5 * k, "#f4f2ec"); s.rect(x - 5 * k, y + 1 * k, 10 * k, 4 * k, "#4a4f52"); s.circle(x - 2 * k, y + 3 * k, 1.5 * k, "#8a8f9a"); s.circle(x + 2 * k, y + 3 * k, 1.5 * k, "#8a8f9a"); for (let i = 0; i < 3; i++) s.rect(x - 8 * k, y - 3 * k + i * 1.5 * k, 12 * k, 0.8 * k, "#9a927e"); },
    filmroll: (s, x, y, k) => { s.ellipse(x, y, 8 * k, 9 * k, "#3a3a44"); s.rect(x - 8 * k, y - 4 * k, 16 * k, 8 * k, "#8a8f9a"); s.rect(x - 8 * k, y - 4 * k, 16 * k, 2 * k, "#b23a30"); s.rect(x + 6 * k, y - 9 * k, 4 * k, 6 * k, "#26232c"); for (let i = -6; i < 8; i += 3) s.put(x + i * k, y - 8 * k, "#f4f2ec"); },
    atlas: (s, x, y, k) => { s.rect(x - 12 * k, y - 7 * k, 24 * k, 14 * k, "#e8e2d0"); for (let i = -8; i < 10; i += 6) s.rect(x + i * k, y - 7 * k, 1 * k, 14 * k, "#b8b2a0"); s.line(x - 10 * k, y + 3 * k, x + 2 * k, y - 4 * k, "#b23a30"); s.line(x + 2 * k, y - 4 * k, x + 10 * k, y + 1 * k, "#b23a30"); s.rect(x - 12 * k, y - 7 * k, 24 * k, 1 * k, "#9a927e"); },
    phonebook: (s, x, y, k) => { s.rect(x - 10 * k, y - 3 * k, 20 * k, 11 * k, "#e0d8b8"); for (let i = 0; i < 5; i++) s.rect(x - 10 * k, y - 2 * k + i * 2 * k, 20 * k, 1 * k, "#c8bf9c"); s.rect(x - 10 * k, y - 8 * k, 20 * k, 5 * k, "#c8a03c"); s.text(x, y - 7 * k, "A-Z", { align: "center", color: "#4a3a10" }); },
    rolodex: (s, x, y, k) => { s.rect(x - 11 * k, y + 4 * k, 22 * k, 4 * k, "#3a3a44"); s.ring(x, y, 8 * k, "#8a8f9a", 255, 2 * k); for (let i = 0; i < 9; i++) { const a = i * 0.7 - 1.2; s.line(x + Math.cos(a) * 5 * k, y + Math.sin(a) * 5 * k, x + Math.cos(a) * 10 * k, y + Math.sin(a) * 10 * k, "#f4f2ec"); } s.rect(x - 2 * k, y - 1 * k, 4 * k, 2 * k, "#4a4f52"); },
    redbutton: (s, x, y, k) => { s.ellipse(x, y + 6 * k, 13 * k, 5 * k, "#4a4f52"); s.circle(x, y, 10 * k, "#8a1f18"); s.circle(x, y - 1 * k, 9 * k, "#c8322a"); s.circle(x - 3 * k, y - 4 * k, 3 * k, "#e8665c", 200); s.ring(x, y, 12 * k, GOLD, 200, k); },
    switch: (s, x, y, k) => { s.rect(x - 8 * k, y - 10 * k, 16 * k, 20 * k, "#3a3a44"); s.frame(x - 8 * k, y - 10 * k, 16 * k, 20 * k, "#8a8f9a"); s.rect(x - 3 * k, y - 7 * k, 6 * k, 9 * k, "#c9ccd4"); s.rect(x - 4 * k, y - 8 * k, 8 * k, 3 * k, "#b23a30"); s.text(x, y + 4 * k, "OFF", { align: "center", color: "#c9ccd4" }); },
    barrier: (s, x, y, k) => { for (let i = 0; i < 5; i++) s.rect(x - 12 * k + i * 5 * k, y - 3 * k, 5 * k, 6 * k, i % 2 ? "#e8c76a" : "#26232c"); s.rect(x - 13 * k, y + 3 * k, 3 * k, 8 * k, "#8a8f9a"); s.rect(x + 10 * k, y + 3 * k, 3 * k, 8 * k, "#8a8f9a"); },
    seal: (s, x, y, k) => { s.rect(x - 11 * k, y - 8 * k, 22 * k, 16 * k, "#f4f2ec"); for (let i = 0; i < 4; i++) s.rect(x - 8 * k, y - 6 * k + i * 2.5 * k, 12 * k, 1 * k, "#9a927e"); s.circle(x + 6 * k, y + 3 * k, 5 * k, "#b23a30"); s.ring(x + 6 * k, y + 3 * k, 5 * k, "#8a1f18", 255, k); s.text(x + 6 * k, y + 1 * k, "OK", { align: "center", color: "#f4f2ec" }); },
    stopwatch: (s, x, y, k) => { s.circle(x, y + 1 * k, 9 * k, "#c9ccd4"); s.circle(x, y + 1 * k, 7 * k, "#f4f2ec"); s.rect(x - 2 * k, y - 11 * k, 4 * k, 3 * k, "#8a8f9a"); s.line(x, y + 1 * k, x + 4 * k, y - 3 * k, "#b23a30"); s.line(x, y + 1 * k, x, y - 4 * k, "#26232c"); },
    punchcard: (s, x, y, k) => { s.rect(x - 13 * k, y - 6 * k, 26 * k, 12 * k, "#e8e0c8"); const R = mulberry(7); for (let c = 0; c < 10; c++) for (let r = 0; r < 3; r++) if (R() < 0.4) s.rect(x - 11 * k + c * 2.4 * k, y - 4 * k + r * 3 * k, 1.4 * k, 2 * k, "#8a8270"); s.line(x - 13 * k, y - 6 * k, x - 10 * k, y - 6 * k, "#c8bf9c"); },
    captcha: (s, x, y, k) => { s.rect(x - 13 * k, y - 8 * k, 26 * k, 11 * k, "#e8e4dc"); const R = mulberry(11); for (let i = 0; i < 6; i++) { const cx = x - 10 * k + i * 4 * k, o = (R() * 4 - 2) * k; s.rect(cx, y - 6 * k + o, 2 * k, 7 * k, "#3a3a44"); } for (let i = 0; i < 3; i++) s.line(x - 13 * k, y - 6 * k + i * 4 * k, x + 13 * k, y - 3 * k + i * 4 * k, "#9a927e", 150); s.rect(x - 12 * k, y + 5 * k, 6 * k, 6 * k, "#f4f2ec"); s.frame(x - 12 * k, y + 5 * k, 6 * k, 6 * k, "#3a3a44"); s.text(x + 2 * k, y + 6 * k, "HUMAN", { color: "#9a927e" }); },
    orb: (s, x, y, k, col) => { s.circle(x, y, 8 * k, col || "#2e5fd0", 90); s.circle(x, y, 5 * k, col || "#2e5fd0"); s.circle(x - 2 * k, y - 2 * k, 1.5 * k, "#ffffff", 220); }
  };
  const KIND_RULES = [[/hot metal/, "tablet"], [/distorted word|captcha/, "captcha"], [/red button|big red/, "redbutton"], [/key cabinet/, "key"], [/signboard/, "nameplate"],
    [/plugboard|cable still/, "wire"], [/front page|rack of front/, "paper"], [/modem/, "fax"], [/thermal slip|paying-in slip|envelope|handwritten|rubber stamp|page that says/, "paper"],
    [/progress bar|per cent complete/, "stopwatch"], [/drawer, pulled|card catalogue/, "slots"], [/empty frame/, "photo"], [/training log/, "paper"],
    [/videotape|vhs|cassette/, "videotape"], [/film|negative|canister/, "filmroll"], [/road atlas|street atlas|folded map/, "atlas"], [/telephone directory|phone book|directory, thick/, "phonebook"], [/rolodex/, "rolodex"], [/red button|big red/, "redbutton"], [/switch|lever/, "switch"], [/barrier|rope, retractable|queue/, "barrier"], [/certificate|credential|seal/, "seal"], [/stopwatch|egg timer/, "stopwatch"], [/punched card|punch card/, "punchcard"], [/visitors' book|visitors book/, "book"], [/time clock|punch/, "punch"], [/photocopier/, "copier"], [/fax/, "fax"], [/mug/, "mug"], [/laminated notice/, "paper"], [/wire tray/, "tray"], [/projector/, "projector"], [/nameplate/, "nameplate"], [/rack, humming|one rack/, "rack"], [/wooden slots/, "slots"], [/wooden box/, "box"], [/cupboard/, "key"], [/paperclip/, "clip"], [/trophy/, "trophy"], [/mirror/, "mirror"], [/preprint|blue book|exam/, "book"], [/processor|gpu/, "chip"], [/neuron/, "neuron"], [/pocket watch/, "watch"], [/microscope/, "scope"], [/panda/, "panda"], [/reel|tape/, "reel"], [/coin/, "coin"], [/dial|slider/, "dial"], [/ramp/, "ramps"], [/fire alarm|alarm/, "alarm"], [/tablet/, "tablet"], [/ream|paper|transcript|scorecard|worksheet|résumé|inbox|napkin/, "paper"], [/button|thumb/, "buttons"], [/empty pedestal/, "empty"], [/ticket/, "ticket"], [/vault/, "vault"], [/forest|photograph|portrait|face/, "photo"], [/flags|conference table|town square/, "flags"], [/tripwire|wire/, "wire"], [/telephone|phone/, "phone"], [/steering/, "wheel"], [/robot|machine with its case|small machines/, "robot"], [/camera|printing press|politicians/, "camera"], [/window|condensation/, "photo"], [/oil on canvas/, "photo"]];
  function kindOf(ex) { const o = ((ex.obj || "") + " · " + (ex.t || "")).toLowerCase(); for (const [re, k] of KIND_RULES) if (re.test(o)) return k; return "orb"; }

  /* ---------- an exhibit kiosk: title on the wall, the artifact in a case ---------- */
  function caseStrip(s, y, ex, col, k) {
    s.rect(4, y + 2, 88, 28, "#26232c").frame(4, y + 2, 88, 28, GOLD, 200);
    s.rect(9, y + 5, 78, 22, "#0e1a26").rect(9, y + 5, 78, 22, "#7ec3e8", 40);
    ART[kindOf(ex)](s, 48, y + 16, k, col);
    s.rect(9, y + 5, 78, 22, "#cde4f5", 22); s.line(12, y + 25, 30, y + 7, "#ffffff", 70);
    s.rect(4, y + 29, 88, 1, GOLD, 120);
  }
  function panel(s, y, ex, col, art) {
    s.rect(3, y + 3, 90, 58, "#000000", 80).rect(4, y + 4, 88, 56, CARD).frame(4, y + 4, 88, 56, GOLD, 230).frame(6, y + 6, 84, 52, GOLD, 60);
    s.rect(10, y + 9, 30, 2, col);
    s.text(86, y + 8, "Nº " + String(ex.n).padStart(2, "0"), { align: "right", color: INK_DIM });
    if (art && scenes[ex.ch]) { s.rect(11, y + 15, 74, 32, "#c8a04a").rect(12, y + 16, 72, 30, "#3a2e20"); scenes[ex.ch](s, 14, y + 18, 68, 26); s.text(48, y + 49, font.wrap(ex.t, 22, 1)[0], { align: "center", color: INK }); return; }
    const words = font.norm(ex.t).split(" ");
    const long = words.some(w => w.length > 11) || font.wrap(ex.t, 11, 9).length > 3;   /* a word that will not fit, or too many lines, drops to the small face */
    const lines = long ? font.wrap(ex.t, 21, 4) : font.wrap(ex.t, 11, 3), sc = long ? 1 : 2, lh = long ? 7 : 12;
    const top = y + 18 + Math.max(0, (36 - lines.length * lh) / 2);
    lines.forEach((l, i) => s.text(48, top + i * lh, l, { scale: sc, align: "center", color: INK }));
  }
  /* a shopfront on the High Street: awning, window of goods, hanging sign */
  function shopfront(s, ex, col) {
    s.rect(0, 0, 96, 96, "#2a2530"); s.gradient(0, 0, 96, 42, "#3a3340", "#2b2630");
    s.rect(0, 0, 96, 8, "#1d1a22");
    for (let i = 0; i < 96; i += 8) s.rect(i, 8, 8, 9, (i / 8) % 2 ? col : "#f2ece0", 235);   /* striped awning */
    s.rect(0, 17, 96, 2, "#000000", 120);
    s.rect(8, 22, 80, 16, "#141318").frame(8, 22, 80, 16, GOLD, 220);
    const tl = font.wrap(ex.t, 19, 2), tsc = tl.length === 1 && tl[0].length <= 9 ? 2 : 1;
    tl.forEach((l, i) => s.text(48, (tl.length > 1 ? 25 : tsc === 2 ? 26 : 28) + i * 7, l, { align: "center", color: GOLD, scale: tsc }));
    s.rect(6, 44, 52, 34, "#0d1620"); s.frame(6, 44, 52, 34, "#5a4630", 255);
    s.rect(6, 44, 52, 34, "#7ec3e8", 26);
    ART[kindOf(ex)](s, 32, 60, 1, col);
    s.line(10, 76, 34, 47, "#ffffff", 45);
    s.rect(62, 42, 28, 44, "#5a4630"); s.rect(65, 46, 22, 30, "#1a2430"); s.rect(65, 46, 22, 30, "#7ec3e8", 30); s.circle(84, 62, 2, GOLD);
    s.rect(0, 86, 96, 10, "#8e8b84"); s.rect(0, 86, 96, 2, "#6f6c66");
    s.rect(20, 80, 24, 7, CARD).frame(20, 80, 24, 7, GOLD, 200); s.text(32, 81, "Nº " + String(ex.n).padStart(2, "0"), { align: "center", color: GOLD });
  }
  /* a hazard panel in the Off Switch Gallery */
  function hazardPanel(s, ex, col) {
    s.rect(0, 0, 96, 96, "#3a3a42"); s.grain(6, ex.n * 13);
    for (let i = -12; i < 96; i += 12) for (let j = 0; j < 10; j++) s.line(i + j, 0, i + j + 10, 10, j < 6 ? "#e8c76a" : "#26232c");
    s.rect(0, 10, 96, 2, "#1d1a22");
    s.rect(6, 16, 84, 44, "#26232c").frame(6, 16, 84, 44, "#8a8f9a", 255).frame(8, 18, 80, 40, "#c9ccd4", 60);
    const lines = font.wrap(ex.t, 15, 3);
    lines.forEach((l, i) => s.text(48, 24 + i * 9 + (3 - lines.length) * 4, l, { align: "center", color: "#e8e4dc" }));
    s.rect(6, 62, 84, 26, "#1d1a22").frame(6, 62, 84, 26, "#8a8f9a", 200);
    ART[kindOf(ex)](s, 34, 75, 1, col);
    s.rect(64, 66, 22, 18, "#26232c").frame(64, 66, 22, 18, "#c9ccd4", 180);
    s.text(75, 70, "Nº" + String(ex.n).padStart(2, "0"), { align: "center", color: "#e8c76a" });
  }
  /* a service window at the Verification Desk */
  function serviceWindow(s, ex, col) {
    s.rect(0, 0, 96, 96, "#22262e"); s.gradient(0, 0, 96, 40, "#2c313b", "#22262e");
    s.rect(0, 0, 96, 4, "#1a1d24");
    s.rect(8, 6, 80, 18, "#0d1a22").frame(8, 6, 80, 18, col, 220);
    const vl = font.wrap(ex.t, 19, 2), vsc = vl.length === 1 && vl[0].length <= 9 ? 2 : 1;
    vl.forEach((l, i) => s.text(48, (vl.length > 1 ? 9 : vsc === 2 ? 10 : 12) + i * 7, l, { align: "center", color: col, scale: vsc }));
    s.rect(10, 26, 76, 40, "#0a1016"); s.frame(10, 26, 76, 40, "#8a8f9a", 255);
    s.rect(10, 26, 76, 40, "#a9d3f0", 22);
    ART[kindOf(ex)](s, 48, 44, 1, col);
    for (let i = 22; i < 76; i += 6) s.rect(i, 62, 3, 3, "#5a6068");      /* the speak-through grille */
    s.rect(6, 70, 84, 16, "#5a4630"); s.rect(6, 70, 84, 3, "#7a6040");
    s.rect(14, 76, 20, 7, "#f4f2ec"); s.rect(60, 76, 24, 7, CARD).frame(60, 76, 24, 7, col, 200);
    s.text(72, 77, "Nº " + String(ex.n).padStart(2, "0"), { align: "center", color: col });
    s.rect(0, 88, 96, 8, "#2c313b");
  }
  const STYLE = { highstreet: shopfront, offswitch: hazardPanel, verify: serviceWindow };
  const kiosks = {};
  for (const ch in M.exhibits) {
    const ex = M.exhibits[ch], col = ex.color || GOLD, rgb = (M.ZONES[ex.wing] || {}).rgb || [42, 36, 27];
    const style = STYLE[ex.wing];
    const south = new Sprite(96, 96);
    if (style) style(south, ex, col);
    else {
      for (let ty = 0; ty < 3; ty++) for (let tx = 0; tx < 3; tx++) south.blit(A.tiles[wallFaces[ex.wing] || wallFaces.core], tx * 32, ty * 32);
      panel(south, 0, ex, col, ex.art || ex.mural); caseStrip(south, 64, ex, col, 1);
    }
    let north;
    if (style) { north = new Sprite(96, 96); style(north, ex, col); }   /* shopfronts read the same way round */
    else {
      north = south.flipV();  /* case toward the floor above; the text inside is re-drawn upright */
      north.rect(0, 32, 96, 64, "#000000", 0); for (let ty = 1; ty < 3; ty++) for (let tx = 0; tx < 3; tx++) north.blit(A.tiles[wallFaces[ex.wing] || wallFaces.core], tx * 32, ty * 32);
      panel(north, 32, ex, col, ex.art || ex.mural);
      north.rect(0, 0, 96, 32, "#000000", 0); for (let tx = 0; tx < 3; tx++) north.blit(A.tiles[wallFaces[ex.wing] || wallFaces.core], tx * 32, 0);
      caseStrip(north, 0, ex, col, 1);
    }
    const pillar = new Sprite(96, 96);
    pillar.circle(48, 50, 40, "#000000", 90).circle(48, 48, 40, "#26232c").ring(48, 48, 40, GOLD, 255, 2).circle(48, 48, 33, "#0e1a26").circle(48, 48, 33, "#7ec3e8", 40);
    ART[kindOf(ex)](pillar, 48, 44, 2, col);
    pillar.circle(48, 48, 33, "#cde4f5", 18); pillar.line(24, 66, 60, 22, "#ffffff", 60);
    pillar.rect(24, 80, 48, 12, CARD).frame(24, 80, 48, 12, GOLD, 200); pillar.text(48, 83, "Nº " + String(ex.n).padStart(2, "0"), { align: "center", color: GOLD });
    kiosks[ch] = { S: A.add(south), N: A.add(north), P: A.add(pillar), kind: kindOf(ex) };
  }

  /* ---------- plaques, the title wall ---------- */
  const signs = {};
  const SHORT = { foyer: "THE FOYER", fail: "FAILURES", gov: "THE ROTUNDA", origins: "ORIGINS HALL", interp: "GLASS BRAIN", align: "GENIE ROOM", finale: "LAST ROOM", office: "OLD OFFICE", forecast: "FORECASTS", shop: "GIFT SHOP", newwing: "NEW WING", arcade: "THE ARCADE", mirrors: "MIRRORS", midway: "THE MIDWAY", workbench: "WORKBENCH" };
  for (const key in M.ZONES) {
    const s = new Sprite(96, 32), name = SHORT[key] || font.wrap(M.ZONES[key].name.replace(/^THE /, ""), 12, 1)[0];
    s.rect(2, 4, 92, 24, CARD).frame(2, 4, 92, 24, GOLD, 220).rect(6, 8, 20, 2, M.ZONES[key].color || GOLD);
    s.text(48, 13, name, { scale: name.length <= 11 ? 2 : 1, align: "center", color: INK });
    signs[key] = A.add(s);
  }
  const banner = (() => { const s = new Sprite(672, 32); s.rect(0, 0, 672, 32, "#221e1a").grain(5, 9).rect(0, 2, 672, 1, GOLD, 120).rect(0, 29, 672, 1, GOLD, 120); s.text(336, 6, "THE MUSEUM OF AI SAFETY", { scale: 4, align: "center", color: GOLD }); return A.add(s); })();
  const shopSign = (() => { const s = new Sprite(96, 32); s.rect(2, 4, 92, 24, GOLD).text(48, 9, "GET INVOLVED", { scale: 2, align: "center", color: CARD }).rect(2, 26, 92, 2, GOLD_DIM); return A.add(s); })();

  /* ---------- furniture and people ---------- */
  const bench = (() => { const s = new Sprite(96, 32); s.rect(6, 8, 84, 18, "#000000", 80).rect(4, 6, 88, 18, "#5a4630").rect(4, 6, 88, 2, "#7a6040"); for (let i = 0; i < 4; i++) s.rect(4, 10 + i * 4, 88, 1, "#3b2d1e"); s.rect(8, 24, 4, 4, GOLD_DIM).rect(84, 24, 4, 4, GOLD_DIM); return A.add(s); })();
  const plant = (() => { const s = new Sprite(32, 32); s.circle(16, 22, 8, "#000000", 70).rect(9, 18, 14, 10, "#b06a3c").rect(9, 18, 14, 2, "#c8804a"); for (const [x, y, r] of [[16, 12, 8], [9, 15, 5], [23, 15, 5], [12, 7, 4], [20, 7, 4]]) s.circle(x, y, r, "#4c7a40"); for (const [x, y, r] of [[13, 11, 3], [19, 13, 3]]) s.circle(x, y, r, "#5f9450"); return A.one(s); })();
  const stanchion = (() => { const s = new Sprite(96, 32); s.rect(0, 14, 96, 3, "#8c2f2a"); s.rect(0, 15, 96, 1, "#b8433a"); for (const x of [6, 86]) { s.circle(x, 16, 5, GOLD); s.circle(x, 16, 2, GOLD_DIM); } return A.add(s); })();
  function person(seed, back) {
    const R = mulberry(seed), skin = ["#f0d0b0", "#e2b184", "#c98d5f", "#a86f4a", "#7a4f33"][(R() * 5) | 0], shirt = ["#e9c46a", "#2a9d8f", "#e76f51", "#8e7dbe", "#3a6ea5", "#d64f7a", "#f2e9d8", "#118ab2"][(R() * 8) | 0], hair = ["#26201c", "#4a3826", "#7a6848", "#9a9aa2", "#b5651d", "#d9b26f"][(R() * 6) | 0];
    const s = new Sprite(32, 64); s.ellipse(16, 58, 9, 3, "#000000", 70);
    s.rect(11, 42, 4, 14, "#3c4250").rect(17, 42, 4, 14, "#3c4250").rect(10, 55, 5, 3, "#1d1c22").rect(17, 55, 5, 3, "#1d1c22");
    s.rect(7, 24, 18, 20, shirt).rect(4, 26, 4, 12, shirt).rect(24, 26, 4, 12, shirt).circle(5, 39, 2, skin).circle(26, 39, 2, skin);
    s.circle(16, 15, 8, skin); if (back) s.circle(16, 14, 8, hair); else { s.ellipse(16, 10, 8, 5, hair); s.rect(8, 10, 16, 3, hair); s.put(13, 16, "#1d1c22"); s.put(19, 16, "#1d1c22"); s.rect(14, 20, 4, 1, "#1d1c22"); }
    return s;
  }
  const visitors = [0, 1, 2, 3, 4, 5].map(i => A.add(person(700 + i * 31, true)));
  const visitorsFront = [0, 1, 2].map(i => A.add(person(900 + i * 17, false)));
  /* the office diorama: the pre-AI workplace */
  function desk(seed) {
    const s = new Sprite(64, 64), R = mulberry(seed), skin = ["#f0d0b0", "#e2b184", "#c98d5f", "#a86f4a", "#7a4f33"][(R() * 5) | 0], shirt = ["#eef1f5", "#c3d8ee", "#d5e3d0", "#e9dcc6", "#dfc9d8"][(R() * 5) | 0], hair = ["#26201c", "#4a3826", "#7a6848", "#9a9aa2"][(R() * 4) | 0];
    s.rect(4, 6, 56, 30, "#000000", 70).rect(2, 4, 56, 30, "#8a6a44").rect(2, 4, 56, 3, "#a07a4c").rect(4, 8, 52, 24, "#75552f");
    s.rect(20, 8, 20, 14, "#d9d4c4").rect(22, 10, 16, 10, "#3a4a5a").rect(24, 12, 12, 6, "#5aa0c8", 110).rect(27, 22, 6, 3, "#b0b0a8"); /* the monitor, deep as a suitcase */
    s.rect(8, 24, 22, 7, "#dcd8cc"); for (let i = 0; i < 5; i++) s.rect(10 + i * 4, 26, 2, 3, "#8a8a80"); /* keyboard */
    if (R() < 0.7) s.rect(42, 22, 12, 9, "#f4f2ec").rect(42, 22, 12, 1, "#9a927e"); /* papers */
    s.rect(44, 9, 12, 8, "#3a3a44").rect(46, 11, 8, 4, "#5a5a68"); /* landline phone */
    if (R() < 0.5) s.circle(12, 14, 3, "#e9e2d2").circle(12, 14, 2, "#5a3a20"); /* coffee */
    s.rect(18, 40, 26, 6, "#3c4250").rect(20, 46, 22, 14, "#3c4250").rect(22, 40, 18, 2, "#4c5260"); /* chair */
    s.rect(21, 44, 20, 14, shirt); s.circle(31, 41, 6, skin); s.circle(31, 40, 6, hair); /* the worker, seen from above, hunched at the screen */
    return s;
  }
  const desks = [11, 22, 33, 44, 55].map(seed => A.add(desk(seed)));
  const printer = (() => { const s = new Sprite(32, 32); s.rect(4, 8, 24, 18, "#d9d4c8").rect(4, 8, 24, 4, "#c6c1b4").rect(8, 3, 16, 6, "#f4f2ec").rect(10, 14, 12, 3, "#8a94a4").circle(24, 20, 2, "#3f9e5f").rect(6, 26, 20, 3, "#9a9a92"); return A.one(s); })();
  const copier = (() => { const s = new Sprite(64, 32); s.rect(2, 4, 60, 26, "#000000", 60).rect(0, 2, 60, 26, "#d9d4c8").rect(0, 2, 60, 6, "#c6c1b4").rect(6, 10, 34, 12, "#8a94a4").rect(8, 12, 30, 8, "#a8b2c0").rect(44, 10, 12, 12, "#3a3a44").circle(50, 16, 2, "#3f9e5f").rect(44, 24, 14, 3, "#f4f2ec"); return A.add(s); })();
  const cabinet = (() => { const s = new Sprite(32, 32); s.rect(6, 2, 20, 28, "#9aa4a2").rect(6, 2, 20, 3, "#4a4f52"); for (let i = 0; i < 3; i++) { s.rect(8, 7 + i * 8, 16, 6, "#87918f"); s.rect(13, 9 + i * 8, 6, 2, "#c2ccc9"); } s.rect(10, 0, 10, 4, "#f4f2ec"); return A.one(s); })();
  const cooler = (() => { const s = new Sprite(32, 32); s.circle(16, 26, 7, "#000000", 60).rect(9, 12, 14, 16, "#dfe3e6").rect(9, 12, 14, 3, "#c8ccd0").circle(16, 9, 7, "#6eb4e1").circle(14, 7, 2, "#ffffff", 140).rect(13, 22, 6, 3, "#3f9e5f"); return A.one(s); })();
  const coffee = (() => { const s = new Sprite(32, 32); s.rect(6, 4, 20, 24, "#2a2a30").rect(8, 6, 16, 8, "#4a4a55").rect(11, 16, 10, 8, "#e9e2d2").circle(16, 20, 3, "#5a3a20").rect(6, 26, 20, 2, "#8a8a92").circle(22, 10, 1.5, "#b8332a"); return A.one(s); })();
  const boxes = (() => { const s = new Sprite(32, 32); s.rect(3, 14, 26, 14, "#c9a86e").rect(3, 14, 26, 2, "#b08e52").rect(6, 3, 20, 11, "#c9a86e").rect(6, 3, 20, 2, "#b08e52"); s.text(16, 18, "A4", { align: "center", color: "#6a5836" }); return A.one(s); })();
  const partition = (() => { const s = new Sprite(96, 32); s.rect(0, 10, 96, 12, "#6f7278").rect(0, 10, 96, 2, "#8a8d94").rect(0, 20, 96, 2, "#4f5258"); for (let i = 6; i < 96; i += 12) s.rect(i, 13, 2, 2, "#b8332a", 140); return A.add(s); })();
  const whiteboard = (() => { const s = new Sprite(96, 32); s.rect(6, 4, 84, 22, "#f4f2ec").frame(6, 4, 84, 22, "#8a8f9a"); s.line(12, 20, 28, 12, "#b8332a"); s.line(28, 12, 44, 16, "#b8332a"); s.line(44, 16, 70, 8, "#2e5fd0"); s.rect(50, 20, 30, 1, "#26232c"); s.rect(54, 22, 20, 1, "#26232c"); return A.add(s); })();
  const clock = (() => { const s = new Sprite(32, 32); s.circle(16, 14, 9, "#f4f2ec").ring(16, 14, 9, "#26232c", 255, 1).line(16, 14, 16, 8, "#26232c").line(16, 14, 20, 16, "#26232c"); return A.one(s); })();
  /* the gift shop */
  const counter = (() => { const s = new Sprite(96, 32); s.rect(2, 8, 92, 22, "#000000", 70).rect(0, 6, 92, 22, "#8a6a44").rect(0, 6, 92, 3, "#a07a4c").rect(4, 12, 84, 12, "#e9e2d2"); s.text(46, 15, "GET INVOLVED", { align: "center", color: "#b8722c" }); s.rect(72, 2, 14, 8, "#4a5462"); return A.add(s); })();
  const totes = (() => { const s = new Sprite(32, 32); for (let i = 0; i < 3; i++) { s.rect(6 + i * 2, 20 - i * 6, 18, 8, "#efe6d2"); s.rect(6 + i * 2, 20 - i * 6, 18, 1, "#c8b898"); s.rect(12 + i * 2, 23 - i * 6, 6, 3, "#1d4fd0"); } return A.one(s); })();

  const shelf = (() => { const s = new Sprite(96, 32); s.rect(0, 0, 96, 32, "#221f25").rect(2, 6, 92, 20, "#5a4630").rect(2, 6, 92, 2, "#7a6040").rect(0, 15, 96, 2, "#3b2d1e"); const R = mulberry(9), cols = ["#2e5fd0", "#c8443f", "#12908c", "#e0993f", "#5a4fc9", "#1d74b8"]; for (const row of [7, 18]) for (let x = 6; x < 88; x += 8) s.rect(x, row, 6, 6, cols[(R() * cols.length) | 0]); s.rect(70, 24, 22, 7, "#ffffff").text(81, 25, "FREE", { align: "center", color: "#b8722c" }); return A.add(s); })();
  const vending = (() => { const s = new Sprite(96, 32); s.rect(0, 0, 96, 32, "#101014").frame(0, 0, 96, 32, GOLD).rect(4, 4, 56, 24, "#0a0b10"); const cols = ["#2e5fd0", "#63d6d0", "#b48ce8", "#ee6a5c", "#e2c46e", "#7ec3e8", "#3f9e5f", "#e0993f", "#c9ccd4", "#9b5de5"]; let k = 0; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) s.rect(7 + c * 11, 7 + r * 11, 8, 8, cols[k++ % cols.length]); s.rect(4, 4, 56, 24, "#cde4f5", 30); s.rect(66, 5, 24, 8, GOLD).text(78, 7, "GO", { align: "center", color: CARD }); s.rect(66, 16, 24, 11, "#26232c"); s.circle(78, 21, 3, "#3f9e5f"); return A.add(s); })();
  const fridge = (() => { const s = new Sprite(32, 32); s.rect(5, 2, 22, 28, "#000000", 60).rect(4, 1, 22, 28, "#e6e8ea").rect(4, 1, 22, 9, "#d5d8db").rect(4, 10, 22, 1, "#9a9ea2").rect(22, 4, 2, 4, "#7a7e82").rect(22, 14, 2, 8, "#7a7e82"); return A.one(s); })();
  const microwave = (() => { const s = new Sprite(32, 32); s.rect(3, 9, 26, 16, "#b8bcc0").rect(5, 11, 16, 12, "#2a2a30").rect(7, 13, 12, 8, "#3a4a5a").rect(23, 12, 4, 3, "#3f9e5f").rect(23, 17, 4, 4, "#8a8f9a"); return A.one(s); })();
  const chair = (() => { const s = new Sprite(32, 32); s.rect(8, 8, 16, 16, "#3c4250").rect(8, 6, 16, 4, "#4c5260").rect(10, 10, 12, 12, "#4a5062"); return A.one(s); })();
  const breaktable = (() => { const s = new Sprite(64, 64); s.circle(32, 34, 21, "#000000", 60).circle(32, 32, 20, "#8a6a44").circle(32, 32, 17, "#a07a4c"); for (const [x, y] of [[32, 6], [32, 58], [6, 32], [58, 32]]) { s.rect(x - 6, y - 6, 12, 12, "#3c4250"); s.rect(x - 4, y - 4, 8, 8, "#4a5062"); } s.circle(24, 28, 3, "#e9e2d2"); s.rect(36, 30, 8, 6, "#f4f2ec"); return A.add(s); })();
  const meetingtable = (() => { const s = new Sprite(128, 64); s.rect(16, 18, 96, 30, "#000000", 60).rect(14, 16, 96, 30, "#6b4a2b").rect(14, 16, 96, 3, "#8a6a44").rect(18, 20, 88, 22, "#7d5c33"); for (let i = 0; i < 3; i++) { for (const y of [4, 50]) { s.rect(24 + i * 32, y, 14, 10, "#3c4250"); s.rect(26 + i * 32, y + 2, 10, 6, "#4a5062"); } } s.rect(56, 27, 12, 8, "#3a3a44").circle(62, 31, 2, "#3f9e5f"); s.rect(28, 24, 10, 7, "#f4f2ec"); s.rect(84, 30, 10, 7, "#f4f2ec"); s.circle(40, 36, 3, "#e9e2d2"); return A.add(s); })();
  const bookshelf = (() => { const s = new Sprite(32, 32); s.rect(3, 2, 26, 28, "#5a4630").rect(3, 2, 26, 2, "#7a6040"); const cols = ["#b23a30", "#2e5fd0", "#3f9e5f", "#e0993f", "#5a4fc9", "#c9ccd4"]; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) s.rect(5 + i * 4, 5 + r * 13, 3, 10, cols[(i + r) % cols.length]); s.rect(3, 16, 26, 1, "#3b2d1e"); return A.one(s); })();
  const rack = (() => { const s = new Sprite(32, 32); s.rect(6, 1, 20, 30, "#26232c").frame(6, 1, 20, 30, "#4a4f52"); for (let r = 0; r < 6; r++) { s.rect(8, 4 + r * 4.5, 16, 3, "#3a3a44"); s.put(21, 5 + r * 4.5 | 0, r % 2 ? "#3f9e5f" : "#e0993f"); s.put(19, 5 + r * 4.5 | 0, "#3f9e5f"); } s.rect(10, 27, 12, 3, "#f4f2ec"); return A.one(s); })();
  const shredder = (() => { const s = new Sprite(32, 32); s.rect(7, 12, 18, 16, "#8a8f9a").rect(9, 6, 14, 6, "#b8bcc0").rect(11, 8, 10, 1, "#26232c"); for (let i = 0; i < 5; i++) s.rect(10 + i * 3, 14, 1, 12, "#f4f2ec", 200); return A.one(s); })();
  const mailcart = (() => { const s = new Sprite(32, 32); s.rect(5, 8, 22, 18, "#8a8f9a").rect(7, 10, 18, 14, "#5f6470"); for (let i = 0; i < 4; i++) s.rect(9 + i * 4, 12 + (i % 2) * 3, 5, 3, "#f4f2ec"); s.circle(8, 28, 2, "#26232c"); s.circle(24, 28, 2, "#26232c"); return A.one(s); })();
  const flipchart = (() => { const s = new Sprite(32, 32); s.rect(6, 4, 20, 24, "#f4f2ec").frame(6, 4, 20, 24, "#8a8f9a"); s.line(9, 20, 15, 12, "#b8332a"); s.line(15, 12, 22, 16, "#b8332a"); s.rect(9, 8, 14, 1, "#26232c"); s.rect(14, 28, 4, 3, "#5a4630"); return A.one(s); })();
  const reception = (() => { const s = new Sprite(96, 32); s.rect(2, 8, 92, 22, "#000000", 70).rect(0, 6, 92, 22, "#6b4a2b").rect(0, 6, 92, 3, "#8a6a44").rect(4, 12, 84, 12, "#e9e2d2"); s.text(46, 15, "RECEPTION", { align: "center", color: "#5a3a20" }); s.rect(70, 2, 12, 8, "#f4f2ec").rect(70, 2, 12, 1, "#9a927e"); s.rect(8, 1, 8, 8, "#3a3a44"); return A.add(s); })();
  const pigeonholes = (() => { const s = new Sprite(96, 32); s.rect(2, 2, 92, 28, "#5a4630"); for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) { s.rect(5 + c * 11, 5 + r * 8, 9, 6, "#3b2d1e"); if ((r * 8 + c) % 5 === 2) s.rect(7 + c * 11, 8 + r * 8, 5, 2, "#f4f2ec"); } return A.add(s); })();
  const bulletin = (() => { const s = new Sprite(96, 32); s.rect(4, 3, 88, 26, "#c8a060").frame(4, 3, 88, 26, "#6b4a2b"); const notes = [["#f4f2ec", 10, 7, 16, 12], ["#ffe08a", 30, 6, 12, 14], ["#f4f2ec", 46, 9, 18, 10], ["#a9d3f0", 68, 6, 14, 12], ["#ffb3b3", 84, 12, 6, 8]]; for (const [c, x, y, w, h] of notes) { s.rect(x, y, w, h, c); s.circle(x + w / 2, y, 1, "#b8332a"); for (let l = 0; l < h / 4 - 1; l++) s.rect(x + 2, y + 3 + l * 4, w - 4, 1, "#9a927e", 140); } return A.add(s); })();
  const screen = (() => { const s = new Sprite(96, 32); s.rect(6, 2, 84, 4, "#3a3a44"); s.rect(8, 6, 80, 24, "#f4f2ec"); s.line(16, 26, 40, 14, "#2e5fd0"); s.line(40, 14, 60, 20, "#2e5fd0"); s.line(60, 20, 82, 9, "#2e5fd0"); s.rect(14, 26, 70, 1, "#26232c"); return A.add(s); })();
  const windowDusk = (() => { const s = new Sprite(96, 32); s.rect(2, 1, 92, 30, "#3a2e24"); s.gradient(5, 4, 86, 24, "#e08e54", "#54345a"); s.circle(66, 12, 4, "#ffd696"); s.rect(47, 4, 2, 24, "#3a2e24"); s.rect(5, 15, 86, 2, "#3a2e24"); s.rect(5, 26, 86, 2, "#2a1f18"); return A.add(s); })();
  /* ---------- the street ---------- */
  const lamppost = (() => { const s = new Sprite(32, 64); s.ellipse(16, 60, 7, 3, "#000000", 70); s.rect(14, 14, 4, 46, "#2e3238"); s.rect(11, 58, 10, 4, "#2e3238"); s.rect(8, 8, 16, 8, "#3a3f46"); s.rect(10, 12, 12, 5, "#ffe8b4", 230); s.radial(16, 20, 16, "#ffe8b4", 70); return A.add(s); })();
  const postbox = (() => { const s = new Sprite(32, 32); s.ellipse(16, 29, 8, 3, "#000000", 70); s.rect(8, 8, 16, 21, "#a8231c"); s.ellipse(16, 9, 8, 5, "#c8322a"); s.rect(11, 13, 10, 2, "#26232c"); s.rect(10, 20, 12, 4, "#8a1f18"); return A.one(s); })();
  const phonebox = (() => { const s = new Sprite(32, 64); s.ellipse(16, 60, 10, 3, "#000000", 70); s.rect(5, 8, 22, 52, "#a8231c"); s.rect(8, 14, 16, 40, "#2a3038"); for (let j = 0; j < 4; j++) s.rect(8, 14 + j * 10, 16, 8, "#4a5866", 200); s.rect(5, 4, 22, 6, "#c8322a"); s.text(16, 5, "PHONE", { align: "center", color: "#f4f2ec" }); return A.add(s); })();
  const car = (() => { const s = new Sprite(64, 32); s.ellipse(32, 28, 26, 4, "#000000", 70); s.rect(6, 8, 52, 18, "#2e5fd0"); s.rect(14, 4, 36, 10, "#2e5fd0"); s.rect(17, 6, 30, 7, "#a9d3f0"); s.rect(6, 12, 52, 2, "#1d4fb0"); s.circle(14, 27, 4, "#1d1c22"); s.circle(50, 27, 4, "#1d1c22"); s.rect(4, 12, 3, 4, "#ffe8b4"); s.rect(57, 12, 3, 4, "#b23a30"); return A.add(s); })();
  const tree = (() => { const s = new Sprite(32, 64); s.ellipse(16, 60, 9, 4, "#000000", 70); s.rect(13, 38, 6, 22, "#6b4a2b"); for (const [x, y, r] of [[16, 26, 14], [8, 32, 9], [24, 32, 9], [16, 14, 10]]) s.circle(x, y, r, "#3f6a36"); for (const [x, y, r] of [[12, 22, 6], [21, 28, 5], [16, 12, 4]]) s.circle(x, y, r, "#4f8544"); return A.add(s); })();
  const bin = (() => { const s = new Sprite(32, 32); s.ellipse(16, 29, 7, 3, "#000000", 70); s.rect(10, 10, 12, 19, "#3f4a45"); s.rect(9, 8, 14, 3, "#56635d"); for (let j = 13; j < 28; j += 4) s.rect(10, j, 12, 1, "#2e3733"); return A.one(s); })();
  const busstop = (() => { const s = new Sprite(96, 64); s.rect(4, 10, 88, 6, "#3a3f46"); s.rect(6, 16, 4, 44, "#3a3f46"); s.rect(86, 16, 4, 44, "#3a3f46"); s.rect(12, 18, 72, 30, "#a9d3f0", 60); s.rect(12, 48, 72, 8, "#5a4630"); s.rect(30, 2, 36, 10, "#b23a30"); s.text(48, 4, "BUS", { align: "center", color: "#f4f2ec", scale: 2 }); return A.add(s); })();
  const planter = (() => { const s = new Sprite(32, 32); s.rect(6, 16, 20, 13, "#8a7a5c"); s.rect(6, 16, 20, 2, "#a89870"); for (const [x, y, r] of [[12, 12, 6], [20, 11, 6], [16, 7, 5]]) s.circle(x, y, r, "#3f6a36"); return A.one(s); })();
  /* ---------- the waiting room ---------- */
  const chairrow = (() => { const s = new Sprite(96, 32); s.rect(4, 22, 88, 5, "#3a3f46"); for (let i = 0; i < 3; i++) { const x = 6 + i * 30; s.rect(x, 10, 26, 12, "#2e5fd0"); s.rect(x, 6, 26, 5, "#1d4fb0"); s.rect(x + 2, 12, 22, 9, "#3a6ae0"); } s.rect(6, 27, 6, 4, "#2e3238"); s.rect(84, 27, 6, 4, "#2e3238"); return A.add(s); })();
  const ticketmachine = (() => { const s = new Sprite(32, 32); s.ellipse(16, 29, 8, 3, "#000000", 70); s.rect(8, 4, 17, 25, "#b8332a"); s.rect(10, 7, 13, 9, "#f4f2ec"); s.text(16, 9, "TAKE", { align: "center", color: "#8a1f18" }); s.rect(11, 19, 11, 3, "#26232c"); s.rect(12, 22, 9, 5, "#f4f2ec"); return A.one(s); })();
  const nowserving = (() => { const s = new Sprite(96, 32); s.rect(4, 4, 88, 24, "#0d1220"); s.frame(4, 4, 88, 24, "#7ec3e8", 200); s.text(26, 9, "NOW SERVING", { color: "#7ec3e8" }); s.rect(62, 8, 26, 16, "#1a2230"); s.text(75, 12, "47", { align: "center", color: "#e8c76a", scale: 2 }); return A.add(s); })();
  const magtable = (() => { const s = new Sprite(32, 32); s.ellipse(16, 26, 12, 4, "#000000", 60); s.rect(5, 10, 22, 14, "#8a6a44"); s.rect(5, 10, 22, 2, "#a07a4c"); s.rect(8, 14, 9, 7, "#f4f2ec"); s.rect(17, 13, 8, 7, "#e8c76a"); return A.one(s); })();
  /* ---------- the memory wing ---------- */
  const cardcat = (() => { const s = new Sprite(64, 32); s.rect(2, 4, 60, 25, "#6b4a2b"); s.rect(2, 4, 60, 2, "#8a6a44"); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { s.rect(5 + c * 11.5, 8 + r * 7, 10, 6, "#5a3f24"); s.rect(8 + c * 11.5, 10 + r * 7, 4, 2, "#c9ccd4"); } return A.add(s); })();
  const phoneshelf = (() => { const s = new Sprite(32, 32); s.rect(4, 4, 24, 25, "#5a4630"); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) s.rect(6 + i * 5, 6 + r * 8, 4, 7, ["#e0d8b8", "#c8a03c", "#d8cdb0", "#b8ac8c"][i % 4]); s.rect(4, 13, 24, 1, "#3b2d1e"); s.rect(4, 21, 24, 1, "#3b2d1e"); return A.one(s); })();
  const globe = (() => { const s = new Sprite(32, 32); s.ellipse(16, 29, 7, 3, "#000000", 60); s.rect(14, 22, 4, 7, "#6b4a2b"); s.rect(10, 28, 12, 3, "#6b4a2b"); s.circle(16, 14, 10, "#2e5fd0"); s.ellipse(11, 11, 4, 3, "#3f8a44"); s.ellipse(20, 16, 5, 4, "#3f8a44"); s.ring(16, 14, 11, "#c8a03c", 200, 1); return A.one(s); })();
  const atlastable = (() => { const s = new Sprite(64, 32); s.rect(3, 7, 58, 22, "#000000", 60); s.rect(2, 5, 58, 22, "#8a6a44"); s.rect(2, 5, 58, 3, "#a07a4c"); s.rect(10, 10, 42, 14, "#e8e2d0"); for (let i = 14; i < 52; i += 8) s.rect(i, 10, 1, 14, "#b8b2a0"); s.line(14, 20, 28, 13, "#b23a30"); s.line(28, 13, 44, 18, "#b23a30"); return A.add(s); })();
  /* ---------- the verification desk ---------- */
  const queuebarrier = (() => { const s = new Sprite(96, 32); s.rect(0, 14, 96, 3, "#8a1f18"); s.rect(0, 15, 96, 1, "#c8322a"); for (const x of [4, 48, 92]) { s.ellipse(x, 26, 6, 3, "#000000", 60); s.rect(x - 2, 10, 4, 16, "#8a8f9a"); s.circle(x, 9, 3, "#c9ccd4"); } return A.add(s); })();
  const scanner = (() => { const s = new Sprite(32, 32); s.rect(6, 6, 20, 22, "#2c313b"); s.frame(6, 6, 20, 22, "#8a8f9a"); s.rect(9, 9, 14, 10, "#0d1a22"); s.rect(9, 9, 14, 10, "#3f9e5f", 90); s.rect(10, 13, 12, 1, "#8fe8ae"); s.circle(16, 23, 2, "#b23a30"); return A.one(s); })();
  const cctv = (() => { const s = new Sprite(32, 32); s.rect(12, 6, 4, 6, "#3a3f46"); s.rect(6, 12, 20, 9, "#4a5058"); s.rect(4, 14, 4, 5, "#26232c"); s.circle(7, 16, 1.5, "#a9d3f0"); s.circle(22, 15, 1.5, "#b23a30"); return A.one(s); })();
  const idbooth = (() => { const s = new Sprite(96, 32); s.rect(2, 8, 92, 22, "#000000", 70); s.rect(0, 6, 92, 22, "#2c313b"); s.rect(0, 6, 92, 3, "#3c424c"); s.rect(6, 12, 30, 12, "#0d1a22"); s.rect(8, 14, 26, 8, "#7ec3e8", 70); s.rect(44, 12, 20, 12, "#f4f2ec"); s.rect(70, 11, 16, 14, "#3a3f46"); s.circle(78, 18, 4, "#8fe8ae"); return A.add(s); })();
  /* ---------- the off switch gallery ---------- */
  const bigbutton = (() => { const s = new Sprite(64, 64); s.ellipse(32, 58, 24, 6, "#000000", 80); s.rect(14, 34, 36, 24, "#2c313b"); s.rect(12, 30, 40, 6, "#3c424c"); for (let i = -12; i < 40; i += 10) for (let j = 0; j < 6; j++) s.line(14 + i + j, 40, 22 + i + j, 50, j < 3 ? "#e8c76a" : "#26232c"); s.rect(14, 34, 36, 2, "#1a1d24"); s.circle(32, 24, 15, "#8a1f18"); s.circle(32, 22, 13, "#c8322a"); s.circle(26, 17, 4, "#e8665c", 200); s.ring(32, 23, 17, "#c9ccd4", 220, 2); return A.add(s); })();
  const switchbank = (() => { const s = new Sprite(96, 32); s.rect(4, 4, 88, 24, "#2c313b"); s.frame(4, 4, 88, 24, "#8a8f9a", 220); for (let i = 0; i < 7; i++) { const x = 10 + i * 12; s.rect(x, 8, 8, 16, "#1a1d24"); s.rect(x + 1, i % 3 === 0 ? 10 : 17, 6, 6, i % 3 === 0 ? "#3f9e5f" : "#b23a30"); } return A.add(s); })();
  const caged = (() => { const s = new Sprite(32, 32); s.rect(4, 4, 24, 24, "#1a1d24"); s.frame(4, 4, 24, 24, "#8a8f9a"); s.circle(16, 16, 7, "#8a1f18"); s.circle(16, 15, 6, "#c8322a"); for (let i = 7; i < 28; i += 5) { s.rect(i, 4, 1, 24, "#c9ccd4", 190); s.rect(4, i, 24, 1, "#c9ccd4", 190); } return A.one(s); })();
  /* ---------- signage ---------- */
  const SUB = { foyer: "ADMISSION FREE", fail: "SMALL INSTRUCTIVE DISASTERS", gov: "WHO DECIDES", origins: "HOW THE WORRY BEGAN", interp: "LOOKING INSIDE", align: "SAYING WHAT WE MEAN", finale: "THE UNFINISHED EXHIBIT", office: "WORK BEFORE AI", forecast: "WHEN, AND HOW FAST", shop: "TAKE SOMETHING FREE",
    newwing: "YOURS TO CURATE", arcade: "GAMES ABOUT WANTING THINGS", mirrors: "BIAS, PLAYABLE", midway: "STEP RIGHT UP", workbench: "INSTRUMENTS YOU CAN USE", officefloor: "A WORKING EXHIBIT", highstreet: "TRADES THAT CHANGED", waiting: "WHEN THINGS TOOK TIME", memory: "WHAT WE USED TO KNOW BY HEART", verify: "PROVING IT IS REAL", offswitch: "CAN WE STILL STOP IT" };
  const bigSigns = {};
  for (const key in M.ZONES) {
    const z = M.ZONES[key], s = new Sprite(96, 64), name = (SHORT[key] || z.name.replace(/^THE /, "")).toUpperCase();
    s.rect(2, 4, 92, 54, "#000000", 90).rect(4, 6, 88, 50, CARD).frame(4, 6, 88, 50, GOLD, 235).frame(6, 8, 84, 46, GOLD, 70);
    s.rect(10, 12, 76, 3, z.color || GOLD);
    const nl = font.wrap(name, 12, 2);
    nl.forEach((l, i) => s.text(48, 20 + i * 12 + (2 - nl.length) * 5, l, { scale: 2, align: "center", color: INK }));
    s.rect(20, 44, 56, 1, GOLD, 120);
    s.text(48, 47, font.wrap(SUB[key] || "", 26, 1)[0], { align: "center", color: INK_DIM });
    bigSigns[key] = A.add(s);
  }
  const directoryBoard = (() => { const s = new Sprite(96, 64); s.rect(2, 4, 92, 56, "#000000", 90).rect(4, 6, 88, 52, CARD).frame(4, 6, 88, 52, GOLD, 235);
    s.text(48, 11, "MUSEUM", { scale: 2, align: "center", color: GOLD }); s.text(48, 23, "DIRECTORY", { scale: 2, align: "center", color: GOLD });
    s.rect(16, 34, 64, 1, GOLD, 140);
    const names = ["FAILURES", "ROTUNDA", "ORIGINS", "GLASS BRAIN", "GENIE ROOM"];
    names.forEach((n, i) => { s.text(14, 39 + i * 4.2, n, { color: INK_DIM }); s.rect(78, 40 + i * 4.2, 4, 1, GOLD, 160); });
    s.text(48, 56, "PRESS SPACE", { align: "center", color: INK }); return A.add(s); })();
  const wayArrow = (() => { const s = new Sprite(32, 32); s.rect(2, 10, 28, 12, CARD).frame(2, 10, 28, 12, GOLD, 200); for (let i = 0; i < 6; i++) s.rect(20 + i, 16 - i, 1, 1 + i * 2, GOLD); s.rect(8, 15, 12, 2, GOLD); return A.one(s); })();
  const png = A.png();
  const out = path.join(__dirname, "..", "tilesets", "museum.png");
  fs.writeFileSync(out, png);
  return { atlas: A, T, floors, wallFaces, kiosks, signs, banner, shopSign, art: ART, LIGHT, LIGHT_SOFT, SHADOW, THRESH, bench, plant, stanchion, visitors, visitorsFront,
    office: { desks, printer, copier, cabinet, cooler, coffee, boxes, partition, whiteboard, clock, fridge, microwave, chair, breaktable, meetingtable, bookshelf, rack, shredder, mailcart, flipchart, reception, pigeonholes, bulletin, screen, window: windowDusk },
    shop: { counter, totes, shelf, vending }, floorStyles, bigSigns, directoryBoard, wayArrow,
    street: { lamppost, postbox, phonebox, car, tree, bin, busstop, planter },
    waiting: { chairrow, ticketmachine, nowserving, magtable },
    memory: { cardcat, phoneshelf, globe, atlastable },
    verify: { queuebarrier, scanner, cctv, idbooth },
    offswitch: { bigbutton, switchbank, caged }, cols: A.cols, width: A.width, height: A.height, tileCount: A.tiles.length, file: "../tilesets/museum.png" };
};

if (require.main === module) {
  const M = require("./exhibits-index.cjs")();
  const t = module.exports(M);
  console.log("wrote tilesets/museum.png", t.width + "x" + t.height, t.tileCount, "tiles");
}
