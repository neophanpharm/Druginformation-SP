import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { M, FONT, CONTENT, CW, T, Page, Heading, Stat, Callout, Tag, useText, lit, tw, pop, wob, at } from "./kit";
import { Capsule, Germ, Bacterium, Burst, BetaLactam, Enzyme, Bilayer, GabaReceptor, ReceptorTop, Terminal, Vesicle, Dot, Neuron, Vessel, Albumin, Kidneys, Head, Bolt, EyeIcon, SpiralIcon, Elder, Dialysis, BrainIcon, Flask, Ban, CheckIcon, Syringe, TestTube, IVBag } from "./art";

const meta = (id: string) => T.scenes.find((s) => s.id === id)!;
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
/** Khung cảnh: "camera thở" rất nhẹ (trôi 4–6 px, zoom ±0,8%) để vùng nội dung không bao giờ đứng yên. */
const Shell: React.FC<{ id: string; display?: boolean; children: React.ReactNode }> = ({ id, display, children }) => {
  const f = useCurrentFrame();
  const drift = `translate(${wob(f, 190, 5)}px, ${wob(f + 40, 250, 6)}px) scale(${1.004 + 0.008 * Math.sin(f / 55)})`;
  return (
    <Page>
      <AbsoluteFill style={{ transform: drift, transformOrigin: "50% 45%" }}>
        <Heading chapter={meta(id).chapter} title={meta(id).title} display={display} />
        {children}
      </AbsoluteFill>
    </Page>
  );
};
/** Ô icon nhỏ (SVG) dùng trong thẻ. */
const Icon: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 110, children }) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200">{children}</svg>
);

/* ───────────── HOOK ───────────── */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("HOOK");
  const cap = pop(f, fps, 8, 12);
  const pulse = 1 + 0.05 * Math.max(0, Math.sin((f - 90) / 6)) * tw(f, 90, 100) * (1 - tw(f, 150, 160));
  const germs = [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 + f * 0.012;
    const hit = tw(f, 96 + i * 10, 110 + i * 10);
    return { x: 540 + Math.cos(a) * (330 - 60 * hit), y: 930 + Math.sin(a) * (230 - 40 * hit), s: (0.75 - 0.75 * hit) * pop(f, fps, 20 + i * 5), r: f * 2 + i * 40, hit };
  });
  return (
    <Shell id="HOOK" display>
      <div style={{ position: "absolute", left: CONTENT.left, top: 524, fontFamily: FONT, fontSize: 40, fontWeight: 500, color: M.muted, opacity: tw(f, 26, 42) }}>{t.lede}</div>
      <Stage>
        <ellipse cx={540} cy={1110} rx={260 * cap} ry={26} fill={M.outline} opacity={0.08} />
        <Capsule x={540} y={930 + wob(f, 60, 8)} s={1.35 * cap * pulse} rot={-28 + wob(f, 90, 4)} />
        {germs.map((g, i) => <Germ key={i} x={g.x} y={g.y} s={g.s} rot={g.r} spikes={8} c={i % 2 ? M.coral : "#FF8A6B"} />)}
        {germs.map((g, i) => g.hit > 0 && g.hit < 1 && <circle key={`h${i}`} cx={g.x} cy={g.y} r={40 + 80 * g.hit} fill="none" stroke={M.yellow} strokeWidth={8 * (1 - g.hit)} />)}
      </Stage>
      <Stat x={CONTENT.left} y={1220} w={CW} value={t.dose} label={t.doseLabel} show={at(3.08)} color={M.tealDeep} size={62}
        icon={<Icon size={120}><IVBag s={0.7} y={-20} t={f} /></Icon>} />
    </Shell>
  );
};

