#!/usr/bin/env node
// Kiểm chứng chữ/số trên màn hình với facts.md (ý tưởng từ paper2video/check_claims.py).
//
//   node scripts/video/check_claims.mjs <timeline.json> <facts.md> [--rendered <rendered-text.json>]
//
// Quy ước: mỗi cảnh trong timeline.json khai báo chữ trên màn hình ở
//   "onScreen": [{ "text": "85–95%", "fact": "F4" }, ...]
// Script kiểm tra:
//   1. Mọi mục onScreen đều có "fact" và mã đó tồn tại trong facts.md (cột # = F1, F2…).
//   2. Mọi con số trong "text" xuất hiện trong dòng fact tương ứng (so khớp số đã chuẩn hóa).
//   3. Nguồn của fact (PMID/Nhãn) có mặt trong "sources" (footer) của cảnh.
//   4. (--rendered) Mọi chuỗi chứa số mà trình render thực sự vẽ đều khớp một mục onScreen
//      → bắt được số "gõ cứng" trong component mà không khai báo.
// Thoát mã 1 nếu có lỗi (chặn render), 0 nếu sạch. Ghi báo cáo ra stdout dạng Markdown.
import fs from "node:fs";

const [tlPath, factsPath, ...rest] = process.argv.slice(2);
if (!tlPath || !factsPath) {
  console.error("Cách dùng: node scripts/video/check_claims.mjs <timeline.json> <facts.md> [--rendered rendered.json]");
  process.exit(2);
}
const renderedPath = rest[0] === "--rendered" ? rest[1] : null;
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
const tl = readJson(tlPath);
const factsMd = fs.readFileSync(factsPath, "utf8");

// facts.md: dòng bảng bắt đầu bằng "| F<n> |"
const facts = new Map();
for (const line of factsMd.split(/\r?\n/)) {
  const m = line.match(/^\|\s*(F\d+)\s*\|(.*)$/);
  if (m) facts.set(m[1], m[2]);
}

// Chuẩn hóa số: "37,8" → "37.8", "2,60" → "2.6", "85–95%" → ["85","95"]
const numbers = (s) =>
  (s.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => String(Number(n.replace(",", "."))));
const sourcesOf = (row) => [
  ...(row.match(/PMID\s*\d{6,9}|\b\d{8}\b/g) ?? []).map((p) => p.replace(/\D/g, "")),
  ...(/Nhãn/i.test(row) ? ["NHAN"] : []),
];

const errors = [], warns = [];
let checked = 0;
const declared = new Set();
for (const s of tl.scenes) {
  const items = s.onScreen ?? [];
  const footer = (s.sources ?? []).join(" ");
  const footerIds = [...(footer.match(/\d{6,9}/g) ?? []), ...(/Nhãn/i.test(footer) ? ["NHAN"] : [])];
  if ((s.sources ?? []).length && !items.length && s.voice) warns.push(`${s.id}: chưa khai báo "onScreen" – không kiểm được chữ trên màn hình.`);
  for (const it of items) {
    checked++;
    declared.add(it.text.trim());
    const row = facts.get(it.fact);
    // Bắt buộc fact khi chuỗi có số (trừ vạch trục) hoặc là số liệu/callout; nhãn chữ thuần thì khuyến nghị.
    const exempt = it.role === "axis" || it.role === "disclaimer"; // trục biểu đồ, disclaimer pháp lý (ngày cập nhật) không phải dữ kiện lâm sàng
    const hasNum = /\d/.test(it.text) && !exempt;
    if (!it.fact) {
      if (hasNum || it.role === "stat") errors.push(`${s.id}: "${it.text}" có số/số liệu nhưng không gắn fact.`);
      continue;
    }
    if (exempt) continue;
    if (!row) { errors.push(`${s.id}: "${it.text}" gắn ${it.fact} nhưng facts.md không có ${it.fact}.`); continue; }
    const rowNums = new Set(numbers(row));
    for (const n of numbers(it.text)) {
      if (!rowNums.has(n)) errors.push(`${s.id}: số "${n}" trong "${it.text}" không có trong ${it.fact}.`);
    }
    const src = sourcesOf(row);
    if (src.length && !src.some((x) => footerIds.includes(x))) errors.push(`${s.id}: nguồn của ${it.fact} (${src.join(", ")}) không có trong footer.`);
  }
}

if (renderedPath) {
  // rendered.json: [{ "scene": "PK", "text": "85–95%" }, ...] — thu từ DOM khi render ảnh soát.
  const rendered = readJson(renderedPath);
  for (const r of rendered) {
    if (!/\d/.test(r.text)) continue;
    const t = r.text.trim();
    const ok = [...declared].some((d) => d === t || d.includes(t) || t.includes(d));
    if (!ok) errors.push(`${r.scene}: trình render vẽ "${t}" nhưng không có trong onScreen (số gõ cứng chưa kiểm).`);
  }
}

console.log(`# Kiểm chứng chữ trên màn hình\n\n- Timeline: \`${tlPath}\`\n- Facts: \`${factsPath}\` (${facts.size} fact)\n- Mục đã kiểm: ${checked}\n- Lỗi: ${errors.length} · Cảnh báo: ${warns.length}\n`);
if (errors.length) console.log("## Lỗi (chặn render)\n" + errors.map((e) => `- ${e}`).join("\n") + "\n");
if (warns.length) console.log("## Cảnh báo\n" + warns.map((e) => `- ${e}`).join("\n") + "\n");
if (!errors.length) console.log("Kết quả: ĐẠT");
process.exit(errors.length ? 1 : 0);
