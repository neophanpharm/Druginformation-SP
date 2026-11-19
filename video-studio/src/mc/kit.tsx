import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import brand from "../../../brand/brand.json";
import timeline from "./timeline.json";
import captionsRaw from "../reel/captions.json";
import { fontFamily } from "../theme";

/* ───────── Token: khung medical-clean (brand.json → frame) + bảng màu minh họa flat ───────── */
const P = brand.frame.palette;
export const M = {
  ...P,
  outline: "#26324B", // viền minh họa (như icon tham khảo)
  teal: "#3CC6C8", tealDeep: "#1E9FB0", tealSoft: "#BFEDEC",
  orange: "#F9B56B", orangeSpot: "#F27C5C",
  coral: "#FF6B57",
  blue: "#5B8DEF", blueSoft: "#D6E2FB", lavender: "#C9D3F5", lavDeep: "#8C9BE0",
  purple: "#9B7BEA", green: "#3DCB8E", yellow: "#F6B445",
  alpha: "#56C4EA", beta: "#F6B445", gamma: "#3DCB8E",
  lipidHead: "#56A6E8", lipidTail: "#F6DDB0",
  gaba: "#3DCB8E", chloride: "#FF6B57",
  kidney: "#F29C9C", kidneyDeep: "#D9656E",
  albumin: "#FFE3A6",
  vpa: "#B86BD6",
};
export const FONT = fontFamily;
export const T = timeline;
export const FPS = timeline.fps;
export const CONTENT = brand.frame.content; // left 68, right 68, top 210, bottom 268
export const CW = 1080 - CONTENT.left - CONTENT.right; // 944

/* ───────── easing / helpers ───────── */
const EO = (t: number) => 1 - Math.pow(1 - t, 3);
export const tw = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
export const pop = (f: number, fps: number, d = 0, damping = 13) => spring({ frame: f - d, fps, config: { damping, stiffness: 130, mass: 0.8 } });
export const wob = (f: number, speed = 30, amp = 1) => Math.sin((f / speed) * Math.PI * 2) * amp;
export const at = (sec: number, lead = timeline.voiceLeadFrames) => lead + Math.round(sec * FPS);

/* ───────── Timing toàn video ───────── */
type Scene = (typeof timeline.scenes)[number];
export type Timing = Scene & { start: number; end: number; lead: number; voiceStart: number; voiceEnd: number; page: number; pages: number };
export function timings(): { list: Timing[]; total: number } {
  const TR = timeline.transitionFrames;
  let cursor = 0;
  const contentIds = timeline.scenes.filter((s) => s.sources.length > 0).map((s) => s.id);
  const list = timeline.scenes.map((s, i) => {
    const start = i === 0 ? 0 : cursor - TR;
    const end = start + s.dur;
    cursor = end;
    const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? timeline.voiceLeadFrames;
    const voiceStart = start + lead;
    return { ...s, start, end, lead, voiceStart, voiceEnd: voiceStart + Math.round(s.voiceSec * FPS), page: contentIds.indexOf(s.id) + 1, pages: contentIds.length };
  });
  return { list, total: cursor };
}

/** Chữ trên màn hình lấy từ timeline.json → onScreen (không gõ cứng trong component). */
export function useText(id: string): Record<string, string> {
  const s = timeline.scenes.find((x) => x.id === id);
  return Object.fromEntries((s?.onScreen ?? []).map((o) => [o.key, o.text]));
}
/** Mục đang được đọc (focus) tại khung cục bộ f. */
export function focusAt(id: string, f: number): string | null {
  const s = timeline.scenes.find((x) => x.id === id) as { focus?: [string, number][] } | undefined;
  let cur: string | null = null;
  for (const [key, sec] of s?.focus ?? []) if (f >= at(sec)) cur = key;
  return cur;
}
/** Mức "sáng" 0..1 của một mục theo focus: mục đang đọc = 1, mục khác = 0.45 (chuyển 9 khung). */
export function lit(id: string, key: string, f: number) {
  const s = timeline.scenes.find((x) => x.id === id) as { focus?: [string, number][] } | undefined;
  const fs = s?.focus ?? [];
  let v = 0.45;
  fs.forEach(([k, sec], i) => {
    const a = at(sec), b = fs[i + 1] ? at(fs[i + 1][1]) : 99999;
    if (k === key) v = Math.max(v, Math.min(tw(f, a, a + 9, 0.45, 1), tw(f, b, b + 9, 1, 0.45)));
  });
  return v;
}

