// The title drawer, drawn by the kit in a worker: the plates' own oak (rails, mitred corners and an
// inner wall in depth around an oak floor) and labels typed on the plates' buff stock. Sizes arrive
// in device pixels; s is device pixels per plate pixel, so the grain matches the drawers beside it.
self.document = { createElement: () => new OffscreenCanvas(1, 1) };
importScripts('kit/kit.js');

// _oakAt with its fine figure faded as it falls below a sample's footprint fw (plate px), as the
// plates' own frames lose it when a 1080 px drawer is shown a few hundred pixels wide
function oak(n1, n2, n3, u, v, piece, fw, g = 1) {
  const as = clamp((3.3 * g / fw - 1.5) / 1.5), af = clamp((3.1 * g / fw - 1.5) / 1.5);
  const wv = v + 6 * fbm(n1, u * 0.004 + piece, piece, 3) + 1.5 * n2(u * 0.02, piece);
  const stripe = 0.5 + 0.5 * as * Math.sin(wv * 1.9 / g + 3 * n2(wv * 0.08, u * 0.003 + piece));
  const col = mix(OAK.dark, OAK.mid, clamp(0.42 + fbm(n2, wv * 0.05 + piece, u * 0.006, 3) * 0.9 + stripe * 0.16));
  const f0 = smooth(0.05, 0.35, n1(u * 0.012 + piece, wv * 0.05)), fleck = f0 * lerp(0.16, smooth(0.38, 0.62, n3(u * 0.045 / g + piece, wv * 0.32 / g)), af);
  return shade(mix(col, OAK.light, fleck * 0.55), 1 + fleck * 0.04);
}
function wood(w, h, s) {
  const c = new OffscreenCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), D = img.data;
  const n1 = nzc('oak1'), n2 = nzc('oak2'), n3 = nzc('oak3'), rim = RIM * s, wall = WALLV * s, fw = 1 / s;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / s, v = y / s, k = (y * w + x) * 4; let col;
    if (x >= rim + wall && x < w - rim - wall && y >= rim + wall && y < h - rim - wall) {
      // the floor: one oak board, its grain across, shaded under the walls on the window side
      col = oak(n1, n2, n3, u * 0.55, v, 611, fw, 3); // quartersawn: the figure runs long down the board
      const dx = (x - rim - wall) / s, dy = (y - rim - wall) / s;
      col = shade(col, 1.0 * (1 - 0.34 * Math.exp(-dy / 30) - 0.26 * Math.exp(-dx / 26)) * (1 + 0.06 * Math.exp(-Math.pow((u * 0.55 + v * 0.83 - 380) / 900, 2))));
    } else if (x >= rim && x < w - rim && y >= rim && y < h - rim) {
      // an inner wall face, as the drawers' walls: t from the rim (0) down to the floor (1)
      const tl = (x - rim) / wall, tr = (w - rim - 1 - x) / wall, tt = (y - rim) / wall, tb = (h - rim - 1 - y) / wall;
      const m = Math.min(tl, tr, tt, tb), side = m === tt ? 0 : m === tb ? 1 : m === tl ? 2 : 3, horiz = side < 2;
      col = oak(n1, n2, n3, horiz ? u : v, m * 9 + side * 40, 300 + side * 71, fw);
      const lit = side === 3 ? 1.0 : side === 1 ? 0.92 : side === 2 ? 0.46 : 0.4;
      col = shade(col, lit * (1 - 0.3 * smooth(0.6, 1, m)) * (1 - 0.12 * (1 - smooth(0, 0.15, m))));
    } else {
      // the rails, oiled, mitred at the corners
      const dt = (rim - y) / rim, db = (y - (h - rim)) / rim, dl = (rim - x) / rim, dr = (x - (w - rim)) / rim;
      const m = Math.max(dt, db, dl, dr), side = m === dt ? 0 : m === db ? 1 : m === dl ? 2 : 3, horiz = side < 2;
      col = oak(n1, n2, n3, horiz ? u : v, horiz ? v : u, side * 97.3, fw);
      col = shade(col, 1 + Math.exp(-Math.pow((u * 0.55 + v * 0.83 - 300) / 560, 2)) * 0.09);
      const d = Math.min(Math.abs(dt - dl), Math.abs(dt - dr), Math.abs(db - dl), Math.abs(db - dr)) * rim;
      if (m > 0) col = shade(col, 1 - 0.45 * clamp(0.5 + 0.7 * s - d) * Math.min(1, 0.3 + 1.4 * s));
    }
    D[k] = col[0]; D[k + 1] = col[1]; D[k + 2] = col[2]; D[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
// at small scales the board is sampled twice over each way and averaged down
function board(w, h, s) {
  const ss = s < 0.36 ? 2 : 1; if (ss === 1) return wood(w, h, s);
  const big = wood(w * ss, h * ss, s * ss), c = new OffscreenCanvas(w, h), ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(big, 0, 0, w, h);
  return c;
}

// a slip: lines already broken to fit, typed at one size; m is the margin kept for its shade
function slip({ lines, size, pad, lead, seed, w }) {
  const m = Math.ceil(size * 0.9) + 6, L = lines.map(t => ({ text: t.replace(/[’‘]/g, "'").replace(/[“”]/g, '"'), size }));
  const h = Math.round(pad + size * 1.05 + (L.length - 1) * size * lead + size * 0.42 + pad);
  const c = new OffscreenCanvas(w + 2 * m, h + 2 * m), ctx = c.getContext('2d');
  labelCard(ctx, { x: m, y: m, w, lines: L, pad, lead, typeSize: size, seed, rot: (rngFor(seed)() - 0.5) * 0.008, lift: size * 0.5 });
  return { c, m, h };
}

onmessage = async ({ data: q }) => {
  if (q.kind === 'wood') { const c = board(q.w, q.h, q.s); const bmp = c.transferToImageBitmap(); postMessage({ id: q.id, bmp }, [bmp]); return; }
  const r = slip(q), bmp = r.c.transferToImageBitmap();
  postMessage({ id: q.id, bmp, m: r.m, h: r.h }, [bmp]);
};
