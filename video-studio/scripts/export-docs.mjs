// Xuất timestamp.md/.json, phụ đề .srt từ src/timeline.json (cùng công thức với timing.ts).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tl = require("../src/timeline.json");
const [, , workDir = "../work/ertapenem-co-giat/video", outBase = "../output/video/ertapenem-co-giat"] = process.argv;

const T = tl.transitionFrames, fps = tl.fps;
let cursor = 0;
const rows = tl.scenes.map((s, i) => {
  const start = i === 0 ? 0 : cursor - T;
  const end = start + s.dur;
  cursor = end;
  const lead = s.voiceLeadFrames ?? tl.voiceLeadFrames;
  const vStart = start + lead;
  const vEnd = vStart + Math.round(s.voiceSec * fps);
  return { ...s, start, end, vStart, vEnd };
});
const total = cursor;
const tc = (fr) => {
  const sec = fr / fps;
  const m = Math.floor(sec / 60), ss = (sec % 60).toFixed(2).padStart(5, "0");
  return `${m}:${ss}`;
};
const srtT = (fr) => {
  const ms = Math.round((fr / fps) * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), r = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(r).padStart(3, "0")}`;
};

let md = `# Timestamp – Video ertapenem và co giật\n\nTự sinh từ \`video-studio/src/timeline.json\`. ${fps} fps, chuyển cảnh ${T} khung (${(T / fps).toFixed(2)} s) chồng lên nhau. Tổng ${total} khung = ${tc(total)}.\n\n`;
md += `| Cảnh | Nội dung | Bắt đầu | Kết thúc | Thời lượng | Lời đọc | Chuyển cảnh sau | Nguồn (footer) |\n|---|---|---|---|---|---|---|---|\n`;
for (const r of rows) {
  md += `| ${r.id} | ${r.title} | ${tc(r.start)} | ${tc(r.end)} | ${(r.dur / fps).toFixed(1)} s | ${r.voice ? `${tc(r.vStart)}–${tc(r.vEnd)}` : "—"} | ${r.transition ?? "—"} | ${r.sources.join("; ") || "—"} |\n`;
}
fs.writeFileSync(path.join(workDir, "timestamp.md"), md, "utf8");
fs.writeFileSync(path.join(workDir, "timestamp.json"), JSON.stringify({ fps, total, scenes: rows }, null, 2), "utf8");

let srt = "", n = 1;
for (const r of rows) {
  if (!r.voice || !r.text) continue;
  // Tách câu dài thành các dòng phụ đề ngắn, chia thời gian theo số ký tự.
  const parts = r.text.split(/(?<=[.,])\s+/).reduce((acc, p) => {
    const last = acc[acc.length - 1];
    if (last && (last + " " + p).length <= 84) acc[acc.length - 1] = last + " " + p; else acc.push(p);
    return acc;
  }, []);
  const totalChars = parts.reduce((a, p) => a + p.length, 0);
  let t0 = r.vStart;
  for (const p of parts) {
    const t1 = t0 + Math.round(((r.vEnd - r.vStart) * p.length) / totalChars);
    srt += `${n++}\n${srtT(t0)} --> ${srtT(t1)}\n${p}\n\n`;
    t0 = t1;
  }
}
fs.writeFileSync(`${outBase}.srt`, srt, "utf8");
console.log("total", total, tc(total));
