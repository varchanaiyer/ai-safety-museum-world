#!/usr/bin/env node
/* Turns every exhibit file into a placard page for WorkAdventure's side
   panel, plus the directory, the gift-shop catalogue, and the pages the
   departures board and the mural are drawn on. Run: node scripts/build-placards.cjs */
"use strict";
const fs = require("fs"), path = require("path");
const load = require("./exhibits-index.cjs");
const ROOT = path.join(__dirname, "..");
const M = load(ROOT);
const OUT = path.join(ROOT, "placards");
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const list = Object.values(M.exhibits).sort((a, b) => a.n - b.n);
const byN = {}; for (const e of list) byN[e.n] = e;
const rel = e => "../" + e.folder + "/" + e.slug + ".html";

const CSS = `
:root{--gold:#e9b949;--gold-dim:#96793c;--ink:#ece5d3;--ink-dim:#9a927e;--bg:#0b0b0e;--card:#141318;
  --serif:"Avenir Next",Avenir,Futura,"Segoe UI","Helvetica Neue",Arial,sans-serif;--caps:ui-sans-serif,-apple-system,"Helvetica Neue",Arial,sans-serif}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--serif);min-height:100%}
body{padding:22px 18px 40px}
.card{max-width:640px;margin:0 auto;background:var(--card);border:1px solid #2b2a30;outline:1px solid rgba(233,185,73,.28);outline-offset:6px;padding:34px 36px 28px}
.wingchip{font-family:var(--caps);font-size:9px;letter-spacing:.4em;text-transform:uppercase;margin-bottom:12px;font-weight:600}
.num{font-family:var(--caps);font-size:10px;letter-spacing:.3em;color:var(--ink-dim);text-transform:uppercase}
h1{font-size:28px;font-weight:500;line-height:1.2;margin:10px 0 4px}
.obj{font-style:italic;color:var(--ink-dim);font-size:14.5px;margin:16px 0 4px;padding-left:14px;border-left:2px solid var(--gold-dim);line-height:1.5}
.obj b{font-style:normal;font-family:var(--caps);font-size:9px;letter-spacing:.3em;color:var(--gold);display:block;margin-bottom:4px;text-transform:uppercase}
p{font-size:15.5px;line-height:1.72;color:#cfc9bb;margin:16px 0 0}
blockquote{margin:20px 0 0;font-style:italic;color:var(--gold);font-size:14.5px;line-height:1.6;text-align:center;padding:0 12px}
.btn{display:inline-block;margin-top:22px;font-family:var(--caps);font-size:10px;letter-spacing:.25em;color:var(--gold);border:1px solid var(--gold-dim);padding:11px 20px;text-decoration:none;text-transform:uppercase;background:none;cursor:pointer}
.btn:hover{background:rgba(233,185,73,.08)}
.foot{margin-top:28px;padding-top:14px;border-top:1px solid #26252b;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font-family:var(--caps);font-size:9.5px;letter-spacing:.22em;color:var(--ink-dim);text-transform:uppercase}
.foot a{color:var(--ink);text-decoration:none}.foot a:hover{color:var(--gold)}
.seen b{color:var(--gold);font-weight:600}
.plate{width:100%;display:block;margin-top:18px;border:1px solid #2b2a30;image-rendering:pixelated;image-rendering:crisp-edges}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:10px}
.item{display:flex;gap:10px;align-items:baseline;padding:9px 11px;border:1px solid #26252b;text-decoration:none;color:#cfc9bb;font-size:14px;line-height:1.35}
.item:hover{border-color:var(--gold-dim)}.item .no{font-family:var(--caps);font-size:9px;letter-spacing:.1em;color:var(--ink-dim);min-width:20px}
.hallhead{font-family:var(--caps);font-size:10px;letter-spacing:.3em;text-transform:uppercase;margin:22px 0 8px;display:flex;align-items:center;gap:10px}
.hallhead::after{content:"";flex:1;height:1px;background:#26252b}
.item.seen{border-color:rgba(216,180,106,.35)}.item.seen .no{color:var(--gold)}
`;

