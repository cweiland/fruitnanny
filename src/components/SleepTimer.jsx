import React, { Component } from "react";
import * as zzz from "../assets/zzz.png";

export default class SleepTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      isTiming: false,
      elapsed: "00:00:00"
    };
  }

  /* eslint-disable class-methods-use-this */
  calcTime(start) {
    const now = Number(new Date());
    let elapsedSecs = Math.round((now - start) / 1000);

    const hrs = Math.floor(elapsedSecs / (60 * 60));
    elapsedSecs -= hrs * (60 * 60);

    const mins = Math.floor(elapsedSecs / 60);
    elapsedSecs -= mins * 60;

    const secs = elapsedSecs;

    const [hStr, mStr, sStr] = [hrs, mins, secs].map(t => {
      let strT = String(t);
      if (strT.length < 2) {
        strT = `0${t}`;
      }
      return strT;
    });

    return `${hStr}:${mStr}:${sStr}`;
  }

  toggleTimer() {
    this.setState({
      start: +new Date() - this.state.start || +new Date(),
      isTiming: !this.state.isTiming
    });

    if (!this.state.isTiming) {
      this.interval = setInterval(() => {
        this.setState({ elapsed: this.calcTime(this.state.start) });
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  resetTimer() {
    clearInterval(this.interval);
    this.setState({ start: 0, isTiming: null, elapsed: "00:00:00" });
  }

  saveTime() {
    // TODO
  }

  render() {
    return (
      <div className="sleep-timer-container">
        <img alt="zzz" className="zzz-image" src={zzz} />
        <span>{this.state.elapsed}</span>
        <div className="timer-buttons">
          <button className="btn-primary" onClick={() => this.toggleTimer()}>
            {this.state.isTiming ? "Stop" : "Start"}
          </button>
          {this.state.isTiming ? (
            <button className="btn-secondary" onClick={() => this.resetTimer()}>
              Reset
            </button>
          ) : (
            <button
              disabled={!this.state.start}
              className="btn-success"
              onClick={() => this.saveTime()}
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  }
}
