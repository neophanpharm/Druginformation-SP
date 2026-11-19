import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, tw, pulse, EASE_IN_OUT } from "../theme";
import { DarkBG, Header, StatCard, Callout, Label, K, SAFE, CONTENT_W } from "./ui";
import { Scene3D, Molecule3D, Bacterium3D, Membrane3D, Receptor3D, Neuron3D, Vessel3D, Albumin3D, Kidneys3D, Tank3D, Dot3D, toPx } from "./three";
import { R } from "./timing";

/** Khung cục bộ của một từ trong lời đọc (giây → khung, cộng lead). */
const at = (sec: number) => R.voiceLeadFrames + Math.round(sec * R.fps);

/* ───────────── HOOK ───────────── */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f - 6, fps, config: { damping: 14, stiffness: 80 } });
  const camZ = interpolate(f, [0, 210], [12.5, 9.6], { easing: EASE_IN_OUT });
  return (
    <DarkBG>
      <Scene3D cam={[0, 0.2, camZ]} look={[0, 0.5, 0]}>
        <Molecule3D position={[0, 0.72, 0]} scale={0.95 * enter} rot={[0.35 + Math.sin(f / 50) * 0.15, f * 0.014, 0.1]} glow={0.55 + 0.35 * pulse(f, 45)} />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i / 22) * Math.PI * 2 + f * 0.008 * (i % 2 ? 1 : -1);
          const r = 2.0 + (i % 4) * 0.25;
          return <Dot3D key={i} position={[Math.cos(a) * r * 0.55, 0.72 + Math.sin(a) * r * 0.38, Math.sin(a) * 1.4]} r={0.035 + (i % 3) * 0.02} color={i % 3 ? K.erta : "#FFFFFF"} glow={0.9} opacity={0.8 * enter} />;
        })}
      </Scene3D>
      <Header chapter="THÔNG TIN THUỐC" title="Ertapenem & co giật" />
      <div style={{ position: "absolute", left: SAFE.left, top: 370, fontFamily, color: K.soft, fontSize: 34, fontWeight: 600, opacity: tw(f, 30, 48) }}>
        Điều dược sĩ & bác sĩ cần biết
      </div>
      <StatCard x={SAFE.left} y={1010} w={CONTENT_W} delay={at(3.08)} value="1 g × 1 lần/ngày" label="Liều chuẩn người lớn · truyền TM 30 phút" color={K.erta} size={60} />
    </DarkBG>
  );
};

/* ───────────── FAMILY ───────────── */
export const Family: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringIn = tw(f, 10, 40);
  const split = tw(f, at(2.5), at(3.3));
  const items = [
    { name: "Ertapenem", color: K.erta, x: -0.78, y: 1.0, t: at(3.36) },
    { name: "Imipenem", color: K.imi, x: 0.78, y: 1.0, t: at(4.72) },
    { name: "Meropenem", color: K.mero, x: -0.78, y: -0.12, t: at(5.76) },
    { name: "Doripenem", color: K.dori, x: 0.78, y: -0.12, t: at(7.04) },
  ];
  const focus = tw(f, 245, 285);
  return (
    <DarkBG>
      <Scene3D>
        {/* vòng β-lactam chung ở trung tâm, tách thành 4 phân tử */}
        <group position={[0, 0.5, 0]} scale={(1 - split) * 1.25 * ringIn} rotation={[Math.sin(f / 30) * 0.25, Math.sin(f / 37) * 0.35, Math.PI / 4]}>
          <mesh>
            <torusGeometry args={[0.6, 0.09, 24, 4]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.2} clearcoat={1} emissive="#88E6E6" emissiveIntensity={0.3} />
          </mesh>
        </group>
        {items.map((it, i) => {
          const p = spring({ frame: f - it.t, fps, config: { damping: 13, stiffness: 110 } });
          const isE = i === 0;
          const s = 0.5 * p * (isE ? 1 + 0.18 * focus : 1 - 0.1 * focus);
          return <Molecule3D key={it.name} color={it.color} position={[it.x * (0.4 + 0.6 * split), it.y, 0]} scale={s} rot={[0.3, f * 0.018 + i, 0.1]} glow={isE ? 0.4 + 0.5 * focus : 0.25} opacity={isE ? 1 : 1 - 0.45 * focus} />;
        })}
      </Scene3D>
      <Header chapter="01 · NHÓM THUỐC" title="Họ carbapenem (β-lactam)" />
      {items.map((it, i) => {
        const [px, py] = toPx(it.x, it.y);
        const o = tw(f, it.t + 6, it.t + 18) * (i === 0 ? 1 : 1 - 0.45 * focus);
        return (
          <div key={it.name} style={{ position: "absolute", left: px - 170, width: 340, top: py + 150, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 36, color: it.color, opacity: o }}>
            {it.name}
          </div>
        );
      })}
    </DarkBG>
  );
};