/* ───────────── FAMILY ───────────── */
export const Family: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("FAMILY");
  const draw = tw(f, 8, 50);
  const split = tw(f, at(2.5), at(3.2));
  const items = [
    { k: "erta", c: M.teal, x: 300, y: 1060, d: at(3.36) },
    { k: "imi", c: M.yellow, x: 780, y: 1060, d: at(4.72) },
    { k: "mero", c: M.blue, x: 300, y: 1340, d: at(5.76) },
    { k: "dori", c: M.purple, x: 780, y: 1340, d: at(7.04) },
  ];
  return (
    <Shell id="FAMILY">
      <Stage>
        <BetaLactam x={560} y={760 - 120 * split} s={1.25 - 0.55 * split} draw={draw} rot={wob(f, 120, 3)} />
        {split > 0.5 && items.map((it) => (
          <path key={`l${it.k}`} d={`M 540 ${700} C 540 ${820} ${it.x} ${it.y - 200} ${it.x} ${it.y - 90}`} stroke={M.primary} strokeWidth={4} fill="none" strokeDasharray="10 10" opacity={0.35 * tw(f, it.d, it.d + 10)} />
        ))}
        {items.map((it) => {
          const p = pop(f, fps, it.d, 12);
          const l = lit("FAMILY", it.k, f);
          return <Capsule key={it.k} x={it.x} y={it.y + wob(f + it.d, 70, 6)} s={0.78 * p * (0.92 + 0.12 * l)} rot={-25} c1={it.c} o={Math.min(1, p) * (0.35 + 0.65 * l)} />;
        })}
      </Stage>
      <div style={{ position: "absolute", left: 560 + 170, top: 640 - 120 * split, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: M.ink, opacity: tw(f, 40, 56) * (1 - split) }}>{t.ring}</div>
      {items.map((it) => {
        const l = lit("FAMILY", it.k, f);
        return (
          <div key={`n${it.k}`} style={{ position: "absolute", left: it.x - 200, width: 400, top: it.y + 90, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: l > 0.9 ? M.primary : M.ink, opacity: tw(f, it.d + 6, it.d + 16) * (0.4 + 0.6 * l) }}>{t[it.k]}</div>
        );
      })}
    </Shell>
  );
};

/* ───────────── PD ───────────── */
export const PD: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("PD");
  const S = 1.05, BX = 540, BY = 840;
  const lockPts = [[-205, -125], [-120, -135], [-30, -40], [90, 0]];
  const locks = lockPts.map((_, i) => tw(f, at(1.6) + i * 5, at(1.9) + i * 5));
  const wall = 1 - tw(f, at(2.9), at(4.0));
  const burst = tw(f, at(4.2), at(4.9));
  const p2 = tw(f, at(5.0), at(5.4));
  const lunge = tw(f, at(6.4), at(7.0)), bounce = tw(f, at(7.0), at(7.8));
  return (
    <Shell id="PD">
      <Stage>
        <g opacity={1 - p2}>
          <Bacterium x={BX} y={BY} s={S} wall={wall} burst={burst} t={f} locks={locks} rot={wob(f, 100, 2)} />
          <Burst x={BX} y={BY} p={burst} />
          {lockPts.map(([lx, ly], i) => {
            const arr = tw(f, at(0.4) + i * 6, at(1.5) + i * 6);
            const fx = i % 2 ? 1150 : -70, fy = 520 + i * 40;
            const tx = BX + lx * S, ty = BY + ly * S - 46;
            return burst < 0.5 ? <Capsule key={i} x={fx + (tx - fx) * arr} y={fy + (ty - fy) * arr} s={0.2} rot={-30 + 360 * (1 - arr)} o={1 - burst * 2} /> : null;
          })}
        </g>
        {p2 > 0 && (
          <g opacity={p2}>
            <circle cx={650} cy={860} r={170 + 30 * bounce} fill="none" stroke={M.teal} strokeWidth={10 * (1 - bounce) + 2} opacity={0.5 + 0.5 * bounce} strokeDasharray="20 14" />
            <Capsule x={650} y={860} s={0.95} rot={-25 + wob(f, 40, 3) * bounce} />
            <Enzyme x={300 + 170 * lunge - 140 * bounce} y={860} s={1.0} bite={lunge} broken={bounce} rot={-6 * bounce} />
          </g>
        )}
      </Stage>
      {burst < 0.3 && <Tag x={BX + lockPts[1][0] * S} y={BY + lockPts[1][1] * S - 20} tx={700} ty={560} text={t.pbp} show={at(1.3)} />}
      {p2 > 0.5 && <Tag x={300 + 170 * lunge - 140 * bounce} y={760} tx={120} ty={620} text="β-lactamase" show={at(5.6)} color={M.purple} />}
      <Stat x={CONTENT.left} y={1190} w={CW} value={t.kill} label="" show={at(0.64)} light={lit("PD", "kill", f)} color={M.orangeSpot} size={38} icon={<Icon size={90}><Bacterium s={0.32} burst={0} locks={[1, 1, 1, 1]} /></Icon>} />
      <Stat x={CONTENT.left} y={1380} w={CW} value={t.esbl} label={t.mbl} show={at(5.2)} light={lit("PD", "esbl", f)} color={M.tealDeep} size={38} icon={<Icon size={90}><Capsule s={0.5} rot={-25} /></Icon>} />
    </Shell>
  );
};

