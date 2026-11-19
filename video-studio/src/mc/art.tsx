/* Thư viện minh họa flat vector – viền đậm, màu pastel, phong cách sơ đồ giáo khoa.
   Tất cả là <g> SVG, gốc tọa độ ở tâm, điều khiển bằng props (không tự chạy theo thời gian). */
import React from "react";
import { M } from "./kit";

const O = M.outline;
const SW = 7;
type G = { x?: number; y?: number; s?: number; rot?: number; o?: number };
const T = ({ x = 0, y = 0, s = 1, rot = 0 }: G) => `translate(${x} ${y}) rotate(${rot}) scale(${s})`;

/* Viên nang (thuốc) – tham khảo icon capsule: nửa màu, nửa nhạt, vệt sáng. */
export const Capsule: React.FC<G & { c1?: string; c2?: string; fill?: number }> = ({ c1 = M.teal, c2 = M.lavender, fill = 1, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-150} y={-62} width={300} height={124} rx={62} fill={c2} />
    <clipPath id={`cap-${c1}`}><rect x={-150} y={-62} width={300} height={124} rx={62} /></clipPath>
    <g clipPath={`url(#cap-${c1})`}>
      <rect x={-150} y={-62} width={150 * fill + 0.01} height={124} fill={c1} />
      <rect x={-150} y={8} width={150 * fill + 0.01} height={54} fill={M.tealDeep} opacity={0.35} />
    </g>
    <rect x={-150} y={-62} width={300} height={124} rx={62} fill="none" stroke={O} strokeWidth={SW + 1} />
    <line x1={0} y1={-62} x2={0} y2={62} stroke={O} strokeWidth={SW - 2} />
    <path d="M -112 -30 Q -90 -44 -60 -44" stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);

/* Mầm bệnh dạng tròn có gai (như icon tham khảo). */
export const Germ: React.FC<G & { c?: string; spikes?: number; r?: number }> = ({ c = M.coral, spikes = 8, r = 46, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    {Array.from({ length: spikes }).map((_, i) => {
      const a = (i / spikes) * Math.PI * 2;
      return <g key={i}>
        <line x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * (r + 26)} y2={Math.sin(a) * (r + 26)} stroke={O} strokeWidth={SW} strokeLinecap="round" />
        <circle cx={Math.cos(a) * (r + 30)} cy={Math.sin(a) * (r + 30)} r={7} fill={O} />
      </g>;
    })}
    <circle r={r} fill={c} stroke={O} strokeWidth={SW} />
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.18} fill="#FFFFFF" opacity={0.5} />
  </g>
);

/* Vi khuẩn hình hạt đậu cong có lông (tham khảo hình 1). wall: 1 lành → 0 thủng; burst: 0..1 vỡ. */
export const Bacterium: React.FC<G & { wall?: number; burst?: number; t?: number; locks?: number[] }> = ({ wall = 1, burst = 0, t = 0, locks = [], o = 1, ...g }) => {
  const body = "M -230 -40 C -250 -150 -130 -190 -70 -110 C -20 -40 40 10 140 10 C 240 10 270 110 200 160 C 120 215 -40 180 -130 110 C -200 60 -220 20 -230 -40 Z";
  const cilia = Array.from({ length: 26 }).map((_, i) => i / 26);
  const pts = [[-232, -60], [-222, -120], [-170, -165], [-110, -150], [-70, -100], [-30, -55], [20, -15], [80, 8], [150, 5], [215, 30], [255, 85], [245, 140], [200, 175], [130, 200], [50, 200], [-30, 180], [-100, 145], [-160, 100], [-205, 50], [-232, 0]];
  const spots = [[-170, -90, 18], [-180, -20, 26], [-110, 30, 34], [-150, 70, 12], [-40, 70, 20], [120, 110, 34]];
  if (burst >= 1) return null;
  return (
    <g transform={T(g)} opacity={o * (1 - burst)}>
      {pts.map(([px, py], i) => {
        const nx = px * 0.12, ny = py * 0.12;
        const len = 38 + Math.sin(i * 1.7 + t / 4) * 6;
        const d = Math.hypot(nx, ny) || 1;
        return <line key={i} x1={px} y1={py} x2={px + (nx / d) * len} y2={py + (ny / d) * len} stroke={O} strokeWidth={SW + 1} strokeLinecap="round" transform={`scale(${1 + 0.15 * burst})`} />;
      })}
      <path d={body} fill={M.orange} stroke={O} strokeWidth={SW + 2} strokeLinejoin="round" strokeDasharray={wall < 1 ? `${60 * wall + 14} ${(1 - wall) * 30 + 2}` : undefined} transform={`scale(${1 + 0.08 * (1 - wall) + 0.2 * burst})`} />
      {spots.map(([sx, sy, r], i) => <circle key={i} cx={sx} cy={sy} r={r} fill={M.orangeSpot} opacity={0.9} />)}
      {/* PBP (protein gắn penicillin): ổ khóa trên thành */}
      {[[-205, -125], [-120, -135], [-30, -40], [90, 0]].map(([lx, ly], i) => {
        const lk = locks[i] ?? 0;
        return (
          <g key={`l${i}`} transform={`translate(${lx} ${ly})`}>
            <rect x={-20} y={-14} width={40} height={30} rx={8} fill={lk > 0.5 ? "#B8C0CC" : M.yellow} stroke={O} strokeWidth={5} />
            <path d={`M -11 -14 V ${-26 + 8 * lk} a 11 11 0 0 1 22 0 V -14`} fill="none" stroke={O} strokeWidth={5} />
          </g>
        );
      })}
      {void cilia}
    </g>
  );
};

