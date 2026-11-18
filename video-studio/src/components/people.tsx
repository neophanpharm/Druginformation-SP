import React from "react";
import { C } from "../theme";
import { mix } from "./medical";

type XY = { x: number; y: number };

/** Giường bệnh + bệnh nhân cao tuổi. sit 0 = nằm, 1 = ngồi dậy; jerk = biên độ co giật. */
export const PatientBed: React.FC<XY & { s?: number; sit?: number; jerk?: number; t?: number; happy?: number }> = ({ x, y, s = 1, sit = 0, jerk = 0, t = 0, happy = 0 }) => {
  const j = jerk * Math.sin(t * 1.9) * 6;
  const torsoRot = sit * 62; // SVG: góc dương = theo chiều kim đồng hồ → đầu (bên trái hông) nhấc lên
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* giường */}
      <rect x={-330} y={40} width={660} height={44} rx={14} fill={C.bed} stroke={C.line} strokeWidth={5} />
      <rect x={-340} y={-60} width={26} height={200} rx={10} fill={C.line} />
      <rect x={314} y={0} width={26} height={140} rx={10} fill={C.line} />
      <rect x={-300} y={84} width={18} height={56} fill={C.line} />
      <rect x={282} y={84} width={18} height={56} fill={C.line} />
      {/* gối */}
      <rect x={-300} y={2} width={150} height={44} rx={22} fill={C.white} stroke={C.bg2} strokeWidth={4} />
      {/* chăn + chân */}
      <path d={`M -150 40 L 300 40 L 300 ${-6 + j} Q 120 ${-34 + j} -150 -16 Z`} fill="#9DB7DA" stroke={C.line} strokeWidth={5} />
      {/* thân + đầu (xoay quanh hông) */}
      <g transform={`translate(-120 18) rotate(${torsoRot + j * 0.6})`}>
        <rect x={-150} y={-36} width={170} height={64} rx={30} fill="#C9D9EE" stroke={C.line} strokeWidth={5} />
        {/* tay */}
        <path d={`M -60 0 Q -10 ${30 + j * 2} 40 ${10 + j * 3}`} stroke={C.skin} strokeWidth={20} fill="none" strokeLinecap="round" />
        <g transform="translate(-188 -6)">
          <circle r={44} fill={C.skin} stroke={C.line} strokeWidth={5} />
          <path d="M -40 -12 Q -30 -48 6 -44 Q 34 -40 40 -14" fill="#E9ECF1" stroke={C.line} strokeWidth={4} />
          <circle cx={-14} cy={4} r={4} fill={C.ink} />
          <circle cx={12} cy={4} r={4} fill={C.ink} />
          <path d={happy > 0.5 ? "M -14 20 Q 0 32 14 20" : "M -12 24 L 12 24"} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

/** Cột truyền + túi dịch + giọt rơi; clamp = dây bị kẹp. */
export const IVStand: React.FC<XY & { s?: number; t?: number; color?: string; clamp?: number; level?: number }> = ({ x, y, s = 1, t = 0, color = C.erta, clamp = 0, level = 0.8 }) => {
  const dropY = ((t * 3) % 60);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={-300} x2={0} y2={260} stroke={C.line} strokeWidth={10} strokeLinecap="round" />
      <path d="M -70 260 L 70 260" stroke={C.line} strokeWidth={10} strokeLinecap="round" />
      <path d="M -60 -300 L 60 -300" stroke={C.line} strokeWidth={8} strokeLinecap="round" />
      <rect x={-50} y={-290} width={100} height={150} rx={26} fill={C.white} stroke={C.line} strokeWidth={6} />
      <rect x={-44} y={-284 + 138 * (1 - level)} width={88} height={138 * level} rx={22} fill={color} opacity={0.8} />
      <rect x={-10} y={-140} width={20} height={40} rx={6} fill={C.white} stroke={C.line} strokeWidth={5} />
      {clamp < 0.5 && <circle cx={0} cy={-90 + dropY * 0.6} r={7} fill={color} />}
      <path d="M 0 -100 C 0 -40, -120 0, -170 60" stroke={color} strokeWidth={6} fill="none" opacity={0.9} />
      {clamp > 0 && (
        <g transform={`translate(-60 -12) scale(${clamp})`}>
          <rect x={-34} y={-16} width={68} height={32} rx={8} fill={C.danger} />
          <rect x={-26} y={-6} width={52} height={12} rx={4} fill={C.white} />
        </g>
      )}
    </g>
  );
};

