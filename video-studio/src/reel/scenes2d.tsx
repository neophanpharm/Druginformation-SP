import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, tw, pulse, EASE_IN_OUT } from "../theme";
import { DarkBG, Header, StatCard, Callout, K, SAFE, CONTENT_W } from "./ui";
import { Scene3D, Molecule3D } from "./three";
import { R } from "./timing";

const at = (sec: number) => R.voiceLeadFrames + Math.round(sec * R.fps);

/** Lớp phân tử 3D mờ trôi ở hậu cảnh cho các cảnh infographic (tạo chiều sâu). */
const AmbientMolecules: React.FC<{ color?: string; count?: number }> = ({ color = K.erta, count = 5 }) => {
  const f = useCurrentFrame();
  return (
    <Scene3D>
      {Array.from({ length: count }).map((_, i) => (
        <Molecule3D key={i} color={i % 2 ? color : K.mero} position={[(i % 2 ? 1.25 : -1.25) + Math.sin(f / 70 + i) * 0.15, 2.6 - i * 1.15 + Math.cos(f / 80 + i) * 0.12, -6 - (i % 3)]} scale={0.5} rot={[0.4, f * 0.01 + i, 0.2]} glow={0.2} opacity={0.16} />
      ))}
    </Scene3D>
  );
};

/* ───────────── FREE – thuốc tự do tăng ───────────── */
export const Free: React.FC = () => (
  <DarkBG>
    <AmbientMolecules />
    <Header chapter="03 · DƯỢC ĐỘNG HỌC" title="Thuốc tự do tăng khi…" />
    <StatCard x={SAFE.left} y={420} w={CONTENT_W} delay={at(0)} value="×2,3 → ×7,6" label="AUC thuốc tự do: suy thận vừa → giai đoạn cuối" color={K.erta} size={64} />
    <StatCard x={SAFE.left} y={622} w={CONTENT_W} delay={at(0.96)} value="25/29 ca" label="có albumin < 3,5 g/dL trong ca độc tính thần kinh" color={K.warn} size={64} />
    <StatCard x={SAFE.left} y={824} w={CONTENT_W} delay={at(2.24)} value="37,8 vs 14,6" label="Nồng độ đáy (µg/mL): có vs không độc tính" color={K.danger} size={64} />
    <Callout x={SAFE.left} y={1052} delay={at(4.3)} text="Thuốc tự do ↑ → nguy cơ độc tính thần kinh ↑" color={K.warn} icon="↑" />
  </DarkBG>
);

