// The site icon: plate 1's nautilus section, computed from its rule like every plate.
// The shell is the logarithmic spiral r = a·e^(bθ) at the ticked whorl expansion rate W = 3,
// so b = ln 3 / 2π; septa seal the chambers along it, and the living chamber is left open.
// usage: node favicon.mjs   (writes ../images/favicon.svg, favicon-32.png, apple-touch-icon.png)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve(import.meta.dirname, '../images');
const W = 3, b = Math.log(W) / (2 * Math.PI);
const S = 64, M = 6.5, tMax = 0;           // the tile, its margin, and the aperture at θ = 0 on the right
const r = t => Math.exp(b * t);
// y is flipped so the shell coils clockwise as it grows; the bounding box of the outer whorl is fitted to the tile
const raw = (t, k = 1) => [k * r(t) * Math.cos(t), -k * r(t) * Math.sin(t)];
const box = Array.from({ length: 721 }, (_, i) => raw(tMax - 2 * Math.PI * i / 720));
const [x0, x1, y0, y1] = [Math.min(...box.map(p => p[0])), Math.max(...box.map(p => p[0])), Math.min(...box.map(p => p[1])), Math.max(...box.map(p => p[1]))];
const k0 = (S - 2 * M) / Math.max(x1 - x0, y1 - y0), ox = (S - k0 * (x1 + x0)) / 2, oy = (S - k0 * (y1 + y0)) / 2;
const pt = (t, k = 1) => raw(t, k).map((v, i) => +(k0 * v + (i ? oy : ox)).toFixed(2));
const spiral = (t0, t1, n) => Array.from({ length: n + 1 }, (_, i) => pt(t0 + (t1 - t0) * i / n));

const tStart = tMax - 4 * 2 * Math.PI;     // four whorls in, the coil is below a pixel
const outer = spiral(tStart, tMax, 400);
const shell = `M${outer.map(p => p.join(' ')).join('L')}L${pt(tMax - 2 * Math.PI).join(' ')}Z`;
const whorl = `M${spiral(tStart, tMax - 2 * Math.PI, 300).map(p => p.join(' ')).join('L')}`;

// Septa: nine chambers a whorl, each one curved back toward the coil like a real septum.
// The last chamber, the living one, runs a quarter whorl open to the aperture.
const step = 2 * Math.PI / 9;
const septa = [];
for (let t = tMax - Math.PI / 2; t > tMax - 2 * Math.PI - 2 * Math.PI; t -= step) {
  const [ax, ay] = pt(t - 2 * Math.PI), [bx, by] = pt(t);
  if (Math.hypot(bx - ax, by - ay) < 2.2) break;
  const [mx, my] = pt(t - step * 0.45, (1 + 1 / W) / 2);
  septa.push(`M${ax} ${ay}Q${mx} ${my} ${bx} ${by}`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
<rect width="${S}" height="${S}" rx="12" fill="#16130f"/>
<path d="${shell}" fill="#f3efec"/>
<g fill="none" stroke="#57534d" stroke-linecap="round">
<path d="${whorl}" stroke-width="2"/>
<path d="${septa.join('')}" stroke-width="1.6"/>
</g>
<path d="${shell}" fill="none" stroke="#201f1d" stroke-width="1.4" stroke-linejoin="round"/>
</svg>
`;
fs.writeFileSync(path.join(out, 'favicon.svg'), svg);
await sharp(Buffer.from(svg), { density: 72 * 32 / S * 4 }).resize(32, 32).png().toFile(path.join(out, 'favicon-32.png'));
await sharp(Buffer.from(svg.replace('rx="12"', 'rx="0"')), { density: 72 * 180 / S * 2 }).resize(180, 180).png().toFile(path.join(out, 'apple-touch-icon.png'));
console.log(`favicon.svg (${svg.length} B, ${septa.length} septa), favicon-32.png, apple-touch-icon.png`);
