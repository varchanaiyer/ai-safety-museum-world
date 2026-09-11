/* Opens the converted map in the real WorkAdventure client (public instance,
   map served from the local dev server) and walks through the entry screens. */
const { chromium } = require('playwright-core');
const fs = require('fs');
const MAP = process.argv[2] || 'core';
const HOST = process.argv[3] || 'localhost:5173';
const HASH = process.argv[4] || '';
const MODE = process.argv[5] || '';
const URL = `https://play.workadventu.re/_/${process.env.INSTANCE || 'museum-test'}/${HOST}/maps/${MAP}.tmj${HASH}`;
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'].concat(process.env.RESOLVE ? ['--host-resolver-rules=' + process.env.RESOLVE] : []) });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.grantPermissions(['microphone', 'camera']);
  const page = await ctx.newPage();
  const logs = [], mapReqs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text().slice(0, 240)); });
  page.on('pageerror', e => logs.push('pageerror: ' + e.message.slice(0, 240)));
  page.on('response', r => { const u = r.url(); if (u.includes(HOST)) mapReqs.push(r.status() + ' ' + u.split(HOST).pop()); if (r.status() >= 400) logs.push('http ' + r.status() + ' ' + u.slice(0, 160)); });
  const shot = async (n) => { await page.screenshot({ path: `shots/wa-${MAP}-${n}.png` }); };
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  const steps = [];
  for (let i = 0; i < 14; i++) {
    if (i > 3 && steps.length && /Zoom In/.test(steps[steps.length - 1].text)) break;
    await page.waitForTimeout(i < 3 ? 6000 : 3500);
    await shot(i);
    const state = await page.evaluate(() => {
      const vis = el => !!(el && el.offsetParent !== null);
      const inputs = [...document.querySelectorAll('input')].filter(vis).map(e => ({ type: e.type, id: e.id, ph: e.placeholder, name: e.name }));
      const buttons = [...document.querySelectorAll('button, a.button, [role=button]')].filter(vis).map(e => (e.innerText || e.textContent || '').trim().slice(0, 40)).filter(Boolean);
      const canvas = !!document.querySelector('canvas');
      const text = (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 300);
      return { url: location.href, inputs, buttons, canvas, text };
    });
    steps.push({ i, ...state });
    /* name screen */
    const nameInput = state.inputs.find(x => x.type === 'text' || /name/i.test(x.ph || '') || /name/i.test(x.id || ''));
    if (nameInput) {
      const sel = nameInput.id ? '#' + CSS.escape(nameInput.id) : 'input[type=text]';
      try { await page.fill(sel, 'Curator'); } catch (e) { try { await page.fill('input', 'Curator'); } catch (e2) {} }
      await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    }
    /* any continue-ish button */
    const prefs = [/^continue/i, /let.?s go/i, /^save/i, /^next/i, /skip/i, /^start/i, /^enter/i, /^ok$/i, /^go$/i];
    let cont = null; for (const re of prefs) { cont = state.buttons.find(b => re.test(b)); if (cont) break; }
    if (cont && !nameInput) {
      try { await page.getByRole('button', { name: new RegExp(cont.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first().click({ timeout: 3000 }); } catch (e) { try { await page.click('button', { timeout: 2000 }); } catch (e2) {} }
    }
  }
  const extra = {};
  if (MODE === 'placard') {
    /* the map script's frame exposes the scripting API; use it to read our position while we walk with the keys */
    const target = (process.env.TARGET || '2736,2928').split(',').map(Number);
    let api = null;
    for (let w = 0; w < 10 && !api; w++) { await page.waitForTimeout(1500); for (const f of page.frames()) { if (f === page.mainFrame()) continue; try { if (await f.evaluate(() => typeof WA !== 'undefined' && !!WA.player)) { api = f; break; } } catch (e) {} } }
    extra.apiFrame = api ? api.url().slice(0, 60) : null;
    const pos = async () => api ? await api.evaluate(async () => { await WA.onInit(); const p = await WA.player.getPosition(); return [Math.round(p.x), Math.round(p.y)]; }) : null;
    extra.spawn = await pos();
    try { extra.shortMoveTo = await api.evaluate(async ([x, y]) => { const p = await WA.player.getPosition(); const r = await WA.player.moveTo(p.x + 200, p.y, 12); return r; }, target); } catch (e) { extra.shortMoveTo = String(e).slice(0, 80); }
    const hold = async (key, done) => { await page.keyboard.down(key); let last = null, still = 0; for (let t = 0; t < 120; t++) { await page.waitForTimeout(100); const p = await pos(); if (!p) break; if (done(p)) break; if (last && p[0] === last[0] && p[1] === last[1]) { if (++still > 8) break; } else still = 0; last = p; } await page.keyboard.up(key); return await pos(); };
    const p0 = await pos();
    extra.afterRight = p0 && p0[0] < target[0] ? await hold('ArrowRight', p => p[0] >= target[0] - 8) : p0;
    extra.afterUp = await hold('ArrowUp', p => p[1] <= target[1] + 8);
    try { extra.finalMoveTo = await api.evaluate(async ([x, y]) => await WA.player.moveTo(x, y, 6), target); } catch (e) { extra.finalMoveTo = String(e).slice(0, 80); }
    await page.waitForTimeout(1200); extra.atCell = await pos();
    let prompt = '';
    for (let w = 0; w < 12; w++) { await page.waitForTimeout(2000); prompt = await page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ')); if (/SPACE/i.test(prompt)) break; }
    await shot('at-placard');
    extra.promptText = (prompt.match(/.{0,60}SPACE.{0,60}/i) || [prompt.slice(0, 160)])[0];
    await page.keyboard.press('Space'); await page.waitForTimeout(6000); await shot('placard-open');
    extra.panel = await page.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.src).filter(u => /placards|trycloudflare/.test(u)));
    extra.panelText = await page.evaluate(async () => { const f = [...document.querySelectorAll('iframe')].find(f => /placards/.test(f.src)); try { return f && f.contentDocument ? (f.contentDocument.body.innerText || '').replace(/\s+/g, ' ').slice(0, 160) : 'cross-origin or none'; } catch (e) { return 'cross-origin'; } });
  } else if (MODE === 'exits') {
    extra.moves = [];
    for (const k of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      const before = await page.evaluate(() => location.href);
      await page.keyboard.down(k); await page.waitForTimeout(1400); await page.keyboard.up(k); await page.waitForTimeout(2500);
      const after = await page.evaluate(() => location.href);
      extra.moves.push(k + ': ' + (after === before ? 'same map' : 'now at ' + after.split('/maps/').pop()));
      if (after !== before) { await page.waitForTimeout(5000); await shot('after-exit'); extra.arrivedText = await page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 160)); break; }
    }
  } else {
    try { for (const k of ['ArrowRight','ArrowRight','ArrowUp','ArrowUp']) { await page.keyboard.down(k); await page.waitForTimeout(500); await page.keyboard.up(k); } await page.waitForTimeout(800); await shot('walk'); } catch (e) {}
  }
  const out = { url: URL, extra, steps, mapReqs: [...new Set(mapReqs)].slice(0, 20), logs: logs.slice(0, 30) };
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(`results7-${MAP}.json`, JSON.stringify(out, null, 2));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