/* ───────────── PD ───────────── */
export const PD: React.FC = () => {
  const f = useCurrentFrame();
  const wall = 1 - tw(f, at(2.9), at(4.0));
  const burst = tw(f, at(4.2), at(5.0));
  const phase2 = tw(f, at(5.0), at(5.4));
  const sites = [[-1.0, 0.82, 0.25], [-0.35, 0.9, 0.3], [0.35, 0.9, 0.3], [1.0, 0.82, 0.25]] as const;
  const S = 0.6, Y = 0.55;
  const locked = sites.map((_, i) => tw(f, at(1.6) + i * 4, at(1.9) + i * 4));
  // giai đoạn 2: men β-lactamase lao vào, bị bật ra
  const lunge = tw(f, at(6.6), at(7.2), 0, 1, EASE_IN_OUT);
  const bounce = tw(f, at(7.2), at(8.0));
  const ex = -1.35 + 1.0 * lunge - 0.75 * bounce;
  return (
    <DarkBG>
      <Scene3D>
        <group visible={phase2 < 1}>
          <group scale={S}>
            <Bacterium3D position={[0, Y / S, 0]} rot={[0.15, Math.sin(f / 40) * 0.25, 0]} wall={wall} burst={burst} locked={locked} />
          </group>
          {sites.map((s, i) => {
            const arrive = tw(f, at(0.5) + i * 5, at(1.6) + i * 5, 0, 1, EASE_IN_OUT);
            const from = [(i % 2 ? 2.3 : -2.3), 1.5 - (i % 2) * 0.4] as const;
            const x = from[0] + (s[0] * S - from[0]) * arrive;
            const y = from[1] + (Y + s[1] * S + 0.2 - from[1]) * arrive;
            return burst < 0.6 ? <Molecule3D key={i} position={[x, y, 0.4]} scale={0.24} rot={[0.5, f * 0.05, 0]} glow={0.5} opacity={1 - burst} /> : null;
          })}
        </group>
        {phase2 > 0 && (
          <group>
            <Molecule3D position={[0.45, Y, 0]} scale={0.62 * phase2} rot={[0.3, f * 0.02, 0]} glow={0.5 + 0.5 * bounce} />
            {/* men β-lactamase: khối cầu khuyết (miệng) */}
            <group position={[ex, Y, 0.3]} rotation={[0, 0, Math.sin(f / 4) * 0.1 * lunge]} scale={0.62 * phase2}>
              <mesh rotation={[0, 0, Math.PI * 0.15]}>
                <sphereGeometry args={[0.55, 40, 40, 0.6, Math.PI * 2 - 1.2]} />
                <meshPhysicalMaterial color={K.dori} roughness={0.35} clearcoat={0.6} side={2} />
              </mesh>
            </group>
            {/* gợn sóng "khiên" khi bị va chạm */}
            {bounce > 0 && bounce < 1 && (
              <mesh position={[0.45, Y, 0]}>
                <sphereGeometry args={[0.6 + bounce * 0.6, 32, 32]} />
                <meshBasicMaterial color={K.erta} transparent opacity={0.35 * (1 - bounce)} depthWrite={false} />
              </mesh>
            )}
          </group>
        )}
      </Scene3D>
      <Header chapter="02 · DƯỢC LỰC HỌC" title="Phá thành vi khuẩn" />
      {phase2 < 0.5 && <Label x={toPx(-0.35 * S, Y + 0.9 * S)[0]} y={toPx(-0.35 * S, Y + 0.9 * S)[1]} tx={660} ty={560} delay={at(1.4)} text="PBP 2, 3" color={K.pbp} />}
      <StatCard x={SAFE.left} y={1000} w={420} delay={at(2.9)} value="Diệt khuẩn" label="Ức chế tổng hợp thành tế bào" color={K.bacteria} size={48} />
      <StatCard x={SAFE.left + 448} y={1000} w={420} delay={at(6.9)} value="Bền ESBL" label="Bền với β-lactamase phổ rộng" sub="Bị metallo-β-lactamase thủy phân" color={K.erta} size={48} />
    </DarkBG>
  );
};