/* Mảnh vỡ khi vi khuẩn bị phá. */
export const Burst: React.FC<G & { p: number }> = ({ p, ...g }) =>
  p <= 0 || p >= 1 ? null : (
    <g transform={T(g)}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + i;
        const d = 60 + p * 300;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.7} r={(18 - (i % 3) * 5) * (1 - p) + 3} fill={i % 2 ? M.orange : M.orangeSpot} stroke={O} strokeWidth={4} opacity={1 - p} />;
      })}
    </g>
  );

/* Biểu tượng vòng β-lactam (vuông 4 cạnh) gắn vòng 5 cạnh. draw: 0..1 vẽ dần. */
export const BetaLactam: React.FC<G & { draw?: number; c?: string }> = ({ draw = 1, c = M.teal, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-150} y={-75} width={150} height={150} rx={10} fill={M.tealSoft} stroke={O} strokeWidth={SW + 2} strokeDasharray={620} strokeDashoffset={620 * (1 - draw)} />
    <polygon points="0,-75 110,-110 165,0 110,110 0,75" fill={c} stroke={O} strokeWidth={SW + 2} strokeLinejoin="round" strokeDasharray={640} strokeDashoffset={640 * (1 - draw)} opacity={0.95} />
    <text x={-75} y={18} textAnchor="middle" fontSize={56} fontWeight={800} fill={O} opacity={draw}>N</text>
    <circle cx={-150} cy={-75} r={12} fill={M.coral} stroke={O} strokeWidth={4} opacity={draw} />
    <line x1={-150} y1={75} x2={-200} y2={120} stroke={O} strokeWidth={SW} strokeLinecap="round" opacity={draw} />
    <circle cx={-208} cy={128} r={16} fill={M.coral} stroke={O} strokeWidth={4} opacity={draw} />
  </g>
);

/* Men β-lactamase: hình miệng "pac-man" có răng. bite 0..1. */
export const Enzyme: React.FC<G & { bite?: number; broken?: number }> = ({ bite = 0, broken = 0, o = 1, ...g }) => {
  const a = 0.35 + 0.35 * (1 - bite);
  const x1 = Math.cos(a) * 110, y1 = Math.sin(a) * 110;
  return (
    <g transform={T(g)} opacity={o}>
      <path d={`M 0 0 L ${x1} ${-y1} A 110 110 0 1 0 ${x1} ${y1} Z`} fill={M.purple} stroke={O} strokeWidth={SW + 1} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <polygon key={i} points={`${30 + i * 26},${-y1 * (0.3 + i * 0.2) + 6} ${42 + i * 26},${-y1 * (0.3 + i * 0.2) + 26} ${54 + i * 26},${-y1 * (0.3 + i * 0.2) + 6}`} fill="#FFFFFF" stroke={O} strokeWidth={3} opacity={1 - broken} />)}
      <circle cx={-20} cy={-55} r={13} fill={O} />
      {broken > 0 && <path d="M 40 -20 l 18 14 l -12 10 l 20 16" stroke={M.yellow} strokeWidth={6} fill="none" strokeLinecap="round" opacity={broken} />}
    </g>
  );
};

