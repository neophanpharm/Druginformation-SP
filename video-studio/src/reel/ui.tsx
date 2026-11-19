import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { fontFamily, tw, EASE } from "../theme";
import { ReelTiming, wordsFor, pages } from "./timing";

/* ───────── Bảng màu reel (nền tối điện ảnh, chữ trắng; đỏ thương hiệu chỉ ở khung) ───────── */
export const K = {
  bg0: "#04122B",
  bg1: "#0A2552",
  bg2: "#123A78",
  ink: "#0B1F3A",
  white: "#FFFFFF",
  soft: "rgba(255,255,255,0.72)",
  faint: "rgba(255,255,255,0.14)",
  navy: "#002060",
  brandRed: "#C00000",
  erta: "#1CC8C8",
  ertaDeep: "#0FA3A3",
  imi: "#FF9A3C",
  mero: "#5B9BFF",
  dori: "#A47BFF",
  gaba: "#3DDC84",
  chloride: "#8BE3FF",
  bacteria: "#9BD14B",
  pbp: "#FFB020",
  danger: "#FF6A3D",
  warn: "#FFC542",
  safe: "#3DDC84",
  card: "rgba(255,255,255,0.08)",
  cardLine: "rgba(255,255,255,0.18)",
} as const;

export const SAFE = { left: 64, right: 148, top: 150 }; // lề phải chừa nút của ứng dụng reel
export const CONTENT_W = 1080 - SAFE.left - SAFE.right; // 868