/* ───────────── PK ───────────── */
export const PK: React.FC = () => {
  const f = useCurrentFrame();
  const toKidney = tw(f, at(4.6), at(5.6));
  const camZ = 6 - f * 0.01;
  return (
    <DarkBG hue="#3A1430">
      <AbsoluteFill style={{ opacity: 1 - toKidney }}>
        <Scene3D cam={[0, 0, camZ]} look={[0, 0, camZ - 6]} fov={50}>
          <Vessel3D speed={0.06} />
          {Array.from({ length: 9 }).map((_, i) => {
            const z = camZ - 5 - ((i * 1.6 + f * 0.09) % 14);
            const x = Math.sin(i * 2.1) * 1.3, y = Math.cos(i * 1.7) * 1.1;
            return <group key={i} scale={0.75}><Albumin3D position={[x / 0.75, y / 0.75, z / 0.75]} load={i % 3 === 0 ? 2 : 3} rot={f * 0.02 + i} /></group>;
          })}
          {Array.from({ length: 4 }).map((_, i) => {
            const z = camZ - 4.5 - ((i * 3.5 + f * 0.11) % 14);
            return <Dot3D key={`f${i}`} position={[Math.cos(i * 2.5) * 1.6, Math.sin(i * 2.5) * 1.2, z]} r={0.13} color={K.erta} glow={1.4} />;
          })}
        </Scene3D>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toKidney }}>
        <Scene3D>
          <Kidneys3D position={[0, 0.95, 0]} scale={0.6} />
          {Array.from({ length: 12 }).map((_, i) => {
            const p = ((f - at(4.6) - i * 7) % 60) / 60;
            if (f < at(4.6) + i * 7) return null;
            const toBladder = i % 10 < 8; // ≈ 80% qua nước tiểu
            const side = i % 2 ? -1 : 1;
            const x = toBladder ? side * 0.63 * (1 - p) : side * (0.63 + 0.9 * p);
            const y = toBladder ? 1.31 - 1.14 * p : 1.31 + 0.2 * p;
            return <Dot3D key={i} position={[x, y, 0.4]} r={0.07} color={toBladder ? K.erta : "#8FA3BF"} glow={0.9} opacity={1 - Math.max(0, p - 0.8) * 5} />;
          })}
        </Scene3D>
      </AbsoluteFill>
      <Header chapter="03 · DƯỢC ĐỘNG HỌC" title="Albumin, t½ & thận" />
      <StatCard x={SAFE.left} y={980} w={274} delay={at(1.56)} value="85–95%" label="Gắn protein (albumin)" color={K.erta} size={46} />
      <StatCard x={SAFE.left + 297} y={980} w={274} delay={at(3.4)} value="≈ 4 giờ" label="Thời gian bán thải" sub={f > at(7.2) ? "→ 1 lần/ngày" : undefined} color={K.warn} size={46} />
      <StatCard x={SAFE.left + 594} y={980} w={274} delay={at(4.8)} value="≈ 80%" label="Liều qua nước tiểu" color={K.mero} size={46} />
    </DarkBG>
  );
};

