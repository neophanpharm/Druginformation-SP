import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily, tw, EASE } from "../theme";
import { SceneTiming } from "../timing";

/** Nền chung cho mọi cảnh: gradient rất nhẹ + lưới chấm mờ. */
export const SceneBG: React.FC<{ tint?: string; plain?: boolean; children?: React.ReactNode }> = ({ tint = C.bg, plain = false, children }) => plain ? (<AbsoluteFill style={{ background: "#FFFFFF" }}>{children}</AbsoluteFill>) : (
  <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 50% 42%, #FFFFFF 0%, ${tint} 70%, ${C.bg2} 100%)` }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="dots" width={48} height={48} patternUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={2} fill={C.line} opacity={0.06} />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#dots)" />
    </svg>
    {children}
  </AbsoluteFill>
);

/** Khung SVG 1920×1080 cho nội dung cảnh (vùng an toàn trên footer). */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

/** Lớp thương hiệu cố định: watermark SPH, footer nguồn PMID theo cảnh, thanh tiến độ. */
export const BrandFrame: React.FC<{ timings: SceneTiming[] }> = ({ timings }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const content = timings.filter((t) => t.sources.length > 0);
  const first = content[0];
  const last = content[content.length - 1];
  const chrome = Math.min(tw(frame, first.start, first.start + 20), 1 - tw(frame, last.end - 25, last.end - 5));
  if (chrome <= 0) return null;

  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      {/* watermark SPH góc trên phải */}
      <div style={{ position: "absolute", top: 28, right: 40, padding: "8px 14px", background: "#FFFFFF", borderRadius: 14, boxShadow: "0 4px 18px rgba(0,32,96,0.10)", opacity: 0.92 * chrome }}><Img src={staticFile("brand/logo-sph.png")} style={{ height: 54, display: "block" }} /></div>
      {/* footer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 78, opacity: chrome, transform: `translateY(${(1 - chrome) * 30}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.94)", borderTop: `1px solid ${C.bg2}` }} />
        <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: `${(frame / durationInFrames) * 100}%`, background: C.brandRed }} />
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 14 }}>
          <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ height: 50 }} />
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 19, letterSpacing: 0.3, lineHeight: 1.15 }}>
            BỆNH VIỆN ĐA KHOA XANH PÔN
            <div style={{ fontWeight: 400, fontSize: 14, color: C.brandRed, letterSpacing: 0.2 }}>Truyền thống Trăm năm – Tiên phong Công nghệ</div>
          </div>
          <div style={{ width: 2, height: 40, background: C.bg2, marginLeft: 18 }} />
        </div>
        {timings.map((t) => {
          if (!t.sources.length) return null;
          const o = Math.min(tw(frame, t.start + 4, t.start + 18), 1 - tw(frame, t.end - 16, t.end - 2));
          if (o <= 0) return null;
          return (
            <div key={t.id} style={{ position: "absolute", left: 520, right: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 10, opacity: o, transform: `translateX(${(1 - o) * 14}px)` }}>
              <span style={{ color: C.muted, fontSize: 17, fontWeight: 600, marginRight: 4 }}>Nguồn:</span>
              {t.sources.map((s) => (
                <span key={s} style={{ fontSize: 17, fontWeight: 600, color: s.startsWith("PMID") ? C.navy : C.ertaDark, background: s.startsWith("PMID") ? "#E8EEF8" : "#E2F4F4", padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>
                  {s}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Cảnh mở đầu: logo tròn hiện bằng vòng sáng + mặt nạ tròn, SPH, đường đỏ. */
export const BrandIntro: React.FC = () => {
  const f = useCurrentFrame();
  const ring = tw(f, 6, 46);
  const reveal = tw(f, 22, 62);
  const scale = interpolate(reveal, [0, 1], [0.86, 1]);
  const line = tw(f, 58, 92);
  const sph = tw(f, 70, 100);
  const out = 1 - tw(f, 128, 150);
  return (
    <SceneBG tint="#FFFFFF" plain>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <circle cx={960} cy={470} r={300} fill="none" stroke={C.navy} strokeWidth={6} strokeDasharray={2 * Math.PI * 300} strokeDashoffset={2 * Math.PI * 300 * (1 - ring)} transform="rotate(-90 960 470)" strokeLinecap="round" opacity={0.9} />
          <circle cx={960} cy={470} r={322} fill="none" stroke={C.brandRed} strokeWidth={3} strokeDasharray={2 * Math.PI * 322} strokeDashoffset={2 * Math.PI * 322 * (1 - tw(f, 16, 58))} transform="rotate(90 960 470)" opacity={0.7} />
          <defs>
            <clipPath id="introReveal">
              <circle cx={960} cy={470} r={300 * reveal} />
            </clipPath>
          </defs>
          <rect x={660} y={796} width={600 * line} height={5} rx={2} fill={C.brandRed} transform={`translate(${300 * (1 - line)} 0)`} />
        </svg>
        <div style={{ position: "absolute", top: 470 - 268, left: 960 - 301, width: 602, height: 536, clipPath: `circle(${300 * reveal}px at 301px 268px)`, transform: `scale(${scale})` }}>
          <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ width: 602, height: 536 }} />
        </div>
        <Img src={staticFile("brand/logo-sph.png")} style={{ position: "absolute", top: 830, height: 120, opacity: sph, transform: `translateY(${(1 - sph) * 20}px)` }} />
      </AbsoluteFill>
    </SceneBG>
  );
};

/** Cảnh kết: logo + tên + slogan song ngữ + lưu ý dành cho nhân viên y tế. */
export const BrandOutro: React.FC = () => {
  const f = useCurrentFrame();
  const logo = tw(f, 0, 30);
  const name = tw(f, 22, 46);
  const vn = tw(f, 40, 66);
  const en = tw(f, 56, 82);
  const note = tw(f, 80, 104);
  const fadeOut = 1 - tw(f, 186, 210, 0, 1, EASE);
  return (
    <SceneBG tint="#FFFFFF" plain>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", opacity: fadeOut }}>
        <Img src={staticFile("brand/logo-xanhpon-tron.png")} style={{ position: "absolute", top: 120, height: 400, opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }} />
        <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center", opacity: name, transform: `translateY(${(1 - name) * 16}px)` }}>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 56, letterSpacing: 1.5 }}>BỆNH VIỆN ĐA KHOA XANH PÔN</div>
          <div style={{ color: C.navy, fontWeight: 400, fontSize: 28, letterSpacing: 6, marginTop: 6 }}>SAINT PAUL HOSPITAL</div>
        </div>
        <div style={{ position: "absolute", top: 700, width: 520, height: 4, background: C.brandRed, opacity: name, transform: `scaleX(${name})` }} />
        <div style={{ position: "absolute", top: 730, width: "100%", textAlign: "center", color: C.brandRed, fontWeight: 700, fontSize: 46, opacity: vn, transform: `translateY(${(1 - vn) * 16}px)` }}>
          Truyền thống Trăm năm – Tiên phong Công nghệ
        </div>
        <div style={{ position: "absolute", top: 800, width: "100%", textAlign: "center", color: C.navy, fontStyle: "italic", fontSize: 30, opacity: en, transform: `translateY(${(1 - en) * 16}px)` }}>
          Centuries of Tradition – Pioneer in Technology
        </div>
        <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center", color: C.muted, fontSize: 20, opacity: note }}>
          Thông tin dành cho nhân viên y tế · Tài liệu tham khảo đầy đủ kèm theo video
        </div>
      </AbsoluteFill>
    </SceneBG>
  );
};

