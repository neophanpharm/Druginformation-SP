// Render ảnh tĩnh để QA.
//   node scripts/stills.mjs [scale] [relPositions...]
//   COMP=ErtapenemReel TL=src/reel/timeline.json ONLY=PD,MOA node scripts/stills.mjs 0.5 0.3 0.6 0.9
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const COMP = process.env.COMP ?? "ErtapenemSeizure";
const TL = process.env.TL ?? "src/timeline.json";
const timeline = JSON.parse(fs.readFileSync(path.resolve(TL), "utf8"));
const scale = Number(process.argv[2] ?? 0.5);
const rels = process.argv.slice(3).map(Number);
const positions = rels.length ? rels : [0.25, 0.55, 0.85];
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;

const T = timeline.transitionFrames;
let cursor = 0;
const scenes = timeline.scenes.map((s, i) => {
  const start = i === 0 ? 0 : cursor - T;
  cursor = start + s.dur;
  return { ...s, start };
});

const outDir = path.resolve(`out/stills/${COMP}`);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = { gl: "angle" };
const composition = await selectComposition({ serveUrl, id: COMP, chromiumOptions });
for (const s of scenes) {
  if (only && !only.includes(s.id)) continue;
  for (const p of positions) {
    const frame = Math.min(composition.durationInFrames - 1, s.start + Math.round(s.dur * p));
    const output = path.join(outDir, `${s.id}_${String(Math.round(p * 100)).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, output, scale, chromiumOptions });
    console.log(s.id, frame, output);
  }
}