/* ───────────── MOA – synap 3D ───────────── */
export const MOA: React.FC = () => {
  const f = useCurrentFrame();
  const g1 = tw(f, 8, 40);
  const open = Math.min(tw(f, 38, 50), 1 - tw(f, 78, 92));
  const ertaIn = tw(f, 70, 104, 0, 1, EASE_IN_OUT);
  const g2 = tw(f, 104, 122), bounce = tw(f, 122, 146);
  const excite = tw(f, 110, 150);
  const toNet = tw(f, 175, 200);
  const RY = 0.05; // tâm thụ thể
  return (
    <DarkBG hue="#1B2C6B">
      <AbsoluteFill style={{ opacity: 1 - toNet }}>
        <Scene3D>
          <group position={[0, 0.35, 0]} scale={0.85}>
          {/* đầu tận cùng trước synap */}
          <mesh position={[0, 3.55, -0.6]}>
            <sphereGeometry args={[2.0, 48, 48]} />
            <meshPhysicalMaterial color="#3E5C9A" roughness={0.5} clearcoat={0.3} emissive="#10224A" emissiveIntensity={0.4} />
          </mesh>
          {[-0.9, -0.3, 0.3, 0.9].map((x, i) => <Dot3D key={i} position={[x, 1.7, 0.6]} r={0.16} color={K.gaba} glow={0.4} opacity={0.9} />)}
          <Membrane3D y={-0.75} w={6.4} tint={`#${(0x7c8fd6).toString(16)}`} />
          {/* vùng sau synap đổi màu theo mức kích thích */}
          <mesh position={[0, -1.6, -0.5]}>
            <boxGeometry args={[7, 1.2, 0.2]} />
            <meshBasicMaterial color={excite > 0.5 ? K.danger : K.mero} transparent opacity={0.18 + 0.25 * excite} />
          </mesh>
          <group scale={0.62}>
            <Receptor3D position={[0, RY / 0.62 - 0.9, 0]} open={open} blocked={ertaIn} />
          </group>
          {/* GABA lần 1: rơi xuống, gắn */}
          {[-0.28, 0.28].map((x, i) => <Dot3D key={`g${i}`} position={[x, 1.7 - 1.2 * g1, 0.6 - 0.3 * g1]} r={0.15} color={K.gaba} glow={0.6} opacity={1 - tw(f, 84, 96)} />)}
          {/* Cl⁻ đi qua kênh */}
          {Array.from({ length: 7 }).map((_, i) => {
            const p = ((f - 46 - i * 4) % 30) / 30;
            const on = f >= 46 + i * 4 && f < 92;
            return on ? <Dot3D key={`c${i}`} position={[((i % 3) - 1) * 0.06, 0.55 - p * 2.0, 0.1]} r={0.07} color={K.chloride} glow={1.2} /> : null;
          })}
          {/* Ertapenem chiếm vị trí gắn */}
          <Molecule3D position={[2.6 - 2.32 * ertaIn, 1.9 - 1.45 * ertaIn, 0.6 - 0.1 * ertaIn]} scale={0.3} rot={[0.4, f * 0.05, 0]} glow={0.6 + 0.4 * ertaIn} opacity={tw(f, 66, 74)} />
          {/* GABA lần 2: bị dội ra */}
          <Dot3D position={[0.3 + bounce * 1.6, 1.7 - 1.0 * g2 + 1.2 * bounce, 0.6]} r={0.15} color={K.gaba} glow={0.6} opacity={tw(f, 104, 110) * (1 - tw(f, 140, 150))} />
          </group>
        </Scene3D>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toNet }}>
        <Scene3D cam={[0, 0.3, 10]} look={[0, 0.4, 0]}>
          {[[-0.95, 1.45], [0.35, 1.6], [1.05, 0.95], [-0.25, 0.75], [-1.1, 0.35], [0.75, 0.15]].map(([x, y], i) => {
            const on = tw(f, 200 + i * 9, 214 + i * 9);
            return <Neuron3D key={i} position={[x, y, (i % 2) * -0.6]} scale={0.3} state={on} flash={on * pulse(f + i * 5, 9, 0.25, 1)} seed={`net${i}`} />;
          })}
        </Scene3D>
        <EEGStrip spikes={tw(f, 250, 290)} />
      </AbsoluteFill>
      <Header chapter="04 · CƠ CHẾ ADR" title="Đối kháng thụ thể GABA-A" />
      {toNet < 0.5 && (
        <>
          <Label x={toPx(0.24, 1.29)[0] + 20} y={toPx(0.24, 1.29)[1]} tx={720} ty={520} delay={18} text="GABA" color={K.gaba} />
          <Label x={toPx(0.05, -0.42)[0]} y={toPx(0.05, -0.42)[1]} tx={140} ty={1120} delay={52} text="Cl⁻ vào tế bào" color={K.chloride} />
          <Label x={toPx(0.24, 0.73)[0] + 20} y={toPx(0.24, 0.73)[1]} tx={700} ty={720} delay={100} text="Ertapenem chiếm chỗ" color={K.erta} />
        </>
      )}
      <Callout x={SAFE.left} y={1110} delay={180} text="Mất ức chế → hạ ngưỡng co giật" color={K.danger} icon="⚡" />
    </DarkBG>
  );
};

