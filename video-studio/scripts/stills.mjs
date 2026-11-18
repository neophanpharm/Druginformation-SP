// Render ảnh tĩnh để QA: node scripts/stills.mjs [scale] [relPositions...]
// Mặc định mỗi cảnh lấy 3 khung: 25%, 55%, 85% thời lượng cảnh.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const timeline = require("../src/timeline.json");
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

const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "ErtapenemSeizure" });
for (const s of scenes) {
  if (only && !only.includes(s.id)) continue;
  for (const p of positions) {
    const frame = s.start + Math.round(s.dur * p);
    const output = path.join(outDir, `${s.id}_${String(Math.round(p * 100)).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, output, scale });
    console.log(s.id, frame, output);
  }
}