/* the bridge to WorkAdventure: records the visit, opens playable exhibits in the panel */
const API = (ex) => `
<script src="https://play.workadventu.re/iframe_api.js"></script>
<script>
(function(){
  var EX=${JSON.stringify({ n: ex ? ex.n : 0, total: M.total, url: ex ? ex.url : "", embed: ex ? ex.embed : false })};
  var inWA=false;
  var ready=new Promise(function(res){ var done=false; var fin=function(){ if(!done){done=true;res();} };
    if(window.WA&&WA.onInit){ WA.onInit().then(function(){inWA=true;fin();}).catch(fin); } setTimeout(fin,1500); });
  ready.then(function(){
    var seenEl=document.getElementById("seen"), seen=[];
    if(inWA){ try{ var s=WA.player.state.seen; seen=Array.isArray(s)?s.slice():[]; if(EX.n&&seen.indexOf(EX.n)<0){ seen.push(EX.n); WA.player.state.saveVariable("seen",seen,{persist:true,public:false,scope:"world"}); } }catch(e){} }
    else { try{ seen=JSON.parse(localStorage.getItem("museum-seen")||"[]"); if(EX.n&&seen.indexOf(EX.n)<0){seen.push(EX.n);localStorage.setItem("museum-seen",JSON.stringify(seen));} }catch(e){} }
    if(seenEl) seenEl.innerHTML="<b>"+seen.length+"</b> / "+EX.total+" seen";
    document.querySelectorAll("[data-seen]").forEach(function(el){ if(seen.indexOf(+el.getAttribute("data-seen"))>=0) el.classList.add("seen"); });
    var play=document.getElementById("play");
    if(play){ play.addEventListener("click",function(ev){ if(inWA&&EX.embed){ ev.preventDefault(); try{ WA.nav.openCoWebSite(EX.url,false,"fullscreen",70,1,true); }catch(e){ window.open(EX.url,"_blank"); } } }); }
  });
})();
</script>`;

function page(title, body, ex) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · The Museum of AI Safety</title><style>${CSS}</style></head>
<body><div class="card">${body}</div>${API(ex)}</body></html>`;
}

for (const f of fs.readdirSync(OUT, { withFileTypes: true }).filter(f => !["art", "map", "map.html"].includes(f.name))) fs.rmSync(path.join(OUT, f.name), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
let written = 0;
for (const e of list) {
  const prev = byN[((e.n - 2 + M.total) % M.total) + 1], next = byN[(e.n % M.total) + 1];
  const link = e.url ? (e.embed
    ? `<a id="play" class="btn" href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.cta || "PLAY")} · without leaving the museum</a>`
    : `<a class="btn" href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.linkLabel || ((e.cta || "LEARN MORE") + " · " + e.url.replace(/^https?:\/\//, "").replace(/^www\./, "").toUpperCase() + " ↗"))}</a>`) : "";
  const body = `
  <div class="wingchip" style="color:${esc(e.color || "#e9b949")}">${esc(e.wingName)}</div>
  <div class="num">Exhibit Nº ${String(e.n).padStart(2, "0")} of ${M.total}</div>
  <h1>${esc(e.t)}</h1>
  <div class="obj"><b>In the case</b>${esc(e.obj)}</div>
  <img class="plate" src="../art/${e.folder}/${e.slug}.png" alt="${esc(e.obj)}" width="640" height="400">
  ${e.body.map(p => "<p>" + esc(p) + "</p>").join("")}
  ${e.q ? "<blockquote>" + esc(e.q) + "</blockquote>" : ""}
  ${link}
  <div class="foot"><a href="${rel(prev)}">← ${esc(prev.t)}</a><span class="seen" id="seen"></span><a href="${rel(next)}">${esc(next.t)} →</a></div>
  <div class="foot" style="border:0;margin-top:8px;padding-top:0"><a href="../index.html">Directory</a><a href="../map.html">Floor plan</a><a href="../join.html">Get involved</a></div>`;
  const dir = path.join(OUT, e.folder); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, e.slug + ".html"), page(e.t, body, e)); written++;
}