const EEGStrip: React.FC<{ spikes: number }> = ({ spikes }) => {
  const f = useCurrentFrame();
  const pts: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const x = (i / 140) * 800;
    const soft = Math.sin(i / 5 + f / 4) * 12;
    const spk = i % 10 === 0 ? -48 : i % 10 === 1 ? 36 : Math.sin(i * 1.7 + f) * 6;
    pts.push(`${x},${soft * (1 - spikes) + spk * spikes}`);
  }
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: 960, width: CONTENT_W, height: 130, borderRadius: 22, background: "rgba(4,18,43,0.75)", border: `1.5px solid ${K.cardLine}` }}>
      <svg width={CONTENT_W} height={130}>
        <polyline transform="translate(34 65)" points={pts.join(" ")} fill="none" stroke={spikes > 0.5 ? K.danger : K.mero} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", right: 18, top: 10, fontFamily, color: K.soft, fontSize: 20, fontWeight: 700 }}>EEG</div>
    </div>
  );
};

/* ───────────── VPA – bình nồng độ 3D ───────────── */
export const VPA: React.FC = () => {
  const f = useCurrentFrame();
  const molIn = tw(f, 20, 60, 0, 1, EASE_IN_OUT);
  const drop = tw(f, at(2.0), at(3.4), 0, 1, EASE_IN_OUT);
  const level = 0.68 + 0.02 * Math.sin(f / 9) * (1 - drop) - 0.5 * drop;
  return (
    <DarkBG hue="#3B1B5E">
      <Scene3D>
        <group position={[-0.82, 0.78, 0]} scale={0.55}><Tank3D level={level} /></group>
        <Molecule3D position={[-0.82, 1.95 - 1.0 * molIn, 0.3]} scale={0.22} rot={[0.4, f * 0.05, 0]} glow={0.7} opacity={tw(f, 18, 26) * (1 - tw(f, 64, 76))} />
        {Array.from({ length: 3 }).map((_, i) => {
          const p = ((f + i * 18) % 54) / 54;
          return f < at(1.9) ? <Dot3D key={i} position={[-0.82 + (i - 1) * 0.15, 1.75 - p * 0.7, 0.2]} r={0.06} color="#E07AD9" glow={0.6} opacity={1 - p} /> : null;
        })}
      </Scene3D>
      <Header chapter="08 · TƯƠNG TÁC" title="Carbapenem + valproat" />
      <div style={{ position: "absolute", left: toPx(-0.82, 0)[0] - 140, width: 280, top: toPx(0, 0.78 - 0.7)[1] + 12, textAlign: "center", fontFamily, color: K.soft, fontSize: 24, fontWeight: 600 }}>
        <span style={{ color: K.safe }}>▬</span> vùng điều trị
      </div>
      <StatCard x={590} y={470} w={342} delay={at(2.1)} value="88,8 → 24,6" label="Valproat (µg/mL) khi dùng cùng meropenem" color="#E07AD9" size={46} />
      <StatCard x={590} y={730} w={342} delay={at(4.0)} value="IRR 2,60" label="Tần suất cơn co giật tăng (meropenem/ertapenem)" color={K.danger} size={46} />
      <Callout x={SAFE.left} y={1080} delay={at(5.28)} text="Tránh phối hợp – ưu tiên kháng sinh khác" color={K.danger} icon="⛔" />
    </DarkBG>
  );
};