/* ───────── Nền tối có bokeh trôi chậm ───────── */
export const DarkBG: React.FC<{ hue?: string; children?: React.ReactNode }> = ({ hue = K.bg2, children }) => {
  const f = useCurrentFrame();
  const blobs = Array.from({ length: 9 }).map((_, i) => {
    const x = 120 + random(`bx${i}`) * 840 + noise2D(`nx${i}`, f / 220, 0) * 90;
    const y = 200 + random(`by${i}`) * 1500 + noise2D(`ny${i}`, 0, f / 240) * 120;
    const r = 60 + random(`br${i}`) * 180;
    const c = i % 3 === 0 ? K.erta : i % 3 === 1 ? "#3B6BD6" : "#7A5CFF";
    return { x, y, r, c, o: 0.06 + random(`bo${i}`) * 0.08 };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 1200px at 50% 38%, ${hue} 0%, ${K.bg1} 45%, ${K.bg0} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="blur40"><feGaussianBlur stdDeviation="40" /></filter>
        </defs>
        <g filter="url(#blur40)">
          {blobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={b.o} />)}
        </g>
        {Array.from({ length: 36 }).map((_, i) => {
          const x = random(`px${i}`) * 1080;
          const y = (random(`py${i}`) * 1920 - f * (0.3 + random(`pv${i}`) * 0.6) + 1920 * 4) % 1920;
          return <circle key={`p${i}`} cx={x} cy={y} r={1.5 + random(`pr${i}`) * 2.5} fill="#FFFFFF" opacity={0.12 + random(`po${i}`) * 0.2} />;
        })}
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(1100px 1600px at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      {children}
    </AbsoluteFill>
  );
};

/* ───────── Tiêu đề cảnh: pill chương + tiêu đề hiện theo từng từ ───────── */
export const Header: React.FC<{ chapter: string; title: string; delay?: number }> = ({ chapter, title, delay = 4 }) => {
  const f = useCurrentFrame();
  const words = title.split(" ");
  const pill = tw(f, delay, delay + 14);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: 168, width: CONTENT_W, fontFamily }}>
      {chapter && (
        <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: "rgba(28,200,200,0.16)", border: `1.5px solid ${K.erta}`, color: K.erta, fontWeight: 700, fontSize: 24, letterSpacing: 2, opacity: pill, transform: `translateY(${(1 - pill) * 14}px)` }}>
          {chapter}
        </div>
      )}
      <div style={{ marginTop: 18, color: K.white, fontWeight: 800, fontSize: 66, lineHeight: 1.12, letterSpacing: -0.5 }}>
        {words.map((w, i) => {
          const p = tw(f, delay + 6 + i * 3, delay + 22 + i * 3);
          return (
            <span key={i} style={{ display: "inline-block", marginRight: 16, opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Thẻ số liệu: số chạy tới giá trị nguồn ───────── */
export const StatCard: React.FC<{
  x: number; y: number; w?: number; delay: number; value: string; label: string; color?: string; sub?: string; countTo?: number; decimals?: number; prefix?: string; suffix?: string; size?: number;
}> = ({ x, y, w = 400, delay, value, label, color = K.erta, sub, countTo, decimals = 0, prefix = "", suffix = "", size = 72 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 15, stiffness: 120 } });
  const count = tw(f, delay + 4, delay + 30);
  const shown = countTo !== undefined ? `${prefix}${(countTo * count).toFixed(decimals).replace(".", ",")}${suffix}` : value;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "22px 26px", borderRadius: 26, background: "rgba(8,24,56,0.72)", border: `1.5px solid ${K.cardLine}`, boxShadow: "0 18px 50px rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", fontFamily, opacity: Math.min(1, p * 1.2), transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})` }}>
      <div style={{ position: "absolute", left: 0, top: 22, bottom: 22, width: 6, borderRadius: 6, background: color }} />
      <div style={{ color, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -1 }}>{shown}</div>
      <div style={{ color: K.white, fontWeight: 600, fontSize: 28, marginTop: 10, lineHeight: 1.25 }}>{label}</div>
      {sub && <div style={{ color: K.soft, fontWeight: 400, fontSize: 22, marginTop: 6 }}>{sub}</div>}
    </div>
  );
};

/* ───────── Callout cảnh báo ───────── */
export const Callout: React.FC<{ x: number; y: number; w?: number; delay: number; text: string; color?: string; icon?: string }> = ({ x, y, w = CONTENT_W, delay, text, color = K.warn, icon = "!" }) => {
  const f = useCurrentFrame();
  const p = tw(f, delay, delay + 16);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 22, background: "rgba(255,197,66,0.12)", border: `2px solid ${color}`, fontFamily, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <div style={{ flex: "0 0 52px", height: 52, borderRadius: 26, background: color, color: K.ink, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ color: K.white, fontWeight: 700, fontSize: 32, lineHeight: 1.25 }}>{text}</div>
    </div>
  );
};

/* ───────── Nhãn chỉ vào vật thể (đường dẫn vẽ dần) ───────── */
export const Label: React.FC<{ x: number; y: number; tx: number; ty: number; delay: number; text: string; color?: string; align?: "left" | "right" }> = ({ x, y, tx, ty, delay, text, color = K.white, align = "left" }) => {
  const f = useCurrentFrame();
  const line = tw(f, delay, delay + 14);
  const txt = tw(f, delay + 10, delay + 22);
  const ex = x + (tx - x) * line, ey = y + (ty - y) * line;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={8 * line} fill={color} />
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={3} opacity={0.9} />
      </svg>
      <div style={{ position: "absolute", left: align === "left" ? tx + 10 : undefined, right: align === "right" ? 1080 - tx + 10 : undefined, top: ty - 26, fontFamily, color, fontWeight: 700, fontSize: 32, padding: "6px 14px", borderRadius: 12, background: "rgba(4,18,43,0.72)", opacity: txt, whiteSpace: "nowrap" }}>
        {text}
      </div>
    </>
  );
};

/* ───────── Lớp khung thương hiệu + phụ đề (nằm ngoài chuyển cảnh) ───────── */
export const ReelChrome: React.FC<{ timings: ReelTiming[]; total: number }> = ({ timings, total }) => {
  const f = useCurrentFrame();
  const content = timings.filter((t) => t.sources.length > 0);
  const first = content[0], last = content[content.length - 1];
  const chrome = Math.min(tw(f, first.start + 2, first.start + 18), 1 - tw(f, last.end - 22, last.end - 6));

  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      {chrome > 0 && (
        <>
          {/* watermark SPH */}
          <div style={{ position: "absolute", top: 160, right: SAFE.right - 84 + 20, padding: "8px 12px", background: "#FFFFFF", borderRadius: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", opacity: 0.94 * chrome }}>
            <Img src={staticFile("brand/logo-sph.png")} style={{ height: 46, display: "block" }} />
          </div>
          {/* footer nguồn */}
          <div style={{ position: "absolute", left: SAFE.left - 16, width: CONTENT_W + 32, top: 1430, opacity: chrome, transform: `translateY(${(1 - chrome) * 24}px)` }}>
            <div style={{ background: "rgba(255,255,255,0.96)", borderRadius: 22, padding: "14px 18px 16px", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ height: 46 }} />
                <div style={{ lineHeight: 1.15 }}>
                  <div style={{ color: K.navy, fontWeight: 800, fontSize: 21, letterSpacing: 0.3 }}>BỆNH VIỆN ĐA KHOA XANH PÔN</div>
                  <div style={{ color: K.brandRed, fontWeight: 600, fontSize: 16 }}>Truyền thống Trăm năm – Tiên phong Công nghệ</div>
                </div>
              </div>
              <div style={{ position: "relative", height: 34, marginTop: 10 }}>
                {timings.map((t) => {
                  if (!t.sources.length) return null;
                  const o = Math.min(tw(f, t.start + 4, t.start + 16), 1 - tw(f, t.end - 14, t.end - 2));
                  if (o <= 0) return null;
                  return (
                    <div key={t.id} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", overflow: "hidden", opacity: o }}>
                      <span style={{ color: "#7B8BA3", fontSize: 17, fontWeight: 700 }}>Nguồn:</span>
                      {t.sources.map((s) => (
                        <span key={s} style={{ fontSize: 16, fontWeight: 700, color: s.startsWith("PMID") ? K.navy : "#0B7C7C", background: s.startsWith("PMID") ? "#E8EEF8" : "#E2F4F4", padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>{s}</span>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#E9EEF5", marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: 5, width: `${(f / total) * 100}%`, background: K.brandRed }} />
              </div>
            </div>
          </div>
        </>
      )}
      <Captions timings={timings} />
    </AbsoluteFill>
  );
};

/* ───────── Phụ đề karaoke ───────── */
const Captions: React.FC<{ timings: ReelTiming[] }> = ({ timings }) => {
  const f = useCurrentFrame();
  for (const t of timings) {
    if (!t.voice || t.id === "OUTRO") continue;
    const words = wordsFor(t);
    const pg = pages(words);
    for (const page of pg) {
      const a = page[0].s - 3, b = page[page.length - 1].e + 8;
      if (f < a || f > b) continue;
      const o = Math.min(tw(f, a, a + 5), 1 - tw(f, b - 5, b));
      return (
        <div style={{ position: "absolute", left: SAFE.left, width: CONTENT_W, top: 1236, display: "flex", justifyContent: "center", opacity: o }}>
          <div style={{ maxWidth: CONTENT_W, textAlign: "center", padding: "16px 24px", borderRadius: 20, background: "rgba(2,12,32,0.78)", border: "1px solid rgba(255,255,255,0.12)", fontFamily, fontWeight: 700, fontSize: 42, lineHeight: 1.32 }}>
            {page.map((w, i) => {
              const active = f >= w.s - 1 && f <= w.e + 2;
              const done = f > w.e + 2;
              const color = w.key ? (active || done ? K.warn : "rgba(255,197,66,0.55)") : active || done ? K.white : "rgba(255,255,255,0.5)";
              return (
                <span key={i} style={{ display: "inline-block", marginRight: 11, color, fontWeight: w.key ? 800 : 700, transform: `scale(${active ? 1.06 : 1})`, transformOrigin: "50% 70%" }}>{w.text}</span>
              );
            })}
          </div>
        </div>
      );
    }
  }
  return null;
};

/* ───────── Mở đầu thương hiệu (nền trắng) ───────── */
export const ReelIntro: React.FC = () => {
  const f = useCurrentFrame();
  const ring = tw(f, 4, 40);
  const reveal = tw(f, 16, 52);
  const sph = tw(f, 52, 78);
  const glow = interpolate(f, [30, 70, 110], [0, 1, 0.4], { extrapolateRight: "clamp" });
  const C = 2 * Math.PI * 330;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(700px 700px at 50% 42%, rgba(0,32,96,${0.08 * glow}) 0%, rgba(255,255,255,0) 70%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={540} cy={800} r={330} fill="none" stroke={K.navy} strokeWidth={6} strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 540 800)" strokeLinecap="round" />
        <circle cx={540} cy={800} r={352} fill="none" stroke={K.brandRed} strokeWidth={3} strokeDasharray={2 * Math.PI * 352} strokeDashoffset={2 * Math.PI * 352 * (1 - tw(f, 12, 50))} transform="rotate(90 540 800)" opacity={0.75} />
      </svg>
      <div style={{ position: "absolute", top: 800 - 268, left: 540 - 301, width: 602, height: 536, clipPath: `circle(${305 * reveal}px at 301px 268px)`, transform: `scale(${0.88 + 0.12 * reveal})` }}>
        <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ width: 602, height: 536 }} />
      </div>
      <Img src={staticFile("brand/logo-sph.png")} style={{ position: "absolute", top: 1220, height: 130, opacity: sph, transform: `translateY(${(1 - sph) * 24}px)` }} />
    </AbsoluteFill>
  );
};

/* ───────── Thẻ disclaimer ───────── */
export const ReelDisclaimer: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const p = tw(f, 4, 22);
  const out = 1 - tw(f, 92, 105);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center", justifyContent: "center", fontFamily }}>
      <div style={{ width: 860, opacity: p * out, transform: `translateY(${(1 - p) * 30}px)` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 20px", borderRadius: 999, background: "#FFF4E5", border: "2px solid #F2B134", color: "#8A5A00", fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>
          ⚕ LƯU Ý
        </div>
        <div style={{ marginTop: 30, color: K.navy, fontWeight: 700, fontSize: 44, lineHeight: 1.38 }}>{text}</div>
        <div style={{ marginTop: 36, height: 5, width: 220 * tw(f, 14, 40), background: K.brandRed, borderRadius: 3 }} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Kết thương hiệu ───────── */
export const ReelOutro: React.FC<{ short: string }> = ({ short }) => {
  const f = useCurrentFrame();
  const logo = tw(f, 0, 26), name = tw(f, 18, 40), vn = tw(f, 34, 58), en = tw(f, 48, 72), note = tw(f, 70, 92);
  const out = 1 - tw(f, 190, 210, 0, 1, EASE);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center", fontFamily, opacity: out }}>
      <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ position: "absolute", top: 380, height: 430, opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }} />
      <div style={{ position: "absolute", top: 870, width: "100%", textAlign: "center", opacity: name, transform: `translateY(${(1 - name) * 18}px)` }}>
        <div style={{ color: K.navy, fontWeight: 800, fontSize: 54, letterSpacing: 1 }}>BỆNH VIỆN ĐA KHOA</div>
        <div style={{ color: K.navy, fontWeight: 800, fontSize: 70, letterSpacing: 2 }}>XANH PÔN</div>
        <div style={{ color: K.navy, fontSize: 28, letterSpacing: 7, marginTop: 6 }}>SAINT PAUL HOSPITAL</div>
      </div>
      <div style={{ position: "absolute", top: 1108, width: 420, height: 5, background: K.brandRed, transform: `scaleX(${name})` }} />
      <div style={{ position: "absolute", top: 1140, width: 900, textAlign: "center", color: K.brandRed, fontWeight: 800, fontSize: 48, lineHeight: 1.25, opacity: vn, transform: `translateY(${(1 - vn) * 18}px)` }}>
        Truyền thống Trăm năm<br />Tiên phong Công nghệ
      </div>
      <div style={{ position: "absolute", top: 1290, width: 900, textAlign: "center", color: K.navy, fontStyle: "italic", fontSize: 32, opacity: en }}>
        Centuries of Tradition – Pioneer in Technology
      </div>
      <div style={{ position: "absolute", top: 1440, width: 820, textAlign: "center", color: "#7B8BA3", fontSize: 24, lineHeight: 1.4, opacity: note }}>{short}</div>
    </AbsoluteFill>
  );
};
