import React from "react";
import { Composition, Still } from "remotion";
import { ErtapenemVideo } from "./Video";
import { computeTimings, timeline } from "./timing";

export const RemotionRoot: React.FC = () => {
  const { total } = computeTimings();
  return (
    <>
      <Composition id="ErtapenemSeizure" component={ErtapenemVideo} durationInFrames={total} fps={timeline.fps} width={timeline.width} height={timeline.height} />
      <Still id="Thumbnail" component={ErtapenemVideo} width={timeline.width} height={timeline.height} />
    </>
  );
};
