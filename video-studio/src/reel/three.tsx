import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { random, useCurrentFrame } from "remotion";
import { K } from "./ui";

/** Camera mặc định: z = 10, fov 35 → 1 đơn vị ở mặt phẳng z = 0 ≈ 304,4 px. */
export const PX = 304.4;
export const toPx = (x: number, y: number) => [540 + x * PX, 960 - y * PX] as const;

export const Scene3D: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; look?: [number, number, number]; fov?: number }> = ({ children, cam = [0, 0, 10], look = [0, 0, 0], fov = 35 }) => (
  <ThreeCanvas width={1080} height={1920} camera={{ fov, position: cam, near: 0.1, far: 200 }} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
    <CameraRig cam={cam} look={look} />
    <ambientLight intensity={0.38} />
    <directionalLight position={[-4, 6, 7]} intensity={1.5} color="#FFF4E6" />
    <directionalLight position={[5, -3, 4]} intensity={0.55} color="#A9CCFF" />
    <pointLight position={[3, 3, -3]} intensity={30} distance={20} color={K.erta} />
    <pointLight position={[-3, -2, 3]} intensity={10} distance={15} color="#7A5CFF" />
    {children}
  </ThreeCanvas>
);

const CameraRig: React.FC<{ cam: [number, number, number]; look: [number, number, number] }> = ({ cam, look }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(cam[0], cam[1], cam[2]);
    camera.lookAt(look[0], look[1], look[2]);
    camera.updateProjectionMatrix();
  }, [camera, cam[0], cam[1], cam[2], look[0], look[1], look[2]]);
  return null;
};

/* ───────── Liên kết (trụ nối hai điểm) ───────── */
const UP = new THREE.Vector3(0, 1, 0);
export const Bond: React.FC<{ a: THREE.Vector3Tuple; b: THREE.Vector3Tuple; r?: number; color?: string; opacity?: number }> = ({ a, b, r = 0.05, color = "#DDE7F3", opacity = 1 }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
    const pos = va.clone().add(vb).multiplyScalar(0.5);
    return { pos, quat, len };
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
};