/* ───────────── SIGNS – biểu hiện ───────────── */
export const Signs: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { label: "Co giật", pct: 70, color: K.danger, t: at(0) },
    { label: "Rối loạn ý thức / mê sảng", pct: 27, color: K.warn, t: at(4.52) },
    { label: "Ảo giác (chủ yếu thị giác)", pct: 17, color: K.dori, t: at(3.68) },
  ];
  return (
    <DarkBG>
      <AmbientMolecules color={K.danger} count={4} />
      <Header chapter="05 · LÂM SÀNG" title="Biểu hiện thường gặp" />
      {rows.map((r, i) => {
        const p = tw(f, r.t, r.t + 26, 0, 1, EASE_IN_OUT);
        const o = tw(f, r.t, r.t + 10);
        return (
          <div key={r.label} style={{ position: "absolute", left: SAFE.left, top: 440 + i * 150, width: CONTENT_W, fontFamily, opacity: o }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: K.white, fontWeight: 700, fontSize: 34 }}>{r.label}</span>
              <span style={{ color: r.color, fontWeight: 800, fontSize: 56 }}>{Math.round(r.pct * p)}%</span>
            </div>
            <div style={{ marginTop: 10, height: 22, borderRadius: 11, background: K.faint, overflow: "hidden" }}>
              <div style={{ height: 22, width: `${r.pct * p}%`, borderRadius: 11, background: `linear-gradient(90deg, ${r.color}AA, ${r.color})`, boxShadow: `0 0 18px ${r.color}88` }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: SAFE.left, top: 892, fontFamily, color: K.soft, fontSize: 24, opacity: tw(f, 30, 50) }}>
        125 ca · tổng quan hệ thống (Mitaka 2024) · một BN có thể có nhiều biểu hiện
      </div>
      <div style={{ position: "absolute", left: SAFE.left, top: 950, display: "flex", gap: 14, fontFamily, opacity: tw(f, at(5.4), at(5.8)) }}>
        {["Run · giật cơ", "Đi không vững"].map((t) => (
          <span key={t} style={{ padding: "10px 20px", borderRadius: 999, border: `2px solid ${K.mero}`, color: K.white, fontWeight: 700, fontSize: 28, background: "rgba(91,155,255,0.14)" }}>{t}</span>
        ))}
      </div>
      <Callout x={SAFE.left} y={1062} delay={at(6.6)} text="Dễ nhầm: bệnh tâm thần · nhiễm trùng TKTW" color={K.warn} icon="?" />
    </DarkBG>
  );
};

/* ───────────── ONSET – thời gian khởi phát ───────────── */
export const Onset: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const X0 = SAFE.left + 20, X1 = SAFE.left + CONTENT_W - 60, Y = 700;
  const xd = (d: number) => X0 + ((X1 - X0) * d) / 14;
  const axis = tw(f, 4, 30);
  const head = tw(f, at(0.2), at(1.5), 0, 1, EASE_IN_OUT) * 4;
  const band = tw(f, at(1.0), at(2.2));
  const late = tw(f, at(4.0), at(4.6));
  const mark = spring({ frame: f - at(1.4), fps, config: { damping: 12 } });
  return (
    <DarkBG>
      <AmbientMolecules count={4} />
      <Header chapter="05 · LÂM SÀNG" title="Thời gian khởi phát" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glowF"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
        <rect x={xd(3)} y={Y - 34} width={(xd(9) - xd(3)) * band} height={68} rx={34} fill={K.warn} opacity={0.28} />
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * axis} y2={Y} stroke={K.white} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        {Array.from({ length: 15 }).map((_, d) => (
          <g key={d} opacity={axis}>
            <line x1={xd(d)} y1={Y - (d % 7 === 0 ? 22 : 12)} x2={xd(d)} y2={Y + (d % 7 === 0 ? 22 : 12)} stroke={K.white} strokeWidth={d % 7 === 0 ? 5 : 3} opacity={0.75} />
            {[0, 3, 4, 7, 9, 14].includes(d) && (
              <text x={xd(d)} y={Y + 66} textAnchor="middle" fill={d === 4 ? K.warn : K.soft} fontFamily={fontFamily} fontWeight={700} fontSize={30}>{d}</text>
            )}
          </g>
        ))}
        <text x={X1 + 18} y={Y + 10} fill={K.soft} fontFamily={fontFamily} fontSize={26} fontWeight={600} opacity={axis}>ngày</text>
        {/* đầu chạy: giọt thuốc từ ngày 0 tới ngày 4 */}
        <circle cx={xd(head)} cy={Y} r={16} fill={K.erta} />
        <circle cx={xd(head)} cy={Y} r={34} fill={K.erta} opacity={0.25} filter="url(#glowF)" />
        {/* mốc trung vị */}
        <g transform={`translate(${xd(4)} ${Y - 150}) scale(${mark})`}>
          <rect x={-120} y={-58} width={240} height={96} rx={22} fill={K.danger} />
          <text x={0} y={8} textAnchor="middle" fill={K.white} fontFamily={fontFamily} fontWeight={800} fontSize={52}>Ngày 4</text>
          <path d="M -16 38 L 0 66 L 16 38 Z" fill={K.danger} />
        </g>
        <text x={(xd(3) + xd(9)) / 2} y={Y + 120} textAnchor="middle" fill={K.warn} fontFamily={fontFamily} fontWeight={700} fontSize={30} opacity={band}>IQR 3–9 ngày</text>
        {/* ca muộn */}
        <g opacity={late}>
          <path d={`M ${xd(13.2)} ${Y - 70} q 30 -40 70 -20`} stroke={K.mero} strokeWidth={4} fill="none" strokeDasharray="8 8" />
          <text x={xd(14) - 20} y={Y - 110} textAnchor="end" fill={K.mero} fontFamily={fontFamily} fontWeight={700} fontSize={28}>có ca &gt; 14 ngày</text>
        </g>
      </svg>
      <StatCard x={SAFE.left} y={930} w={CONTENT_W} delay={at(5.44)} value="90,9%" label="hồi phục hoàn toàn sau ngừng thuốc" sub="Thời gian hồi phục trung vị 7 ngày (1–42)" color={K.safe} size={60} />
    </DarkBG>
  );
};

