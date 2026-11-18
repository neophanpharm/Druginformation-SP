import React from "react";
import { C } from "../theme";

type XY = { x: number; y: number };

/** Phân tử carbapenem: vòng tròn màu + vòng β-lactam vuông bốn cạnh + chuỗi bên. */
export const Molecule: React.FC<XY & { r?: number; color?: string; rot?: number; opacity?: number; glow?: number; free?: boolean }> = ({
  x, y, r = 34, color = C.erta, rot = 0, opacity = 1, glow = 0, free = false,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
    {glow > 0 && <circle r={r * 1.9} fill={color} opacity={0.18 * glow} />}
    {glow > 0 && <circle r={r * 1.45} fill={color} opacity={0.22 * glow} />}
    <circle r={r} fill={color} stroke={C.white} strokeWidth={r * 0.12} />
    <rect x={-r * 0.38} y={-r * 0.38} width={r * 0.76} height={r * 0.76} rx={r * 0.06} fill="none" stroke={C.white} strokeWidth={r * 0.13} />
    <line x1={r * 0.38} y1={-r * 0.38} x2={r * 0.72} y2={-r * 0.72} stroke={C.white} strokeWidth={r * 0.11} strokeLinecap="round" />
    <circle cx={r * 0.72} cy={-r * 0.72} r={r * 0.13} fill={C.white} />
    {free && <circle r={r * 1.18} fill="none" stroke={color} strokeWidth={3} strokeDasharray="6 7" />}
  </g>
);

/** Vi khuẩn hình que có lông roi; wall = độ nguyên vẹn thành (1 lành, 0 thủng), burst = 0..1 vỡ. */
export const Bacterium: React.FC<XY & { w?: number; h?: number; rot?: number; wall?: number; burst?: number; t?: number; color?: string; dark?: string }> = ({
  x, y, w = 420, h = 170, rot = 0, wall = 1, burst = 0, t = 0, color = C.bacteria, dark = C.bacteriaDark,
}) => {
  const swell = 1 + 0.12 * (1 - wall) + 0.25 * burst;
  const holes = Math.round((1 - wall) * 6);
  const flag = (k: number) => {
    const ph = t / 6 + k;
    const d = `M ${-w / 2} ${(k - 1) * 30} C ${-w / 2 - 60} ${(k - 1) * 30 + 30 * Math.sin(ph)}, ${-w / 2 - 110} ${(k - 1) * 30 - 30 * Math.sin(ph)}, ${-w / 2 - 170} ${(k - 1) * 40 + 20 * Math.sin(ph + 1)}`;
    return <path key={k} d={d} fill="none" stroke={dark} strokeWidth={5} strokeLinecap="round" opacity={1 - burst} />;
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${swell})`}>
      {[0, 1, 2].map(flag)}
      {burst < 1 && (
        <g opacity={1 - burst}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} stroke={dark} strokeWidth={10} strokeDasharray={wall < 1 ? `${40 * wall + 8} ${(1 - wall) * 28 + 2}` : undefined} />
          {/* lưới peptidoglycan */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={-w / 2 + 60 + i * ((w - 120) / 6)} y1={-h / 2 + 18} x2={-w / 2 + 60 + i * ((w - 120) / 6)} y2={h / 2 - 18} stroke={dark} strokeWidth={3} opacity={0.35 * wall} />
          ))}
          <line x1={-w / 2 + 50} y1={0} x2={w / 2 - 50} y2={0} stroke={dark} strokeWidth={3} opacity={0.35 * wall} />
          {Array.from({ length: holes }).map((_, i) => (
            <circle key={i} cx={-w / 2 + 70 + i * 55} cy={i % 2 ? -h / 2 + 4 : h / 2 - 4} r={14} fill={C.bg} />
          ))}
          <ellipse cx={-w * 0.12} cy={-h * 0.05} rx={w * 0.16} ry={h * 0.18} fill={dark} opacity={0.25} />
        </g>
      )}
      {burst > 0 &&
        Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const d = 40 + burst * 260;
          return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.6} r={10 * (1 - burst) + 4} fill={i % 2 ? color : dark} opacity={1 - burst} />;
        })}
    </g>
  );
};

/** Kẹp PBP (protein gắn penicillin). locked = đã bị thuốc khóa (xám). */
export const PBP: React.FC<XY & { locked?: number; scale?: number }> = ({ x, y, locked = 0, scale = 1 }) => {
  const col = locked > 0.5 ? "#9AA5B1" : C.pbp;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -26 -10 Q -30 -40 -6 -44 L -6 -18 Z" fill={col} />
      <path d="M 26 -10 Q 30 -40 6 -44 L 6 -18 Z" fill={col} />
      <rect x={-28} y={-12} width={56} height={30} rx={10} fill={col} />
    </g>
  );
};

/** Neuron: state 0 = yên (lam), 1 = quá kích thích (cam). */
export const Neuron: React.FC<XY & { state?: number; s?: number; flash?: number; rot?: number }> = ({ x, y, state = 0, s = 1, flash = 0, rot = 0 }) => {
  const col = mix(C.calm, C.excited, state);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {flash > 0 && <circle r={90} fill={C.excited} opacity={0.25 * flash} />}
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <path key={i} d={`M 0 0 Q ${Math.cos(rad(a)) * 60} ${Math.sin(rad(a)) * 60 + 18} ${Math.cos(rad(a + 8)) * 98} ${Math.sin(rad(a + 8)) * 98}`} stroke={col} strokeWidth={10} fill="none" strokeLinecap="round" />
      ))}
      <path d={`M 0 0 L 170 10`} stroke={col} strokeWidth={12} strokeLinecap="round" />
      <circle r={42} fill={col} stroke={C.white} strokeWidth={6} />
      <circle r={16} fill={C.white} opacity={0.7} />
      {flash > 0 && [0, 1, 2].map((k) => (
        <path key={k} d={`M ${-60 + k * 50} -70 l 12 22 l -14 4 l 14 24`} stroke={C.warn} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={flash} />
      ))}
    </g>
  );
};

/** Thụ thể GABA-A: 5 tiểu đơn vị trên màng; open 0..1. */
export const GabaReceptor: React.FC<XY & { open?: number; s?: number }> = ({ x, y, open = 0, s = 1 }) => {
  const gap = 10 + open * 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-2, -1, 0, 1, 2].map((k) => {
        const off = k === 0 ? 0 : Math.sign(k) * gap * (Math.abs(k) === 1 ? 1 : 1.6);
        return <rect key={k} x={k * 44 - 20 + off} y={-90} width={40} height={180} rx={18} fill={k % 2 ? "#5B7DB1" : "#7A98C9"} stroke={C.white} strokeWidth={4} />;
      })}
    </g>
  );
};

/** GABA: giọt xanh lá. */
export const Gaba: React.FC<XY & { r?: number; opacity?: number }> = ({ x, y, r = 16, opacity = 1 }) => (
  <path transform={`translate(${x} ${y})`} opacity={opacity} d={`M 0 ${-r * 1.4} C ${r} ${-r * 0.2}, ${r} ${r}, 0 ${r} C ${-r} ${r}, ${-r} ${-r * 0.2}, 0 ${-r * 1.4} Z`} fill={C.gaba} stroke={C.white} strokeWidth={3} />
);

/** Thận: impaired 0..1 chuyển xám, phễu tắc. */
export const Kidney: React.FC<XY & { s?: number; impaired?: number; flow?: number }> = ({ x, y, s = 1, impaired = 0, flow = 0 }) => {
  const col = mix(C.kidney, "#A3ABB6", impaired);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 80} 0) scale(${d} 1)`}>
          <path d="M 10 -90 C 80 -95, 95 -20, 70 30 C 50 75, 10 95, -10 70 C -30 45, 0 20, -10 0 C -20 -20, -40 -40, -20 -70 C -10 -85, 0 -88, 10 -90 Z" fill={col} stroke={C.white} strokeWidth={6} />
          <path d="M -6 0 C -30 10, -40 30, -60 60" stroke={mix("#E9B8BE", "#CDD3DA", impaired)} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d="M -140 60 C -110 120, -40 140, 0 150 C 40 140, 110 120, 140 60" stroke={mix("#E9B8BE", "#CDD3DA", impaired)} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={-46} y={150} width={92} height={70} rx={26} fill={mix("#F3E2B3", "#D9DEE5", impaired)} stroke={C.white} strokeWidth={5} />
      {flow > 0 && <rect x={-46} y={220 - 70 * flow} width={92} height={70 * flow} rx={26} fill={mix("#E9C76A", "#C0C6CF", impaired)} opacity={0.8} />}
    </g>
  );
};

