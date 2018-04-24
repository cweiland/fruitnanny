import React from "react";
import * as cherub from "../assets/cherub.png";
import SleepTimer from "./SleepTimer";
import Spotify from "./Spotify";
import StreamContainer from "./StreamContainer";

const BabyMonitor = () => (
  <div>
    <div className="monitor-feed">
      <span className="feed-header">Lily Evelyn Marrero</span>
      <img alt="cherub" className="cherub-image" src={cherub} />
      <StreamContainer />
    </div>
    <SleepTimer />
    <Spotify />
  </div>
);

export default BabyMonitor;
