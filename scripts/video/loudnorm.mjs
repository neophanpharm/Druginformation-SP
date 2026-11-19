#!/usr/bin/env node
// Chuẩn hóa âm lượng 2 lượt (EBU R128) về -15 LUFS, true peak -1.5 dBTP; giữ nguyên luồng hình.
//   node scripts/video/loudnorm.mjs <in.mp4> <out.mp4> [--I -15] [--TP -1.5] [--LRA 11]
// Cần ffmpeg ĐẦY ĐỦ (brand/brand.json → tools.ffmpegFull).
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) { console.error("Cách dùng: node scripts/video/loudnorm.mjs <in.mp4> <out.mp4>"); process.exit(2); }
const arg = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : d; };
const I = arg("--I", "-15"), TP = arg("--TP", "-1.5"), LRA = arg("--LRA", "11");
const brand = JSON.parse(fs.readFileSync(new URL("../../brand/brand.json", import.meta.url), "utf8"));
const ff = brand.tools.ffmpegFull;

const p1 = spawnSync(ff, ["-hide_banner", "-nostats", "-i", input, "-af", `loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:print_format=json`, "-f", "null", "-"], { encoding: "utf8" });
const json = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf("{"), p1.stderr.lastIndexOf("}") + 1));
console.log(`Lượt 1: ${json.input_i} LUFS, true peak ${json.input_tp} dBTP, LRA ${json.input_lra}`);
const af = `loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:measured_I=${json.input_i}:measured_TP=${json.input_tp}:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true:print_format=summary`;
const p2 = spawnSync(ff, ["-hide_banner", "-nostats", "-y", "-i", input, "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", output], { encoding: "utf8" });
if (p2.status !== 0) { console.error(p2.stderr.slice(-2000)); process.exit(1); }
const out = p2.stderr.match(/Output Integrated:\s+(-?[\d.]+)[\s\S]*?Output True Peak:\s+([+-]?[\d.]+)/);
console.log(`Lượt 2 (ước tính): ${out ? out[1] : "?"} LUFS, true peak ${out ? out[2] : "?"} dBTP → ${output}`);