/** Xe albumin chở phân tử thuốc. */
export const AlbuminCart: React.FC<XY & { load?: number; s?: number; color?: string; wobble?: number }> = ({ x, y, load = 3, s = 1, color = C.erta, wobble = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(wobble) * 3}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={80} ry={44} fill={C.albumin} stroke={C.albuminDark} strokeWidth={5} />
    <path d="M -50 -10 Q 0 -30 50 -10" stroke={C.albuminDark} strokeWidth={4} fill="none" opacity={0.6} />
    {Array.from({ length: load }).map((_, i) => (
      <Molecule key={i} x={-44 + i * 44} y={-48} r={18} color={color} />
    ))}
  </g>
);

/** Đồng hồ ngày: 14 vạch; progress = số ngày đã chạy (0..14); vùng tô [bandA, bandB]; vạch nhấn. */
export const DayClock: React.FC<XY & { r?: number; progress: number; bandA?: number; bandB?: number; band?: number; mark?: number; markGlow?: number; dots?: number[]; dotsOn?: number; color?: string }> = ({
  x, y, r = 260, progress, bandA = 3, bandB = 9, band = 0, mark = 4, markGlow = 0, dots = [], dotsOn = 0, color = C.erta,
}) => {
  const N = 14;
  const ang = (d: number) => -90 + (d / N) * 360;
  const arc = (a0: number, a1: number, rr: number) => {
    const p0 = [Math.cos(rad(a0)) * rr, Math.sin(rad(a0)) * rr];
    const p1 = [Math.cos(rad(a1)) * rr, Math.sin(rad(a1)) * rr];
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${p0[0]} ${p0[1]} A ${rr} ${rr} 0 ${large} 1 ${p1[0]} ${p1[1]}`;
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 30} fill={C.white} stroke={C.bg2} strokeWidth={10} />
      {band > 0 && <path d={arc(ang(bandA), ang(bandA) + (ang(bandB) - ang(bandA)) * band, r - 10)} stroke={C.warn} strokeWidth={46} fill="none" strokeLinecap="round" opacity={0.85} />}
      <path d={arc(-90, -90 + (Math.min(progress, N - 0.001) / N) * 360, r + 30)} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
      {Array.from({ length: N }).map((_, d) => {
        const a = rad(ang(d));
        const big = d === 0 || d === 7;
        return <line key={d} x1={Math.cos(a) * (r - 40)} y1={Math.sin(a) * (r - 40)} x2={Math.cos(a) * (r + 10)} y2={Math.sin(a) * (r + 10)} stroke={d <= progress ? C.line : C.muted} strokeWidth={big ? 12 : 7} strokeLinecap="round" opacity={d <= progress ? 1 : 0.5} />;
      })}
      {markGlow > 0 && (
        <g transform={`rotate(${ang(mark)})`}>
          <circle cx={r - 10} cy={0} r={46 * markGlow} fill={C.danger} opacity={0.9} />
          <path d={`M ${r - 18} -22 l 14 18 l -10 4 l 12 22`} stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={markGlow} />
        </g>
      )}
      {dots.map((d, i) => (
        <circle key={i} cx={Math.cos(rad(ang(d))) * (r + 70)} cy={Math.sin(rad(ang(d))) * (r + 70)} r={12} fill={C.excited} opacity={dotsOn} />
      ))}
      <g transform={`rotate(${ang(progress)})`}>
        <line x1={0} y1={0} x2={r - 60} y2={0} stroke={C.navy} strokeWidth={14} strokeLinecap="round" />
      </g>
      <circle r={22} fill={C.navy} />
    </g>
  );
};

/** Đồng hồ đo nguy cơ: value 0..1 (lục → vàng → đỏ). */
export const RiskGauge: React.FC<XY & { r?: number; value: number }> = ({ x, y, r = 280, value }) => {
  const seg = (a0: number, a1: number, col: string) => {
    const p0 = [Math.cos(rad(a0)) * r, Math.sin(rad(a0)) * r];
    const p1 = [Math.cos(rad(a1)) * r, Math.sin(rad(a1)) * r];
    return <path d={`M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`} stroke={col} strokeWidth={60} fill="none" />;
  };
  const a = -180 + value * 180;
  return (
    <g transform={`translate(${x} ${y})`}>
      {seg(-180, -120, C.safe)}
      {seg(-120, -60, C.warn)}
      {seg(-60, 0, C.danger)}
      <g transform={`rotate(${a})`}>
        <path d={`M 0 -14 L ${r - 40} 0 L 0 14 Z`} fill={C.navy} />
      </g>
      <circle r={30} fill={C.navy} />
    </g>
  );
};

/** Bể nồng độ (valproat): level 0..1; dải điều trị [lo, hi]. */
export const Tank: React.FC<XY & { w?: number; h?: number; level: number; lo?: number; hi?: number; color?: string }> = ({ x, y, w = 300, h = 460, level, lo = 0.5, hi = 0.8, color = C.valproate }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={30} fill={C.white} stroke={C.line} strokeWidth={8} />
    <rect x={-w / 2 + 8} y={h / 2 - 8 - (h - 16) * hi} width={w - 16} height={(h - 16) * (hi - lo)} fill={C.safe} opacity={0.22} />
    <line x1={-w / 2 - 20} x2={w / 2 + 20} y1={h / 2 - 8 - (h - 16) * hi} y2={h / 2 - 8 - (h - 16) * hi} stroke={C.safe} strokeWidth={5} strokeDasharray="14 10" />
    <line x1={-w / 2 - 20} x2={w / 2 + 20} y1={h / 2 - 8 - (h - 16) * lo} y2={h / 2 - 8 - (h - 16) * lo} stroke={C.safe} strokeWidth={5} strokeDasharray="14 10" />
    <clipPath id={`tank-${x}-${y}`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={24} />
    </clipPath>
    <g clipPath={`url(#tank-${x}-${y})`}>
      <rect x={-w / 2} y={h / 2 - 8 - (h - 16) * level} width={w} height={h} fill={color} opacity={0.75} />
      <path d={`M ${-w / 2} ${h / 2 - 8 - (h - 16) * level} q ${w / 4} -14 ${w / 2} 0 t ${w / 2} 0`} fill={color} opacity={0.9} />
    </g>
  </g>
);

/** Viên thuốc hai màu. */
export const Pill: React.FC<XY & { s?: number; rot?: number; color?: string; opacity?: number }> = ({ x, y, s = 1, rot = 0, color = C.valproate, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <rect x={-70} y={-30} width={140} height={60} rx={30} fill={C.white} stroke={color} strokeWidth={6} />
    <path d="M 0 -30 L 40 -30 A 30 30 0 0 1 40 30 L 0 30 Z" fill={color} />
  </g>
);

/** Dấu cấm tròn. */
export const NoSign: React.FC<XY & { r?: number; p?: number }> = ({ x, y, r = 170, p = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${p})`} opacity={p}>
    <circle r={r} fill="none" stroke={C.danger} strokeWidth={26} />
    <line x1={-r * 0.7} y1={r * 0.7} x2={r * 0.7} y2={-r * 0.7} stroke={C.danger} strokeWidth={26} strokeLinecap="round" />
  </g>
);

/** Dấu tích. */
export const Check: React.FC<XY & { s?: number; p?: number; color?: string }> = ({ x, y, s = 1, p = 1, color = C.safe }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={40} fill={color} opacity={p} />
    <path d="M -18 0 L -4 14 L 20 -14" stroke={C.white} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
  </g>
);

export function mix(a: string, b: string, t: number) {
  const k = Math.max(0, Math.min(1, t));
  const pa = hex(a), pb = hex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const rad = (d: number) => (d * Math.PI) / 180;
