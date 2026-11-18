import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, tw, pop, life, EASE_IN_OUT } from "../theme";
import { SceneBG, Stage } from "../components/frame";
import { Molecule, Bacterium, PBP, AlbuminCart, Kidney, Check, mix } from "../components/medical";
import { PatientBed, IVStand, Brain } from "../components/people";

/* ───────────── S01 – Bệnh nhân và kháng sinh ───────────── */
export const S01: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = 1 + 0.06 * tw(f, 0, 225, 0, 1, EASE_IN_OUT);
  const mol = tw(f, 120, 200);
  return (
    <SceneBG>
      <Stage>
        <g transform={`translate(960 520) scale(${zoom}) translate(-960 -520)`}>
          {/* cửa sổ phòng bệnh */}
          <rect x={1180} y={150} width={420} height={300} rx={20} fill="#E3EEFB" stroke={C.bg2} strokeWidth={10} />
          <line x1={1390} y1={150} x2={1390} y2={450} stroke={C.bg2} strokeWidth={10} />
          <circle cx={1500} cy={250} r={46} fill="#FFE8A3" opacity={0.9} />
          <PatientBed x={820} y={620} s={1.15} t={f} />
          <IVStand x={1310} y={560} s={1.05} t={f} level={0.85 - 0.1 * tw(f, 0, 225)} />
        </g>
        {/* một phân tử tách khỏi dây truyền, bay lên giữa khung */}
        <Molecule x={1180 - 220 * mol} y={560 - 260 * mol} r={20 + 40 * mol} opacity={tw(f, 120, 140)} glow={mol} />
      </Stage>
    </SceneBG>
  );
};

