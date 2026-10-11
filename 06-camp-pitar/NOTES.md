# Math-Animals No. 6: Notes

## The card

- **Animal.** *Lioconcha castrensis* (Linnaeus, 1758), the camp pitar, a venus clam. One right valve, exterior up, at low tide on wet grey sand. The name means "of the camp": its pattern is rows of brown tents.
- **Mathematics.** The shell is built the way the animal builds it, by accretion at the margin.
  - The outline is a Catmull-Rom curve converted into a 1440-entry polar table about the beak. Every growth line is an iso-line of r = d / R(φ), so each ring is the same outline scaled about the beak, as in isometric bivalve growth.
  - Age follows a von Bertalanffy growth curve, r = r0 + (1 − r0)(1 − e^(−ke)) / (1 − e^(−kE)), with e the age less any pauses, so the growth lines crowd toward the margin as the clam ages, and two growth checks leave ridges.
  - The tents are a Meinhardt activator–inhibitor reaction–diffusion system run along the mantle edge: one row of the simulation per growth increment, on a margin that lengthens as the shell grows: mantle cells divide and each daughter is inserted between its neighbours, so the pattern keeps its scale (one cell per pixel at full size). The inhibitor is long-lived and does not diffuse, so activation travels as waves: a cell that fires starts a pair of waves (a Λ, the tent's peak), waves that meet annihilate. Pigment is laid on the wave and, while the inhibitor stays high, in its wake, so each wave leaves a band; where the tissue has recovered the shell stays white. A slowly varying pigment readiness along the margin makes some tents fill solid. The shell is the space-time diagram of that system, with arc length along the margin as space and the radius as time.
  - The valve's dome is a height field in r, blurred into a knob near the beak; its shadow on the sand is ray-marched toward the sun. Each stage of the build is a scaled replica of the finished valve, since bivalves grow nearly isometrically.
- **The designed moment.** During the build the margin advances from the beak and the tents write themselves at the edge: wave pairs ignite, run apart, collide and vanish, and the fresh, thin margin carries the newest row before it hardens.
- **Palette.** Three colours.
  - *Aragonite cream* `#ece2cf`: the shell, warm and slightly translucent.
  - *Mantle umber* `#4d2d10`: the tents, warm and dark, never black.
  - *Grey sand* `#7a766e`: a cool mid grey ground of volcanic and quartz grains, so the only warm colours on the page belong to the animal and the cream reads as lit. (Round 5: lightened from a dark basalt `#55524c`, which swallowed the low sun's shadow and the ripples.)
- **Reference to beat.** Hans Meinhardt's comparison plates in *The Algorithmic Beauty of Sea Shells*: a simulation printed beside a photograph of the shell. Here the simulation and the shell are one image, and it has to hold up as a photograph.
- **What a fake gets wrong.** A reaction–diffusion texture laid over a shell outline: tents that ignore the growth lines, do not converge on the beak, keep one size and one slope, and do not compress where growth slows. Also a flat cream fill, a perfect margin, and a crisp beak.

## How the real thing looks

A venus shell is glossy, but its fine concentric growth lines break the highlight into bands, and growth checks show as small steps with a slight colour change. The pigment sits inside the outer shell layer, so the tent edges are slightly soft and the brown runs warmer where it thins. The beak is usually eroded chalky with the pattern faded, the margin is thin enough to glow a little, the ligament is a dark brown horny strip behind the beak, and on wet sand the shell sits in a darker halo with a shadow sharp at the contact and opening up away from it.

## Working log

### Round 0: tuning the margin model (scratch)
- `scratch/rd3.mjs` simulates the activator–inhibitor model and writes the space-time diagram as a PNG (`node scratch/rd3.mjs out.png key=val ...`). `scratch/mont.mjs` puts PNGs side by side.
- Model: a' = s(a²/(b(1+sa·a²)) + ba) − ra·a + Da·a''; b' = kb·s·a² − rb·b + rb·b*. Inhibitor does not diffuse.
- Working regime: ra 1, sa 0.25, ba 0.02, b* 0.3, kb 0.015, rb 0.02, Da 0.5, T 1 time unit per row, random kicks (pt 0.0003 per cell per time, +2 on five cells). This gives clean tents: Λ peaks where a kick fires, V where waves meet. The plain depletion model and a low-ra activator–inhibitor did not make waves.
- Next: the page itself, `index.html`, with a growing margin (cell insertion), von Bertalanffy rows, and the valve.

### Round 1: first page
- Wrote the whole page: margin model, row table, shell bake (height, ridges, normals, albedo), sand bake, Felzenszwalb EDT of the outline, per-frame shadow ray-march at half resolution, `seek`, `init`, `?t=`.
- Render: about 2.5 s init, 0.4 s per frame, deterministic, no `Math.random`.
- Weakest: the valve read as a cone or bell; tents were thin scribbles; sand was uniform speckle.

### Round 2
- Tents: the margin now has one cell per pixel (NF 2470) so waves are resolved; Da 1.0, TT 330, T_ROW 0.25, which doubles the pattern's scale; pigment follows the activator and the inhibitor-rich wake (b smoothed over a few cells), giving bold zigzag bands. Removed the synchronised jolt after growth checks (it drew loud rings).
- Dome: (1 - r^3)^0.4 profile, HMAX 0.13 L, beak region blurred into a knob.
- Sand rebuilt: grains on a jittered grid, each a lit dome, pores darker, asymmetric ripples, rare glints and shell crumbs.

### Round 3
- New outline (beak at about a third of the length), valve rotated -0.62 rad so the beak points toward the sun; this fixed the cone read.
- Pigment supersampled 4x in record coordinates; warmer umber; ligament sprite along the posterior dorsal margin, scaled about the beak each frame.
- Build: each stage is now a scaled replica of the finished valve (bivalves grow nearly isometrically). Growth line r keeps its place on the sand, so the record does not move; the dome and its shadow scale with the stage. Slopes are stored apart (dome vs relief) so the ridges stay with the record.

### Round 4
- Sun lowered to 18 degrees and warmed (sun 1.55/1.34/1.06, sky 0.22/0.27/0.36), longer shadow; bolder bands (pigment thresholds a 0.8, b 0.8); no pigment in the larval shell; the worn beak is a crisp-edged chalky patch with pits.
- Weakest now: ground reads as an even grey field at feed size; the tents keep one rhythm everywhere; the growth lines do not catch the raking light.

### Round 5
- Sector-varying pigment readiness: where it is high the wake pigment runs deeper and tents fill solid.
- Ground lightened from dark basalt to a mid grey sand (`#7a766e`): on the dark ground the low sun's shadow and the ripples were invisible.
- Ripples now wander in wavelength and their crests die out and resume; wrap lighting keeps the shaded aragonite warm.

### Round 6 (final)
- Sun lowered to 13 degrees: long blue shadow, ripples raking. Low-frequency undulation in the dome so the highlight is not a perfect gradient. A sand berm term at the margin and a crevice that blocks only the sun at the contact. Fresh margin rim widened to 14 px.
- Outputs: `out/hero.png` (t 5.2, 1080 x 1350) and `out/build.png` (t 0, 1, 2, 3, 4, 5.2 at 270 px).
- Timing: init about 3.4 s, a frame 0.5 to 0.9 s, deterministic, no `Math.random`.

### Round 7 (after review 1: one more round)
Review fixes, in order:
1. **Pigment edges.** The record is now near-binary (a pigment cell lays or does not), then opened and closed (min/max over 9 cells by 11 rows) to drop specks and fill pinholes, then blurred about 1.3 cells by 1.7 rows, the pigment's spread in the shell layer. The bake reads it at four sub-pixel points with no jitter or threshold noise, and lays it as a Beer-Lambert glaze over the cream (absorption set so full density gives umber), so a thin edge runs warm chestnut. Result: 1 to 2 px soft edges, no islands, the same pattern.
2. **Material and form.** Translucency term (light scattered through the aragonite, tinted by albedo squared) keeps the shaded side cream. Gloss: a broad sun lobe (n 16) plus a sharp one (n 140) on the sunward shoulder, broken into bands by stronger growth ridges, and a Fresnel sky reflection that sees sand below the horizon. Profile (1 - r^6)^0.3 gives a thin edge standing almost straight up, with a fine pale translucent lip. Ligament rebuilt as an amber horn strip straddling the margin, with a fibre texture, a crest highlight and a narrow shadow on the shell.
3. **Build pacing.** The margin now advances at a nearly even pace from 0.62 s (after a 0.12 s larval cap) to BUILD_END 4.6 s, eased in over 0.2 s and out over the last 0.45 s, and slows almost to a stop at each growth check (r 0.45, 0.78). Strip radii: t1 0.12, t2 0.45, t3 0.67, t4 0.87, hero 1. New shell takes 0.3 s to harden: until then it is pale, more translucent and its pigment only faintly laid, so every growing frame shows a band of fresh margin with the newest row half-written (clearest at t = 4).
- Timing: init about 5.3 s, a frame 0.5 to 0.9 s.

## State and what is next
- Updated after round 16; see the end of the working log for the rounds after reviews 2, 3 and 4.
- Page: `index.html` (about 650 lines). Scratch: `scratch/rd3.mjs` (first model tuner, now out of date), `scratch/mont.mjs`, `scratch/strip.py` (build strip from a render folder), `scratch/var.py` (parallel variants through the `?p=` hook; `seed:` picks another margin seed).
- Render: `node tools/render.mjs 06-camp-pitar/index.html <outdir> 0,1,2,3,4,5.2`, then `python3 (a contact-strip script) <outdir> <outdir>/build.png`. Keep scratch renders outside `out/`.
- Nudges left: one sector near the anterior dorsal margin carries a cluster of fine scratchy lines (a fast-recovering sector); the arms are thin, so the feed-size read rests on the first chevron and the tent clusters; the lunule barely reads at feed size; the start of the ligament reads as a small dark crescent under the beak; lit pigment is a mid chestnut, lighter than the card's umber; the gloss reads on the sunward shoulder only; the outline is blunt at the anterior-ventral corner; there is no lettering, by choice.
- The margin model is chaotic: any change to the kick rule or the random draws gives a different pattern. `RD.seed` 2 was chosen by eye from four seeds (round 16).

## Review 2 (blind art director and lead): one more round
Works: soft clean pigment edges, cream in shade, horn ligament, a true blank page at t = 0, a strip that steps through distinct sizes; at 432 px the valve stops a thumb and the growth lines read as the construction.
1. **It reads as a limpet.** A crisp pale nipple with rings closing round it sits at the apex, and the dome peaks at the beak, so the valve shades as a cone. A venus valve is most convex well down from the beak; the beak is small, curled forward (prosogyrate) at the hinge over the lunule. Keep the worn-beak truth, lose the disc-and-knob.
2. **The tents read as torn-paper zigzags.** The card promises rows of tents; spiky wavefronts and thin lines read as rips in a crop. Let the Λ read as tents, by the model's own means. The umber goes cold taupe on the shaded side; keep it warm.
3. **The ground is one flat grey value at feed size.** Ripples show in the strip but are lost in the hero; the wet halo and sand contact do not read. Give the sand a second value so the shell sits in it. Strip: the t = 1 larval shell is a dot; a first stage near a quarter of the valve would read evenly.

### Round 8 (begun by the first builder; kept)
Uncommitted in `index.html` (see `git diff HEAD -- 06-camp-pitar/index.html`): the dome is now a broad swell centred at `DOME.c` well down from the beak (`domeAt`), the beak blur is tighter (a small rounded hook), the worn chalk patch is a small disc at the beak, a lunule depression is cut in front of the beak (`LUN`, `lunuleAt`), and growth ridges fade out on the worn umbo. A `?p=` tuning hook (`/*TUNE*/`) and new optional RD terms (`hc`, `hr`, `brec`, `s0`, `sz`, `sf`) were added for tent tuning but not yet tuned. `out/r8/` held one render of that state (now removed). Fixes 2 and 3 were not started. The second builder kept all of it: the dome swell, tighter beak blur and lunule cut the cone read.

### Round 9 (second builder): tents
- Tuning tools: `scratch/var.py <outdir> <t> <crop|full[:w]> name=k:v,k:v ...` renders variants in parallel through the page's `?p=` hook (sets `RD`, or `PIGM` with a `P` prefix) and lays them side by side. Scratch renders go to `/tmp/ma11/`, outside `out/`.
- Fewer, cleaner fronts: kicks only fire where the inhibitor has fallen below `brec` 0.6 (rested tissue), and `pt` 0.0006. This removed the small front jumps that made the torn-paper teeth. Alone it gives regular concentric zebra chevrons (variants A to K), with no tents.
- A first try, pigment kept on while any front within `tw` cells was still running, filled the V notches into blobs (L to O). Dropped.
- What works: each trigger also releases a short pulse of a fast-spreading signal (lifetime `tD` 50, reach `tv` 2 cells per time unit, the measured wave speed). While it lasts, the cells its wave has passed keep laying pigment (inhibitor above `PIGM.t` 0.5), so the peak of each Λ fills solid down to a base laid all at once when the pulse dies; the arms run on as lines. The pulse is weaker toward its reach (`tc` 1: duration falls as 1 - q²), so the base arcs up to its corners and no tent ends in a vertical cut. Lines from the wake are thinner (`PIGM.b` 1.1), and the fill readiness zones (`PIGM.fill` 0.25) thicken them into chestnut fields in places. This is the species' own description: "zigzag lines with attached chevron or triangular marks" and "solid tents" (van der Meij et al. 2010).
- Measured wave speed (`/tmp/ma11/speed.mjs`, one kick on a resting margin): 2 cells per time unit at Da 1, inhibitor peak 1.35. `T_ROW` only sets sampling, not tent slope (slope is wave speed over radial growth speed); 0.4 keeps rows under 1.3 px and is faster.
- Warm umber in shade: the cold taupe came from the blue Fresnel sky reflection on dark pigment with nothing warm under it. The translucency term now leaves through the pigment on a shorter path than reflected light (`TR/TG/TB`, cream squared times exp(-0.75 dens ABS)), so shaded tents stay chestnut; sky reflection 1.6 -> 1.1, translucency on the lit side cut (1 - 0.85 ndl). In-page sampler `/tmp/ma11/samp.mjs`: shaded pigment went from 56,52,54 (blue-grey) to 71,54,47.

### Round 10: ground, strip, beak
- Ground second value: ripples rescaled (wavelength 126 -> 215 px, height 6.5 to 9.5 px) and the ebb drains the crests first, so troughs hold water: darker (0.74 to 1.08 of albedo with ripple phase) with water-filled pores. A damp ring with a noisy edge hugs the valve (`SHN` noise, 10 to 26 px at full size).
- Strip: growth speed now carries a (1 + 3(1 - r)²) term (fastest while young, as von Bertalanffy growth is) and the larva ends at 0.55 s. Radii: t1 0.26, t2 0.55, t3 0.78 (at the second check), t4 0.92; the area added per second is about even. Fresh-shell band is now the narrower of 0.3 s and 30 px, so the fast young shell no longer reads as an empty translucent cup; sand show-through 0.3 -> 0.2.
- Beak: the dome is lowered toward the beak (`RD.bk` 0.25 over 0.22 valve lengths) so it rolls down to the hinge; the worn patch is smaller and cream-grey; the lunule is a brown-washed lens with a deeper groove (still faint at feed size). A first try at a juvenile fine net (kicks x4 when young) laid a solid brown cap on the umbo: dropped. Kept: young wakes are short and young tents small (`juv`, r < 0.34), and pigment fades in over r 0.05 to 0.16, so the umbo carries one thin chevron, no cap.

### Round 11: escutcheon
- The posterior end of the mantle (sigma < `RD.pw` 0.14) fires 15 times as often, with no tents and thinner wakes: a dense field of fine lines along the posterior dorsal margin, as the species has. Subtle at feed size; it breaks the symmetry round the beak.
- Timing: init about 4.7 s, a frame 0.5 to 1.0 s, deterministic, no `Math.random`.

### Round 12: record cleaning, final
- The opening and closing by a 9 x 11 rectangle is replaced by a group average (gaussian 2.5 cells by 3 rows) re-thresholded at 0.5: the same specks and pinholes go (the record has 13 pigment islands either way, counted in-page), no rectangle corners can come from it, and init is a second faster.
- Outputs: `out/hero.png` (t 5.2) and `out/build.png` (t 0, 1, 2, 3, 4, 5.2). `out/r8/` removed.
- Timing: init 3.7 s, a frame 0.5 to 1.0 s, deterministic, no `Math.random`, no page errors.

## Review 3 (blind art director and lead): one more round, the last
Works: the tents read as tents in warm chestnut; the strip (blank page, quarter-size valve at t = 1, even eased steps); at 432 px it stops a thumb and the growth lines read as the construction.
1. **The ground reads as asphalt**: about `#484744`, cold charcoal against the card's `#7a766e`; white glints read as a starfield; the damp ring does not read.
2. **The growth lines read as 3D-print layer lines**: evenly spaced embossed bright rings round the apex, bringing back the cone. Lower and vary them, let them show in the highlight, fade them on the umbo.
3. **A few tent sides step like stairs**: right-angled corners a mantle could not lay.

### Round 13: ground and growth lines
- Sand calibrated to the card: `calibrateSand()` scales each channel of the sand's albedo so the open sand, under this sun and sky and through the tone curve, averages `#7a766e` as displayed. Measured after: `#78746c` to `#7b776f` in three open corners. Under a 13 degree sun the albedo that gives the card's grey is far paler than the swatch; the old page used the swatch as the albedo, hence the charcoal.
- Glints: a tenth of their old strength, and only on wet trough grains.
- Damp ring: 0.46 darker out to 44 to 66 px (finished size) with a noisy edge, plus the old soft falloff. Reads as a darker halo at 432 px.
- Growth lines: spacing wanders (row/6 plus a warp of 9 and 3 ridges), each ridge has its own height (hash to the power 2.5, so most are faint), relief at 0.45 of before, fading on the umbo over r 0.08 to 0.4. The diffuse light sees the dome and 0.35 of the relief (`KD`); the highlight and the sky reflection see all of it, so the lines show chiefly in the gloss.

### Round 14: clean arms
- The wake threshold on the inhibitor is replaced by timed pigment cells: a cell the wave sets laying keeps laying for `PIGM.w` 8 time units, up to `PIGM.fill` 10 more where the readiness is high, shorter on the escutcheon and in the young clam. Each arm is now a line of even width behind its front. The old threshold made wakes end along a radius wherever the threshold varied, which drew the right-angled risers.
- Kicks fire only clear of a running front (no activator above 0.3 within `kg` 14 cells): a kick just ahead of a front only made it jump, a stair step. With fewer near-front tents, `pt` rose to 0.0012 to keep the rows of tents.
- The umbo: young lines at half width, no young tents, and the escutcheon's extra firing fades in with size; together they removed a brown crescent at the beak.

### Round 15: tents bounded by their own wave
- A tent's fill now reaches, on each side, only as far as its own wave ran: the full reach while that arm still runs, or the point where the arm met another wave or stalled. Its base comes down to meet the arm there, so no tent ends in a wall. Releasing pulses only into wide rested tissue (tried first) also removed the walls but cut most of the tents; dropped.
- Seed: the margin stream is `rngFor('margin' + RD.seed)`; seed 1 chosen by eye from four.
- Outputs: `out/hero.png` (t 5.2) and `out/build.png` (t 0, 1, 2, 3, 4, 5.2). Timing: init 3.7 s, a frame 0.5 to 1.0 s, deterministic, no `Math.random`, no page errors.

## Review 4 (blind art director and lead): one fix
Works: the warm grey sand, ripples and damp halo; the smooth glossy shell with no risers; the strip.
- **The fix: the tents had fallen into lockstep**, six evenly spaced zigzag rings round the beak, a target or zebra print. Let the rows drift, merge and branch, with white dominant and the brown gathered in the tents; remove the ink-spill blob on the third ring.
- If cheap: fine sawtooth on the arm edges at 540 px; growth lines invisible in the gloss below the apex.

### Round 16: rows out of step
- Why the lockstep: after a sweep the whole margin recovered at once, and a wave can enter tissue (inhibitor below about 1) long before a cell there may fire (below `brec` 0.6), so the first sector to fire entrained all the others: one generation, one ring, round the whole margin.
- The inhibitor's recovery rate now drifts slowly by sector, `rb * e^(rv n)` with `n` a noise in (sigma * `rf`, tau / `rt`): `rv` 1.5, `rf` 4, `rt` 120. With `rv` up to 0.9 the rings stayed. It took `rv` 1.5 together with `brec` 0.85, so cells may fire about as soon as they can conduct again; then each sector keeps its own time and its rows drift, branch where a fast sector meets a slow one, and merge.
- White dominant: arms thinner (`PIGM.w` 4, `PIGM.fill` 3) and fewer triggers (`pt` 0.0008), so the brown gathers in the tents and the solid fields (the ink-spill blob was one) are gone. Seed 2 of four.
- Small items: the final record blur across rows 1.7 -> 2.6 rows clears the sawtooth on shallow arms; growth lines fade on the umbo over r 0.05 to 0.2 (was 0.08 to 0.4) at 0.55 relief (was 0.45), so they show again in the highlight below the apex.
- Outputs: `out/hero.png`, `out/build.png`. Timing: init 3.8 s, a frame 0.6 to 1.0 s, deterministic, no `Math.random`, no page errors.
