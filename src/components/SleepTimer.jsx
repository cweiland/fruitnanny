import { PropTypes } from "prop-types";
import React from "react";
import * as zzz from "../assets/zzz.png";

// TODO: proptypes
const SleepTimer = props => (
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

SleepTimer.propTypes = {
  elapsed: PropTypes.string.isRequired,
  toggleTimer: PropTypes.func.isRequired,
  isTiming: PropTypes.bool.isRequired,
  resetTimer: PropTypes.func.isRequired,
  start: PropTypes.number.isRequired,
  saveTime: PropTypes.func.isRequired
};

export default SleepTimer;
