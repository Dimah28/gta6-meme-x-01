// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post named in POST.json: a GTA 6 meme ("FOR SALE:
// Vice City") posted on X with make.fun and the entrant's play code in
// its text. The house reads the post itself from X, so this program
// only has to hand the gate the post's address: it copies POST.json
// from the repository directory into the output directory.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// Afterwards out/POST.json is byte for byte the repository's POST.json.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

// Validate the post file before handing it to the gate: it must be a
// JSON object whose url names an X post. A bad file fails loudly here
// instead of shipping a copy the gate would refuse.
const sourcePath = join(BOT_DIR, 'POST.json');
let postUrl: unknown;
try {
  postUrl = (JSON.parse(readFileSync(sourcePath, 'utf8')) as { url?: unknown }).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof postUrl !== 'string' || !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\//.test(postUrl)) {
  console.error(`POST.json does not name an X post: ${String(postUrl)}`);
  process.exit(1);
}

try {
  copyFileSync(sourcePath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`could not copy POST.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