/* ───────── Nền nội dung trắng với chấm hạt mảnh trôi (khung medical-clean) ───────── */
export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="pg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF5F7" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#pg)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i * 137) % 1000 + 40 + wob(f + i * 9, 140, 22);
          const y = 240 + ((i * 263 + f * (0.6 + (i % 4) * 0.25)) % 1400);
          return <circle key={i} cx={x} cy={y} r={5 + (i % 4) * 3} fill={i % 2 ? M.primary : M.teal} opacity={0.1} />;
        })}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

/* ───────── Eyebrow + tiêu đề h2 (hiện theo từng từ) ───────── */
export const Heading: React.FC<{ chapter: string; title: string; display?: boolean }> = ({ chapter, title, display }) => {
  const f = useCurrentFrame();
  const words = title.replace("|", " | ").split(" ").filter(Boolean);
  const size = display ? 92 : title.replace("|", "").length > 26 ? 64 : 72;
  return (
    <div style={{ position: "absolute", left: CONTENT.left, width: CW, top: 236, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: M.primary, fontWeight: 800, fontSize: 22, letterSpacing: "0.15em", opacity: tw(f, 2, 14) }}>
        <span style={{ width: 44 * tw(f, 2, 18), height: 4, background: M.primary, borderRadius: 2 }} />
        {chapter}
      </div>
      <div style={{ marginTop: 14, color: M.ink, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.025em" }}>
        {words.map((w, i) => {
          const p = tw(f, 6 + i * 3, 20 + i * 3);
          if (w === "|") return <br key={i} />; // dấu ngắt dòng có chủ đích trong tiêu đề
          return <span key={i} style={{ display: "inline-block", marginRight: size * 0.24, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>{w}</span>;
        })}
      </div>
    </div>
  );
};

/* ───────── Thẻ số liệu trắng (nhấn khi được đọc) ───────── */
export const Stat: React.FC<{ x: number; y: number; w: number; value: string; label: string; sub?: string; color?: string; show: number; light?: number; size?: number; icon?: React.ReactNode }> = ({
  x, y, w, value, label, sub, color = M.primary, show, light = 1, size = 64, icon,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, fps, show, 15);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "22px 26px", borderRadius: 24, background: "#FFFFFF", border: `2px solid ${light > 0.9 ? color : "rgba(190,18,56,0.14)"}`, boxShadow: `0 14px 40px rgba(190,18,56,${0.05 + 0.08 * light})`, fontFamily: FONT, display: "flex", gap: 20, alignItems: "center", opacity: Math.min(1, p * 1.2) * (0.35 + 0.65 * light), transform: `translateY(${(1 - p) * 36}px) scale(${(0.95 + 0.05 * p) * (light > 0.9 ? 1.02 : 1)})`, filter: light < 0.6 ? "blur(0.6px)" : "none" }}>
      <div style={{ position: "absolute", left: 0, top: 20, bottom: 20, width: 7, borderRadius: 6, background: color }} />
      {icon && <div style={{ flex: "0 0 auto" }}>{icon}</div>}
      <div>
        <div style={{ color, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ color: M.ink, fontWeight: 700, fontSize: 28, marginTop: 10, lineHeight: 1.25 }}>{label}</div>
        {sub && <div style={{ color: M.muted, fontWeight: 500, fontSize: 23, marginTop: 6, lineHeight: 1.3 }}>{sub}</div>}
      </div>
    </div>
  );
};

export const Callout: React.FC<{ x?: number; y: number; w?: number; text: string; show: number; icon?: string; tone?: "warn" | "good" }> = ({ x = CONTENT.left, y, w = CW, text, show, icon = "!", tone = "warn" }) => {
  const f = useCurrentFrame();
  const p = tw(f, show, show + 14);
  const c = tone === "good" ? M.good : M.primary;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 22, background: tone === "good" ? "#E8F6F3" : M.warningSoft, borderLeft: `8px solid ${c}`, fontFamily: FONT, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ flex: "0 0 60px", height: 60, borderRadius: 30, background: c, color: "#FFFFFF", fontWeight: 900, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ color: M.ink, fontWeight: 700, fontSize: 33, lineHeight: 1.28 }}>{text}</div>
    </div>
  );
};

