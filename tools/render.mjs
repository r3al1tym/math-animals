// Render a Math-Animals page at given times.
// usage: node render.mjs <page.html> <outdir> [t1,t2,...] [--small=540]
// Writes <outdir>/t<t>.png at the canvas's native size and <outdir>/t<t>-small.png downscaled.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [page, out, times = '1.5,3.0,4.5,5.2', ...rest] = process.argv.slice(2);
const small = Number((rest.find(a => a.startsWith('--small=')) || '--small=540').split('=')[1]);
const exe = process.env.CHROME; // optional: path to a Chrome or chrome-headless-shell binary
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu', '--use-gl=swiftshader', '--disable-web-security'] });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 1500 } });
const pg = await ctx.newPage();
const errors = [];
pg.on('pageerror', e => errors.push(String(e)));
pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
const t0 = Date.now();
await pg.goto('file://' + path.resolve(page));
await pg.waitForFunction(() => window.__riso && window.__riso.ready, null, { timeout: 300000 });
const initMs = Date.now() - t0;
const report = { page, initMs, frames: [], errors };
const usesRandom = await pg.evaluate(() => document.documentElement.outerHTML.includes('Math.random'));
report.mathRandom = usesRandom;
for (const t of times.split(',').map(Number)) {
  const s = Date.now();
  const url = await pg.evaluate(async t => {
    await window.__riso.seek(t);
    const c = document.querySelector('canvas');
    return c.toDataURL('image/png');
  }, t);
  const ms = Date.now() - s;
  const buf = Buffer.from(url.split(',')[1], 'base64');
  const name = `t${t.toFixed(1)}`;
  fs.writeFileSync(path.join(out, name + '.png'), buf);
  await sharp(buf).resize({ width: small }).png().toFile(path.join(out, name + '-small.png'));
  report.frames.push({ t, ms });
}
// determinism: seek the hero twice and compare
const det = await pg.evaluate(async () => {
  const c = document.querySelector('canvas'), h = window.__riso.hero;
  await window.__riso.seek(h); const a = c.toDataURL();
  await window.__riso.seek(1.0); await window.__riso.seek(h); const b = c.toDataURL();
  return a === b;
});
report.deterministic = det;
await browser.close();
console.log(JSON.stringify(report));
