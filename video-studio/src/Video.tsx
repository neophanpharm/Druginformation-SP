import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { C } from "./theme";
import { computeTimings, TRANSITION, timeline } from "./timing";
import { BrandFrame, BrandIntro, BrandOutro } from "./components/frame";
import { S01, S02, S03, S04, S05 } from "./scenes/part1";
import { S06, S07, S08, S09, S10, S11, S12 } from "./scenes/part2";

const SCENES: Record<string, React.FC> = {
  INTRO: BrandIntro, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, OUTRO: BrandOutro,
};

export const ErtapenemVideo: React.FC = () => {
  const { timings } = computeTimings();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <TransitionSeries>
        {timeline.scenes.map((s, i) => {
          const Comp = SCENES[s.id];
          const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? timeline.voiceLeadFrames;
          const items = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={s.dur} name={`${s.id} – ${s.title}`}>
              <Comp />
              {s.voice && (
                <Sequence from={lead} name={`voice ${s.voice}`}>
                  <Audio src={staticFile(`audio/${s.voice}.mp3`)} volume={1} />
                </Sequence>
              )}
            </TransitionSeries.Sequence>,
          ];
          if (i < timeline.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`${s.id}-t`}
                presentation={s.transition === "slide" ? slide({ direction: "from-right" }) : fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      <BrandFrame timings={timings} />
    </AbsoluteFill>
  );
};