/* the directory */
{
  const order = M.composed.HALLORDER;
  let body = `<div class="wingchip" style="color:var(--gold)">Museum directory</div><h1>All ${M.total} exhibits</h1><p class="num" style="margin-top:6px">Press SPACE at any placard on the wall, or read ahead here</p><a href="map.html"><img class="plate" src="map/museum.png" alt="Floor plan of the museum, every hall named"></a><p class="num" style="margin-top:8px"><a href="map.html" style="color:var(--gold)">Open the floor plan</a> · follow the coloured lines on the floor</p>`;
  for (const h of order) {
    const items = list.filter(e => e.wing === h); if (!items.length) continue;
    body += `<div class="hallhead" style="color:${esc((M.ZONES[h] || {}).color || "#e9b949")}">${esc((M.ZONES[h] || {}).name || h)}</div><div class="grid">` +
      items.map(e => `<a class="item" data-seen="${e.n}" href="${e.folder}/${e.slug}.html"><span class="no">${String(e.n).padStart(2, "0")}</span><span>${esc(e.t)}${e.embed ? " ▸" : ""}</span></a>`).join("") + "</div>";
  }
  body += `<div class="foot"><span class="seen" id="seen"></span><a href="join.html">Get involved →</a></div>`;
  fs.writeFileSync(path.join(OUT, "index.html"), page("Directory", body, null));
}

/* the gift shop, and the museum's own door */
{
  const links = [
    ["Learn", "#63d6d0", [["BlueDot Impact", "Free, cohort-based courses on AI alignment and governance, the standard on-ramp into the field.", "https://bluedot.org"], ["AISafety.info", "Plain-language answers to hundreds of AI-safety questions, volunteer writers and editors welcome.", "https://aisafety.info"], ["Alignment Forum", "Where much of the research argued about in these halls actually happens, in public.", "https://www.alignmentforum.org"]]],
    ["Volunteer and contribute", "#e2c46e", [["Volunteer for this museum", "The Museum of AI Safety is a real, free, walk-in museum being built by volunteers. Own an exhibit or a wing.", "https://docs.google.com/forms/d/e/1FAIpQLSckGPa53Gh9MHLsXTkYyg_25DlB224IwXPU-QxoMdaZR34zOw/viewform"], ["Build this building", "The world you are standing in is a public repository. Donate an exhibit or open a wing in Tiled.", "https://github.com/aisafetymuseum/ai-safety-museum/blob/main/CONTRIBUTING.md"], ["Apart Research", "Weekend research sprints and hackathons, open to newcomers; often someone's first publication.", "https://apartresearch.com"], ["AI Safety Camp", "Part-time, remote research collaborations for people entering the field.", "https://aisafety.camp"], ["AISafety.com", "The field's directory: local groups, events, courses, and volunteer opportunities on one map.", "https://www.aisafety.com"]]],
    ["Careers and programs", "#b48ce8", [["80,000 Hours", "Career guidance plus a curated job board across technical safety, policy, and operations.", "https://80000hours.org"], ["MATS", "Mentored research-scholar program pairing newcomers with alignment researchers.", "https://www.matsprogram.org"], ["GovAI", "Fellowships and research for the policy-shaped rooms of this museum.", "https://www.governance.ai"]]]
  ];
  let body = `<div class="wingchip" style="color:#e0993f">The Gift Shop · Get involved</div><h1>Everything here is free.</h1><p>The currency is your attention. The museum sells nothing; these doors open to the internet.</p>`;
  for (const [head, color, items] of links) body += `<div class="hallhead" style="color:${color}">${esc(head)}</div><div class="grid">` + items.map(([nm, ds, url]) => `<a class="item" href="${url}" target="_blank" rel="noopener" style="flex-direction:column;gap:4px"><span style="color:var(--ink);font-size:15px">${esc(nm)}</span><span style="font-size:12.5px;color:var(--ink-dim)">${esc(ds)}</span></a>`).join("") + "</div>";
  body += `<div class="foot"><a href="index.html">← Directory</a><span>Exit through the gift shop · The Curators</span></div>`;
  fs.writeFileSync(path.join(OUT, "join.html"), page("Get involved", body, null));
}
/* the pages drawn on the walls are hand-written in pages/ and copied here */
for (const f of ["board.html", "mural.html"]) if (fs.existsSync(path.join(ROOT, "pages", f))) fs.copyFileSync(path.join(ROOT, "pages", f), path.join(OUT, f));
fs.writeFileSync(path.join(OUT, "board.js"), fs.readFileSync(path.join(ROOT, "content", "board.js"), "utf8"));
console.log("placards:", written, "pages + directory, join, board, mural");