/* ───────────── RISK – yếu tố nguy cơ ───────────── */
export const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [
    { t: at(0.84), text: "Cao tuổi (TB 72)" },
    { t: at(1.88), text: "Suy thận · 62%" },
    { t: at(2.6), text: "Lọc máu" },
    { t: at(3.6), text: "Bệnh TKTW nền · 42%" },
    { t: at(4.64), text: "Albumin thấp" },
  ];
  const value = 0.1 + chips.reduce((a, c) => a + 0.155 * tw(f, c.t + 4, c.t + 20), 0);
  const cx = 540 - 42, cy = 760, r = 270;
  const ang = -180 + Math.min(value, 0.95) * 180;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <DarkBG>
      <AmbientMolecules count={4} />
      <Header chapter="06 · NGUY CƠ" title="Ai dễ gặp?" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={arc(-180, -122)} stroke={K.safe} strokeWidth={54} fill="none" />
        <path d={arc(-118, -62)} stroke={K.warn} strokeWidth={54} fill="none" />
        <path d={arc(-58, 0)} stroke={K.danger} strokeWidth={54} fill="none" />
        <g transform={`rotate(${ang} ${cx} ${cy})`}>
          <path d={`M ${cx} ${cy - 14} L ${cx + r - 36} ${cy} L ${cx} ${cy + 14} Z`} fill={K.white} />
        </g>
        <circle cx={cx} cy={cy} r={30} fill={K.white} />
        <circle cx={cx} cy={cy} r={60} fill={K.danger} opacity={0.18 * tw(f, at(4.8), at(5.4)) * pulse(f, 14, 0.5, 1)} />
      </svg>
      <div style={{ position: "absolute", left: SAFE.left, top: 820, width: CONTENT_W, display: "flex", flexWrap: "wrap", gap: 14, fontFamily }}>
        {chips.map((c) => {
          const p = spring({ frame: f - c.t, fps, config: { damping: 13 } });
          return (
            <span key={c.text} style={{ padding: "12px 22px", borderRadius: 999, background: "rgba(255,106,61,0.14)", border: `2px solid ${K.danger}`, color: K.white, fontWeight: 700, fontSize: 30, opacity: Math.min(1, p * 1.3), transform: `scale(${0.7 + 0.3 * p})` }}>{c.text}</span>
          );
        })}
      </div>
      <Callout x={SAFE.left} y={1080} delay={at(5.8)} text="Chỉ 15% ca dùng liều vượt khuyến cáo – liều đúng vẫn có thể gặp" color={K.warn} icon="!" />
    </DarkBG>
  );
};