/* ───────────── PK ───────────── */
export const PK: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("PK");
  const kid = tw(f, at(6.2), at(6.9));
  return (
    <Shell id="PK">
      <Stage>
        <g opacity={1 - kid}>
          <Vessel x={540} y={800} t={f} w={1000} />
          {[0, 1, 2, 3].map((i) => {
            const x = ((i * 290 + f * 3.2) % 1300) - 110;
            return <Albumin key={i} x={x} y={i % 2 ? 760 : 860} s={0.8} load={3} rot={wob(f + i * 20, 60, 6)} />;
          })}
          {[0, 1].map((i) => {
            const x = ((i * 600 + 300 + f * 4.4) % 1300) - 110;
            return <g key={`fr${i}`}><circle cx={x} cy={i ? 700 : 900} r={30} fill={M.teal} opacity={0.25} /><Dot x={x} y={i ? 700 : 900} c={M.teal} r={18} /></g>;
          })}
        </g>
        {kid > 0 && (
          <g opacity={kid}>
            <Kidneys x={540} y={700 + (1 - kid) * 30} s={1.05} />
            {Array.from({ length: 10 }).map((_, i) => {
              const p = ((f - at(6.4) - i * 6) % 54) / 54;
              if (f < at(6.4) + i * 6) return null;
              const side = i % 2 ? -1 : 1;
              const toBl = i % 10 < 8; // ≈ 80%
              const x = toBl ? 540 + side * (130 - 100 * p) * 1.05 : 540 + side * (150 + 200 * p);
              const y = toBl ? 700 + (30 + 270 * p) * 1.05 : 700 - 40 * p;
              return <Dot key={i} x={x} y={y} c={toBl ? M.teal : "#B8C0CC"} r={12} o={1 - Math.max(0, p - 0.85) * 6} />;
            })}
          </g>
        )}
      </Stage>
      {kid < 0.5 && <Tag x={540} y={860} tx={150} ty={520} text={t.pbLabel} show={at(1.3)} color={M.tealDeep} />}
      {[["pb", "pbLabel", M.tealDeep], ["t12", "t12Label", M.yellow], ["urine", "urineLabel", M.blue]].map(([k, lab, c], i) => (
        <Stat key={k} x={CONTENT.left + i * 322} y={1200} w={300} value={t[k]} label={t[lab]} sub={k === "t12" && f > at(4.32) ? t.once : undefined} show={at([1.36, 3.44, 6.72][i])} light={lit("PK", k, f) > 0.9 || (k === "t12" && lit("PK", "once", f) > 0.9) ? 1 : lit("PK", k, f)} color={c} size={50} />
      ))}
    </Shell>
  );
};

/* ───────────── FREE ───────────── */
export const Free: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("FREE");
  const rows: [string, string, string, React.ReactNode, number][] = [
    ["renal", "renalLabel", M.kidneyDeep, <Kidneys key="k" s={0.36} y={-30} impaired={tw(f, 20, 60)} />, 0],
    ["alb", "albLabel", "#D9A13B", <Albumin key="a" s={0.9} y={20} drop={tw(f, at(0.9), at(1.5))} />, 0.8],
    ["trough", "troughLabel", M.coral, <g key="c"><path d={`M -80 50 ${Array.from({ length: 9 }).map((_, i) => `L ${-80 + i * 20} ${50 - (i % 3 === 0 ? 90 : 40) - i * 6}`).join(" ")}`} stroke={M.coral} strokeWidth={8} fill="none" strokeLinejoin="round" /><line x1={-85} y1={-10} x2={85} y2={-10} stroke={M.primary} strokeWidth={5} strokeDasharray="10 8" /></g>, 3.76],
  ];
  return (
    <Shell id="FREE">
      {rows.map(([k, lab, c, ic, sec], i) => (
        <Stat key={k} x={CONTENT.left} y={500 + i * 250} w={CW} value={t[k]} label={t[lab]} show={at(sec)} light={lit("FREE", k, f) > 0.9 || f > at(4.72) ? 1 : lit("FREE", k, f)} color={c} size={64} icon={<Icon size={150}>{ic}</Icon>} />
      ))}
      <Stage>
        <g opacity={tw(f, at(4.5), at(4.9))}>
          <path d="M 540 1255 l 0 50" stroke={M.primary} strokeWidth={8} strokeLinecap="round" />
          <path d="M 520 1290 l 20 22 l 20 -22" stroke={M.primary} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      </Stage>
      <Callout y={1340} text={t.callout} show={at(4.72)} icon="↔" />
    </Shell>
  );
};

