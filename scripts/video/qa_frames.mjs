#!/usr/bin/env node
// QC tự động trên file MP4 cuối: lấy mẫu 2 khung/giây thành contact sheet, phát hiện đoạn hình đứng yên,
// đo âm lượng (EBU R128). Cần ffmpeg ĐẦY ĐỦ (brand/brand.json → tools.ffmpegFull).
//
//   node scripts/video/qa_frames.mjs <video.mp4> <thư-mục-ra> [--freeze 2] [--skip-edges 6]
//   (--skip-edges: bỏ qua N giây đầu/cuối – thẻ logo mở đầu và kết được phép tĩnh)
//
// Đầu ra: <thư-mục-ra>/sheet-XX.png (mỗi tờ 6×4 = 24 khung = 12 giây), qa-frames.md (bảng kết quả).
// Thoát mã 1 nếu có đoạn đứng yên > ngưỡng hoặc LUFS ngoài [-16, -14] hoặc true peak > -1 dBTP.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const [video, outDir, ...rest] = process.argv.slice(2);
if (!video || !outDir) { console.error("Cách dùng: node scripts/video/qa_frames.mjs <video.mp4> <out-dir> [--freeze 2]"); process.exit(2); }
const arg = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? Number(rest[i + 1]) : d; };
const freezeSec = arg("--freeze", 2), edges = arg("--skip-edges", 6);
const brand = JSON.parse(fs.readFileSync(new URL("../../brand/brand.json", import.meta.url), "utf8"));
const ffmpeg = brand.tools.ffmpegFull, ffprobe = brand.tools.ffprobeFull;
fs.mkdirSync(outDir, { recursive: true });

const probe = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate", "-of", "json", video]).toString());
const dur = Number(probe.format.duration);
const v = probe.streams.find((s) => s.codec_type === "video");
const hasAudio = probe.streams.some((s) => s.codec_type === "audio");

// 1. Contact sheet 2 khung/giây, 24 khung mỗi tờ
execFileSync(ffmpeg, ["-v", "error", "-y", "-i", video, "-vf", "fps=2,scale=216:-1,tile=6x4", path.join(outDir, "sheet-%02d.png")]);
const sheets = fs.readdirSync(outDir).filter((f) => /^sheet-\d+\.png$/.test(f)).sort();

// 2. Đoạn hình đứng yên (freezedetect) – chỉ tính vùng nội dung: cắt bỏ header 210 px và đáy 268 px (khung medical-clean)
const H = Number(v.height);
const crop = H >= 1900 ? `crop=iw:ih-478:0:210,` : "";
const fz = spawnSync(ffmpeg, ["-hide_banner", "-nostats", "-i", video, "-vf", `${crop}freezedetect=n=0.003:d=${freezeSec}`, "-an", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const freezes = [...fz.matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)].map((m) => ({ start: Number(m[1]), d: Number(m[2]) })).filter((f) => f.start + f.d > edges && f.start < dur - edges);

// 3. Âm lượng EBU R128
let lufs = null, peak = null;
if (hasAudio) {
  const eb = spawnSync(ffmpeg, ["-hide_banner", "-nostats", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  lufs = Number((eb.match(/I:\s+(-?[\d.]+) LUFS/g) ?? []).pop()?.match(/-?[\d.]+/)?.[0]);
  peak = Number((eb.match(/Peak:\s+(-?[\d.]+) dBFS/g) ?? []).pop()?.match(/-?[\d.]+/)?.[0]);
}

const fails = [];
if (freezes.length) fails.push(`${freezes.length} đoạn hình đứng yên > ${freezeSec} s`);
if (lufs !== null && (lufs < -16 || lufs > -14)) fails.push(`LUFS ${lufs} ngoài khoảng −16…−14`);
if (peak !== null && peak > -1) fails.push(`true peak ${peak} dBFS > −1`);
if (!hasAudio) fails.push("không có luồng âm thanh");

const md = `# QC tự động khung hình – ${path.basename(video)}

- Kích thước: ${v.width}×${v.height}, ${v.r_frame_rate} fps, ${dur.toFixed(2)} s
- Contact sheet: ${sheets.length} tờ (2 khung/giây; mỗi tờ = 12 s): ${sheets.join(", ")}
- Đoạn đứng yên > ${freezeSec} s (vùng nội dung, bỏ ${edges} s đầu/cuối): ${freezes.length ? freezes.map((f) => `${f.start.toFixed(1)} s (${f.d.toFixed(1)} s)`).join("; ") : "không có"}
- Âm lượng: ${lufs ?? "—"} LUFS, true peak ${peak ?? "—"} dBFS
- Kết quả: ${fails.length ? "**CHƯA ĐẠT** – " + fails.join("; ") : "**ĐẠT**"}

> Contact sheet phải được agent xem lại bằng mắt: chữ đọc được, không tràn vùng an toàn, phụ đề không đè nội dung.
`;
fs.writeFileSync(path.join(outDir, "qa-frames.md"), md, "utf8");
console.log(md);
process.exit(fails.length ? 1 : 0);
