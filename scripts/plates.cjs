#!/usr/bin/env node
/* One plate per exhibit for the placard pages: the object from "in the
   case" lit and photographed under glass, or the painting itself for the
   art exhibits. Writes placards/art/<folder>/<slug>.png. */
"use strict";
const fs = require("fs"), path = require("path");
const { Sprite, encodePNG, font } = require("./paint.cjs");
const scenes = require("./scenes.cjs");
const GOLD = "#e9b949", CARD = "#141318", INK_DIM = "#9a927e";
const W = 640, H = 400;

module.exports = function plates(M, TS) {
  const root = path.join(__dirname, "..", "placards", "art");
  let n = 0;
  for (const ch in M.exhibits) {
    const ex = M.exhibits[ch], s = new Sprite(W, H), col = ex.color || GOLD;
    if ((ex.art || ex.mural) && scenes[ch]) {
      /* a painting, hung and lit */
      s.gradient(0, 0, W, H, "#2c2620", "#181310");
      s.radial(W / 2, 30, 460, "#ffefc8", 60);
      const fx = 26, fy = 22, fw = W - 52, fh = H - 44;
      s.rect(fx + 8, fy + 10, fw, fh, "#000000", 120);
      s.rect(fx, fy, fw, fh, "#7a6030"); s.rect(fx + 8, fy + 8, fw - 16, fh - 16, "#c8aa64"); s.rect(fx + 18, fy + 18, fw - 36, fh - 36, "#5e4a24");
      scenes[ch](s, fx + 26, fy + 26, fw - 52, fh - 52);
      s.rect(fx + 26, fy + 26, fw - 52, 40, "#ffffff", 16);
      for (const [px, py] of [[fx + 8, fy + 8], [fx + fw - 8, fy + 8], [fx + 8, fy + fh - 8], [fx + fw - 8, fy + fh - 8]]) s.circle(px, py, 8, "#dcc07c");
    } else {
      /* an object, in a case, on a plinth */
      s.gradient(0, 0, W, H, "#262430", "#101017");
      s.radial(W / 2, 20, 480, "#ffefc8", 70);
      s.rect(0, 316, W, H - 316, "#2e2b36"); s.rect(0, 316, W, 3, GOLD, 150); s.rect(0, 322, W, 2, "#000000", 60);
      const cx = 54, cy = 34, cw = W - 108, chh = 268;
      s.rect(cx + 10, cy + 12, cw, chh, "#000000", 120);
      s.gradient(cx, cy, cw, chh, "#1d2b39", "#0f1a24");
      s.radial(W / 2, cy + 46, 300, "#cfe6f5", 46);
      s.radial(W / 2, cy + chh - 26, 220, "#000000", 70);
      TS.art[TS.kiosks[ch].kind](s, W / 2, cy + chh / 2 - 12, 10, col);
      s.ellipse(W / 2, cy + chh - 30, 120, 16, "#000000", 70);          /* the object's shadow on the case floor */
      s.rect(cx, cy, cw, chh, "#cfe6f5", 16);                            /* glass */
      for (let i = 0; i < 5; i++) s.line(cx + 26 + i, cy + chh - 14, cx + 170 + i, cy + 10, "#ffffff", 55 - i * 8);
      s.frame(cx, cy, cw, chh, GOLD, 240); s.frame(cx + 1, cy + 1, cw - 2, chh - 2, GOLD, 140); s.frame(cx + 5, cy + 5, cw - 10, chh - 10, "#cde4f5", 70);
      s.rect(W / 2 - 108, 332, 216, 44, CARD); s.frame(W / 2 - 108, 332, 216, 44, GOLD, 230); s.frame(W / 2 - 105, 335, 210, 38, GOLD, 80);
      s.text(W / 2, 342, "EXHIBIT Nº " + String(ex.n).padStart(2, "0"), { scale: 3, align: "center", color: GOLD });
      s.rect(W / 2 - 90, 384, 180, 3, col);
    }
    const dir = path.join(root, ex.folder); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, ex.slug + ".png"), encodePNG(s.px, W, H)); n++;
  }
  return n;
};
if (require.main === module) {
  const M = require("./exhibits-index.cjs")(); const TS = require("./tileset.cjs")(M);
  console.log("plates:", module.exports(M, TS), "at " + W + "x" + H);
}