/** Nhãn chú thích trên minh họa: thẻ trắng viền đỏ đô mảnh + đường dẫn vẽ dần. */
export const Tag: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; show: number; color?: string; align?: "left" | "right" }> = ({ x, y, tx, ty, text, show, color = M.primary, align = "left" }) => {
  const f = useCurrentFrame();
  const l = tw(f, show, show + 12), o = tw(f, show + 8, show + 18);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={7 * l} fill={color} />
        <line x1={x} y1={y} x2={x + (tx - x) * l} y2={y + (ty - y) * l} stroke={color} strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", top: ty - 26, left: align === "left" ? tx + 8 : undefined, right: align === "right" ? 1080 - tx + 8 : undefined, padding: "8px 16px", borderRadius: 12, background: "#FFFFFF", border: `2px solid ${color}`, color: M.ink, fontFamily: FONT, fontWeight: 700, fontSize: 28, whiteSpace: "nowrap", opacity: o, boxShadow: "0 6px 18px rgba(38,50,75,0.10)" }}>{text}</div>
    </>
  );
};

/* ───────── Khung cố định: header bệnh viện, phụ đề viên đỏ, footer nguồn + trang ───────── */
const H = brand.frame.header.center;
export const ClinicalHeader: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 176, background: "#FFFFFF", borderBottom: `4px solid ${M.primary}`, boxShadow: "0 10px 30px rgba(190,18,56,.06)", display: "grid", gridTemplateColumns: "118px 1fr 136px", alignItems: "center", gap: 14, padding: "18px 34px 14px", fontFamily: FONT, opacity: o, transform: `translateY(${(1 - o) * -30}px)` }}>
    <div style={{ position: "absolute", bottom: -4, right: 0, width: "32%", height: 4, background: M.primaryDeep }} />
    <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ width: 112, height: 112, objectFit: "contain", margin: "0 auto" }} />
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 4 }}>
      <div style={{ fontSize: H[0].size, fontWeight: H[0].weight, color: H[0].color, letterSpacing: H[0].letterSpacing, whiteSpace: "nowrap" }}>{H[0].text}</div>
      <div style={{ fontSize: H[1].size, fontWeight: H[1].weight, color: H[1].color, letterSpacing: H[1].letterSpacing, whiteSpace: "nowrap" }}>{H[1].text}</div>
      <div style={{ marginTop: 3, fontSize: H[2].size, fontWeight: H[2].weight, color: H[2].color, whiteSpace: "nowrap" }}>
        {H[2].text.split("|")[0].trim()}<span style={{ margin: "0 6px", color: M.primary, fontWeight: 900 }}>|</span>{H[2].text.split("|")[1].trim()}
      </div>
    </div>
    <Img src={staticFile("brand/logo-sph.png")} style={{ width: 132, height: 106, objectFit: "contain", margin: "0 auto" }} />
  </div>
);

const caps = captionsRaw as unknown as Record<string, [string, number, number][]>;
type W = { text: string; s: number; e: number; key: boolean };
function words(t: Timing): W[] {
  if (!t.voice) return [];
  const keys = new Set(((t as { keywords?: string[] }).keywords ?? []).map((k) => k.toLowerCase()));
  return (caps[t.voice] ?? []).map(([text, s, e]) => ({ text, s: t.voiceStart + Math.round(s * FPS), e: t.voiceStart + Math.round(e * FPS), key: keys.has(text.toLowerCase()) }));
}
/* Ngắt phụ đề theo cụm nghĩa (dùng chung logic với scripts/export-reel-docs.mjs):
   luôn ngắt ở dấu chấm; gộp các vế cách nhau dấu phẩy nếu vừa dòng; vế quá dài thì
   ngắt trước hư từ (và, khi, với…) gần giữa nhất, không tách từ ghép. */
