import React from "react";
import { Composition, Still } from "remotion";
import { ErtapenemVideo } from "./Video";
import { computeTimings, timeline } from "./timing";
import { ErtapenemReel } from "./reel/Reel";
import { ErtapenemMedicalClean } from "./mc/Reel";
import { timings as mcTimings } from "./mc/kit";
import { reelTimings, R } from "./reel/timing";

export const RemotionRoot: React.FC = () => {
  const { total } = computeTimings();
  return (
    <>
      <Composition id="ErtapenemSeizure" component={ErtapenemVideo} durationInFrames={total} fps={timeline.fps} width={timeline.width} height={timeline.height} />
      <Still id="Thumbnail" component={ErtapenemVideo} width={timeline.width} height={timeline.height} />
      <Composition id="ErtapenemMC" component={ErtapenemMedicalClean} durationInFrames={mcTimings().total} fps={30} width={1080} height={1920} />
      <Composition id="ErtapenemReel" component={ErtapenemReel} durationInFrames={reelTimings().total} fps={R.fps} width={R.width} height={R.height} />
    </>
  );
};
