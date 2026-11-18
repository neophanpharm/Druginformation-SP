import { Easing, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["vietnamese", "latin"],
});

/** Bảng màu: thương hiệu (đỏ/navy) chỉ dùng cho khung; màu ngữ nghĩa y khoa tách riêng. */
export const C = {
  bg: "#F6F8FB",
  bg2: "#E9EEF5",
  ink: "#0B1F3A",
  line: "#1E3A5F",
  muted: "#8A9BB3",
  navy: "#002060",
  brandRed: "#C00000",
  white: "#FFFFFF",
  // ngữ nghĩa
  erta: "#0FA3A3",
  ertaDark: "#0B7C7C",
  imi: "#F08A24",
  mero: "#3B7DDD",
  dori: "#8B5CF6",
  gaba: "#2FBF71",
  chloride: "#7DD3FC",
  bacteria: "#9BC53D",
  bacteriaDark: "#5E8C1F",
  pbp: "#F59E0B",
  calm: "#8EC5FF",
  excited: "#FF7A45",
  danger: "#E4572E",
  kidney: "#A85563",
  albumin: "#E8D3A8",
  albuminDark: "#B9965A",
  valproate: "#C04ABC",
  safe: "#2FBF71",
  warn: "#F2B134",
  skin: "#F2C9A0",
  bed: "#D7E3F1",
} as const;

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Nội suy có easing, kẹp hai đầu. */
export const tw = (f: number, a: number, b: number, from = 0, to = 1, ease = EASE) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const pop = (frame: number, fps: number, delay = 0, damping = 14) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness: 140, mass: 0.8 } });

/** Xuất hiện + biến mất mềm trong một cảnh. */
export const life = (f: number, start: number, end: number, fade = 12) =>
  Math.min(tw(f, start, start + fade), 1 - tw(f, end - fade, end));

export const pulse = (f: number, period = 30, lo = 0, hi = 1) =>
  lo + (hi - lo) * (0.5 + 0.5 * Math.sin((f / period) * Math.PI * 2));
