#!/usr/bin/env node
/* Renders a map to a PNG so the dressing can be judged without Tiled.
   Reads the finished tileset from disk, so it shows every tile the
   converter added: node scripts/preview.cjs core [out.png] [divisor] */
"use strict";
const fs = require("fs"), path = require("path");
const { encodePNG, decodePNG, SIZE } = require("./paint.cjs");
const name = process.argv[2] || "core", D = +(process.argv[4] || 4);
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "maps", name + ".tmj"), "utf8"));
const ts = decodePNG(fs.readFileSync(path.join(__dirname, "..", "tilesets", "museum.png")));
const src = ts.px, SW = ts.w, COLS = ts.w / SIZE;
const W = map.width * SIZE / D | 0, H = map.height * SIZE / D | 0, out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) { out[i * 4] = 8; out[i * 4 + 1] = 8; out[i * 4 + 2] = 10; out[i * 4 + 3] = 255; }
for (const l of map.layers) {
  if (l.type !== "tilelayer" || /^(collisions|zone-|start)/.test(l.name)) continue;
  for (let ty = 0; ty < l.height; ty++) for (let tx = 0; tx < l.width; tx++) {
    const g = l.data[ty * l.width + tx]; if (!g) continue;
    const id = g - 1, sx = (id % COLS) * SIZE, sy = Math.floor(id / COLS) * SIZE;
    for (let j = 0; j < SIZE / D; j++) for (let i = 0; i < SIZE / D; i++) {
      const si = ((sy + j * D) * SW + (sx + i * D)) * 4, a = src[si + 3] / 255; if (!a) continue;
      const di = ((ty * SIZE / D + j) * W + (tx * SIZE / D + i)) * 4;
      for (let c = 0; c < 3; c++) out[di + c] = src[si + c] * a + out[di + c] * (1 - a);
    }
  }
}
const dest = process.argv[3] || path.join(__dirname, "..", "maps", name + "-preview.png");
fs.writeFileSync(dest, encodePNG(out, W, H)); console.log("wrote", dest, W + "x" + H);
