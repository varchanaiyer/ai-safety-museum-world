#!/usr/bin/env node
/* One plate per exhibit for the placard pages: the object from "in the
   case" photographed under glass, or the painting itself for art exhibits.
   Writes placards/art/<folder>/<slug>.png. Run after build-placards. */
"use strict";
const fs = require("fs"), path = require("path");
const { Sprite, encodePNG, font } = require("./paint.cjs");
const scenes = require("./scenes.cjs");
const GOLD = "#e9b949", CARD = "#141318";
module.exports = function plates(M, TS) {
  const W = 480, H = 270, root = path.join(__dirname, "..", "placards", "art");
  let n = 0;
  for (const ch in M.exhibits) {
    const ex = M.exhibits[ch], s = new Sprite(W, H), col = ex.color || GOLD;
    if ((ex.art || ex.mural) && scenes[ch]) {
      s.gradient(0, 0, W, H, "#2a2420", "#181410"); s.radial(W / 2, H / 2, 300, "#ffefc8", 40);
      s.rect(22, 18, W - 44, H - 36, "#000000", 120).rect(18, 14, W - 36, H - 28, "#7a6030").rect(24, 20, W - 48, H - 40, "#baa060").rect(30, 26, W - 60, H - 52, "#5e4a24");
      scenes[ch](s, 36, 32, W - 72, H - 64);
      for (const [x, y] of [[18, 14], [W - 18, 14], [18, H - 14], [W - 18, H - 14]]) s.circle(x, y, 6, "#ceaa60");
    } else {
      s.gradient(0, 0, W, H, "#1c1b21", "#0b0b0e"); s.radial(W / 2, 96, 260, "#ffefc8", 60);
      s.rect(0, 200, W, 70, "#26232c"); s.rect(0, 200, W, 2, GOLD, 120);
      s.rect(62, 214, W - 124, 30, "#000000", 90).rect(60, 60, W - 120, 152, "#0e1a26").rect(60, 60, W - 120, 152, "#7ec3e8", 34).frame(60, 60, W - 120, 152, GOLD, 220).frame(62, 62, W - 124, 148, "#cde4f5", 60);
      TS.art[TS.kiosks[ch].kind](s, W / 2, 140, 5, col);
      s.rect(60, 60, W - 120, 152, "#cde4f5", 14); s.line(70, 200, 150, 70, "#ffffff", 50); s.line(76, 200, 156, 70, "#ffffff", 30);
      s.rect(W / 2 - 70, 222, 140, 26, CARD).frame(W / 2 - 70, 222, 140, 26, GOLD, 220);
      s.text(W / 2, 226, "EXHIBIT Nº " + String(ex.n).padStart(2, "0"), { scale: 2, align: "center", color: GOLD });
      s.rect(W / 2 - 20, 250, 40, 2, col);
    }
    const dir = path.join(root, ex.folder); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, ex.slug + ".png"), encodePNG(s.px, W, H)); n++;
  }
  return n;
};
if (require.main === module) {
  const M = require("./exhibits-index.cjs")(); const TS = require("./tileset.cjs")(M);
  console.log("plates:", module.exports(M, TS));
}
