import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import brand from "../../../brand/brand.json";
import { T, timings, FrameChrome, Disclaimer, Outro } from "./kit";
import { Hook, Family, PD, PK, Free, MOA, Signs, Onset, Risk, Compare, VPA, Practice, Takeaway } from "./scenes";

const disc = brand.disclaimer.card.replace("{thang_nam}", "11/2026");
const txt = (id: string, key: string) => (T.scenes.find((s) => s.id === id)?.onScreen as { key: string; text: string }[]).find((o) => o.key === key)!.text;
const SCENES: Record<string, React.FC> = {
  DISCLAIMER: () => <Disclaimer eyebrow={txt("DISCLAIMER", "eyebrow")} title={txt("DISCLAIMER", "title")} text={disc} />,
  HOOK: Hook, FAMILY: Family, PD, PK, FREE: Free, MOA, SIGNS: Signs, ONSET: Onset, RISK: Risk, COMPARE: Compare, VPA, PRACTICE: Practice, TAKEAWAY: Takeaway,
  OUTRO: () => <Outro brand={txt("OUTRO", "brand")} title={txt("OUTRO", "title")} body={txt("OUTRO", "body")} />,
};

export const ErtapenemMedicalClean: React.FC = () => {
  const { list, total } = timings();
  const m = T.music;
  const vol = (fr: number) => {
    let duck = 0;
    for (const t of list) {
      if (!t.voice) continue;
      duck = Math.max(duck, Math.min(
        interpolate(fr, [t.voiceStart - m.rampFrames, t.voiceStart], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        interpolate(fr, [t.voiceEnd, t.voiceEnd + m.rampFrames * 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      ));
    }
    const base = m.gapVolume + (m.voiceVolume - m.gapVolume) * duck;
    return base * interpolate(fr, [0, m.fadeInFrames], [0, 1], { extrapolateRight: "clamp" }) * interpolate(fr, [total - m.fadeOutFrames, total], [1, 0], { extrapolateLeft: "clamp" });
  };
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <TransitionSeries>
        {T.scenes.map((s, i) => {
          const Comp = SCENES[s.id];
          const lead = (s as { voiceLeadFrames?: number }).voiceLeadFrames ?? T.voiceLeadFrames;
          const out = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={s.dur} name={`${s.id} - ${s.title || s.id}`}>
              <Comp />
              {s.voice && <Sequence from={lead} name={`voice ${s.voice}`}><Audio src={staticFile(`audio/${s.voice}.mp3`)} volume={1} /></Sequence>}
            </TransitionSeries.Sequence>,
          ];
          if (i < T.scenes.length - 1)
            out.push(<TransitionSeries.Transition key={`${s.id}-t`} presentation={s.transition === "slide" ? slide({ direction: "from-right" }) : fade()} timing={linearTiming({ durationInFrames: T.transitionFrames })} />);
          return out;
        })}
      </TransitionSeries>
      <Audio src={staticFile(m.file)} volume={vol} />
      <FrameChrome list={list} />
    </AbsoluteFill>
  );
};