const FUNC = new Set("và nhưng nên khi với ở trong của cho có hoặc hay từ sau bằng làm giúp để thì là được mà đến dưới vào kể ngăn liên nếu rồi".split(" "));
const len = (ws: { text: string }[]) => ws.map((w) => w.text).join(" ").length;
function splitLong<T extends { text: string }>(ws: T[], max: number): T[][] {
  if (len(ws) <= max || ws.length < 2) return [ws];
  let best = 1, bestCost = Infinity;
  for (let i = 1; i < ws.length; i++) {
    const cost = Math.abs(len(ws.slice(0, i)) - len(ws.slice(i))) + (FUNC.has(ws[i].text.toLowerCase()) ? 0 : 40);
    if (cost < bestCost) { bestCost = cost; best = i; }
  }
  return [...splitLong(ws.slice(0, best), max), ...splitLong(ws.slice(best), max)];
}
export function phraseChunks<T extends { text: string }>(ws: T[], max: number, hardBreak: (i: number) => boolean = () => false): T[][] {
  // vế = đoạn giữa hai dấu câu (hoặc khoảng lặng dài)
  const clauses: { ws: T[]; end: boolean }[] = []; let cur: T[] = [];
  ws.forEach((w, i) => {
    cur.push(w);
    const stop = /[.;!?]$/.test(w.text), comma = /,$/.test(w.text);
    if (stop || comma || hardBreak(i) || i === ws.length - 1) { clauses.push({ ws: cur, end: stop || hardBreak(i) }); cur = []; }
  });
  const out: T[][] = []; let acc: T[] = [];
  for (const c of clauses) {
    if (acc.length && len([...acc, ...c.ws]) > max) { out.push(...splitLong(acc, max)); acc = []; }
    acc = [...acc, ...c.ws];
    if (c.end) { out.push(...splitLong(acc, max)); acc = []; }
  }
  if (acc.length) out.push(...splitLong(acc, max));
  return out;
}
function pages(ws: W[], max = 50): W[][] {
  return phraseChunks(ws, max, (i) => (ws[i + 1] ? ws[i + 1].s - ws[i].e > 12 : false));
}

export const FrameChrome: React.FC<{ list: Timing[] }> = ({ list }) => {
  const f = useCurrentFrame();
  const content = list.filter((t) => t.sources.length > 0);
  const total = list[list.length - 1].end;
  // Header cố định suốt video (như template); footer chỉ hiện ở trang có nguồn.
  const o = Math.min(tw(f, 0, 12), 1 - tw(f, total - 12, total));
  const curScene = [...list].reverse().find((t) => f >= t.start + 6) ?? list[0];
  const cur = [...content].reverse().find((t) => f >= t.start + 6) ?? content[0];
  const fo = curScene.sources.length > 0 ? Math.min(o, tw(f, curScene.start, curScene.start + 12)) : 1 - tw(f, curScene.start, curScene.start + 8);
  // phụ đề
  let cap: React.ReactNode = null;
  for (const t of list) {
    if (!t.voice) continue;
    const pg = pages(words(t));
    pg.forEach((page, pi) => {
      const a = page[0].s - 2, next = pg[pi + 1];
      const end = next ? next[0].s - 2 : page[page.length - 1].e + 8;
      if (f < a || f >= end || cap) return;
      const fade = next ? 1 : Math.min(1, (end - f) / 5);
      const inA = pi === 0 ? tw(f, a, a + 4) : 1; // không nhấp nháy giữa các câu liên tiếp
      cap = (
        <div key={`${t.id}-${pi}`} style={{ position: "absolute", left: 56, right: 56, bottom: 82, height: 162, display: "flex", alignItems: "center", justifyContent: "center", opacity: inA * fade }}>
          <div style={{ maxWidth: 950, padding: "18px 30px", borderRadius: 20, background: M.captionBg, color: M.captionInk, fontFamily: FONT, fontWeight: 700, fontSize: page.map((w) => w.text).join(" ").length > 40 ? 31 : 36, lineHeight: 1.28, textAlign: "center", boxShadow: "0 14px 34px rgba(190,18,56,.24)", border: "1.5px solid rgba(255,255,255,.18)" }}>
            {/* Phụ đề thường như template: cả câu trắng, không nhấn từ khóa/karaoke */}
            {page.map((w) => w.text).join(" ")}
          </div>
        </div>
      );
    });
  }
  // Hiện đủ mọi nguồn: gộp PMID thành một cụm, cho phép xuống 2 dòng thay vì cắt "+2"/"…"
  const pmids = cur.sources.filter((s) => s.startsWith("PMID ")).map((s) => s.slice(5));
  const other = cur.sources.filter((s) => !s.startsWith("PMID ")).map((s) => s.replace("Nhãn ", "NHÃN ").toUpperCase());
  const src = [...other, ...(pmids.length ? [`PMID ${pmids.join(", ")}`] : [])];
  const more = "";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {o > 0 && <ClinicalHeader o={o} />}
      {fo > 0 && cur && (
        <div style={{ position: "absolute", left: 68, right: 68, bottom: 26, paddingTop: 12, borderTop: "1.5px solid rgba(190,18,56,.14)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, fontFamily: FONT, fontSize: 18, fontWeight: 700, letterSpacing: "0.05em", color: M.muted, opacity: fo }}>
          <span style={{ maxWidth: 760, lineHeight: 1.35, fontSize: src.join(" · ").length > 70 ? 16 : 18 }}>NGUỒN: {src.join(" · ")}{more}</span>
          <span style={{ whiteSpace: "nowrap", color: M.primary }}>TRANG {String(cur.page).padStart(2, "0")} / {String(cur.pages).padStart(2, "0")}</span>
        </div>
      )}
      {cap}
    </AbsoluteFill>
  );
};

/* ───────── Cảnh mở & kết theo template medical-clean (nằm trong khung: header + footer) ───────── */
const Breath: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${wob(f, 190, 4)}px, ${wob(f + 40, 250, 5)}px) scale(${1.003 + 0.006 * Math.sin(f / 55)})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