/* ───────────── S02 – Cây gia đình β-lactam ───────────── */
const RingIcon: React.FC<{ x: number; y: number; kind: number; o: number; s: number; glow?: number }> = ({ x, y, kind, o, s, glow = 0 }) => {
  // vòng β-lactam vuông + vòng phụ: 0 penicillin (5 cạnh), 1 cephalosporin (6 cạnh), 2 monobactam (đơn), 3 carbapenem (5 cạnh có nối đôi)
  const poly = (n: number, r: number, cx: number) =>
    Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.PI / n;
      return `${cx + Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {glow > 0 && <circle r={120} fill={C.erta} opacity={0.18 * glow} />}
      <circle r={92} fill={C.white} stroke={glow > 0 ? C.erta : C.bg2} strokeWidth={glow > 0 ? 8 : 6} />
      <rect x={-56} y={-26} width={52} height={52} fill="none" stroke={C.line} strokeWidth={7} />
      {kind === 0 && <polygon points={poly(5, 32, 26)} fill="none" stroke={C.line} strokeWidth={7} />}
      {kind === 1 && <polygon points={poly(6, 34, 28)} fill="none" stroke={C.line} strokeWidth={7} />}
      {kind === 2 && <line x1={-4} y1={0} x2={34} y2={-22} stroke={C.line} strokeWidth={7} strokeLinecap="round" />}
      {kind === 3 && (
        <>
          <polygon points={poly(5, 32, 26)} fill="none" stroke={C.erta} strokeWidth={7} />
          <line x1={34} y1={-20} x2={48} y2={6} stroke={C.erta} strokeWidth={5} />
        </>
      )}
    </g>
  );
};

export const S02: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const trunk = tw(f, 0, 40);
  const nodes = [
    { x: 420, y: 330, kind: 0 },
    { x: 760, y: 250, kind: 1 },
    { x: 1160, y: 250, kind: 2 },
    { x: 1500, y: 330, kind: 3 },
  ];
  const dimOthers = tw(f, 190, 230);
  const fruits = [
    { c: C.imi, dx: -150, dy: 190 },
    { c: C.mero, dx: -50, dy: 230 },
    { c: C.dori, dx: 50, dy: 230 },
    { c: C.erta, dx: 150, dy: 190 },
  ];
  const ertaFocus = tw(f, 220, 290);
  return (
    <SceneBG>
      <Stage>
        {/* thân cây */}
        <path d="M 960 900 L 960 560" stroke={C.line} strokeWidth={14} strokeLinecap="round" strokeDasharray={340} strokeDashoffset={340 * (1 - trunk)} opacity={1 - 0.5 * dimOthers} />
        {nodes.map((n, i) => {
          const b = tw(f, 30 + i * 12, 80 + i * 12);
          const d = `M 960 560 C 960 ${n.y + 140}, ${n.x} ${n.y + 180}, ${n.x} ${n.y + 92}`;
          const isCarba = n.kind === 3;
          return (
            <g key={i} opacity={isCarba ? 1 : 1 - 0.75 * dimOthers}>
              <path d={d} stroke={isCarba && f > 100 ? C.erta : C.line} strokeWidth={10} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - b)} strokeLinecap="round" />
              <RingIcon x={n.x} y={n.y} kind={n.kind} o={tw(f, 60 + i * 12, 85 + i * 12)} s={pop(f, fps, 60 + i * 12)} glow={isCarba ? tw(f, 100, 130) : 0} />
            </g>
          );
        })}
        <RingIcon x={960} y={920} kind={2} o={trunk} s={0.9} />
        {/* bốn "quả" carbapenem */}
        {fruits.map((fr, i) => {
          const p = pop(f, fps, 130 + i * 14, 12);
          const isE = i === 3;
          const fx = 1500 + fr.dx + (isE ? (960 - 1500 - fr.dx) * ertaFocus : 0);
          const fy = 330 + fr.dy + (isE ? (600 - 330 - fr.dy) * ertaFocus : 0);
          return (
            <Molecule key={i} x={fx} y={fy} r={(isE ? 34 + 56 * ertaFocus : 34) * p} color={fr.c} opacity={isE ? 1 : 1 - 0.7 * dimOthers} glow={isE ? ertaFocus : 0} />
          );
        })}
      </Stage>
    </SceneBG>
  );
};

/* ───────────── S03 – Dược lực học ───────────── */
export const S03: React.FC = () => {
  const f = useCurrentFrame();
  const bactLife = 1 - tw(f, 170, 190);
  const wall = 1 - tw(f, 100, 145);
  const burst = tw(f, 140, 178);
  const pbps = [-150, -50, 50, 150].map((dx, i) => ({ x: 960 + dx * 1.2, y: 540 - 118 + (i % 2) * 0 }));
  // giai đoạn 2: men β-lactamase không cắt được ertapenem
  const p2 = tw(f, 180, 205);
  const close = tw(f, 220, 245);
  const crack = tw(f, 248, 285);
  return (
    <SceneBG>
      <Stage>
        <g opacity={bactLife}>
          <Bacterium x={960} y={560} w={560} h={230} wall={wall} burst={burst} t={f} />
          {pbps.map((p, i) => {
            const arrive = tw(f, 30 + i * 10, 80 + i * 10);
            const locked = tw(f, 80 + i * 8, 90 + i * 8);
            // gạch thành tế bào được PBP gắn thêm (trước khi bị khóa)
            const brick = tw(f, (i * 7) % 30, 30 + ((i * 7) % 30));
            return (
              <g key={i} opacity={1 - burst}>
                <PBP x={p.x} y={p.y} locked={locked} scale={1.2} />
                {locked < 0.5 && <rect x={p.x - 16} y={p.y - 90 + 60 * brick} width={32} height={18} rx={4} fill={C.bacteriaDark} opacity={1 - brick} />}
                <Molecule x={p.x + (1 - arrive) * (i % 2 ? 500 : -500)} y={p.y - 70 - (1 - arrive) * 260} r={24} opacity={arrive} />
              </g>
            );
          })}
        </g>
        {/* β-lactamase: hai lưỡi kéo khép lại nhưng gãy */}
        <g opacity={p2}>
          <Molecule x={960} y={540} r={70} glow={0.6 + 0.4 * crack} />
          {[-1, 1].map((d) => {
            const ang = d * (40 - 34 * close);
            const fall = crack * 220;
            return (
              <g key={d} transform={`translate(${960 - 340 + 40 * close} ${540 + fall * (d > 0 ? 1 : 0.7)}) rotate(${ang + crack * d * 40})`}>
                <path d="M 0 0 L 260 -14 L 270 0 L 260 14 Z" fill={mix("#7A869A", "#B9C2CF", crack)} />
                <circle cx={-20} cy={0} r={34} fill="none" stroke="#7A869A" strokeWidth={14} opacity={1 - crack} />
              </g>
            );
          })}
          <Check x={1180} y={360} s={1.6} p={tw(f, 285, 310)} />
        </g>
      </Stage>
    </SceneBG>
  );
};

/* ───────────── S04 – Dược động học ───────────── */
export const S04: React.FC = () => {
  const f = useCurrentFrame();
  const a = life(f, 0, 140);
  const b = life(f, 128, 268);
  const c = tw(f, 256, 276);
  // đường cong nồng độ: t½ ≈ 4 giờ, 2 liều cách 24 giờ
  const curve = (tt: number) => {
    const day = Math.floor(tt / 24);
    const since = tt - day * 24;
    const peak = since < 0.5 ? since / 0.5 : Math.pow(0.5, (since - 0.5) / 4);
    return peak;
  };
  const drawn = tw(f, 140, 250) * 48;
  const pts: string[] = [];
  for (let h = 0; h <= drawn; h += 0.25) pts.push(`${360 + (h / 48) * 1200},${740 - curve(h) * 420}`);
  return (
    <SceneBG>
      <Stage>
        {/* 1. Mạch máu với xe albumin */}
        <g opacity={a}>
          <rect x={-20} y={380} width={1960} height={320} rx={160} fill="#F7D9DD" stroke="#E7A9B2" strokeWidth={10} />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = ((i * 360 + f * 5) % 2200) - 140;
            return <AlbuminCart key={i} x={x} y={560 + (i % 2) * 40} load={3} s={1.1} wobble={f / 6 + i} />;
          })}
          {[0, 1].map((i) => {
            const x = ((i * 1000 + 500 + f * 6.5) % 2200) - 120;
            return <Molecule key={i} x={x} y={470 + i * 170} r={22} glow={0.9} free />;
          })}
        </g>
        {/* 2. Một liều mỗi ngày: đường cong + mặt trời đi qua 24 giờ */}
        <g opacity={b}>
          <line x1={360} y1={740} x2={1580} y2={740} stroke={C.line} strokeWidth={5} />
          <line x1={360} y1={740} x2={360} y2={280} stroke={C.line} strokeWidth={5} />
          <polyline points={pts.join(" ")} fill="none" stroke={C.erta} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
          {[0, 24].map((h) => (
            <g key={h} opacity={drawn >= h ? 1 : 0}>
              <path d={`M ${360 + (h / 48) * 1200} 250 l 0 40`} stroke={C.erta} strokeWidth={6} />
              <circle cx={360 + (h / 48) * 1200} cy={240} r={14} fill={C.erta} />
            </g>
          ))}
          {(() => {
            const sx = 360 + (drawn / 48) * 1200;
            const sy = 200 - Math.sin(((drawn % 24) / 24) * Math.PI) * 60;
            return <circle cx={sx} cy={sy} r={26} fill="#FFD166" stroke="#F4A261" strokeWidth={5} />;
          })()}
        </g>
        {/* 3. Thải trừ qua thận (~80% qua nước tiểu) */}
        <g opacity={c}>
          <Kidney x={960} y={430} s={1.5} flow={tw(f, 300, 380)} />
          {Array.from({ length: 10 }).map((_, i) => {
            const p = ((f - 270 - i * 9) % 90) / 90;
            if (f < 270 + i * 9) return null;
            const toBladder = i < 8; // 8/10 ≈ 80%
            const x = toBladder ? 960 + (i % 2 ? -1 : 1) * (200 - 200 * p) : 960 + 300 + 200 * p;
            const y = toBladder ? 200 + 520 * p : 300 + 320 * p;
            return <Molecule key={i} x={x} y={y} r={16} opacity={1 - Math.max(0, p - 0.85) * 6} color={toBladder ? C.erta : C.muted} />;
          })}
        </g>
      </Stage>
    </SceneBG>
  );
};

/* ───────────── S05 – Ba nguồn tích lũy ───────────── */
export const S05: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p1 = pop(f, fps, 8), p2 = pop(f, fps, 50), p3 = pop(f, fps, 92);
  const converge = tw(f, 150, 205);
  const brainGlow = tw(f, 190, 230);
  const panel = (x: number, p: number, child: React.ReactNode) => (
    <g transform={`translate(${x} 700) scale(${p})`}>
      <rect x={-250} y={-200} width={500} height={380} rx={36} fill={C.white} stroke={C.bg2} strokeWidth={6} />
      {child}
    </g>
  );
  const lvl = tw(f, 20, 120);
  const fallen = Math.round(6 * tw(f, 60, 140));
  const trough = tw(f, 100, 180);
  return (
    <SceneBG>
      <Stage>
        {panel(420, p1, (
          <>
            <Kidney x={-90} y={-40} s={0.8} impaired={lvl} />
            <rect x={90} y={-150} width={110} height={280} rx={20} fill={C.bg} stroke={C.line} strokeWidth={5} />
            <rect x={96} y={124 - 268 * (0.3 + 0.55 * lvl)} width={98} height={268 * (0.3 + 0.55 * lvl)} rx={16} fill={C.erta} opacity={0.75} />
          </>
        ))}
        {panel(960, p2, (
          <>
            {[0, 1, 2, 3].map((i) => (
              <AlbuminCart key={i} x={-120 + (i % 2) * 240} y={-80 + Math.floor(i / 2) * 150} s={0.7} load={i < 2 ? 3 : 1} wobble={f / 7 + i} />
            ))}
            {Array.from({ length: fallen }).map((_, i) => (
              <Molecule key={i} x={-180 + i * 72} y={118} r={16} glow={1} free />
            ))}
          </>
        ))}
        {panel(1500, p3, (
          <>
            <line x1={-200} y1={120} x2={200} y2={120} stroke={C.line} strokeWidth={4} />
            <polyline fill="none" stroke={C.erta} strokeWidth={7} strokeLinejoin="round"
              points={Array.from({ length: 61 }).map((_, i) => {
                const t = i / 60; const day = Math.floor(t * 3); const s = t * 3 - day;
                const base = trough * day * 0.12;
                const y = 120 - (base + Math.max(0.12 + base * 0.2, Math.exp(-s * 3.2))) * 150;
                return `${-200 + t * 400},${y}`;
              }).join(" ")} />
            <line x1={-200} y1={120 - (0.12 + trough * 0.28) * 150} x2={200} y2={120 - (0.12 + trough * 0.28) * 150} stroke={C.danger} strokeWidth={4} strokeDasharray="12 10" opacity={trough} />
          </>
        ))}
        {/* hội tụ về não */}
        {[420, 960, 1500].map((x, i) => (
          <path key={i} d={`M ${x} 490 Q ${(x + 960) / 2} 380 960 300`} stroke={C.erta} strokeWidth={10} fill="none" strokeDasharray={800} strokeDashoffset={800 * (1 - converge)} strokeLinecap="round" opacity={0.85} />
        ))}
        <Brain x={960} y={190} s={0.95 * tw(f, 140, 175)} glow={brainGlow} />
      </Stage>
    </SceneBG>
  );
};

