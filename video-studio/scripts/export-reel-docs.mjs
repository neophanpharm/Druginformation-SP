// Xuất timestamp.md/.json và .srt cho reel 9:16 từ src/reel/timeline.json + captions.json.
import fs from "node:fs";
import path from "node:path";

const tl = JSON.parse(fs.readFileSync(process.env.TL ?? "src/reel/timeline.json", "utf8"));
const caps = JSON.parse(fs.readFileSync("src/reel/captions.json", "utf8"));
const workDir = process.argv[2] ?? "../work/ertapenem-co-giat/video";
const outBase = process.argv[3] ?? "../output/video/ertapenem-co-giat-reel-9x16";
const fps = tl.fps, T = tl.transitionFrames;

let cursor = 0;
const rows = tl.scenes.map((s, i) => {
  const start = i === 0 ? 0 : cursor - T;
  const end = start + s.dur;
  cursor = end;
  const lead = s.voiceLeadFrames ?? tl.voiceLeadFrames;
  const vStart = start + lead, vEnd = vStart + Math.round(s.voiceSec * fps);
  return { ...s, start, end, vStart, vEnd };
});
const total = cursor;
const tc = (fr) => { const s = fr / fps; return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`; };
const st = (fr) => { const ms = Math.round((fr / fps) * 1000); const p = (n, w = 2) => String(n).padStart(w, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`; };

let md = `# Timestamp – Reel 9:16 "Ertapenem & co giật"\n\nTự sinh từ \`video-studio/src/reel/timeline.json\`. 1080×1920, ${fps} fps, chuyển cảnh ${T} khung chồng nhau. Tổng ${total} khung = ${tc(total)}.\n\n`;
md += `| Cảnh | Chương | Tiêu đề trên màn hình | Bắt đầu | Kết thúc | Thời lượng | Lời đọc | Chuyển cảnh | Nguồn (footer) |\n|---|---|---|---|---|---|---|---|---|\n`;
for (const r of rows) md += `| ${r.id} | ${r.chapter || "—"} | ${r.title || "—"} | ${tc(r.start)} | ${tc(r.end)} | ${(r.dur / fps).toFixed(1)} s | ${r.voice ? `${r.voice}: ${tc(r.vStart)}–${tc(r.vEnd)}` : "nhạc"} | ${r.transition ?? "—"} | ${r.sources.join("; ") || "—"} |\n`;
const tag = process.env.TAG ?? "reel";
fs.writeFileSync(path.join(workDir, `timestamp-${tag}.md`), md, "utf8");
fs.writeFileSync(path.join(workDir, `timestamp-${tag}.json`), JSON.stringify({ fps, total, scenes: rows }, null, 2), "utf8");

// SRT: nhóm từ thành dòng ≤ 42 ký tự, ngắt ở dấu câu; mốc theo từng từ thật.
const cues = [];
for (const r of rows) {
  if (!r.voice) continue;
  const words = caps[r.voice].map(([t, s, e]) => ({ t, s: r.vStart + s * fps, e: r.vStart + e * fps }));
  for (const line of phraseChunks(words.map((w) => ({ ...w, text: w.t })), 50))
    cues.push({ a: line[0].s, b: line[line.length - 1].e + 6, text: line.map((w) => w.t).join(" ") });
}

// Ngắt theo cụm nghĩa – cùng logic với phraseChunks trong src/mc/kit.tsx.
function phraseChunks(ws, max) {
  const FUNC = new Set("và nhưng nên khi với ở trong của cho có hoặc hay từ sau bằng làm giúp để thì là được mà đến dưới vào kể ngăn liên nếu rồi".split(" "));
  const len = (a) => a.map((w) => w.text).join(" ").length;
  const splitLong = (a) => {
    if (len(a) <= max || a.length < 2) return [a];
    let best = 1, bestCost = Infinity;
    for (let i = 1; i < a.length; i++) {
      const cost = Math.abs(len(a.slice(0, i)) - len(a.slice(i))) + (FUNC.has(a[i].text.toLowerCase()) ? 0 : 40);
      if (cost < bestCost) { bestCost = cost; best = i; }
    }
    return [...splitLong(a.slice(0, best)), ...splitLong(a.slice(best))];
  };
  const clauses = []; let cur = [];
  ws.forEach((w, i) => {
    cur.push(w);
    const stop = /[.;!?]$/.test(w.text), comma = /,$/.test(w.text);
    if (stop || comma || i === ws.length - 1) { clauses.push({ ws: cur, end: stop }); cur = []; }
  });
  const out = []; let acc = [];
  for (const c of clauses) {
    if (acc.length && len([...acc, ...c.ws]) > max) { out.push(...splitLong(acc)); acc = []; }
    acc = [...acc, ...c.ws];
    if (c.end) { out.push(...splitLong(acc)); acc = []; }
  }
  if (acc.length) out.push(...splitLong(acc));
  return out;
}
cues.forEach((c, i) => { if (cues[i + 1] && c.b > cues[i + 1].a - 1) c.b = cues[i + 1].a - 1; });
const srt = cues.map((c, i) => `${i + 1}\n${st(c.a)} --> ${st(c.b)}\n${c.text}\n`).join("\n");
fs.writeFileSync(`${outBase}.srt`, srt, "utf8");
console.log("total", total, tc(total), "srt cues", cues.length);
