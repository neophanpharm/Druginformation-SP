import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import brand from "../../../brand/brand.json";
import { R, reelTimings } from "./timing";
import { ReelChrome, ReelIntro, ReelDisclaimer, ReelOutro, K } from "./ui";
import { Hook, Family, PD, PK, MOA, VPA } from "./scenes3d";
import { Free, Signs, Onset, Risk, Compare, Practice, Takeaway } from "./scenes2d";

const disclaimerCard = brand.disclaimer.card.replace("{thang_nam}", "11/2026");

const SCENES: Record<string, React.FC> = {
  INTRO: ReelIntro,
  DISCLAIMER: () => <ReelDisclaimer text={disclaimerCard} />,
  HOOK: Hook, FAMILY: Family, PD, PK, FREE: Free, MOA, SIGNS: Signs, ONSET: Onset, RISK: Risk, COMPARE: Compare, VPA, PRACTICE: Practice, TAKEAWAY: Takeaway,
  OUTRO: () => <ReelOutro short={brand.disclaimer.short} />,
};

export const ErtapenemReel: React.FC = () => {
  const { timings, total } = reelTimings();
  const m = R.music;
  // Ducking: nhạc hạ khi có lời đọc, lên lại ở khoảng trống; vào/ra mềm.
  const musicVolume = (fr: number) => {
    let duck = 0;
    for (const t of timings) {
      if (!t.voice) continue;
      const d = Math.min(interpolate(fr, [t.voiceStart - m.rampFrames, t.voiceStart], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(fr, [t.voiceEnd, t.voiceEnd + m.rampFrames * 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      duck = Math.max(duck, d);
    }
    const base = m.gapVolume + (m.voiceVolume - m.gapVolume) * duck;
    const fadeIn = interpolate(fr, [0, m.fadeInFrames], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(fr, [total - m.fadeOutFrames, total], [1, 0], { extrapolateLeft: "clamp" });
    return base * fadeIn * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: K.bg0 }}>
      <TransitionSeries>
        {R.scenes.map((s, i) => {
          const Comp = SCENES[s.id];
          const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? R.voiceLeadFrames;
          const out = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={s.dur} name={`${s.id} – ${s.title || s.id}`}>
              <Comp />
              {s.voice && (
                <Sequence from={lead} name={`voice ${s.voice}`}>
                  <Audio src={staticFile(`audio/${s.voice}.mp3`)} />
                </Sequence>
              )}
            </TransitionSeries.Sequence>,
          ];
          if (i < R.scenes.length - 1) {
            out.push(
              <TransitionSeries.Transition key={`${s.id}-t`} presentation={s.transition === "slide" ? slide({ direction: "from-bottom" }) : fade()} timing={linearTiming({ durationInFrames: R.transitionFrames })} />,
            );
          }
          return out;
        })}
      </TransitionSeries>
      <Audio src={staticFile(m.file)} volume={musicVolume} />
      <ReelChrome timings={timings} total={total} />
    </AbsoluteFill>
  );
};