/* ───────────── COMPARE – forest plot ───────────── */
export const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const L = 420, Rx = 900;
  const xp = (v: number) => L + ((Math.log10(v) + 1) / 2) * (Rx - L);
  const rows = [
    { name: "Imipenem", c: K.imi, or: 3.5, lo: 2.23, hi: 5.49, txt: "3,50 (2,23–5,49)" },
    { name: "Ertapenem", c: K.erta, or: 1.32, lo: 0.22, hi: 7.74, txt: "1,32 (0,22–7,74)" },
    { name: "Meropenem", c: K.mero, or: 1.04, lo: 0.61, hi: 1.77, txt: "1,04 (0,61–1,77)" },
    { name: "Doripenem", c: K.dori, or: 0.44, lo: 0.13, hi: 1.53, txt: "0,44 (0,13–1,53)" },
  ];
  const axis = tw(f, 4, 26);
  const meroHi = tw(f, at(2.72), at(3.2));
  const imiHi = tw(f, at(0), at(0.6)) * (1 - 0.5 * meroHi);
  return (
    <DarkBG>
      <Header chapter="07 · SO SÁNH" title="Nguy cơ co giật giữa các carbapenem" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={xp(1)} y={500} width={Rx - xp(1)} height={520} fill={K.danger} opacity={0.07 * axis} />
        <line x1={xp(1)} y1={500} x2={xp(1)} y2={1020} stroke={K.white} strokeWidth={3} strokeDasharray="10 10" opacity={0.6 * axis} />
        <line x1={L} y1={1020} x2={L + (Rx - L) * axis} y2={1020} stroke={K.white} strokeWidth={4} opacity={0.85} />
        {[0.1, 1, 10].map((v) => (
          <g key={v} opacity={axis}>
            <line x1={xp(v)} y1={1010} x2={xp(v)} y2={1032} stroke={K.white} strokeWidth={4} />
            <text x={xp(v)} y={1068} textAnchor="middle" fill={K.soft} fontFamily={fontFamily} fontWeight={700} fontSize={26}>{String(v).replace(".", ",")}</text>
          </g>
        ))}
        <text x={xp(1) + 12} y={1104} fill={K.danger} fontFamily={fontFamily} fontWeight={700} fontSize={22} opacity={axis}>nhiều co giật hơn →</text>
        <text x={xp(1) - 12} y={1104} textAnchor="end" fill={K.safe} fontFamily={fontFamily} fontWeight={700} fontSize={22} opacity={axis}>← ít hơn</text>
        {rows.map((r, i) => {
          const y = 560 + i * 120;
          const d = 12 + i * 12;
          const bar = tw(f, d, d + 26, 0, 1, EASE_IN_OUT);
          const hl = i === 0 ? imiHi : i === 2 ? meroHi : 0;
          return (
            <g key={r.name}>
              {hl > 0 && <rect x={SAFE.left - 12} y={y - 50} width={Rx - SAFE.left + 30} height={100} rx={20} fill={r.c} opacity={0.12 * hl} />}
              <circle cx={SAFE.left + 18} cy={y - 10} r={14 * tw(f, d - 6, d + 4)} fill={r.c} />
              <text x={SAFE.left + 44} y={y} fill={K.white} fontFamily={fontFamily} fontWeight={800} fontSize={34} opacity={tw(f, d - 6, d + 8)}>{r.name}</text>
              <text x={SAFE.left + 44} y={y + 34} fill={K.soft} fontFamily={fontFamily} fontWeight={600} fontSize={22} opacity={bar}>OR {r.txt}</text>
              <line x1={xp(r.or) - (xp(r.or) - xp(r.lo)) * bar} x2={xp(r.or) + (xp(r.hi) - xp(r.or)) * bar} y1={y} y2={y} stroke={r.c} strokeWidth={9} strokeLinecap="round" />
              <rect x={xp(r.or) - 17} y={y - 17} width={34} height={34} rx={5} fill={r.c} stroke={K.white} strokeWidth={3} transform={`rotate(45 ${xp(r.or)} ${y})`} opacity={bar} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: SAFE.left, top: 440, fontFamily, color: K.soft, fontSize: 24, opacity: axis }}>
        Phân tích gộp RCT · OR so với kháng sinh không phải carbapenem
      </div>
      <Callout x={SAFE.left} y={1132} delay={at(2.9)} text="Cần carbapenem? Cân nhắc meropenem" color={K.mero} icon="✓" />
    </DarkBG>
  );
};

/* ───────────── PRACTICE – 5 việc cần làm ───────────── */
export const Practice: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { t: at(0), title: "ClCr ≤ 30 → 500 mg/ngày", sub: "Rà soát tiền sử động kinh, đột quỵ, sa sút trí tuệ", c: K.erta },
    { t: at(7.28), title: "Theo dõi sát tuần đầu", sub: "Khởi phát trung vị ngày 4 (IQR 3–9)", c: K.warn },
    { t: at(9.04), title: "Nghi ngờ → ngừng ertapenem", sub: "Loại trừ nguyên nhân khác: CT/MRI, EEG, dịch não tủy", c: K.danger },
    { t: at(12.16), title: "Cắt cơn: benzodiazepin", sub: "Cân nhắc lọc máu nếu suy thận nặng", c: K.dori },
    { t: at(14.4), title: "Thay thế: meropenem · TDM", sub: "Đo nồng độ đáy ở nhóm nguy cơ cao", c: K.mero },
  ];
  const allDone = tw(f, 575, 600);
  return (
    <DarkBG>
      <Header chapter="09 · THỰC HÀNH" title="5 việc cần làm" />
      {steps.map((s, i) => {
        const p = spring({ frame: f - s.t, fps, config: { damping: 15, stiffness: 120 } });
        const next = steps[i + 1]?.t ?? 9999;
        const active = f >= s.t && f < next && allDone < 0.5;
        const done = f >= next || allDone > 0.5;
        return (
          <div key={i} style={{ position: "absolute", left: SAFE.left, top: 410 + i * 146, width: CONTENT_W, height: 128, borderRadius: 24, background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)", border: `2px solid ${active ? s.c : K.cardLine}`, boxShadow: active ? `0 0 30px ${s.c}55` : "none", display: "flex", alignItems: "center", gap: 22, padding: "0 24px", fontFamily, opacity: Math.min(1, p * 1.2) * (done && !active ? 0.82 : 1), transform: `translateX(${(1 - p) * 60}px) scale(${active ? 1.02 : 1})` }}>
            <div style={{ flex: "0 0 64px", height: 64, borderRadius: 32, background: done ? K.safe : s.c, color: K.ink, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? "✓" : i + 1}</div>
            <div>
              <div style={{ color: K.white, fontWeight: 800, fontSize: 34, lineHeight: 1.15 }}>{s.title}</div>
              <div style={{ color: K.soft, fontWeight: 500, fontSize: 23, marginTop: 6 }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </DarkBG>
  );
};

/* ───────────── TAKEAWAY – 3 điểm mấu chốt ───────────── */
export const Takeaway: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    "Nghĩ tới độc tính thần kinh ở BN cao tuổi, suy thận, có bệnh TKTW nền",
    "Khởi phát thường ngày 3–9; ngừng thuốc → đa số hồi phục",
    "Không phối hợp carbapenem với valproat",
  ];
  return (
    <DarkBG hue="#0F4A6B">
      <AmbientMolecules count={5} />
      <Header chapter="GHI NHỚ" title="3 điểm mấu chốt" />
      {items.map((t, i) => {
        const d = 18 + i * 22;
        const p = tw(f, d, d + 18);
        return (
          <div key={i} style={{ position: "absolute", left: SAFE.left, top: 460 + i * 210, width: CONTENT_W, display: "flex", gap: 24, alignItems: "flex-start", fontFamily, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ flex: "0 0 84px", height: 84, borderRadius: 24, background: K.erta, color: K.ink, fontWeight: 800, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ color: K.white, fontWeight: 700, fontSize: 40, lineHeight: 1.3 }}>{t}</div>
          </div>
        );
      })}
    </DarkBG>
  );
};
