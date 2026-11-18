import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, tw, pop, life, pulse, EASE_IN_OUT } from "../theme";
import { SceneBG, Stage } from "../components/frame";
import { Molecule, Neuron, GabaReceptor, Gaba, DayClock, RiskGauge, Tank, Pill, NoSign, Check, Kidney, mix } from "../components/medical";
import { Brain, Elder, Dialysis, Eye, IVStand, Syringe, CTScanner, EEG, TestTube, Balance, Calculator, PatientBed, Clinician } from "../components/people";
import { AlbuminCart } from "../components/medical";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S06 â€“ CÆ¡ cháº¿: Ä‘á»‘i khÃ¡ng GABA-A â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S06: React.FC = () => {
  const f = useCurrentFrame();
  const synapse = 1 - tw(f, 200, 225);
  const network = tw(f, 210, 235);
  // Chu ká»³ bÃ¬nh thÆ°á»ng
  const gabaFall = tw(f, 10, 42);
  const open1 = Math.min(tw(f, 42, 58), 1 - tw(f, 96, 112));
  // Ertapenem chiáº¿m chá»—
  const ertaIn = tw(f, 112, 150, 0, 1, EASE_IN_OUT);
  const gaba2 = tw(f, 150, 172);
  const bounce = tw(f, 172, 200);
  const cellTint = mix(C.calm, C.excited, tw(f, 160, 200));
  return (
    <SceneBG>
      <Stage>
        <g opacity={synapse}>
          {/* Ä‘áº§u táº­n cÃ¹ng trÆ°á»›c synap */}
          <path d="M 640 0 L 640 170 Q 960 330 1280 170 L 1280 0 Z" fill="#DCE6F5" stroke={C.line} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={760 + i * 100} cy={120 + (i % 2) * 30} r={30} fill={C.white} stroke={C.gaba} strokeWidth={5} />)}
          {/* mÃ ng sau synap */}
          <rect x={300} y={600} width={1320} height={70} rx={20} fill="#C9D6EA" />
          <rect x={300} y={670} width={1320} height={410} fill={cellTint} opacity={0.35} />
          <GabaReceptor x={960} y={630} open={open1} s={1.1} />
          {/* GABA láº§n 1 â†’ gáº¯n, má»Ÿ cá»­a */}
          <Gaba x={960 - 70} y={250 + 300 * gabaFall} opacity={1 - tw(f, 96, 110)} r={18} />
          <Gaba x={960 + 70} y={230 + 320 * gabaFall} opacity={1 - tw(f, 96, 110)} r={18} />
          {Array.from({ length: 8 }).map((_, i) => {
            const p = ((f - 58 - i * 5) % 40) / 40;
            const on = f >= 58 + i * 5 && f < 108;
            return on ? <circle key={i} cx={960 + ((i % 3) - 1) * 10} cy={500 + p * 360} r={10} fill={C.chloride} stroke="#38BDF8" strokeWidth={3} /> : null;
          })}
          {/* Ertapenem chen vÃ o vá»‹ trÃ­ gáº¯n */}
          <Molecule x={1500 - 470 * ertaIn} y={380 + 170 * ertaIn} r={40} opacity={tw(f, 112, 122)} glow={ertaIn} />
          {/* GABA láº§n 2 dá»™i ra */}
          <Gaba x={960 + 70 + bounce * 260} y={250 + 280 * gaba2 - bounce * 220} opacity={tw(f, 150, 158) * (1 - tw(f, 190, 200))} r={18} />
        </g>
        {/* máº¡ng neuron quÃ¡ kÃ­ch thÃ­ch lan nhÆ° domino */}
        <g opacity={network}>
          {[[520, 320], [860, 220], [1220, 300], [1460, 520], [1160, 600], [780, 600], [470, 640]].map(([x, y], i) => {
            const on = tw(f, 235 + i * 9, 250 + i * 9);
            const flash = on * pulse(f + i * 4, 10, 0.2, 1);
            return <Neuron key={i} x={x} y={y} s={0.8} state={on} flash={flash} rot={i * 47} />;
          })}
          <EEG x={660} y={900} w={600} spikes={tw(f, 280, 320)} t={f} />
        </g>
      </Stage>
    </SceneBG>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S07 â€“ Biá»ƒu hiá»‡n lÃ¢m sÃ ng â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S07: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = (x: number, y: number, r: number, d: number, child: React.ReactNode) => {
    const p = pop(f, fps, d);
    return (
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <circle r={r} fill={C.white} stroke={C.bg2} strokeWidth={8} />
        {child}
      </g>
    );
  };
  const shake = Math.sin(f * 1.7) * 6;
  return (
    <SceneBG>
      <Stage>
        {/* Ä‘áº§u bá»‡nh nhÃ¢n á»Ÿ giá»¯a */}
        <g transform="translate(960 520)">
          <circle r={130} fill={C.skin} stroke={C.line} strokeWidth={7} />
          <path d="M -120 -50 Q -90 -150 10 -140 Q 110 -130 124 -40 Q 70 -100 -120 -50 Z" fill="#E5E7EB" stroke={C.line} strokeWidth={5} />
          <circle cx={-40} cy={10} r={9} fill={C.ink} />
          <circle cx={40} cy={10} r={9} fill={C.ink} />
          <path d="M -30 70 Q 0 56 30 70" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
        {/* Co giáº­t ~70% â€“ Ã´ lá»›n nháº¥t */}
        {tile(470, 400, 230, 18, (
          <>
            <Neuron x={0} y={0} s={1.05} state={1} flash={pulse(f, 8, 0.3, 1)} />
          </>
        ))}
        {/* MÃª sáº£ng ~27% */}
        {tile(1440, 330, 150, 92, (
          <g>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`rotate(${f * (i % 2 ? -3 : 4) + i * 120}) translate(70 0)`}>
                <circle r={32} fill={C.white} stroke={C.line} strokeWidth={5} />
                <line x1={0} y1={0} x2={0} y2={-20} stroke={C.line} strokeWidth={5} strokeLinecap="round" transform={`rotate(${f * 12})`} />
              </g>
            ))}
          </g>
        ))}
        {/* áº¢o giÃ¡c ~17% */}
        {tile(1480, 740, 120, 150, (
          <g>
            <Eye x={-10} y={10} s={0.6} look={Math.sin(f / 12)} />
            {[0, 1, 2].map((i) => (
              <path key={i} transform={`translate(${-40 + i * 50} ${-70 + Math.sin(f / 9 + i) * 12})`} d="M 0 -16 Q 14 0 0 16 Q -14 0 0 -16" fill={C.dori} opacity={0.4 + 0.4 * pulse(f + i * 10, 25)} />
            ))}
          </g>
        ))}
        {/* Run, Ä‘i khÃ´ng vá»¯ng */}
        {tile(560, 830, 110, 205, (
          <g transform={`translate(${shake} 0)`}>
            <path d="M -30 40 L -30 -30 M -10 40 L -10 -50 M 10 40 L 10 -46 M 30 40 L 30 -24 M -46 20 Q -40 60 0 60 Q 40 60 40 30" stroke={C.skin} strokeWidth={16} strokeLinecap="round" fill="none" />
          </g>
        ))}
        {/* káº¿t: cÃ¡c Ã´ nháº¥p nhÃ¡y nháº¹, gá»£i Ã½ cháº©n Ä‘oÃ¡n phÃ¢n biá»‡t */}
        <circle cx={960} cy={520} r={170 + 10 * pulse(f, 20)} fill="none" stroke={C.warn} strokeWidth={6} strokeDasharray="18 14" opacity={tw(f, 260, 290)} />
      </Stage>
    </SceneBG>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S08 â€“ Thá»i gian khá»Ÿi phÃ¡t â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S08: React.FC = () => {
  const f = useCurrentFrame();
  const prog = tw(f, 16, 120) * 4 + tw(f, 130, 170) * 0;
  const band = tw(f, 40, 110);
  const mark = tw(f, 118, 140);
  const dots = tw(f, 150, 175);
  const clamp = tw(f, 190, 205);
  const recover = tw(f, 210, 300);
  return (
    <SceneBG>
      <Stage>
        <DayClock x={720} y={520} r={300} progress={prog} band={band} bandA={3} bandB={9} mark={4} markGlow={mark} dots={[1, 2, 13.6]} dotsOn={dots} />
        {/* cung há»“i phá»¥c 1â€“5 ngÃ y sau ngá»«ng thuá»‘c */}
        <path d={describeArc(720, 520, 380, -90 + (4 / 14) * 360, -90 + ((4 + 3 * recover) / 14) * 360)} stroke={C.safe} strokeWidth={22} fill="none" strokeLinecap="round" opacity={recover > 0 ? 1 : 0} />
        <IVStand x={1420} y={560} s={0.95} t={f} clamp={clamp} />
        <g transform="translate(1420 160)">
          <Neuron x={0} y={0} s={0.7} state={1 - recover} flash={(1 - recover) * pulse(f, 8, 0.2, 1) * tw(f, 120, 140)} />
        </g>
        <Check x={1600} y={760} s={1.3} p={tw(f, 290, 315)} />
      </Stage>
    </SceneBG>
  );
};
function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r];
  const [x0, y0] = p(a0), [x1, y1] = p(Math.max(a1, a0 + 0.01));
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S09 â€“ Yáº¿u tá»‘ nguy cÆ¡ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S09: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const starts = [18, 58, 98, 138, 178];
  const value = 0.08 + starts.reduce((acc, s) => acc + 0.15 * tw(f, s + 10, s + 30), 0) + 0.06 * tw(f, 236, 260);
  const slots = [
    { x: 380, y: 300 }, { x: 680, y: 190 }, { x: 960, y: 150 }, { x: 1240, y: 190 }, { x: 1540, y: 300 },
  ];
  const icons = [
    <Elder key="e" x={0} y={0} s={0.85} />,
    <Kidney key="k" x={0} y={-20} s={0.55} impaired={1} />,
    <Brain key="b" x={0} y={-10} s={0.7} scar={1} />,
    <AlbuminCart key="a" x={0} y={10} s={1} load={1} />,
    <Dialysis key="d" x={0} y={0} s={0.7} t={f} />,
  ];
  return (
    <SceneBG>
      <Stage>
        <RiskGauge x={960} y={860} r={300} value={Math.min(value, 0.97)} />
        {slots.map((s, i) => {
          const p = pop(f, fps, starts[i]);
          return (
            <g key={i} transform={`translate(${s.x} ${s.y + 40}) scale(${p})`}>
              <circle r={115} fill={C.white} stroke={C.bg2} strokeWidth={8} />
              {icons[i]}
            </g>
          );
        })}
        {/* chai thuá»‘c "liá»u Ä‘Ãºng" váº«n Ä‘áº©y kim */}
        <g transform={`translate(1560 700) scale(${pop(f, fps, 222)})`}>
          <rect x={-60} y={-90} width={120} height={170} rx={20} fill={C.white} stroke={C.line} strokeWidth={6} />
          <rect x={-40} y={-120} width={80} height={36} rx={8} fill={C.erta} />
          <Check x={0} y={0} s={1} p={tw(f, 230, 250)} />
        </g>
      </Stage>
    </SceneBG>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S10 â€“ So sÃ¡nh: biá»ƒu Ä‘á»“ rá»«ng (OR co giáº­t, thang log) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S10: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const X0 = 560, W = 1120;
  const xp = (v: number) => X0 + ((Math.log10(v) + 1) / 2) * W; // 0,1 â†’ 10
  const rows = [
    { c: C.imi, or: 3.5, lo: 2.23, hi: 5.49 },
    { c: C.erta, or: 1.32, lo: 0.22, hi: 7.74 },
    { c: C.mero, or: 1.04, lo: 0.61, hi: 1.77 },
    { c: C.dori, or: 0.44, lo: 0.13, hi: 1.53 },
  ];
  const axis = tw(f, 0, 30);
  const swap = tw(f, 200, 250);
  return (
    <SceneBG>
      <Stage>
        <line x1={X0} y1={860} x2={X0 + W * axis} y2={860} stroke={C.line} strokeWidth={5} />
        {[0.1, 1, 10].map((v) => <line key={v} x1={xp(v)} y1={850} x2={xp(v)} y2={875} stroke={C.line} strokeWidth={5} opacity={axis} />)}
        <line x1={xp(1)} y1={200} x2={xp(1)} y2={860} stroke={C.muted} strokeWidth={4} strokeDasharray="14 12" opacity={axis} />
        <rect x={xp(1)} y={200} width={X0 + W - xp(1)} height={660} fill={C.danger} opacity={0.05 * axis} />
        {rows.map((r, i) => {
          const y = 280 + i * 165;
          const d = 30 + i * 22;
          const bar = tw(f, d, d + 30);
          const isImi = i === 0;
          const dimImi = isImi ? 1 - 0.6 * swap : 1;
          return (
            <g key={i} opacity={dimImi}>
              <Molecule x={360} y={y} r={44 * pop(f, fps, d - 10)} color={r.c} glow={isImi ? pulse(f, 14, 0.2, 0.8) * tw(f, 90, 110) : 0} />
              <line x1={xp(r.or) - (xp(r.or) - xp(r.lo)) * bar} x2={xp(r.or) + (xp(r.hi) - xp(r.or)) * bar} y1={y} y2={y} stroke={r.c} strokeWidth={10} strokeLinecap="round" />
              <rect x={xp(r.or) - 22} y={y - 22} width={44} height={44} rx={6} fill={r.c} stroke={C.white} strokeWidth={4} transform={`rotate(45 ${xp(r.or)} ${y})`} opacity={bar} />
              {isImi && [0, 1, 2].map((k) => (
                <path key={k} d={`M ${300 + k * 40} ${y - 70} l 10 18 l -12 4 l 12 20`} stroke={C.warn} strokeWidth={5} fill="none" opacity={pulse(f + k * 6, 10) * tw(f, 90, 110)} strokeLinecap="round" />
              ))}
            </g>
          );
        })}
        {/* chuyá»ƒn tá»« ertapenem sang meropenem khi báº¯t buá»™c dÃ¹ng carbapenem */}
        <path d="M 270 445 C 170 470, 170 585, 270 610" stroke={C.navy} strokeWidth={8} fill="none" strokeDasharray={260} strokeDashoffset={260 * (1 - swap)} markerEnd={swap > 0.95 ? "url(#arrow)" : undefined} opacity={swap > 0.01 ? 1 : 0} />
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.navy} />
          </marker>
        </defs>
        <Check x={440} y={610} s={0.8} p={tw(f, 240, 260)} />
      </Stage>
    </SceneBG>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S11 â€“ TÆ°Æ¡ng tÃ¡c vá»›i valproat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S11: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = tw(f, 95, 175, 0, 1, EASE_IN_OUT);
  const level = 0.66 + 0.03 * Math.sin(f / 10) * (1 - drop) - 0.48 * drop;
  const molIn = tw(f, 70, 100);
  const excite = tw(f, 150, 190);
  const ban = pop(f, fps, 210, 12);
  return (
    <SceneBG>
      <Stage>
        <Tank x={640} y={540} level={level} lo={0.5} hi={0.8} />
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 22) % 66) / 66;
          return f < 95 ? <Pill key={i} x={640 + (i - 1) * 60} y={160 + p * 200} s={0.45} rot={p * 90} opacity={1 - p} /> : null;
        })}
        <Molecule x={640} y={120 + 260 * molIn} r={42} opacity={tw(f, 70, 80) * (1 - tw(f, 110, 125))} glow={molIn} />
        <Neuron x={1240} y={460} s={1.2} state={excite} flash={excite * pulse(f, 8, 0.2, 1)} />
        <g transform="translate(1560 780)">
          <Pill x={-70} y={0} s={0.7} rot={-20} />
          <Molecule x={80} y={0} r={46} />
          <NoSign x={0} y={0} r={150} p={ban} />
        </g>
      </Stage>
    </SceneBG>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ S12 â€“ Thá»±c hÃ nh lÃ¢m sÃ ng: 5 bÆ°á»›c â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const S12: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const starts = [18, 215, 285, 395, 455];
  const cols = [230, 595, 960, 1325, 1690];
  const done = tw(f, 560, 595);
  const card = (i: number, child: React.ReactNode) => {
    const p = pop(f, fps, starts[i]);
    const active = i === 4 ? f >= starts[i] : f >= starts[i] && f < starts[i + 1];
    return (
      <g key={i} transform={`translate(${cols[i]} 560) scale(${p * (active && done < 1 ? 1.04 : 1)})`}>
        <rect x={-165} y={-300} width={330} height={560} rx={36} fill={C.white} stroke={active ? C.navy : C.bg2} strokeWidth={active ? 7 : 5} />
        {child}
        <Check x={120} y={-260} s={0.8} p={done} />
      </g>
    );
  };
  const half = tw(f, 120, 170);
  return (
    <SceneBG>
      <Stage>
        {/* Ä‘Æ°á»ng tiáº¿n trÃ¬nh */}
        <line x1={230} y1={200} x2={1690} y2={200} stroke={C.bg2} strokeWidth={10} strokeLinecap="round" />
        <line x1={230} y1={200} x2={230 + 1460 * Math.min(1, tw(f, 18, 480))} y2={200} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
        {cols.map((x, i) => <circle key={i} cx={x} cy={200} r={22} fill={f >= starts[i] ? C.navy : C.bg2} stroke={C.white} strokeWidth={6} />)}
        {card(0, (
          <>
            <Calculator x={-70} y={-170} s={0.6} />
            <Kidney x={70} y={-180} s={0.4} impaired={0.6} />
            {/* liá»u 1 g â†’ 0,5 g khi ClCr â‰¤ 30 */}
            <IVStand x={-50} y={120} s={0.4} t={f} level={0.85 - 0.42 * half} />
            <Brain x={80} y={60} s={0.45} scar={tw(f, 150, 175)} />
          </>
        ))}
        {card(1, (
          <>
            <Eye x={0} y={-150} s={0.95} look={Math.sin(f / 15)} />
            <DayClock x={0} y={90} r={110} progress={tw(f, 220, 280) * 9} band={tw(f, 225, 270)} bandA={2} bandB={9} />
          </>
        ))}
        {card(2, (
          <>
            <IVStand x={-70} y={-110} s={0.42} t={f} clamp={tw(f, 290, 305)} />
            <CTScanner x={70} y={-150} s={0.55} />
            <g transform="translate(-150 60) scale(0.5)"><EEG x={0} y={0} w={580} spikes={0.2} t={f} /></g>
            <Balance x={0} y={200} s={0.5} tilt={-tw(f, 340, 380)} />
          </>
        ))}
        {card(3, (
          <>
            <Syringe x={10} y={-160} s={0.8} push={tw(f, 405, 440)} />
            <Neuron x={-20} y={80} s={0.75} state={1 - tw(f, 425, 455)} flash={(1 - tw(f, 425, 455)) * pulse(f, 8, 0.2, 1)} />
          </>
        ))}
        {card(4, (
          <>
            <Molecule x={0} y={-160} r={70} color={C.mero} glow={tw(f, 460, 490)} />
            <TestTube x={0} y={110} s={0.9} level={0.2 + 0.5 * tw(f, 500, 540)} />
          </>
        ))}
        {/* káº¿t: bá»‡nh nhÃ¢n há»“i phá»¥c, Ä‘á»™i ngÅ© y táº¿ gáº­t Ä‘áº§u */}
        <g opacity={tw(f, 600, 630)}>
          <rect x={0} y={0} width={1920} height={1080} fill={C.bg} opacity={0.95} />
          <PatientBed x={820} y={640} s={1} sit={tw(f, 610, 650)} happy={1} t={f} />
          <Clinician x={1320} y={600} s={0.9} coat={C.white} accent={C.erta} nod={pulse(f, 30) * tw(f, 625, 645)} />
          <Clinician x={1580} y={600} s={0.9} coat={C.white} accent={C.navy} nod={pulse(f + 10, 30) * tw(f, 625, 645)} />
        </g>
      </Stage>
    </SceneBG>
  );
};

export { life };


