#!/usr/bin/env node
// Bản duyệt gắn mã băm (ý tưởng từ claude-video-kit): duyệt kịch bản/timeline gắn với SHA-256;
// sửa nội dung thì bản duyệt cũ mất hiệu lực. Duyệt bản cuối gắn với đúng file MP4.
//
//   node scripts/video/review_hash.mjs record <review.json> <stage> <người duyệt> <file...>
//   node scripts/video/review_hash.mjs verify <review.json> <stage>
//
// stage: "script" (kịch bản + timeline + facts, trước khi tiêu credit/ render) hoặc "final" (MP4 + srt).
// Thoát mã 1 nếu verify thất bại (file đã đổi sau khi duyệt hoặc chưa duyệt).
import fs from "node:fs";
import crypto from "node:crypto";

const [cmd, reviewPath, stage, ...rest] = process.argv.slice(2);
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const load = () => (fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, "utf8")) : {});

if (cmd === "record") {
  const [reviewer, ...files] = rest;
  if (!reviewer || !files.length) { console.error("Thiếu người duyệt hoặc file."); process.exit(2); }
  const db = load();
  db[stage] = { reviewer, date: new Date().toISOString(), files: Object.fromEntries(files.map((f) => [f, sha(f)])) };
  fs.writeFileSync(reviewPath, JSON.stringify(db, null, 2), "utf8");
  console.log(`Đã ghi duyệt "${stage}" bởi ${reviewer} cho ${files.length} file.`);
} else if (cmd === "verify") {
  const rec = load()[stage];
  if (!rec) { console.log(`CHƯA DUYỆT: không có bản duyệt "${stage}".`); process.exit(1); }
  const changed = Object.entries(rec.files).filter(([f, h]) => !fs.existsSync(f) || sha(f) !== h).map(([f]) => f);
  if (changed.length) { console.log(`HẾT HIỆU LỰC: file đã đổi sau khi duyệt "${stage}":\n` + changed.map((f) => `- ${f}`).join("\n")); process.exit(1); }
  console.log(`HỢP LỆ: "${stage}" duyệt bởi ${rec.reviewer} lúc ${rec.date}; ${Object.keys(rec.files).length} file khớp mã băm.`);
} else {
  console.error("Lệnh: record | verify");
  process.exit(2);
}
