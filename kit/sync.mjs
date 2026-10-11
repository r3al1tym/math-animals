// Paste the current kit.js between the kit markers of each page given.
// usage: node kit/sync.mjs <page.html> [more.html ...]
//        node kit/sync.mjs --kit=kit/kit-next.js <page.html>   (test a draft kit)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const B = '// ===== math-animals kit v1 begin =====', E = '// ===== math-animals kit v1 end =====';
const args = process.argv.slice(2), opt = args.find(a => a.startsWith('--kit=')), kitPath = opt ? path.resolve(opt.slice(6)) : path.join(here, 'kit.js');
const kit = fs.readFileSync(kitPath, 'utf8').trim();
if (!kit.startsWith(B) || !kit.endsWith(E)) { console.error(`${kitPath} must begin and end with its marker lines`); process.exit(1); }
const files = args.filter(a => !a.startsWith('--kit='));
if (!files.length) { console.error('usage: node sync.mjs <page.html> [...]'); process.exit(1); }
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8'), i = s.indexOf(B), j = s.indexOf(E, i);
  if (i < 0 || j < 0) { console.error(`${f}: no kit markers`); process.exitCode = 1; continue; }
  const out = s.slice(0, i) + kit + s.slice(j + E.length);
  if (out !== s) fs.writeFileSync(f, out);
  console.log(`${f}: ${out === s ? 'already current' : 'synced'}`);
}
