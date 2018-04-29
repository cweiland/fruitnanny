import React from "react";
import * as zzz from "../assets/zzz.png";

const SleepTimer = (props) => (
  <div className="sleep-timer-container">
    <img alt="zzz" className="zzz-image" src={zzz} />
    <span>{props.elapsed}</span>
    <div className="timer-buttons">
      <button className="btn-primary" onClick={props.toggleTimer}>
        {props.isTiming ? "Stop" : "Start"}
      </button>
      {props.isTiming ? (
        <button className="btn-secondary" onClick={props.resetTimer}>
          Reset
        </button>
      ) : (
        <button
          disabled={!props.start}
          className="btn-success"
          onClick={props.saveTime}
        >
          Save
        </button>
      )}
    </div>
  </div>
);

export default SleepTimer;