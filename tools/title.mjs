// node title.mjs: renders the title drawer (tools/title.html) for both shapes into images/title/.
// Needs the site served at http://127.0.0.1:8765 (python3 -m http.server 8765 from the repo).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
const exe = process.env.CHROME || process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const b = await chromium.launch({ executablePath: exe }), layout = {};
for (const [shape, k] of [['wide', 2 / 3], ['tall', 1 / 2]]) {
  const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://127.0.0.1:8765/tools/title.html');
  const t0 = Date.now(), o = await p.evaluate(s => window.render(s), shape);
  console.log(shape, Date.now() - t0, 'ms', 'title size', o.ts, 'text ends', Math.round(o.end), 'slips at', Math.round(o.slipTop), 'missing glyphs', o.miss.join(''));
  const buf = u => Buffer.from(u.split(',')[1], 'base64');
  await sharp(buf(o.jpg)).resize(Math.round(o.w * k)).jpeg({ quality: 86, mozjpeg: true }).toFile(`../images/title/${shape}.jpg`);
  layout[shape] = [];
  for (const [i, s] of o.slips.entries()) {
    await sharp(buf(s.png)).resize(Math.round(s.w * k)).png({ compressionLevel: 9, palette: false }).toFile(`../images/title/${shape}-${i + 1}.png`);
    layout[shape].push({ left: +(100 * s.x / o.w).toFixed(3), top: +(100 * s.y / o.h).toFixed(3), width: +(100 * s.w / o.w).toFixed(3) });
  }
  await p.close();
}
fs.writeFileSync('../images/title/layout.json', JSON.stringify(layout, null, 1) + '\n');
await b.close();