/** Não nhìn nghiêng, có thể có "sẹo" (bệnh nền) hoặc phát sáng. */
export const Brain: React.FC<XY & { s?: number; glow?: number; scar?: number; color?: string }> = ({ x, y, s = 1, glow = 0, scar = 0, color = "#F4B6C2" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <circle r={150} fill={C.excited} opacity={0.22 * glow} />}
    <path d="M -110 10 C -130 -60, -60 -110, 0 -100 C 60 -115, 130 -70, 115 0 C 135 40, 100 90, 50 80 C 20 100, -30 100, -50 80 C -100 90, -130 50, -110 10 Z" fill={color} stroke={C.line} strokeWidth={6} />
    <path d="M -60 -60 Q -30 -30 -60 0 M 0 -90 Q 20 -40 -10 0 Q -40 30 -10 60 M 60 -60 Q 30 -20 70 10 M 30 40 Q 60 50 80 30" stroke={C.line} strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
    <path d="M 30 80 Q 40 120 20 150" stroke={C.line} strokeWidth={14} fill="none" strokeLinecap="round" />
    {scar > 0 && (
      <g opacity={scar}>
        <circle cx={-40} cy={-20} r={30} fill="#8E6C88" opacity={0.75} />
        <path d="M -60 -30 L -20 -10 M -55 -5 L -25 -35" stroke={C.white} strokeWidth={5} />
      </g>
    )}
  </g>
);

/** Người cao tuổi chống gậy (biểu tượng). */
export const Elder: React.FC<XY & { s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-90} r={34} fill={C.skin} stroke={C.line} strokeWidth={5} />
    <path d="M -30 -100 Q -10 -134 24 -116" stroke="#E5E7EB" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M -6 -56 Q -30 0 -20 60" stroke={C.line} strokeWidth={34} fill="none" strokeLinecap="round" />
    <path d="M -20 60 L -40 120 M -20 60 L 10 120" stroke={C.line} strokeWidth={18} strokeLinecap="round" />
    <path d="M 0 -30 Q 30 -10 44 10" stroke={C.skin} strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M 44 10 L 54 124 M 44 10 Q 44 -6 62 -2" stroke={C.albuminDark} strokeWidth={9} fill="none" strokeLinecap="round" />
  </g>
);

/** Máy lọc máu (biểu tượng). */
export const Dialysis: React.FC<XY & { s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-120} width={160} height={240} rx={22} fill={C.white} stroke={C.line} strokeWidth={6} />
    <rect x={-56} y={-96} width={112} height={60} rx={10} fill={C.bg2} />
    <path d={`M -48 -66 ${Array.from({ length: 6 }).map((_, i) => `L ${-48 + i * 18 + 9} ${-66 + (i % 2 ? -14 : 14) * Math.sin(t / 5)}`).join(" ")}`} stroke={C.erta} strokeWidth={4} fill="none" />
    <circle cx={-30} cy={20} r={24} fill="none" stroke={C.kidney} strokeWidth={7} />
    <circle cx={30} cy={20} r={24} fill="none" stroke={C.mero} strokeWidth={7} />
    <path d="M -30 44 C -30 110, 30 110, 30 44" stroke={C.kidney} strokeWidth={6} fill="none" />
  </g>
);

/** Ống tiêm (benzodiazepin). */
export const Syringe: React.FC<XY & { s?: number; rot?: number; push?: number }> = ({ x, y, s = 1, rot = 0, push = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-22} width={180} height={44} rx={8} fill={C.white} stroke={C.line} strokeWidth={6} />
    <rect x={-114} y={-16} width={120 * (1 - push * 0.7)} height={32} fill={C.calm} opacity={0.9} />
    <rect x={-170 + push * 60} y={-8} width={60} height={16} fill={C.line} />
    <rect x={-186 + push * 60} y={-30} width={16} height={60} rx={4} fill={C.line} />
    <line x1={60} y1={0} x2={130} y2={0} stroke={C.line} strokeWidth={5} />
  </g>
);

/** Máy chụp CT (vòng tròn) + bàn. */
export const CTScanner: React.FC<XY & { s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={90} fill={C.white} stroke={C.line} strokeWidth={8} />
    <circle r={46} fill={C.bg2} stroke={C.line} strokeWidth={6} />
    <rect x={-140} y={40} width={280} height={22} rx={8} fill={C.line} />
  </g>
);

