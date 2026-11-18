import timeline from "./timeline.json";

export type SceneDef = (typeof timeline.scenes)[number];
export type SceneTiming = SceneDef & { start: number; end: number; voiceStart: number; voiceEnd: number };

/** Tính mốc tuyệt đối của từng cảnh khi các cảnh chồng nhau `transitionFrames` khung ở mỗi chuyển cảnh. */
export function computeTimings(): { timings: SceneTiming[]; total: number } {
  const T = timeline.transitionFrames;
  let cursor = 0;
  const timings = timeline.scenes.map((s, i) => {
    const start = i === 0 ? 0 : cursor - T;
    const end = start + s.dur;
    cursor = end;
    const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? timeline.voiceLeadFrames;
    const voiceStart = start + lead;
    const voiceEnd = voiceStart + Math.round(s.voiceSec * timeline.fps);
    return { ...s, start, end, voiceStart, voiceEnd };
  });
  return { timings, total: cursor };
}

export const FPS = timeline.fps;
export const TRANSITION = timeline.transitionFrames;
export const VOICE_LEAD = timeline.voiceLeadFrames;
export { timeline };