/** Thẻ lưu ý ở đầu video: eyebrow + tiêu đề đỏ + đoạn lưu ý, giống trang mở của template. */
export const Disclaimer: React.FC<{ eyebrow: string; title: string; text: string }> = ({ eyebrow, title, text }) => {
  const f = useCurrentFrame();
  const a = tw(f, 4, 18), b = tw(f, 10, 28), c = tw(f, 20, 40);
  return (
    <Page>
      <Breath>
        <div style={{ position: "absolute", left: CONTENT.left, width: CW, top: 640, fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: M.primary, fontWeight: 800, fontSize: 22, letterSpacing: "0.15em", opacity: a }}>
            <span style={{ width: 44 * a, height: 4, background: M.primary, borderRadius: 2 }} />{eyebrow}
          </div>
          <div style={{ marginTop: 16, color: M.primary, fontWeight: 800, fontSize: 76, lineHeight: 1.06, letterSpacing: "-0.025em", opacity: b, transform: `translateY(${(1 - b) * 24}px)` }}>{title}</div>
          <div style={{ marginTop: 26, height: 4, width: 220 * c, background: M.primary, borderRadius: 2, opacity: 0.6 }} />
          <div style={{ marginTop: 30, color: M.muted, fontWeight: 500, fontSize: 40, lineHeight: 1.42, maxWidth: 900, opacity: c, transform: `translateY(${(1 - c) * 20}px)` }}>{text}</div>
        </div>
      </Breath>
    </Page>
  );
};

/** Outro như template: logo chuẩn 136 px, nhãn Khoa Dược, tiêu đề đỏ, đoạn lưu ý, dòng nguồn. */
export const Outro: React.FC<{ brand: string; title: string; body: string }> = ({ brand, title, body }) => {
  const f = useCurrentFrame();
  const d = [tw(f, 4, 20), tw(f, 12, 28), tw(f, 20, 38), tw(f, 30, 48), tw(f, 40, 58)];
  const up = (p: number) => ({ opacity: p, transform: `translateY(${(1 - p) * 22}px)` });
  return (
    <Page>
      <Breath>
        <div style={{ position: "absolute", left: CONTENT.left, width: CW, top: CONTENT.top, bottom: CONTENT.bottom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FONT }}>
          <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ width: 136, height: 136, objectFit: "contain", marginBottom: 22, ...up(d[0]) }} />
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.18em", color: M.primary, marginBottom: 24, ...up(d[1]) }}>{brand}</div>
          <div style={{ fontSize: title.length > 26 ? 66 : 78, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.025em", color: M.primary, maxWidth: 900, ...up(d[2]) }}>{title.split("|").map((l, i) => <div key={i}>{l}</div>)}</div>
          <div style={{ marginTop: 26, height: 4, width: 160 * d[3], background: M.primary, borderRadius: 2, opacity: 0.6 }} />
          <div style={{ marginTop: 26, fontSize: 30, lineHeight: 1.45, color: M.muted, maxWidth: 860, ...up(d[4]) }}>{body}</div>
        </div>
      </Breath>
    </Page>
  );
};