/* Lớp kép phospholipid (tham khảo hình 3). */
export const Bilayer: React.FC<G & { w?: number; gap?: [number, number] }> = ({ w = 900, gap, o = 1, ...g }) => {
  const n = Math.floor(w / 46);
  return (
    <g transform={T(g)} opacity={o}>
      <rect x={-w / 2} y={-38} width={w} height={76} fill={M.lipidTail} />
      {Array.from({ length: n }).map((_, i) => {
        const x = -w / 2 + 23 + i * 46;
        if (gap && x > gap[0] && x < gap[1]) return null;
        return (
          <g key={i}>
            {[-1, 1].map((d) => (
              <g key={d}>
                <path d={`M ${x - 6} ${d * 22} q -5 ${-d * 10} 0 ${-d * 20} M ${x + 6} ${d * 22} q 5 ${-d * 10} 0 ${-d * 20}`} stroke="#B58A5A" strokeWidth={3} fill="none" />
                <circle cx={x} cy={d * 40} r={19} fill={M.lipidHead} stroke={O} strokeWidth={4} />
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
};

/* Thụ thể GABA-A nhìn ngang: β α γ β (tham khảo hình 3). open 0..1; blocked 0..1. */
export const GabaReceptor: React.FC<G & { open?: number; blocked?: number }> = ({ open = 0, blocked = 0, o = 1, ...g }) => {
  const sub = (x: number, c: string, label: string, h: number, wdt: number, z: number) => (
    <g key={label + x} transform={`translate(${x} 0)`} opacity={z}>
      <path d={`M ${-wdt / 2} ${-h / 2 + 30} Q ${-wdt / 2} ${-h / 2} 0 ${-h / 2} Q ${wdt / 2} ${-h / 2} ${wdt / 2} ${-h / 2 + 30} L ${wdt / 2 - 10} ${h / 2 - 30} Q 0 ${h / 2 + 10} ${-wdt / 2 + 10} ${h / 2 - 30} Z`} fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <text x={0} y={10} textAnchor="middle" fontSize={44} fontWeight={800} fill="#FFFFFF" stroke={O} strokeWidth={1.5}>{label}</text>
    </g>
  );
  const sp = 52 + open * 18;
  return (
    <g transform={T(g)} opacity={o}>
      {sub(-sp * 1.55, M.beta, "β", 300, 100, 1)}
      {sub(sp * 1.55, M.beta, "β", 300, 100, 1)}
      {sub(-sp * 0.55, M.alpha, "α", 330, 120, 1)}
      {sub(sp * 0.55, M.gamma, "γ", 330, 120, 1)}
      {/* kênh trung tâm */}
      <rect x={-10 - open * 10} y={-150} width={20 + open * 20} height={300} rx={10} fill={blocked > 0.5 ? "#FBE3E0" : "#E8F7FF"} opacity={open} />
    </g>
  );
};

/* Thụ thể nhìn từ trên: ngũ giác 5 tiểu đơn vị α β α β γ (hình nhỏ). */
export const ReceptorTop: React.FC<G> = ({ o = 1, ...g }) => {
  const cs = [M.alpha, M.beta, M.alpha, M.beta, M.gamma], ls = ["α", "β", "α", "β", "γ"];
  return (
    <g transform={T(g)} opacity={o}>
      {cs.map((c, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return <g key={i}><circle cx={Math.cos(a) * 52} cy={Math.sin(a) * 52} r={40} fill={c} stroke={O} strokeWidth={5} /><text x={Math.cos(a) * 52} y={Math.sin(a) * 52 + 12} textAnchor="middle" fontSize={32} fontWeight={800} fill="#FFFFFF">{ls[i]}</text></g>;
      })}
      <circle r={14} fill="#FFFFFF" stroke={O} strokeWidth={4} />
    </g>
  );
};

/* Đầu tận cùng sợi trục / sợi nhánh (tham khảo hình 2). */
export const Terminal: React.FC<G & { flip?: boolean; c?: string }> = ({ flip, c = M.lavender, o = 1, ...g }) => (
  <g transform={`${T(g)} scale(1 ${flip ? -1 : 1})`} opacity={o}>
    <path d="M -110 -260 L -110 -120 C -230 -100 -240 60 -150 90 L 150 90 C 240 60 230 -100 110 -120 L 110 -260 Z" fill={c} stroke={M.lavDeep} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -150 90 L 150 90" stroke={M.lavDeep} strokeWidth={SW + 3} />
  </g>
);

export const Vesicle: React.FC<G & { dots?: number; c?: string; open?: number }> = ({ dots = 6, c = M.gaba, open = 0, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <circle r={44} fill={M.blueSoft} stroke={M.blue} strokeWidth={5} strokeDasharray={open > 0 ? `${200 * (1 - open)} 400` : undefined} />
    {Array.from({ length: dots }).map((_, i) => {
      const a = (i / dots) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r={10} fill={c} stroke={O} strokeWidth={3} opacity={1 - open} />;
    })}
  </g>
);

export const Dot: React.FC<G & { c: string; r?: number; label?: string }> = ({ c, r = 14, label, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <circle r={r} fill={c} stroke={O} strokeWidth={3.5} />
    {label && <text y={r * 0.35} textAnchor="middle" fontSize={r * 0.9} fontWeight={800} fill="#FFFFFF">{label}</text>}
  </g>
);

/* Neuron hoạt hình: thân sao, nhánh; state 0 = yên (xanh), 1 = quá kích thích (cam-đỏ). */
export const Neuron: React.FC<G & { state?: number; zap?: number }> = ({ state = 0, zap = 0, o = 1, ...g }) => {
  const c = state > 0.5 ? M.coral : M.blue;
  const soft = state > 0.5 ? "#FFE1DC" : M.blueSoft;
  return (
    <g transform={T(g)} opacity={o}>
      {zap > 0 && <circle r={150} fill={M.coral} opacity={0.12 * zap} />}
      {[0, 60, 120, 180, 240].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <path key={i} d={`M ${Math.cos(r) * 50} ${Math.sin(r) * 50} Q ${Math.cos(r + 0.3) * 95} ${Math.sin(r + 0.3) * 95} ${Math.cos(r) * 130} ${Math.sin(r) * 130} M ${Math.cos(r) * 100} ${Math.sin(r) * 100} l ${Math.cos(r - 0.8) * 34} ${Math.sin(r - 0.8) * 34}`} stroke={O} strokeWidth={SW + 6} fill="none" strokeLinecap="round" />;
      })}
      {[0, 60, 120, 180, 240].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <path key={`i${i}`} d={`M ${Math.cos(r) * 50} ${Math.sin(r) * 50} Q ${Math.cos(r + 0.3) * 95} ${Math.sin(r + 0.3) * 95} ${Math.cos(r) * 130} ${Math.sin(r) * 130} M ${Math.cos(r) * 100} ${Math.sin(r) * 100} l ${Math.cos(r - 0.8) * 34} ${Math.sin(r - 0.8) * 34}`} stroke={soft} strokeWidth={SW - 2} fill="none" strokeLinecap="round" />;
      })}
      <path d="M 40 30 L 220 120" stroke={O} strokeWidth={SW + 10} strokeLinecap="round" />
      <path d="M 40 30 L 220 120" stroke={soft} strokeWidth={SW} strokeLinecap="round" />
      <circle r={62} fill={c} stroke={O} strokeWidth={SW} />
      <circle r={24} fill="#FFFFFF" stroke={O} strokeWidth={4} />
      {zap > 0 && [[-120, -120], [110, -130], [150, 20]].map(([zx, zy], i) => (
        <path key={i} d={`M ${zx} ${zy} l 18 26 l -16 6 l 20 30`} stroke={M.yellow} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={zap} />
      ))}
    </g>
  );
};

/* Lòng mạch cắt dọc + hồng cầu + albumin chở thuốc. */
export const Vessel: React.FC<G & { t: number; w?: number }> = ({ t, w = 980, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-w / 2} y={-190} width={w} height={380} rx={40} fill="#FDE3E3" />
    <rect x={-w / 2} y={-190} width={w} height={36} fill="#F6B7B7" stroke={O} strokeWidth={SW} />
    <rect x={-w / 2} y={154} width={w} height={36} fill="#F6B7B7" stroke={O} strokeWidth={SW} />
    {Array.from({ length: 7 }).map((_, i) => {
      const x = ((i * 170 + t * 5) % (w + 200)) - w / 2 - 100;
      return <g key={i} transform={`translate(${x} ${i % 2 ? -80 : 70}) rotate(${i * 30 + t})`}>
        <ellipse rx={40} ry={26} fill="#F0716B" stroke={O} strokeWidth={5} />
        <ellipse rx={18} ry={10} fill="#D9534F" />
      </g>;
    })}
  </g>
);

export const Albumin: React.FC<G & { load?: number; drop?: number }> = ({ load = 3, drop = 0, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <path d="M -80 0 C -90 -50 -30 -70 0 -55 C 40 -80 95 -45 85 0 C 100 45 40 70 0 55 C -40 75 -95 45 -80 0 Z" fill={M.albumin} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -40 -10 q 20 -16 40 0 q 20 16 40 0" stroke="#E2B860" strokeWidth={5} fill="none" strokeLinecap="round" />
    {Array.from({ length: load }).map((_, i) => (
      <circle key={i} cx={-40 + i * 40} cy={-62 - (i === load - 1 ? drop * 120 : 0)} r={17} fill={M.teal} stroke={O} strokeWidth={4} opacity={i === load - 1 ? 1 - drop * 0.3 : 1} />
    ))}
  </g>
);

/* Thận + niệu quản + bàng quang. impaired 0..1 (chuyển xám). */
export const Kidneys: React.FC<G & { impaired?: number }> = ({ impaired = 0, o = 1, ...g }) => {
  const fill = impaired > 0.5 ? "#C9CED6" : M.kidney;
  const bean = "M 0 -120 C 90 -125 110 -20 85 40 C 65 100 10 130 -25 105 C -55 80 -20 40 -30 0 C -40 -40 -80 -60 -60 -95 C -45 -115 -20 -120 0 -120 Z";
  return (
    <g transform={T(g)} opacity={o}>
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 150} 0) scale(${-d} 1)`}>
          <path d={bean} fill={fill} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -28 10 C -10 -10 20 -10 30 20" stroke={impaired > 0.5 ? "#9AA2AE" : M.kidneyDeep} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {[-1, 1].map((d) => <path key={`u${d}`} d={`M ${d * 120} 30 C ${d * 100} 140 ${d * 40} 190 ${d * 30} 250`} stroke={O} strokeWidth={SW + 6} fill="none" strokeLinecap="round" />)}
      {[-1, 1].map((d) => <path key={`v${d}`} d={`M ${d * 120} 30 C ${d * 100} 140 ${d * 40} 190 ${d * 30} 250`} stroke="#F6D7A8" strokeWidth={SW - 2} fill="none" strokeLinecap="round" />)}
      <path d="M -70 250 Q -80 340 0 345 Q 80 340 70 250 Q 0 225 -70 250 Z" fill="#FFE29A" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
};

/* Đầu người nhìn nghiêng (tối giản) với não. */
export const Head: React.FC<G & { glow?: number; c?: string }> = ({ glow = 0, c = "#FFD9C2", o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    {glow > 0 && <circle cx={10} cy={-40} r={190} fill={M.coral} opacity={0.12 * glow} />}
    <path d="M -110 60 C -150 -60 -80 -180 30 -175 C 140 -170 175 -80 160 -10 L 185 40 L 155 50 L 160 90 C 160 120 130 130 100 125 L 90 170 L -60 170 C -55 130 -90 110 -110 60 Z" fill={c} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M -70 -60 C -80 -120 -20 -150 30 -140 C 80 -150 130 -110 120 -60 C 135 -20 100 10 60 0 C 30 20 -20 20 -40 0 C -80 10 -95 -30 -70 -60 Z" fill="#F7A9B8" stroke={O} strokeWidth={5} />
    <path d="M -30 -110 q 20 20 -5 45 M 30 -125 q -15 30 10 60 M 80 -100 q -20 25 5 50" stroke="#C9566E" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

export const Bolt: React.FC<G & { c?: string }> = ({ c = M.yellow, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}><path d="M 10 -60 L -30 10 L 0 10 L -15 60 L 35 -15 L 5 -15 Z" fill={c} stroke={O} strokeWidth={5} strokeLinejoin="round" /></g>
);
export const EyeIcon: React.FC<G> = ({ o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <path d="M -80 0 Q 0 -70 80 0 Q 0 70 -80 0 Z" fill="#FFFFFF" stroke={O} strokeWidth={SW} />
    <circle r={28} fill={M.blue} stroke={O} strokeWidth={5} /><circle r={11} fill={O} /><circle cx={9} cy={-9} r={5} fill="#FFFFFF" />
  </g>
);
export const SpiralIcon: React.FC<G & { t: number }> = ({ t, o = 1, ...g }) => (
  <g transform={`${T(g)} rotate(${t * 4})`} opacity={o}>
    <path d="M 0 0 m 0 -8 a 8 8 0 1 1 -8 8 a 18 18 0 1 1 18 18 a 30 30 0 1 1 -30 -30 a 44 44 0 1 1 44 44" fill="none" stroke={M.purple} strokeWidth={8} strokeLinecap="round" />
  </g>
);
export const Elder: React.FC<G> = ({ o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <circle cx={0} cy={-70} r={30} fill="#FFD9C2" stroke={O} strokeWidth={5} />
    <path d="M -28 -82 q 28 -30 56 0" stroke="#E6E9EF" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M -24 -30 Q -40 20 -26 70 L 18 70 Q 26 20 14 -30 Z" fill={M.blue} stroke={O} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -16 70 l -8 50 M 10 70 l 10 50" stroke={O} strokeWidth={9} strokeLinecap="round" />
    <path d="M 14 -10 L 46 30 L 52 118 M 46 30 q 4 -12 18 -8" stroke="#8C6239" strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);
export const Dialysis: React.FC<G & { t?: number }> = ({ t = 0, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-60} y={-80} width={120} height={160} rx={18} fill="#FFFFFF" stroke={O} strokeWidth={SW} />
    <rect x={-40} y={-60} width={80} height={44} rx={8} fill={M.blueSoft} stroke={O} strokeWidth={4} />
    <path d={`M -32 -38 l 14 ${-10 * Math.sin(t / 5)} l 14 ${20 * Math.sin(t / 5)} l 14 ${-20 * Math.sin(t / 5)} l 14 ${10 * Math.sin(t / 5)}`} stroke={M.coral} strokeWidth={4} fill="none" />
    <circle cx={-22} cy={22} r={16} fill="none" stroke={M.coral} strokeWidth={6} /><circle cx={22} cy={22} r={16} fill="none" stroke={M.blue} strokeWidth={6} />
  </g>
);
export const BrainIcon: React.FC<G & { scar?: boolean }> = ({ scar, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <path d="M -70 10 C -90 -40 -40 -75 0 -68 C 40 -78 90 -45 75 0 C 90 30 60 62 30 55 C 10 70 -25 68 -38 55 C -70 62 -88 35 -70 10 Z" fill="#F7A9B8" stroke={O} strokeWidth={SW} />
    <path d="M -30 -45 q 15 18 -4 35 M 25 -55 q -12 25 6 45" stroke="#C9566E" strokeWidth={5} fill="none" strokeLinecap="round" />
    {scar && <g><circle cx={-25} cy={10} r={18} fill="#9B7BEA" stroke={O} strokeWidth={4} /><path d="M -35 0 l 20 20 M -15 0 l -20 20" stroke="#FFFFFF" strokeWidth={4} /></g>}
  </g>
);
export const Flask: React.FC<G & { level: number; lo?: number; hi?: number }> = ({ level, lo = 0.5, hi = 0.8, o = 1, ...g }) => {
  const H = 420, W = 260, y0 = H / 2 - 10;
  const yl = (v: number) => y0 - (H - 40) * v;
  return (
    <g transform={T(g)} opacity={o}>
      <clipPath id="flaskClip"><rect x={-W / 2 + 8} y={-H / 2 + 8} width={W - 16} height={H - 16} rx={30} /></clipPath>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={36} fill="#F4F8FF" />
      <rect x={-W / 2 + 4} y={yl(hi)} width={W - 8} height={yl(lo) - yl(hi)} fill={M.green} opacity={0.18} />
      <g clipPath="url(#flaskClip)">
        <rect x={-W / 2} y={yl(level)} width={W} height={H} fill={M.vpa} opacity={0.85} />
        <path d={`M ${-W / 2} ${yl(level)} q ${W / 4} -14 ${W / 2} 0 t ${W / 2} 0`} fill={M.vpa} />
      </g>
      {[lo, hi].map((v, i) => <line key={i} x1={-W / 2 - 24} x2={W / 2 + 24} y1={yl(v)} y2={yl(v)} stroke={M.green} strokeWidth={5} strokeDasharray="14 10" />)}
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={36} fill="none" stroke={O} strokeWidth={SW + 1} />
      <path d={`M ${-W / 2 + 26} ${-H / 2 + 40} v ${H - 120}`} stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};
export const Ban: React.FC<G & { p?: number }> = ({ p = 1, ...g }) => (
  <g transform={`${T(g)} scale(${p})`} opacity={p}>
    <circle r={150} fill="none" stroke={M.primary} strokeWidth={26} />
    <line x1={-105} y1={105} x2={105} y2={-105} stroke={M.primary} strokeWidth={26} strokeLinecap="round" />
  </g>
);
export const CheckIcon: React.FC<G & { p?: number; c?: string }> = ({ p = 1, c = M.good, ...g }) => (
  <g transform={T(g)}>
    <circle r={34} fill={c} opacity={p} stroke={O} strokeWidth={4} />
    <path d="M -15 0 L -4 12 L 17 -12" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - p)} />
  </g>
);
export const Syringe: React.FC<G & { push?: number }> = ({ push = 0, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-90} y={-24} width={150} height={48} rx={10} fill="#FFFFFF" stroke={O} strokeWidth={6} />
    <rect x={-84} y={-16} width={110 * (1 - push * 0.7)} height={32} fill={M.purple} opacity={0.7} />
    <rect x={-150 + push * 50} y={-8} width={60} height={16} fill={O} /><rect x={-162 + push * 50} y={-30} width={14} height={60} rx={4} fill={O} />
    <line x1={60} y1={0} x2={120} y2={0} stroke={O} strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const TestTube: React.FC<G & { level?: number }> = ({ level = 0.6, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-26} y={-90} width={52} height={170} rx={26} fill="#FFFFFF" stroke={O} strokeWidth={6} />
    <rect x={-20} y={-84 + 158 * (1 - level)} width={40} height={158 * level} rx={20} fill={M.coral} opacity={0.85} />
    <rect x={-34} y={-104} width={68} height={26} rx={8} fill={M.blue} stroke={O} strokeWidth={5} />
  </g>
);
export const IVBag: React.FC<G & { t?: number; clamp?: number; level?: number }> = ({ t = 0, clamp = 0, level = 0.8, o = 1, ...g }) => (
  <g transform={T(g)} opacity={o}>
    <rect x={-56} y={-110} width={112} height={150} rx={28} fill="#FFFFFF" stroke={O} strokeWidth={6} />
    <rect x={-48} y={-102 + 134 * (1 - level)} width={96} height={134 * level} rx={22} fill={M.teal} opacity={0.75} />
    <rect x={-12} y={40} width={24} height={34} rx={6} fill="#FFFFFF" stroke={O} strokeWidth={5} />
    <path d="M 0 74 C 0 120 -40 150 -60 200" stroke={M.tealDeep} strokeWidth={6} fill="none" />
    {clamp < 0.5 ? <circle cx={0} cy={86 + ((t * 2) % 30)} r={6} fill={M.teal} /> : <rect x={-34} y={94} width={68} height={22} rx={6} fill={M.primary} stroke={O} strokeWidth={4} />}
  </g>
);
