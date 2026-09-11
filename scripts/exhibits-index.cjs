/* Loads the museum's content the way the museum itself does (manifest first,
   every content file in order, the room composer last) and returns everything
   the converter and the placard builder need: the composed grid, the exhibit
   registry with hall folders and slugs, halls, shop, rooms. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

function kebab(s) { return s.toLowerCase().replace(/[’'"“”]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

module.exports = function loadMuseum(root) {
  root = root || path.join(__dirname, "..");
  const ctx = { console }; vm.createContext(ctx);
  const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
  run("manifest.js");
  const files = vm.runInContext("CONTENT_FILES", ctx);
  for (const f of files) if (!f.endsWith("compose.js")) run(f);
  const coreMap = vm.runInContext("MAP.slice()", ctx);
  const coreW = vm.runInContext("MW", ctx), coreH = vm.runInContext("MH", ctx);
  /* which file registered which core character */
  const fileOf = {};
  for (const f of files) if (f.startsWith("exhibits/")) {
    const m = fs.readFileSync(path.join(root, f), "utf8").match(/EXHIBIT\("(.)"/);
    if (m) fileOf[m[1]] = f;
  }
  const rooms = vm.runInContext("ROOMS.map(r => ({ key: r.key, name: r.name, color: r.color, map: r.map.slice(), exhibits: Object.keys(r.exhibits || {}), props: r.props || [], wall: r.wall || [], floors: r.floors || null, floorKey: r.floorKey || {} }))", ctx);
  for (const f of files) if (f.endsWith("compose.js")) run(f);
  const composed = vm.runInContext("({ MAP: MAP.slice(), MW, MH, ROOMRECTS: ROOMRECTS.slice(), HALLORDER: HALLORDER.slice() })", ctx);
  const EXHIBITS = vm.runInContext("EXHIBITS", ctx), ZONES = vm.runInContext("ZONES", ctx), WINGNAME = vm.runInContext("WINGNAME", ctx);
  const SHOP = vm.runInContext("SHOP", ctx), BOARDROWS = vm.runInContext("BOARDROWS", ctx), WAYPOINTS = vm.runInContext("WAYPOINTS", ctx);
  const zoneAt = (x, y) => vm.runInContext("zoneAt(" + (x | 0) + "," + (y | 0) + ")", ctx);

  const hallFolder = {};
  for (const f of files) if (f.startsWith("exhibits/")) { const [, folder] = f.split("/"); const m = fs.readFileSync(path.join(root, f), "utf8").match(/EXHIBIT\("(.)"/); if (m) hallFolder[EXHIBITS[m[1]].wing] = folder; }
  const exhibits = {};
  for (const ch in EXHIBITS) {
    const e = EXHIBITS[ch];
    const isRoom = !!rooms.find(r => r.key === e.wing);
    const folder = isRoom ? e.wing : (hallFolder[e.wing] || kebab(WINGNAME[e.wing] || e.wing));
    const slug = fileOf[ch] ? path.basename(fileOf[ch], ".js") : kebab(e.t);
    exhibits[ch] = { ch, n: e.n, wing: e.wing, wingName: WINGNAME[e.wing] || e.wing, color: (ZONES[e.wing] || {}).color, folder, slug,
      t: e.t, obj: e.obj, body: e.body, q: e.q || "", url: e.url || "", cta: e.cta || "", embed: !!e.embed, linkLabel: e.linkLabel || "", art: !!e.art, mural: !!e.mural };
  }
  const total = Object.keys(exhibits).length;
  return { root, files, coreMap, coreW, coreH, composed, rooms, exhibits, total, ZONES, WINGNAME, SHOP, BOARDROWS, WAYPOINTS, zoneAt, kebab };
};