const Halo: React.FC<{ r: number; color: string; o: number }> = ({ r, color, o }) =>
  o <= 0 ? null : (
    <mesh>
      <sphereGeometry args={[r, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );

/* ───────── Phân tử carbapenem: lõi bóng + vòng β-lactam vuông + nguyên tử phụ ───────── */
export const Molecule3D: React.FC<{ color?: string; position?: THREE.Vector3Tuple; scale?: number; rot?: THREE.Vector3Tuple; glow?: number; opacity?: number }> = ({
  color = K.erta, position = [0, 0, 0], scale = 1, rot = [0, 0, 0], glow = 0, opacity = 1,
}) => {
  const atoms: THREE.Vector3Tuple[] = [[0.95, 0.55, 0.1], [-0.9, 0.5, -0.2], [0.75, -0.75, -0.15], [-0.7, -0.8, 0.25], [0, 1.05, -0.35]];
  const transparent = opacity < 1;
  return (
    <group position={position} scale={scale} rotation={rot}>
      <Halo r={1.05} color={color} o={0.07 * glow * opacity} />
      <Halo r={0.78} color={color} o={0.12 * glow * opacity} />
      <mesh>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.15} emissive={color} emissiveIntensity={0.12 + 0.5 * glow} transparent={transparent} opacity={opacity} />
      </mesh>
      {/* vòng β-lactam vuông */}
      <mesh position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.36, 0.075, 12, 4]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.25} clearcoat={1} transparent={transparent} opacity={opacity} />
      </mesh>
      {atoms.map((p, i) => (
        <group key={i}>
          <Bond a={[0, 0, 0]} b={p} r={0.045} opacity={opacity} />
          <mesh position={p}>
            <sphereGeometry args={[i === 4 ? 0.2 : 0.16, 24, 24]} />
            <meshPhysicalMaterial color={i % 2 ? "#F4F7FB" : "#FF6B6B"} roughness={0.3} clearcoat={0.7} transparent={transparent} opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/* ───────── Vi khuẩn hình que ───────── */
export const Bacterium3D: React.FC<{ wall?: number; burst?: number; locked?: number[]; position?: THREE.Vector3Tuple; rot?: THREE.Vector3Tuple }> = ({ wall = 1, burst = 0, locked = [], position = [0, 0, 0], rot = [0, 0, 0] }) => {
  const f = useCurrentFrame();
  const sites: THREE.Vector3Tuple[] = [[-1.0, 0.82, 0.25], [-0.35, 0.9, 0.3], [0.35, 0.9, 0.3], [1.0, 0.82, 0.25]];
  const flagella = useMemo(() => [0, 1, 2].map((k) => k), []);
  const swell = 1 + 0.08 * (1 - wall) + 0.3 * burst;
  return (
    <group position={position} rotation={rot}>
      {burst < 1 && (
        <group scale={[swell, swell, swell]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.85, 2.3, 16, 32]} />
            <meshPhysicalMaterial color={K.bacteria} roughness={0.45} clearcoat={0.5} emissive="#3E6B12" emissiveIntensity={0.15} transparent opacity={1 - burst} />
          </mesh>
          {/* vết thủng thành tế bào */}
          {Array.from({ length: Math.round((1 - wall) * 9) }).map((_, i) => (
            <mesh key={i} position={[-1.3 + i * 0.32, Math.sin(i * 1.7) * 0.5, 0.78]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#1C3A0A" roughness={0.9} transparent opacity={1 - burst} />
            </mesh>
          ))}
          {sites.map((p, i) => {
            const lk = locked[i] ?? 0;
            return (
              <mesh key={i} position={p}>
                <sphereGeometry args={[0.17, 24, 24]} />
                <meshPhysicalMaterial color={lk > 0.5 ? "#9AA5B1" : K.pbp} emissive={lk > 0.5 ? "#000000" : K.pbp} emissiveIntensity={0.35} roughness={0.35} transparent opacity={1 - burst} />
              </mesh>
            );
          })}
          {flagella.map((k) => {
            const pts = Array.from({ length: 8 }).map((_, i) => new THREE.Vector3(-2.1 - i * 0.28, (k - 1) * 0.35 + Math.sin(i * 0.9 + f / 5 + k) * 0.18, Math.cos(i * 0.7 + k) * 0.15));
            const curve = new THREE.CatmullRomCurve3(pts);
            return (
              <mesh key={k}>
                <tubeGeometry args={[curve, 40, 0.035, 8, false]} />
                <meshStandardMaterial color="#5E8C1F" transparent opacity={1 - burst} />
              </mesh>
            );
          })}
        </group>
      )}
      {burst > 0 &&
        Array.from({ length: 70 }).map((_, i) => {
          const th = random(`bt${i}`) * Math.PI * 2, ph = Math.acos(2 * random(`bp${i}`) - 1);
          const d = 0.6 + burst * (2.2 + random(`bd${i}`) * 1.6);
          return (
            <mesh key={i} position={[Math.sin(ph) * Math.cos(th) * d * 1.4, Math.sin(ph) * Math.sin(th) * d * 0.8, Math.cos(ph) * d * 0.6]}>
              <sphereGeometry args={[0.07 + random(`bs${i}`) * 0.07, 10, 10]} />
              <meshStandardMaterial color={i % 3 ? K.bacteria : "#5E8C1F"} transparent opacity={Math.max(0, 1 - burst * 1.1)} />
            </mesh>
          );
        })}
    </group>
  );
};

/* ───────── Màng tế bào (lớp phospholipid) ───────── */
export const Membrane3D: React.FC<{ y?: number; w?: number; tint?: string }> = ({ y = 0, w = 7, tint = "#7C8FD6" }) => {
  const heads = useMemo(() => {
    const arr: THREE.Vector3Tuple[] = [];
    for (let i = 0; i < 26; i++) for (let j = 0; j < 6; j++) arr.push([-w / 2 + (i + 0.5) * (w / 26), y + 0.32, -1.5 + j * 0.6]);
    return arr;
  }, [y, w]);
  return (
    <group>
      <mesh position={[0, y, 0]}>
        <boxGeometry args={[w, 0.5, 3.6]} />
        <meshPhysicalMaterial color={tint} roughness={0.6} transparent opacity={0.55} />
      </mesh>
      {heads.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#B8C6F2" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/* ───────── Thụ thể GABA-A: 5 tiểu đơn vị quanh lỗ kênh ───────── */
export const Receptor3D: React.FC<{ open?: number; position?: THREE.Vector3Tuple; blocked?: number }> = ({ open = 0, position = [0, 0, 0], blocked = 0 }) => {
  const R = 0.5 + open * 0.22;
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((k) => {
        const a = (k / 5) * Math.PI * 2;
        return (
          <mesh key={k} position={[Math.cos(a) * R, 0, Math.sin(a) * R]}>
            <capsuleGeometry args={[0.3, 1.5, 12, 24]} />
            <meshPhysicalMaterial color={k % 2 ? "#5E86D9" : "#7FA2EC"} roughness={0.35} clearcoat={0.6} emissive={blocked > 0.5 ? "#3A1A00" : "#0A1A40"} emissiveIntensity={0.3} />
          </mesh>
        );
      })}
      <Halo r={0.45 + open * 0.3} color={K.chloride} o={0.25 * open} />
    </group>
  );
};

/* ───────── Neuron ───────── */
export const Neuron3D: React.FC<{ state?: number; flash?: number; position?: THREE.Vector3Tuple; scale?: number; seed?: string }> = ({ state = 0, flash = 0, position = [0, 0, 0], scale = 1, seed = "n" }) => {
  const col = new THREE.Color(K.mero).lerp(new THREE.Color(K.danger), state);
  const hex = `#${col.getHexString()}`;
  const curves = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + random(`${seed}a${i}`) * 0.4;
        const len = 1.1 + random(`${seed}l${i}`) * 0.6;
        return new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(a) * len * 0.5, Math.sin(a) * len * 0.5 + 0.15, (random(`${seed}z${i}`) - 0.5) * 0.6),
          new THREE.Vector3(Math.cos(a + 0.3) * len, Math.sin(a + 0.3) * len, (random(`${seed}w${i}`) - 0.5) * 0.9),
        ]);
      }),
    [seed],
  );
  return (
    <group position={position} scale={scale}>
      <Halo r={1.1} color={K.danger} o={0.3 * flash} />
      <mesh>
        <sphereGeometry args={[0.42, 40, 40]} />
        <meshPhysicalMaterial color={hex} emissive={hex} emissiveIntensity={0.25 + 1.2 * flash} roughness={0.3} clearcoat={0.6} />
      </mesh>
      {curves.map((c, i) => (
        <mesh key={i}>
          <tubeGeometry args={[c, 24, 0.07, 8, false]} />
          <meshStandardMaterial color={hex} emissive={hex} emissiveIntensity={0.2 + 0.8 * flash} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

/* ───────── Lòng mạch (camera bay bên trong) ───────── */
export const Vessel3D: React.FC<{ speed?: number }> = ({ speed = 0.08 }) => {
  const f = useCurrentFrame();
  const z0 = (f * speed) % 2;
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <cylinderGeometry args={[2.6, 2.6, 40, 48, 1, true]} />
        <meshStandardMaterial color="#B23A55" side={THREE.BackSide} roughness={0.8} emissive="#5A0F22" emissiveIntensity={0.4} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 0, 6 - i * 2 + z0]}>
          <torusGeometry args={[2.55, 0.05, 8, 48]} />
          <meshStandardMaterial color="#E07A8E" emissive="#7A1F33" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

/** Albumin hình bầu dục chở các phân tử thuốc. */
export const Albumin3D: React.FC<{ position: THREE.Vector3Tuple; load?: number; rot?: number }> = ({ position, load = 3, rot = 0 }) => (
  <group position={position} rotation={[0.3, rot, 0.2]}>
    <mesh scale={[0.95, 0.6, 0.6]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshPhysicalMaterial color="#F1DDB0" roughness={0.55} clearcoat={0.3} />
    </mesh>
    {Array.from({ length: load }).map((_, i) => (
      <mesh key={i} position={[-0.3 + i * 0.3, 0.42, 0.1]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshPhysicalMaterial color={K.erta} emissive={K.erta} emissiveIntensity={0.3} clearcoat={0.8} roughness={0.2} />
      </mesh>
    ))}
  </group>
);

/* ───────── Thận (cung xuyến) + niệu quản + bàng quang ───────── */
export const Kidneys3D: React.FC<{ impaired?: number; position?: THREE.Vector3Tuple; scale?: number }> = ({ impaired = 0, position = [0, 0, 0], scale = 1 }) => {
  const col = `#${new THREE.Color("#B5475E").lerp(new THREE.Color("#8A929C"), impaired).getHexString()}`;
  return (
    <group position={position} scale={scale}>
      {[-1, 1].map((d) => (
        <group key={d} position={[d * 1.05, 0.6, 0]} rotation={[0, 0, d > 0 ? Math.PI * 0.62 : Math.PI * 0.38]}>
          <mesh>
            <torusGeometry args={[0.45, 0.4, 24, 48, Math.PI * 1.45]} />
            <meshPhysicalMaterial color={col} roughness={0.45} clearcoat={0.4} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((d) => {
        const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(d * 0.75, 0.35, 0.1), new THREE.Vector3(d * 0.55, -0.4, 0.1), new THREE.Vector3(d * 0.2, -1.05, 0.1)]);
        return (
          <mesh key={`u${d}`}>
            <tubeGeometry args={[curve, 24, 0.06, 8, false]} />
            <meshStandardMaterial color="#E8B4BE" />
          </mesh>
        );
      })}
      <mesh position={[0, -1.3, 0]} scale={[1, 0.8, 0.8]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial color="#F2D27A" roughness={0.3} transmission={0.2} clearcoat={0.5} />
      </mesh>
    </group>
  );
};

/* ───────── Bình nồng độ valproat (thủy tinh) ───────── */
export const Tank3D: React.FC<{ level: number; lo?: number; hi?: number; position?: THREE.Vector3Tuple }> = ({ level, lo = 0.5, hi = 0.8, position = [0, 0, 0] }) => {
  const H = 2.4, Rr = 0.8;
  const lh = Math.max(0.02, level) * H;
  return (
    <group position={position}>
      <mesh position={[0, -H / 2 + lh / 2, 0]}>
        <cylinderGeometry args={[Rr * 0.94, Rr * 0.94, lh, 48]} />
        <meshPhysicalMaterial color="#C04ABC" emissive="#6E1E6B" emissiveIntensity={0.35} roughness={0.2} clearcoat={0.6} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[Rr, Rr, H, 48, 1, true]} />
        <meshPhysicalMaterial color="#DDEBFF" roughness={0.05} transmission={0.85} thickness={0.2} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {[lo, hi].map((v, i) => (
        <mesh key={i} position={[0, -H / 2 + v * H, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Rr + 0.04, 0.03, 8, 64]} />
          <meshBasicMaterial color={K.safe} />
        </mesh>
      ))}
      <mesh position={[0, -H / 2 + ((lo + hi) / 2) * H, 0]}>
        <cylinderGeometry args={[Rr + 0.02, Rr + 0.02, (hi - lo) * H, 48, 1, true]} />
        <meshBasicMaterial color={K.safe} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
};

/** Hạt nhỏ phát sáng (GABA, Cl⁻…). */
export const Dot3D: React.FC<{ position: THREE.Vector3Tuple; r?: number; color: string; glow?: number; opacity?: number }> = ({ position, r = 0.1, color, glow = 0.5, opacity = 1 }) => (
  <mesh position={position}>
    <sphereGeometry args={[r, 20, 20]} />
    <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={glow} roughness={0.25} clearcoat={0.8} transparent={opacity < 1} opacity={opacity} />
  </mesh>
);
