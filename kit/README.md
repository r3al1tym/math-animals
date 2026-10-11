# Math-Animals kit

The shared cabinet for the ten drawers: one oak drawer under a glazed lid, a card mount for its floor, graphite for the construction, one curator's hand for every letter, and one window light. Every page pastes `kit.js` verbatim into its first `<script>`, between the marker lines, and syncs it with:

```
node kit/sync.mjs NN-name/index.html
```

A draft kit is tested with `--kit=<path>` (for example `--kit=kit/kit-next.js`) on a demo or a temp copy, never on a page.

`demo.html` is an empty drawer with a demonstration construction (the nautilus spiral, its trials and its label). `?card=black` shows it in graphite on the black card; `?sheet=1` shows the whole hand at cap heights 40, 20 and 13 px in ink and in pencil.

## Page skeleton

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>NN name</title>
<style>html,body{margin:0;background:#1b1712}body{min-height:100vh;display:flex;align-items:center;justify-content:center}canvas{display:block;width:720px;height:900px}</style>
</head><body><canvas id="c" width="1080" height="1350"></canvas>
<script>
"use strict";
// ===== math-animals kit v1 begin =====
// ===== math-animals kit v1 end =====
const X = document.getElementById('c').getContext('2d');
let CARD, FRAME;
function seek(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none';
  X.drawImage(CARD, 0, 0);
  // pencil construction, object shadows, the animal, the label
  X.drawImage(FRAME, 0, 0); lightFalloff(X); glass(X, t);
}
kitStart(async () => { CARD = renderCard({ tone: 'white' }); FRAME = renderFrame(); }, seek);
</script></body></html>
```

## API

Constants and helpers
- `W, H` = 1080 × 1350; `DUR` = 6, `HERO` = 5.2, `BUILD_END` = 4.5 (seconds).
- `SH = {x: 0.56, y: 0.83}` shadow direction, `K` = 1.1 shadow offset per px of height, `MM` = 3.6 px per mm, `SHC` the warm shadow brown.
- `RIM, FRONT, WALLV` = 40, 40, 24; `WALL_H` = 22 mm; the drawer floor `FX0, FY0, FX1, FY1` = 64, 64, 1016, 1286 (952 × 1222 px, about 264 × 339 mm).
- The unit tray: `TRAY_SLOT` = 4 px (dark slot along the drawer walls), `TRAY_WALL` = 3 px (the tray wall's cut top), `TRAY_H` = 12 mm (wall height). Its floor `TX0, TY0, TX1, TY1` = 79, 81, 1001, 1269 (922 × 1188 px, about 256 × 330 mm). Lay the construction, the specimen and the label inside this rect.
- Seeded randomness: `hash(s)`, `rngFor(key)`, `noiseFor(key)`, `nzc(key)` (cached noise), `fbm(n, x, y, oct)`. Never the platform random.
- `clamp, lerp, smooth, hex, mix, shade, rgba, mk(w, h), ease, ease5, catmull(pts, seg)`.

The drawer
- `renderFrame()` → canvas: oak rails, inner wall faces, glass edge; the floor is left transparent.
- `renderCard({tone: 'white' | 'black', seed, tray})` → canvas: one card unit tray filling the drawer, in 16-specimen's vocabulary (a dark slot along the drawer walls, the tray wall's cut top, its foreshortened inner faces lit and shaded by side, the tray wall's shadow on the floor), with tooth, fibres, formation, cockle and corner occlusion baked into the floor. `tone: 'black'` makes it a black tray: a warm charcoal board (about #2a2724 at the lit end) whose tooth crowns and fibres catch the window as a warm grey sheen, with a lit cut top and lit inner faces on the walls turned to the window. `tray: false` gives the old flat card to the walls. Call once in `init`.
- `cardTooth(x, y)` → 0..1, the board's surface tooth at a screen pixel (1 on a fibre's crown).
- `litAt(rgb, x, y)` → the colour as it would look lying on the card at (x, y): the walls' shadow and the corners' occlusion applied.
- `lightFalloff(ctx)`: the window falloff, multiplied over the composed frame.
- `glass(ctx, t)`: the lid's reflection band (slides in 0.35 to 1.4 s, breathes after `BUILD_END`), dust and scratches. Drawn last. The band and its veil are baked once per tone with a soft bell profile across: on the white tray at half the v1.2 strength, on the black tray twice as wide. Dust and scratches lie only on the glass, inside the rails.
- `castShadow(ctx, img, x, y, heightPx, {alpha = 0.5, blur = 0.14 × height, color = SHC, w, h})`: the silhouette of `img` drawn as `drawImage(img, x, y)` would, offset `heightPx × K` along `SH` in screen space and multiplied into the card. It honours the current transform, so a rotated object casts a rotated shadow that still falls down-right. For something lying on the card, cast twice: a soft one at its thickness and a tight contact one at about 0.3 mm.

Graphite
- `pencil(ctx, pts, opts)`: a polyline `[[x, y], ...]` in the current transform. opts: `w` (px, 1.45), `tone` (0..1, 1), `seed`, `prog` (0..1 of arc length), `overshoot` (`true` = 6 px, or px), `tremor` (px, 0.3), `dash` (`[on, off]` px), `white` (defaults to true on the black card: graphite on dark board, a warm grey at about 50% value laid on the tooth's crowns, so the brighter specimen separates from it), `alpha`.
- `pencilLine(ctx, x0, y0, x1, y1, opts)`, `pencilArc(ctx, cx, cy, r, a0, a1, opts)` (canvas radians, clockwise on screen), `pencilCircle(ctx, cx, cy, r, opts)` (closes a little past its start), `pencilDot(ctx, x, y, {r = 1.1})`, `pencilCross(ctx, x, y, size = 8, opts)`, `pencilTick(ctx, x, y, size = 14, opts)`. All take `prog`.

Two voices: the typewriter for labels, the curator's hand for everything drawn on the card.
- `letterText(ctx, str, x, y, opts)` → width. Baseline at `y`. opts: `face` (`'hand'`, the default, or `'type'`), `size` (cap height px, 13), `medium` (hand only: `'ink'`, `'pencil'`, which turns white on the black card, or `'white'`), `italic`, `align` (`'left' | 'center' | 'right'`), `prog` (the pen writes left to right; the typewriter strikes key by key), `seed`, `tracking` (px), `tone` (pencil, 1), `wobble` (1, or 1.25 for pencil; scales every irregularity of the hand).
- The typewriter (`face: 'type'`): a monospaced slab-serif face after a 1950s office machine, every character on a cell `TYPE_PITCH` = 0.6 cap heights wide, x-height 0.7, stroke `TYPE_W` = 0.11 cap. Each character is one strike through an inked fabric ribbon: a little denser or fainter, denser on one side of the slug, a hair off the line and off square; the odd key prints heavier and the odd one light. Italic (`italic` or `*{...}`) is typed as an underline, a row of underscore strikes under the span. `^{...}` and `_{...}` are typed full size on a half-turned platen. Greek and maths come off a symbol ball. The typewriter has one size and no italic.
- The pencil hand prints more freely than the ink hand: bowls slightly oval and leaning, open apertures, a single-storey a, each stroke landing firm and lifting, with more variety in weight. Forms that could merge at 13 to 18 px are kept apart: the a's bowl meets a straight stem in corners, the e's eye is tall, the i's dot sits clear of an l before it, the 4 is open and in two strokes, the 1's flag is a short tick, the 3 is open on the left, and the 6 and 9 run their stems off the loop. Advances are the same in every hand face.
- Ink is the swept nib of a fine, slightly broad pen held at `NIB_ANGLE` = 38°: strokes thicken and thin with direction at `NIB_RATIO` = 1.8 : 1 (thick 0.125 cap, thin 0.07 cap), land a touch heavier and end at the nib's angle. Each letter is set about 3% off in size, a degree or so off in turn and lean, unevenly spaced; strokes are set down separately so joins overshoot or fall short; the baseline wanders and the line runs a hair up- or downhill. Roman lines lean `HAND_LEAN` = 1.5°, italic `HAND_SLANT` = 16°. Pencil lettering prints: each stroke lands firm and eases off, each with its own weight.
- Inline markup: `^{...}` superscript at 0.62 size, `_{...}` subscript, `*{...}` italic (for a binomial inside a line).
- `measureText(str, size, {face, italic, tracking})` → width in px (`'type'`: characters × `TYPE_PITCH` × size).
- Character set (both faces; the typewriter adds `_`): A–Z a–z 0–9, space `. , : ; ' " ( ) [ ] - – — = + − × · / ° % ^ ~ ! ? & < > ≈ √ ∞ ′ ✓`, and `α β γ δ θ λ μ π ρ σ φ ψ ω Δ Σ Φ` (`HAND_CHARS`). Glyphs live in `HAND_SRC` (with `HAND_PENCIL_SRC` overrides for the pencil) and `TYPE_SRC` as centre-lines in cap-height units (hand x-height 0.68, descender −0.3); arcs may carry a seventh value, a rotation in degrees.
- `labelCard(ctx, opts)` → `{x, y, w, h}`. opts: `x, y` (top-left), `w` (auto from the longest line), `lines: [{text, size, italic, align}]` (size defaults to 15 for an italic or `*{}` line, 12.5 otherwise), `prog` (0..1 across all lines, line by line), `rot` (radians), `pad` (12), `lead` (1.7), `lift` (px, height of the faint ambient shade, 1.2 mm), `seed`, `face` (`'type'`, the default, or `'hand'` for the v1.1 ink lettering), `typeSize` (cap px, 13). The label is a hand-cut slip of buff stock, warmer than either board (corners and edges a hair off, fibres, formation, a faint sheen, a bright cut lip toward the window) lying flat: a crisp hairline shadow below and right (0.5 mm, no blur) and a very faint ambient one. The slip is cached per size and seed. Typed labels keep the slip the hand would have needed (so a page that sizes `w` with the hand's `measureText` keeps its layout) and type every line in one size, `typeSize`, reduced only when the longest line would not fit the slip; the lines are spread evenly over the slip's text block.

Contract
- `kitStart(init, seek)`: sets `window.__riso = {duration, ready, seek, hero, build: {end}}`, awaits `init()`, seeks to `?t=` or `HERO`, then sets `ready`. `?play` plays the build in real time from 0 and holds at `HERO`.

## Conventions

- **Light.** One window at the upper left. Shadows fall down-right along `SH`; an object `h` px above the card throws its shadow `h × K` away, blurred about `0.14 × h`. The top and left drawer walls (22 mm) shade the first ~72 px below the top wall and ~49 px right of the left wall, and the tray wall (12 mm) adds its own sharper band of ~39 and ~26 px inside the tray; keep the label and fine lettering clear of those bands. Faces turned from the window are darker; the falloff takes the lower right down by about a third.
- **Scale.** `MM` = 3.6 px per mm everywhere in the drawer. Pencil lines are about 0.4 mm (1.45 px); the label's binomial is about 4 mm caps (15 px), other label lines 3.5 mm (12.5 px); pencil annotations 12 to 13 px.
- **Layering, back to front.** Card tray → pencil construction → object shadows (`castShadow`) → the animal → label (`labelCard` draws its own shadow) → `renderFrame` canvas → `lightFalloff` → `glass`. The frame goes after the drawer's contents so nothing spills onto the rails.
- **Timing.** The glass catches the window from 0.35 s. The construction draws itself from about 0.4 s to 2.0 s; the animal grows out of it from about 1.5 s; the trials and label are lettered near the end (the demo letters its label from 3.8 to 4.5 s); the build ends at `BUILD_END` = 4.5 s and holds the hero at 5.2 s. After the build only the glass breathes.
- **Pencil is screen-space.** Graphite and ink are rasterised against the tooth at the screen pixel, so the grain stays still while a line draws and under any transform. A finished construction can be drawn once into a transparent `mk(W, H)` layer at `init` and composited each frame; only the lines still drawing need `prog`.
- **Seeds.** Give every stroke and text a stable `seed` so the hand's tremor and wobble are the same every frame.

## Cost

On this machine the demo bakes in about 0.8 s (tooth, tray and frame) and seeks in about 0.23 s. A pencil line costs about its length in px times its width squared in pixel tests; a 13 px ink line costs a few milliseconds.
