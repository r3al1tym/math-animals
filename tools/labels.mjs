// node labels.mjs: for each plate, its label typed out on the empty drawer, as a strip of frames the
// site plays while the plate computes (images/labels/<plate>.jpg, images/labels/labels.json).
// Each frame is the plate's own t = 0 frame with its label at prog k / (N - 1), cropped to the label.
// Needs the site served at http://127.0.0.1:8765.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
const N = 24, SCALE = 2 / 3, M = 16;
const exe = process.env.CHROME || process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const dirs = fs.readdirSync('..').filter(d => /^\d\d-/.test(d)).sort(), out = {};
const b = await chromium.launch({ executablePath: exe });
for (const d of dirs) {
  const p = await b.newPage({ viewport: { width: 1200, height: 1500 } }); p.on('pageerror', e => console.log('ERR', d, e.message));
  await p.goto(`http://127.0.0.1:8765/${d}/index.html?t=0`); await p.waitForFunction(() => window.__riso?.ready, null, { timeout: 120000 });
  const r = await p.evaluate(async ({ N, M }) => {
    const lc = window.labelCard; let box = null; window.__labelFirst = true;
    window.labelCard = (ctx, o) => (box = lc(ctx, { ...o, prog: window.__P }));
    const c = document.getElementById('c'), frames = [];
    for (let k = 0; k < N; k++) { window.__P = k / (N - 1); await window.__riso.seek(0); if (!k) var B = box; frames.push(c.getContext('2d').getImageData(Math.max(0, Math.floor(B.x - M)), Math.max(0, Math.floor(B.y - M)), Math.ceil(B.w + 2 * M), Math.ceil(B.h + 2 * M))); }
    const x = Math.max(0, Math.floor(B.x - M)), y = Math.max(0, Math.floor(B.y - M)), w = frames[0].width, h = frames[0].height, s = document.createElement('canvas'); s.width = w; s.height = h * N;
    frames.forEach((f, k) => s.getContext('2d').putImageData(f, 0, k * h));
    return { x, y, w, h, W: c.width, H: c.height, png: s.toDataURL('image/png') };
  }, { N, M });
  const w = Math.round(r.w * SCALE), h = Math.round(r.h * SCALE);
  await sharp(Buffer.from(r.png.split(',')[1], 'base64')).resize(w, h * N, { fit: 'fill' }).jpeg({ quality: 82, mozjpeg: true }).toFile(`../images/labels/${d}.jpg`);
  out[d] = { left: +(100 * r.x / r.W).toFixed(3), top: +(100 * r.y / r.H).toFixed(3), width: +(100 * r.w / r.W).toFixed(3), height: +(100 * r.h / r.H).toFixed(3), n: N };
  console.log(d, JSON.stringify(out[d]), fs.statSync(`../images/labels/${d}.jpg`).size);
  await p.close();
}
fs.writeFileSync('../images/labels/labels.json', JSON.stringify(out) + '\n');
await b.close();