/** Đường điện não đồ; spikes 0..1 chuyển sóng mềm → gai nhọn. */
export const EEG: React.FC<XY & { w?: number; spikes?: number; t?: number; color?: string }> = ({ x, y, w = 600, spikes = 0, t = 0, color = C.navy }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const px = (i / 120) * w;
    const soft = Math.sin(i / 4 + t / 4) * 14;
    const spk = i % 9 === 0 ? -70 : i % 9 === 1 ? 50 : Math.sin(i * 1.7 + t) * 8;
    pts.push(`${px},${soft * (1 - spikes) + spk * spikes}`);
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-20} y={-100} width={w + 40} height={200} rx={20} fill={C.white} stroke={C.bg2} strokeWidth={6} />
      <polyline points={pts.join(" ")} fill="none" stroke={mix("#1E3A8A", "#E4572E", spikes)} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

/** Ống nghiệm máu (TDM). */
export const TestTube: React.FC<XY & { s?: number; level?: number }> = ({ x, y, s = 1, level = 0.6 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-28} y={-120} width={56} height={220} rx={28} fill={C.white} stroke={C.line} strokeWidth={6} />
    <rect x={-22} y={-114 + 208 * (1 - level)} width={44} height={208 * level} rx={22} fill="#C2453D" opacity={0.85} />
    <rect x={-36} y={-136} width={72} height={30} rx={8} fill={C.mero} />
  </g>
);

/** Cân đĩa (đánh giá nhân quả). tilt -1..1. */
export const Balance: React.FC<XY & { s?: number; tilt?: number }> = ({ x, y, s = 1, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -100 L 0 110 M -70 110 L 70 110" stroke={C.line} strokeWidth={10} strokeLinecap="round" />
    <g transform={`translate(0 -100) rotate(${tilt * 14})`}>
      <line x1={-130} y1={0} x2={130} y2={0} stroke={C.line} strokeWidth={10} strokeLinecap="round" />
      <g transform={`translate(-130 0) rotate(${-tilt * 14})`}>
        <path d="M 0 0 L -40 80 M 0 0 L 40 80" stroke={C.muted} strokeWidth={4} />
        <path d="M -56 80 Q 0 120 56 80 Z" fill={C.erta} />
      </g>
      <g transform={`translate(130 0) rotate(${-tilt * 14})`}>
        <path d="M 0 0 L -40 80 M 0 0 L 40 80" stroke={C.muted} strokeWidth={4} />
        <path d="M -56 80 Q 0 120 56 80 Z" fill={C.muted} />
      </g>
    </g>
  </g>
);

/** Máy tính (tính ClCr). */
export const Calculator: React.FC<XY & { s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-100} width={140} height={200} rx={20} fill={C.navy} />
    <rect x={-52} y={-82} width={104} height={44} rx={8} fill={C.chloride} />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-52 + (i % 3) * 38} y={-22 + Math.floor(i / 3) * 38} width={28} height={28} rx={6} fill={i === 8 ? C.warn : C.white} opacity={0.9} />
    ))}
  </g>
);

/** Con mắt theo dõi. */
export const Eye: React.FC<XY & { s?: number; look?: number }> = ({ x, y, s = 1, look = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 0 Q 0 -90 110 0 Q 0 90 -110 0 Z" fill={C.white} stroke={C.line} strokeWidth={7} />
    <circle cx={look * 30} r={38} fill={C.mero} />
    <circle cx={look * 30} r={16} fill={C.ink} />
    <circle cx={look * 30 + 10} cy={-10} r={6} fill={C.white} />
  </g>
);

/** Nhân viên y tế (bác sĩ/dược sĩ) – dạng biểu tượng nửa người. */
export const Clinician: React.FC<XY & { s?: number; coat?: string; accent?: string; nod?: number }> = ({ x, y, s = 1, coat = C.white, accent = C.navy, nod = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 200 Q -110 40 0 40 Q 110 40 110 200 Z" fill={coat} stroke={C.line} strokeWidth={6} />
    <path d="M -24 44 L 0 110 L 24 44" fill={accent} />
    <g transform={`rotate(${nod * 6} 0 20)`}>
      <circle cx={0} cy={-30} r={62} fill={C.skin} stroke={C.line} strokeWidth={6} />
      <path d="M -62 -40 Q -50 -104 6 -98 Q 60 -94 62 -40 Q 30 -70 -62 -40 Z" fill="#2B2B2B" />
      <circle cx={-20} cy={-26} r={5} fill={C.ink} />
      <circle cx={20} cy={-26} r={5} fill={C.ink} />
      <path d="M -16 4 Q 0 16 16 4" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
    <path d="M -50 90 Q -60 150 -20 160 M -20 160 a 14 14 0 1 0 1 0" stroke={C.line} strokeWidth={5} fill="none" />
  </g>
);
