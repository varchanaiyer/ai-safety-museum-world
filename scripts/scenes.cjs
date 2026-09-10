/* The museum's paintings, drawn proportionally into any rectangle so the
   same scene hangs on a kiosk (72 px wide) and on a placard plate (480 px). */
"use strict";
const { mulberry } = require("./paint.cjs");
const ink = "#4a3520";
const scenes = {
  /* open plan at dusk */
  a(s, x, y, w, h) {
    s.gradient(x, y, w, h * 0.55, "#e08e54", "#54345a");
    for (let i = 1; i < 5; i++) s.rect(x + (i * w / 5) | 0, y, Math.max(1, w / 60 | 0), h * 0.55, "#1e161a", 230);
    s.circle(x + w * 0.72, y + h * 0.3, Math.max(2, w / 26), "#ffd696");
    s.gradient(x, y + h * 0.55, w, h * 0.45, "#4a362e", "#241a18");
    const R = mulberry(3);
    for (let r = 0; r < 3; r++) { const yy = y + h * (0.62 + r * 0.115), sc = (0.75 + r * 0.35) * w / 184; for (let i = 0; i < 4; i++) { const xx = x + w * (0.08 + i * 0.24) + r * 6 * w / 184; s.rect(xx, yy, 26 * sc, 3 * sc, "#181214"); s.rect(xx + 2 * sc, yy - 8 * sc, 7 * sc, 8 * sc, "#181214"); s.circle(xx + 16 * sc, yy - 6 * sc, 3.4 * sc, "#181214"); s.rect(xx + 9 * sc, yy - 1.5 * sc, 4 * sc, 2 * sc, "#fff4d6"); if (R() < 0.5) s.circle(xx + 24 * sc, yy - 4 * sc, 2.6 * sc, "#ffc46e", 140); } }
  },
  /* the meeting */
  d(s, x, y, w, h) {
    s.rect(x, y, w, h * 0.62, "#3a3a42"); s.rect(x, y + h * 0.62, w, h * 0.38, "#28201e");
    s.rect(x + w * 0.66, y + h * 0.1, w * 0.26, h * 0.3, "#e2ded2"); s.line(x + w * 0.68, y + h * 0.34, x + w * 0.76, y + h * 0.28, "#a03c36"); s.line(x + w * 0.76, y + h * 0.28, x + w * 0.9, y + h * 0.14, "#a03c36");
    for (let j = 0; j < h * 0.24; j++) { const t = j / (h * 0.24); s.rect(x + w * (0.16 - 0.08 * t), y + h * 0.62 + j, w * (0.44 + 0.16 * t), 1, "#5e4028"); }
    for (let i = 0; i < 5; i++) s.rect(x + w * (0.2 + i * 0.09), y + h * (0.66 + (i % 2) * 0.06), Math.max(2, w / 26), Math.max(1, h / 38), "#fff0d0");
    for (let i = 0; i < 4; i++) { const xx = x + w * (0.16 + i * 0.13); s.circle(xx, y + h * 0.55, Math.max(1, w / 46), "#1a1618"); s.ellipse(xx, y + h * 0.63, Math.max(2, w / 26), Math.max(1, h / 30), "#1a1618"); }
    s.circle(x + w * 0.62, y + h * 0.36, Math.max(1, w / 40), "#1a1618"); s.rect(x + w * 0.6, y + h * 0.4, Math.max(2, w / 20), h * 0.22, "#1a1618"); s.line(x + w * 0.64, y + h * 0.44, x + w * 0.72, y + h * 0.36, "#1a1618");
  },
  /* the water cooler */
  e(s, x, y, w, h) {
    s.rect(x, y, w, h * 0.66, "#404648"); s.rect(x, y + h * 0.66, w, h * 0.34, "#2e2420"); s.rect(x + w * 0.06, y + h * 0.08, w * 0.2, h * 0.5, "#ffe8b4", 34);
    s.rect(x + w * 0.44, y + h * 0.4, w * 0.1, h * 0.34, "#d2d6d8"); s.rect(x + w * 0.45, y + h * 0.28, w * 0.08, h * 0.13, "#78bee6");
    for (const [fx, tilt] of [[0.3, 0.02], [0.62, 0], [0.74, 0.04]]) { s.circle(x + w * fx, y + h * (0.4 + tilt), Math.max(2, w / 37), "#1c181a"); s.rect(x + w * fx - w / 26, y + h * (0.46 + tilt), w / 13, h * 0.28, "#1c181a"); }
    s.circle(x + w * 0.9, y + h * 0.5, Math.max(2, w / 20), "#3c5430"); s.circle(x + w * 0.86, y + h * 0.44, Math.max(2, w / 26), "#3c5430"); s.rect(x + w * 0.87, y + h * 0.56, w * 0.05, h * 0.12, "#6e4628");
  },
  /* the panda diptych */
  O(s, x, y, w, h) {
    s.rect(x, y, w, h, "#eeeade");
    const panda = (px, py, sq) => { s.rect(px, py, sq, sq, "#607858"); for (let i = 0; i < 5; i++) s.rect(px + 4 * sq / 60 + i * sq / 5.4, py + 3 * sq / 60, Math.max(1, sq / 30), sq - 6 * sq / 60, "#465c42"); const cx = px + sq / 2, cy = py + sq * 0.56; s.circle(cx, cy + sq * 0.16, sq * 0.26, "#f4f2ec"); s.circle(cx, cy - sq * 0.12, sq * 0.2, "#f4f2ec"); s.circle(cx - sq * 0.15, cy - sq * 0.26, sq * 0.07, "#181618"); s.circle(cx + sq * 0.15, cy - sq * 0.26, sq * 0.07, "#181618"); s.circle(cx - sq * 0.08, cy - sq * 0.12, sq * 0.05, "#181618"); s.circle(cx + sq * 0.08, cy - sq * 0.12, sq * 0.05, "#181618"); s.rect(cx - sq * 0.26, cy + sq * 0.04, sq * 0.13, sq * 0.3, "#181618"); s.rect(cx + sq * 0.13, cy + sq * 0.04, sq * 0.13, sq * 0.3, "#181618"); };
    const sq = h * 0.52, y0 = y + h * 0.12; panda(x + w * 0.08, y0, sq); panda(x + w * 0.62, y0, sq);
    const R = mulberry(5), nx = x + w * 0.435, ny = y0 + sq * 0.28, ns = sq * 0.42; for (let yy = 0; yy < 8; yy++) for (let xx = 0; xx < 8; xx++) s.rect(nx + xx * ns / 8, ny + yy * ns / 8, Math.ceil(ns / 8), Math.ceil(ns / 8), [R() * 255 | 0, R() * 255 | 0, R() * 255 | 0]);
    if (w > 200) { s.text(x + w * 0.08 + sq / 2, y0 + sq + h * 0.06, "PANDA · 57.7%", { align: "center", color: "#4a463e", scale: 2 }); s.text(x + w * 0.62 + sq / 2, y0 + sq + h * 0.06, "GIBBON · 99.3%", { align: "center", color: "#a0342c", scale: 2 }); s.text(x + w / 2, y0 + sq * 0.5, "+", { align: "center", color: "#4a463e", scale: 3 }); }
  },
  /* the scaling law */
  h(s, x, y, w, h) {
    s.rect(x, y, w, h, "#e9e5d7");
    const gx0 = x + w * 0.12, gx1 = x + w * 0.95, gy0 = y + h * 0.08, gy1 = y + h * 0.86, decX = (gx1 - gx0) / 6, decY = (gy1 - gy0) / 4;
    for (let d = 0; d < 6; d++) for (let m = 1; m < 10; m++) { const xx = gx0 + d * decX + Math.log10(m) * decX; s.rect(xx, gy0, 1, gy1 - gy0, "#969eac", m === 1 ? 190 : 60); }
    for (let d = 0; d < 4; d++) for (let m = 1; m < 10; m++) { const yy = gy0 + d * decY + Math.log10(m) * decY; s.rect(gx0, yy, gx1 - gx0, 1, "#969eac", m === 1 ? 190 : 60); }
    s.rect(gx0, gy0, Math.max(1, w / 240), gy1 - gy0, "#3a3834"); s.rect(gx0, gy1, gx1 - gx0, Math.max(1, h / 135), "#3a3834");
    const lx0 = gx0 + decX * 0.3, ly0 = gy0 + decY * 0.35, lx1 = gx1 - decX * 0.25, ly1 = gy1 - decY * 0.5, R = mulberry(8);
    for (let i = 0; i <= 16; i++) { const t = i / 16; s.circle(lx0 + (lx1 - lx0) * t, ly0 + (ly1 - ly0) * t + (R() - 0.5) * h / 40, Math.max(1, w / 130), "#2e3460"); }
    for (let k = 0; k < Math.max(1, w / 200); k++) s.line(lx0, ly0 + k, lx1, ly1 + k, "#b23a30");
    if (w > 200) { s.text(x + w / 2, y + h * 0.93, "C O M P U T E", { align: "center", color: "#4a463e" }); s.text(x + w * 0.42, y + h * 0.3, "IT SIMPLY KEPT BEING TRUE", { color: "#6a665e" }); }
  },
  /* the march of progress, amended */
  m(s, x, y, w, h) {
    s.gradient(x, y, w, h, "#f0e7d2", "#e0d3b8"); s.rect(x, y, w, Math.max(1, h / 25), "#a08042"); s.rect(x, y + h - Math.max(1, h / 25), w, Math.max(1, h / 25), "#a08042");
    const gy = y + h * 0.8, k = w / 1280;
    s.line(x + 50 * k, gy, x + 1050 * k, gy, "#5a4628", 120);
    const fig = (fx, hh, hd, lean) => { const bx = x + fx * k; s.ellipse(bx, gy - hh * k * 0.55, Math.max(2, 14 * k), Math.max(3, hh * k * 0.45), ink); s.circle(bx + lean * k, gy - hh * k, Math.max(2, 11 * k), ink); s.rect(bx - 6 * k, gy - hh * k * 0.3, Math.max(1, 6 * k), hh * k * 0.3, ink); s.rect(bx + 2 * k, gy - hh * k * 0.3, Math.max(1, 6 * k), hh * k * 0.3, ink); };
    fig(120, 40, 12, 20); fig(270, 62, 11, 12); fig(420, 84, 11, 0); fig(590, 60, 10, 14); fig(760, 56, 10, 16);
    s.rect(x + 917 * k, gy - 74 * k, Math.max(3, 26 * k), Math.max(4, 52 * k), "#33517e"); s.rect(x + 920 * k, gy - 100 * k, Math.max(2, 20 * k), Math.max(3, 20 * k), "#33517e"); s.rect(x + 906 * k, gy - 68 * k, Math.max(1, 8 * k), 30 * k, "#33517e"); s.rect(x + 946 * k, gy - 68 * k, Math.max(1, 8 * k), 30 * k, "#33517e");
    s.circle(x + 1110 * k, gy - 58 * k, Math.max(4, 44 * k), "#2e5fd0", 36); s.circle(x + 1110 * k, gy - 58 * k, Math.max(3, 20 * k), "#2e5fd0"); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s.circle(x + 1110 * k + Math.cos(a) * 42 * k, gy - 58 * k + Math.sin(a) * 42 * k, Math.max(1, 3 * k), "#2e5fd0"); }
    if (w > 300) s.text(x + w / 2, y + h * 0.9, "THE MARCH OF PROGRESS · AMENDED", { align: "center", color: "#6a5230" });
  }
};
module.exports = scenes;
