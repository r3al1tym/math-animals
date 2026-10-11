# 09 cone shell: notes

The pattern comes from Meinhardt and Klingler's activator–inhibitor model with a global hormone (J. Theor. Biol. 126, 1987; *The Algorithmic Beauty of Sea Shells*, 1995). It is a proposed mechanism; the real chemistry of the mantle edge is unknown. The page runs the discrete form of Meinhardt's own program for *Conus textile*:

- activator: `a ← a(1 − r_a − 2D_a) + D_a(a_L + a_R) + s·a²/((s_b + b)(1 + s_a a²))`
- inhibitor: `b ← b(1 − r_b/c) + s·a²/(1 + s_a a²)`
- hormone: `c` follows the mean activator at rate `r_c`, shared by the whole lip.

As differential equations: `da/dt = s·a²/((s_b + b)(1 + s_a a²)) − r_a a + D_a a″`, `db/dt = s·a²/(1 + s_a a²) − (r_b/c) b`, `dc/dt = r_c (mean a − c)`. The source density `s` is `r_a` with a fixed seeded scatter of ±4 percent per cell. Values: D_a 0.015, r_a 0.1, s_a 0.25, s_b 0.10, r_c 0.1, r_b 0.016 (Meinhardt prints 0.014; 0.016 gave the widest spread of triangle sizes on a lip this long with no pacemaker chevrons). The page clamps `r_b/c` at 1 so the step stays stable if every wave dies. The lip has 560 cells, plus 24 more simulated past each end so the ends behave like open lip. Each growth line is 12 steps of the model and a whorl is 640 growth lines (seed `cone:b`). The run is 8521 lines: 1119 to settle, then the nine spire whorls and the body whorl, with the lip as its last line. The settling length was chosen from a scan so the body whorl shows tents of every size with no one tent big enough to read as bare shell: on its visible half, white gaps along a growth line run from 1 to 116 cells (median 9, 95th percentile 42). Waves start where the scatter tips a cell over, run sideways at just under a cell per growth line, and annihilate where they meet, which closes a triangle. On the plate the magnifier's note ("two waves meet: the triangle closes") carries the rule; the equations live here.

Pigment rule (the page's own, standing in for the mantle's pigment cells): each cell keeps a deposit `P = max(a, 0.88·P)` per growth line. A wave's crest is dark chocolate (#26130a, near-black #110804 at its core). The fading deposit stays white-cream (#f6eedc) where thin and takes a golden-tan wash (#d4a352) only where waves come thick, with milk chocolate (#4a2812) just behind a crest. Three spiral bands of the lip (cells 150, 300 and 455) lay the wash deeper, toward ochre (#b07a22). The bands are a colouring choice to match the real shell; the model itself has no bands.

The shell is a large specimen, 130 mm long (the species reaches about 130–150 mm) and 66 mm across the shoulder, so its width is 0.51 of its length. It has a low stepped spire of nine whorls rising 24 mm and a rounded shoulder. On each spire whorl, a short steep side above the suture takes 36 percent of the rise, then a rounded shoulder and a gently sloping ramp. The body whorl is a cone of half-angle 17.6° with a slight swell. The shell lies on its aperture in dorsal view, spire up the plate, resting on the lip's generator, with its anterior tip on the fan's centre. The fan is the body cone unrolled exactly: a sector of 2π sin α = 108.9° and radius 109 mm (the slant length), cut along the shell's top line (age 320) and opened both ways from the contact line. So each radius is a growth line, each arc a cell of the lip, and each flank of the shell continues onto the half of the fan beside it. Its radii are numbered from the oldest line of the whorl (n = 640 − age). Both outer radii are line 320, and 160 and 480 are lettered between them, with cell arcs 100, 300 and 500. The fan's outline is the heaviest pencil, and the two radii nearest the lip (lines 40 and 600) run on under the shell and out past its spire. The shell is ray-cast at true size (3.6 px/mm) and glazed: wrap diffuse lit from the upper left, one broad soft reflection of the window on the shoulder at 40 percent, and a Fresnel reflection of the card and drawer walls. The shadow is cut from 24 height slices of the solid, each offset by its height times K and blurred with it, in two layers. The contact shadow, at 40 percent, takes the slices below 42 percent of the shell's height, blurred 0.07 × height, plus the crevice under the body and the outline laid 8 px down-right. The cast shadow, at 20 percent, takes every slice, softened twice as fast.

The build lays the shell down in growth order. The spire turns up first, then the whorl before the last (1.05 to 1.6 s). That whorl is the same shell one turn younger, smaller by 0.86 (the spire's first step) about the apex, written with lines 640 to 1280 of the same run. Then the lip sweeps the body whorl over it (1.6 to 3.95 s), laying the shell line by line while the pencil writes the same rows on the fan. The loupe (× 4) shows each growth line as a faint rule and each active cell as a dot. Two fronts 26 cells apart close over 21 growth lines and meet at growth line 359 (age 281), cell 89. The two fronts are drawn heavier, in the loupe and on the fan, and the meeting point is circled; a leader runs from it to the same point on the shell.

All registration is pencil on the card, under the specimen.
- The meeting-point leader runs on under the shell.
- The two largest tents in view, other than the loupe's, are ringed on the fan: age 290, cell 180, and age 417, cell 130. A dashed arc about the tip (a cone rolls about its tip) carries each one to the same tent on the shell.
- The cell arcs span the whole fan, so they meet under the shell as rings round the cone.
- Leaders and rings run in a gap left in the fan's pencil.

## Label

- No. 9
- *Conus textile* Linnaeus, 1758
- cloth-of-gold cone, 130 mm
- each growth line is one step
- of the waves along the lip

## Trials (s_b; all else as above)

The ticked trial is the specimen itself: its own field, 560 cells and 640 lines a whorl, drawn small. The others each run a 160-cell lip (183 growth lines a whorl) and show half a whorl in pencil: crests traced, the deposit as a light tone.

- 0.05: zigzags (from line 1360 of its run)
- 0.10: triangles, ticked, the real shell (the specimen's visible half whorl, ages 160 to 480)
- 0.22: beads, bands of pulsing peaks
- 0.30: stripes, steady bands
- 0.60: blank, no activation

Values scanned between these: 0.13 gives small dense triangles, and 0.17 to 0.21 give broken wedge-shaped streaks. No value from 0.05 to 0.6 gives separate dots, so the trial lettered "beads" stands where the card's "dots" would be.