/* ───────────── MOA – synap & thụ thể GABA-A ───────────── */
export const MOA: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("MOA");
  const RX = 540, RY = 980;
  const g1 = tw(f, 4, 34);
  const open = Math.min(tw(f, 32, 42), 1 - tw(f, 88, 96));
  const erta = tw(f, 52, 90);
  const g2 = tw(f, 92, 108), bounce = tw(f, 108, 130);
  const excite = tw(f, 104, 140);
  const zap = excite * (0.6 + 0.4 * Math.abs(Math.sin(f / 5)));
  return (
    <Shell id="MOA">
      <Stage>
        {/* neuron trước synap phía trên */}
        <Terminal x={RX} y={610} s={0.62} />
        {[[-60, 610], [40, 575], [0, 655]].map(([vx, vy], i) => <Vesicle key={i} x={RX + vx} y={vy} s={0.7} open={i === 2 ? tw(f, 4, 16) : 0} />)}
        {/* màng sau synap + thụ thể */}
        <Bilayer x={RX} y={RY} w={980} gap={[RX - 190, RX + 190]} />
        <GabaReceptor x={RX} y={RY} s={0.82} open={open} blocked={erta} />
        <ReceptorTop x={930} y={700} s={0.8} o={tw(f, 20, 36)} />
        {/* GABA lần 1 */}
        {[-34, 34].map((dx, i) => <Dot key={i} x={RX + dx} y={690 + 140 * g1} c={M.gaba} r={16} o={1 - tw(f, 86, 96)} />)}
        {/* Cl⁻ đi qua kênh */}
        {Array.from({ length: 6 }).map((_, i) => {
          const p = ((f - 38 - i * 6) % 36) / 36;
          return f >= 38 + i * 6 && f < 92 ? <Dot key={`c${i}`} x={RX} y={820 + p * 330} c={M.chloride} r={13} label="" /> : null;
        })}
        {/* ertapenem chiếm chỗ */}
        <Capsule x={RX + 420 - 360 * erta} y={640 + 170 * erta} s={0.26} rot={-30 + 200 * (1 - erta)} o={tw(f, 50, 58)} />
        {erta > 0.95 && <circle cx={RX + 60} cy={810} r={46} fill="none" stroke={M.primary} strokeWidth={6} strokeDasharray="12 10" />}
        {/* GABA lần 2 bị dội */}
        <Dot x={RX - 30 - 200 * bounce} y={690 + 110 * g2 - 160 * bounce} c={M.gaba} r={16} o={tw(f, 92, 98) * (1 - tw(f, 140, 150))} />
        {/* neuron sau synap + EEG */}
        <Neuron x={250} y={1340} s={0.62} state={excite} zap={zap} />
        <g transform="translate(470 1260)">
          <rect x={0} y={0} width={540} height={150} rx={22} fill="#FFFFFF" stroke={M.outline} strokeWidth={5} />
          <polyline fill="none" stroke={excite > 0.5 ? M.coral : M.blue} strokeWidth={5} strokeLinejoin="round"
            points={Array.from({ length: 90 }).map((_, i) => `${20 + i * 5.6},${75 + (excite > 0.5 ? (i % 8 === 0 ? -55 : i % 8 === 1 ? 40 : Math.sin(i * 1.7 + f) * 6) * excite : Math.sin(i / 4 + f / 4) * 14)}`).join(" ")} />
          <text x={510} y={34} textAnchor="end" fontFamily={FONT} fontSize={22} fontWeight={800} fill={M.muted}>EEG</text>
        </g>
      </Stage>
      <Tag x={RX - 110} y={540} tx={110} ty={500} text={t.pre} show={6} color={M.lavDeep} align="left" />
      <Tag x={RX + 34} y={690 + 140 * g1} tx={700} ty={790} text={t.gaba} show={14} color={M.gaba} />
      <Tag x={RX - 110} y={RY - 120} tx={110} ty={820} text={t.rec} show={24} color={M.blue} />
      <Tag x={RX} y={1120} tx={700} ty={1190} text={t.cl} show={46} color={M.chloride} />
      <Tag x={RX + 60} y={810} tx={700} ty={880} text={t.erta} show={92} color={M.primary} />
      <Callout y={1440} text={t.callout} show={150} icon="⚡" />
    </Shell>
  );
};

