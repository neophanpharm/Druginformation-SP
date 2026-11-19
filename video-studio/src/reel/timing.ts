import timeline from "./timeline.json";
import captionsRaw from "./captions.json";

export type ReelScene = (typeof timeline.scenes)[number];
export type ReelTiming = ReelScene & { start: number; end: number; lead: number; voiceStart: number; voiceEnd: number };
export type Word = { text: string; s: number; e: number; key: boolean };

export const R = timeline;
export const FPS = timeline.fps;
export const W = timeline.width;
export const H = timeline.height;

export function reelTimings(): { timings: ReelTiming[]; total: number } {
  const T = timeline.transitionFrames;
  let cursor = 0;
  const timings = timeline.scenes.map((s, i) => {
    const start = i === 0 ? 0 : cursor - T;
    const end = start + s.dur;
    cursor = end;
    const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? timeline.voiceLeadFrames;
    const voiceStart = start + lead;
    const voiceEnd = voiceStart + Math.round(s.voiceSec * FPS);
    return { ...s, start, end, lead, voiceStart, voiceEnd };
  });
  return { timings, total: cursor };
}

const caps = captionsRaw as unknown as Record<string, [string, number, number][]>;

/** Từ của một đoạn lời đọc, mốc tính bằng khung tuyệt đối. */
export function wordsFor(t: ReelTiming): Word[] {
  if (!t.voice) return [];
  const list = caps[t.voice] ?? [];
  const keys = new Set(((t as { keywords?: string[] }).keywords ?? []).map((k) => k.toLowerCase()));
  return list.map(([text, s, e]) => ({
    text,
    s: t.voiceStart + Math.round(s * FPS),
    e: t.voiceStart + Math.round(e * FPS),
    key: keys.has(text.toLowerCase()),
  }));
}

/** Chia từ thành các "trang" phụ đề ≤ 2 dòng, ~30 ký tự/dòng, ngắt ở dấu câu khi có thể. */
export function pages(words: Word[], maxChars = 52): Word[][] {
  const out: Word[][] = [];
  let cur: Word[] = [];
  let len = 0;
  words.forEach((w, i) => {
    cur.push(w);
    len += w.text.length + 1;
    const punct = /[.,;:]$/.test(w.text);
    const next = words[i + 1];
    const gap = next ? next.s - w.e : 99;
    if (len >= maxChars || (punct && len >= 22) || gap > 12) {
      out.push(cur);
      cur = [];
      len = 0;
    }
  });
  if (cur.length) out.push(cur);
  return out;
}
