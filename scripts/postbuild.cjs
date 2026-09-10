#!/usr/bin/env node
/* After the map optimizer has written dist/, copy in everything else the
   world serves: placards, the board and mural pages, and an index page. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), DIST = path.join(ROOT, "dist");
fs.cpSync(path.join(ROOT, "placards"), path.join(DIST, "placards"), { recursive: true });
const base = (process.env.PLACARDS_BASE || (fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^PLACARDS_BASE=(.*)$/m) || [])[1] || "https://world.aisafety.museum").trim().replace(/\/$/, "");
const host = base.replace(/^https?:\/\//, "");
const play = `https://play.workadventu.re/_/global/${host}/maps/core.tmj`;
fs.writeFileSync(path.join(DIST, "index.html"), `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=${play}"><title>The Museum of AI Safety</title></head><body style="background:#0b0b0e;color:#ece5d3;font-family:Avenir Next,Helvetica,Arial,sans-serif;padding:40px"><p>Walking you in: <a style="color:#e9b949" href="${play}">${play}</a></p></body></html>`);
console.log("dist ready · play address:", play);