/* ───────────── SIGNS ───────────── */
export const Signs: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("SIGNS");
  const rows = [["sz", "szPct", 70, M.coral, at(0)], ["del", "delPct", 27, M.purple, at(4.52)], ["hal", "halPct", 17, M.blue, at(3.68)]] as const;
  return (
    <Shell id="SIGNS">
      <Stage>
        <Head x={420} y={700} s={0.95} glow={lit("SIGNS", "sz", f) > 0.9 ? 1 : 0} />
        <g transform={`translate(700 560) scale(${pop(f, fps, at(0))})`}><circle r={62} fill="#FFFFFF" stroke={M.outline} strokeWidth={5} /><Bolt s={0.9} rot={wob(f, 8, 8)} /></g>
        <g transform={`translate(800 720) scale(${pop(f, fps, at(3.68))})`}><circle r={62} fill="#FFFFFF" stroke={M.outline} strokeWidth={5} /><EyeIcon s={0.55} /></g>
        <g transform={`translate(700 880) scale(${pop(f, fps, at(4.52))})`}><circle r={62} fill="#FFFFFF" stroke={M.outline} strokeWidth={5} /><SpiralIcon s={0.8} t={f} /></g>
      </Stage>
      {rows.map(([k, pk, pct, c, show], i) => {
        const l = lit("SIGNS", k, f);
        const g = tw(f, show, show + 24);
        return (
          <div key={k} style={{ position: "absolute", left: CONTENT.left, top: 1000 + i * 118, width: CW, fontFamily: FONT, opacity: tw(f, show, show + 8) * (0.4 + 0.6 * l) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: M.ink, fontWeight: 700, fontSize: 32 }}>{t[k]}</span>
              <span style={{ color: c, fontWeight: 800, fontSize: 50 }}>{t[pk]}</span>
            </div>
            <div style={{ marginTop: 8, height: 22, borderRadius: 11, background: "#F3E7EA", border: `2px solid ${M.outline}`, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct * g}%`, background: c }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CONTENT.left, top: 1360, width: CW, fontFamily: FONT, fontSize: 23, color: M.muted, opacity: tw(f, 30, 46) }}>{t.n}</div>
      <div style={{ position: "absolute", left: CONTENT.left, top: 1404, fontFamily: FONT, padding: "10px 22px", borderRadius: 999, border: `2px solid ${M.blue}`, background: M.blueSoft, color: M.ink, fontWeight: 700, fontSize: 28, opacity: tw(f, at(5.44), at(5.8)) * (0.45 + 0.55 * lit("SIGNS", "tremor", f)) }}>{t.tremor}</div>
      <Callout y={1490} text={t.callout} show={at(6.4)} icon="?" />
    </Shell>
  );
};

/* ───────────── ONSET ───────────── */
export const Onset: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("ONSET");
  const X0 = 140, X1 = 960, Y = 900;
  const xd = (d: number) => X0 + ((X1 - X0) * d) / 14;
  const axis = tw(f, 4, 30);
  const run = tw(f, at(0.2), at(1.4)) * 4;
  const band = tw(f, at(1.0), at(2.2));
  const mk = pop(f, fps, at(1.32), 11);
  const late = tw(f, at(4.3), at(4.9));
  const ticks = [0, 3, 4, 7, 9, 14];
  return (
    <Shell id="ONSET">
      <Stage>
        <IVBag x={170} y={620} s={0.85} t={f} />
        <rect x={xd(3)} y={Y - 36} width={(xd(9) - xd(3)) * band} height={72} rx={36} fill={M.yellow} opacity={0.35} stroke={M.outline} strokeWidth={band > 0 ? 4 : 0} />
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * axis} y2={Y} stroke={M.outline} strokeWidth={8} strokeLinecap="round" />
        {Array.from({ length: 15 }).map((_, d) => (
          <line key={d} x1={xd(d)} y1={Y - (d % 7 === 0 ? 22 : 12)} x2={xd(d)} y2={Y + (d % 7 === 0 ? 22 : 12)} stroke={M.outline} strokeWidth={d % 7 === 0 ? 6 : 4} opacity={axis} />
        ))}
        {ticks.map((d) => <text key={d} x={xd(d)} y={Y + 70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={d === 4 ? M.primary : M.muted} opacity={axis}>{d}</text>)}
        <Dot x={xd(run)} y={Y} c={M.teal} r={22} />
        <g transform={`translate(${xd(4)} ${Y - 150}) scale(${mk})`}>
          <rect x={-130} y={-60} width={260} height={100} rx={24} fill={M.primary} stroke={M.outline} strokeWidth={5} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill="#FFFFFF">{t.median}</text>
          <path d="M -18 40 L 0 68 L 18 40 Z" fill={M.primary} stroke={M.outline} strokeWidth={4} strokeLinejoin="round" />
        </g>
        <text x={(xd(3) + xd(9)) / 2} y={Y + 130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#B07A10" opacity={band}>{t.iqr}</text>
        <g opacity={late}>
          <path d={`M ${xd(12.6)} ${Y - 60} q 40 -60 90 -30`} stroke={M.blue} strokeWidth={5} fill="none" strokeDasharray="10 8" />
          <text x={xd(14)} y={Y - 110} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={30} fill={M.blue}>{t.late}</text>
        </g>
      </Stage>
      <Stat x={CONTENT.left} y={1230} w={CW} value={t.recov} label={t.recovLabel} sub={t.recovSub} show={at(5.6)} color={M.good} size={64} icon={<Icon size={120}><CheckIcon s={1.6} p={tw(f, at(5.8), at(6.4))} /></Icon>} />
    </Shell>
  );
};

/* ───────────── RISK ───────────── */
export const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("RISK");
  const chips: [string, number, React.ReactNode][] = [
    ["age", 0.84, <Elder key="e" s={0.75} y={-10} />],
    ["renal", 1.88, <Kidneys key="k" s={0.28} y={-40} impaired={1} />],
    ["hd", 2.6, <Dialysis key="d" s={0.8} t={f} />],
    ["cns", 3.6, <BrainIcon key="b" s={0.95} scar />],
    ["alb", 4.64, <Albumin key="a" s={0.75} load={1} />],
  ];
  const v = 0.08 + chips.reduce((a, c) => a + 0.16 * tw(f, at(c[1]) + 4, at(c[1]) + 20), 0) + 0.05 * tw(f, at(5.8), at(6.4));
  const cx = 540, cy = 820, r = 250;
  const arc = (a0: number, a1: number) => { const p = (a: number) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`; };
  return (
    <Shell id="RISK">
      <Stage>
        <path d={arc(-180, 0)} stroke={M.outline} strokeWidth={70} fill="none" strokeLinecap="round" />
        <path d={arc(-180, -122)} stroke={M.green} strokeWidth={56} fill="none" />
        <path d={arc(-120, -62)} stroke={M.yellow} strokeWidth={56} fill="none" />
        <path d={arc(-60, 0)} stroke={M.coral} strokeWidth={56} fill="none" />
        <g transform={`rotate(${-180 + Math.min(v, 0.96) * 180 + wob(f, 10, 0.8)} ${cx} ${cy})`}>
          <path d={`M ${cx} ${cy - 16} L ${cx + r - 40} ${cy} L ${cx} ${cy + 16} Z`} fill={M.outline} />
        </g>
        <circle cx={cx} cy={cy} r={34} fill="#FFFFFF" stroke={M.outline} strokeWidth={7} />
      </Stage>
      {chips.map(([k, sec, ic], i) => {
        const p = pop(f, fps, at(sec), 13);
        const l = lit("RISK", k, f);
        return (
          <div key={k} style={{ position: "absolute", left: CONTENT.left + (i % 2) * 484, top: 920 + Math.floor(i / 2) * 140, width: 460, height: 120, borderRadius: 24, background: "#FFFFFF", border: `2px solid ${l > 0.9 ? M.primary : "rgba(190,18,56,.14)"}`, boxShadow: `0 10px 30px rgba(190,18,56,${0.05 + 0.07 * l})`, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", fontFamily: FONT, opacity: Math.min(1, p * 1.2) * (0.45 + 0.55 * Math.max(l, f > at(5.6) ? 1 : 0)), transform: `scale(${0.8 + 0.2 * p})` }}>
            <Icon size={96}>{ic}</Icon>
            <span style={{ color: M.ink, fontWeight: 800, fontSize: 30, lineHeight: 1.2 }}>{t[k]}</span>
          </div>
        );
      })}
      <Callout y={1360} text={t.callout} show={at(5.8)} icon="!" />
    </Shell>
  );
};

/* ───────────── COMPARE – forest plot ───────────── */
export const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("COMPARE");
  const names = useText("FAMILY");
  const L = 560, R = 1000;
  const xp = (v: number) => L + ((Math.log10(v) + 1) / 2) * (R - L);
  const rows = [
    { k: "imi", c: M.yellow, or: 3.5, lo: 2.23, hi: 5.49 },
    { k: "erta", c: M.teal, or: 1.32, lo: 0.22, hi: 7.74 },
    { k: "mero", c: M.blue, or: 1.04, lo: 0.61, hi: 1.77 },
    { k: "dori", c: M.purple, or: 0.44, lo: 0.13, hi: 1.53 },
  ];
  const axis = tw(f, 4, 26);
  return (
    <Shell id="COMPARE">
      <div style={{ position: "absolute", left: CONTENT.left, top: 470, width: CW, fontFamily: FONT, fontSize: 24, color: M.muted, opacity: axis }}>{t.note}</div>
      <Stage>
        <rect x={xp(1)} y={560} width={R - xp(1)} height={600} fill={M.primary} opacity={0.05 * axis} />
        <line x1={xp(1)} y1={560} x2={xp(1)} y2={1160} stroke={M.outline} strokeWidth={4} strokeDasharray="12 10" opacity={axis} />
        <line x1={L} y1={1160} x2={L + (R - L) * axis} y2={1160} stroke={M.outline} strokeWidth={6} strokeLinecap="round" />
        {[["axis01", 0.1], ["axis1", 1], ["axis10", 10]].map(([k, v]) => (
          <g key={k as string} opacity={axis}>
            <line x1={xp(v as number)} y1={1150} x2={xp(v as number)} y2={1172} stroke={M.outline} strokeWidth={5} />
            <text x={xp(v as number)} y={1210} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={M.muted}>{t[k as string]}</text>
          </g>
        ))}
        <text x={xp(1) - 12} y={1252} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill={M.good} opacity={axis}>{t.less}</text>
        <text x={xp(1) + 12} y={1252} fontFamily={FONT} fontWeight={700} fontSize={24} fill={M.primary} opacity={axis}>{t.more}</text>
        {rows.map((r, i) => {
          const y = 640 + i * 140;
          const d = 12 + i * 12;
          const b = tw(f, d, d + 26);
          const l = Math.max(lit("COMPARE", r.k, f), f > at(6.2) && (r.k === "mero") ? 1 : 0.45);
          return (
            <g key={r.k} opacity={0.4 + 0.6 * l}>
              {l > 0.9 && <rect x={CONTENT.left - 14} y={y - 62} width={R - CONTENT.left + 28} height={124} rx={22} fill={r.c} opacity={0.12} />}
              <Capsule x={CONTENT.left + 50} y={y - 4} s={0.26} rot={-25} c1={r.c} o={tw(f, d - 6, d + 6)} />
              <text x={CONTENT.left + 110} y={y - 6} fontFamily={FONT} fontWeight={800} fontSize={34} fill={M.ink}>{names[r.k]}</text>
              <text x={CONTENT.left + 110} y={y + 30} fontFamily={FONT} fontWeight={600} fontSize={22} fill={M.muted} opacity={b}>{t[r.k]}</text>
              <line x1={xp(r.or) - (xp(r.or) - xp(r.lo)) * b} x2={xp(r.or) + (xp(r.hi) - xp(r.or)) * b} y1={y} y2={y} stroke={M.outline} strokeWidth={12} strokeLinecap="round" />
              <line x1={xp(r.or) - (xp(r.or) - xp(r.lo)) * b} x2={xp(r.or) + (xp(r.hi) - xp(r.or)) * b} y1={y} y2={y} stroke={r.c} strokeWidth={6} strokeLinecap="round" />
              <rect x={xp(r.or) - 18} y={y - 18} width={36} height={36} rx={6} fill={r.c} stroke={M.outline} strokeWidth={4} transform={`rotate(45 ${xp(r.or)} ${y})`} opacity={b} />
            </g>
          );
        })}
      </Stage>
      <div style={{ position: "absolute", left: CONTENT.left, top: 1272, width: CW, fontFamily: FONT, fontSize: 25, fontWeight: 700, color: M.primary, opacity: tw(f, at(1.0), at(1.6)) }}>{t.sig}</div>
      <Callout y={1330} text={t.callout} show={at(3.6)} icon="✓" tone="good" />
    </Shell>
  );
};

/* ───────────── VPA ───────────── */
export const VPA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("VPA");
  const molIn = tw(f, 18, 54);
  const drop = tw(f, at(2.0), at(3.4));
  const level = 0.66 + 0.02 * Math.sin(f / 9) * (1 - drop) - 0.48 * drop;
  return (
    <Shell id="VPA">
      <Stage>
        <Flask x={300} y={850} level={level} />
        {f < at(1.9) && [0, 1].map((i) => { const p = ((f + i * 25) % 50) / 50; return <Capsule key={i} x={270 + i * 60} y={560 + p * 160} s={0.16} rot={p * 120} c1={M.vpa} o={1 - p} />; })}
        <Capsule x={300} y={520 + 220 * molIn} s={0.22} rot={-30 + 300 * molIn} o={tw(f, 16, 24) * (1 - tw(f, 56, 66))} />
        <Neuron x={300} y={1250} s={0.45} state={tw(f, at(4.0), at(4.6))} zap={tw(f, at(4.0), at(4.6)) * Math.abs(Math.sin(f / 5))} />
      </Stage>
      <div style={{ position: "absolute", left: 300 - 150, width: 300, top: 850 - 210 - 64, textAlign: "center", fontFamily: FONT, fontSize: 26, fontWeight: 800, color: M.good, opacity: tw(f, 10, 26) }}><span style={{ display: "inline-block", width: 34, height: 0, borderTop: `5px dashed ${M.green}`, verticalAlign: "middle", marginRight: 10 }} />{t.band}</div>
      <Stat x={560} y={560} w={452} value={t.drop} label={t.dropLabel} show={at(1.44)} light={lit("VPA", "drop", f)} color={M.vpa} size={50} />
      <Stat x={560} y={830} w={452} value={t.irr} label={t.irrLabel} show={at(4.0)} light={lit("VPA", "irr", f)} color={M.coral} size={50} />
      <Stage>
        <g transform={`translate(780 1200) scale(${pop(f, fps, at(5.28), 12)})`}>
          <Capsule x={-60} y={0} s={0.28} rot={-25} c1={M.vpa} />
          <Capsule x={60} y={0} s={0.28} rot={25} />
          <Ban s={0.62} />
        </g>
      </Stage>
      <Callout y={1420} text={t.callout} show={at(5.28)} icon="✕" />
    </Shell>
  );
};

/* ───────────── PRACTICE ───────────── */
export const Practice: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useText("PRACTICE");
  const icons: React.ReactNode[] = [
    <Kidneys key="1" s={0.27} y={-40} />,
    <EyeIcon key="2" s={0.85} />,
    <IVBag key="3" s={0.6} y={-20} t={f} clamp={1} />,
    <Syringe key="4" s={0.75} rot={-20} push={tw(f, at(13.6), at(14.6))} />,
    <g key="5"><Capsule s={0.3} x={-28} y={-10} rot={-30} c1={M.blue} /><TestTube s={0.6} x={50} y={10} level={0.3 + 0.4 * tw(f, at(17.6), at(18.6))} /></g>,
  ];
  const starts = [0, 8.4, 10.32, 13.44, 15.76];
  const allDone = tw(f, 612, 636);
  return (
    <Shell id="PRACTICE">
      {starts.map((sec, i) => {
        const p = pop(f, fps, 10 + i * 6, 15); // cả 5 thẻ hiện mờ từ đầu (xem trước), sáng dần theo lời đọc
        const l = lit("PRACTICE", `s${i + 1}`, f);
        const reached = f >= at(sec);
        const done = (starts[i + 1] !== undefined && f >= at(starts[i + 1])) || allDone > 0.5;
        const active = l > 0.9 && !allDone;
        return (
          <div key={i} style={{ position: "absolute", left: CONTENT.left, top: 470 + i * 226, width: CW, height: 206, borderRadius: 26, background: "#FFFFFF", border: `2.5px solid ${active ? M.primary : "rgba(190,18,56,.14)"}`, boxShadow: `0 14px 40px rgba(190,18,56,${active ? 0.14 : 0.05})`, display: "flex", alignItems: "center", gap: 22, padding: "0 26px", fontFamily: FONT, opacity: Math.min(1, p * 1.2) * (active || allDone > 0.5 ? 1 : done ? 0.75 : reached ? 0.55 : 0.28), filter: reached || allDone > 0.5 ? "none" : "blur(1.2px)", transform: `translateX(${(1 - p) * 70}px) scale(${active ? 1.02 : 1})` }}>
            <div style={{ flex: "0 0 58px", height: 58, borderRadius: 29, background: done ? M.good : M.primary, color: "#FFFFFF", fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? "✓" : i + 1}</div>
            <Icon size={130}>{icons[i]}</Icon>
            <div style={{ flex: 1 }}>
              <div style={{ color: M.ink, fontWeight: 800, fontSize: 36, lineHeight: 1.15 }}>{t[`s${i + 1}`]}</div>
              <div style={{ color: M.muted, fontWeight: 500, fontSize: 24, marginTop: 8, lineHeight: 1.3 }}>{t[`s${i + 1}sub`]}</div>
            </div>
          </div>
        );
      })}
    </Shell>
  );
};

/* ───────────── TAKEAWAY ───────────── */
export const Takeaway: React.FC = () => {
  const f = useCurrentFrame();
  const t = useText("TAKEAWAY");
  const icons = [<Head key="h" s={0.45} y={10} />, <IVBag key="i" s={0.6} y={-10} t={f} />, <g key="b"><Capsule s={0.3} x={-30} rot={-25} c1={M.vpa} /><Capsule s={0.3} x={30} rot={25} /><Ban s={0.5} /></g>];
  return (
    <Shell id="TAKEAWAY">
      {["k1", "k2", "k3"].map((k, i) => {
        const d = 16 + i * 22;
        const p = tw(f, d, d + 18);
        return (
          <div key={k} style={{ position: "absolute", left: CONTENT.left, top: 500 + i * 330, width: CW, display: "flex", gap: 26, alignItems: "center", padding: "26px 28px", borderRadius: 28, background: "#FFFFFF", border: "2px solid rgba(190,18,56,.14)", boxShadow: "0 14px 40px rgba(190,18,56,.07)", fontFamily: FONT, opacity: p, transform: `translateY(${(1 - p) * 34}px)` }}>
            <div style={{ flex: "0 0 74px", height: 74, borderRadius: 37, background: M.primary, color: "#FFFFFF", fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <Icon size={170}>{icons[i]}</Icon>
            <div style={{ flex: 1, color: M.ink, fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>{t[k]}</div>
          </div>
        );
      })}
    </Shell>
  );
};

export { AbsoluteFill };
