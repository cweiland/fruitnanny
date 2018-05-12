/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import * as cherub from "./assets/cherub.png";
import SleepTimer from "./components//SleepTimer";
import Clock from "./components/Clock";
import DataCards from "./components/DataCards";
import DataChart from "./components/DataChart";
import StreamContainer from "./components/StreamContainer";
import calcElapsedTime from "./lib/calcElapsedTime";
import saveNapData from "./lib/saveNapData";
import { fetchNaps } from "./lib/utils/db";
import { fetchTemp } from "./lib/utils/temp";

class App extends Component {
  constructor(props) {
    super(props);

    // TODO: change state var names to be more descriptive
    this.state = {
      // Data cards
      temp: { type: "Temperature", cur: "--", avg: "--" },
      humidity: { type: "Humidity", cur: "--", avg: "--" },
      naptime: { type: "Naptime", cur: "--", avg: "--" },

      // From database
      naps: [],

      // Nap timer
      timer: {
        start: 0,
        isTiming: false,
        elapsed: "00:00:00"
      },

      // Readings while nap timer is running
      temps: [],
      humids: []
    };

    this.timerInterval = null;
    this.tempInterval = null;

    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.setTempState = this.setTempState.bind(this);
    this.setNapState = this.setNapState.bind(this);
  }

  componentDidMount() {
    this.updateNaps();
    this.updateTemp();
    this.tempInterval = setInterval(this.updateTemp, 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tempInterval);
  }

  updateNaps() {
    fetchNaps()
      .then(this.setNapState)
      .catch(() => {}); // Handled in fetchNaps
  }

  updateTemp() {
    fetchTemp()
      .then(this.setTempState)
      .catch(e => {
        if (e.includes("DHT22 sensor failed.")) {
          // Happens occasionally. Try again.
          this.updateTemp();
        }
      });
  }

  setTempState({ currentTemp, currentHumidity }) {
    const { temp, humidity, temps, humids } = this.state;
    const newTemps = [...temps, currentTemp];
    const newHumidities = [...humids, currentHumidity];
    this.setState({
      temps: newTemps,
      humids: newHumidities,
      temp: { ...temp, cur: `${currentTemp}°` },
      humidity: { ...humidity, cur: `${currentHumidity}%` }
    });
  }

  setNapState(napsData) {
    const {
      naps,
      totalNaptimeToday,
      avgNaptime,
      avgTemp,
      avgHumidity
    } = napsData;
    const { temp, humidity, naptime } = this.state;
    this.setState({
      naps,
      naptime: {
        ...naptime,
        cur: totalNaptimeToday !== null ? `${totalNaptimeToday}m` : "--",
        avg: `${avgNaptime}m`
      },
      temp: { ...temp, avg: `${avgTemp}°` },
      humidity: { ...humidity, avg: `${avgHumidity}%` }
    });
  }

  toggleTimer() {
    let { timer } = this.state;
    let { start, isTiming } = timer;

    // Set start time and negate isTiming
    start = Number(new Date()) - start || Number(new Date());
    isTiming = !isTiming;
    timer = { ...timer, start, isTiming };
    this.setState({ timer });

    if (isTiming) {
      this.timerInterval = setInterval(() => {
        timer.elapsed = calcElapsedTime(start);
        this.setState({ timer });
      }, 1000);
    } else {
      clearInterval(this.timerInterval);
    }
  }

  async saveTime() {
    // TODO: refactor
    // TODO: ensure all data points collected before saving (maybe setTimeout to give time to t/h)
    // TODO: reset elapsed after save
    // FIXME: if another quick start and save is execed after a save, temps and humids is empty, crashes
    const { temps, humids, timer, naps } = this.state;
    const { start } = timer;

    const reducer = (acc, cur) => acc + cur;
    const avgTemp = Math.round(temps.reduce(reducer) / temps.length);
    const avgHumidity = Math.round(humids.reduce(reducer) / humids.length);
    const napLength = Math.round(start / 1000);

    try {
      const newNap = await saveNapData(avgTemp, avgHumidity, napLength);
      const updatedNaps = [...naps, newNap];

      const resetTimer = {
        ...timer,
        start: 0,
        isTiming: false,
        elapsed: "00:00:00"
      };

      this.setState({
        naps: updatedNaps,
        timer: resetTimer,
        temps: [],
        humids: []
      });
    } catch (e) {
      console.error(`Unable to save new nap: ${e}`);
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.setState({
      timer: {
        start: 0,
        isTiming: null,
        elapsed: "00:00:00"
      }
    });
  }

  render() {
    const { temp, humidity, naptime, timer, naps } = this.state;
    return (
      <div className="app">
        <div>
          <div className="monitor-feed">
            <span className="feed-header">Lily Evelyn Marrero</span>
            <img alt="cherub" className="cherub-image" src={cherub} />
            <StreamContainer />
          </div>
          <SleepTimer
            {...timer}
            toggleTimer={this.toggleTimer}
            resetTimer={this.resetTimer}
            saveTime={this.saveTime}
          />
        </div>
        <div className="data-pane">
          <Clock />
          <DataCards temp={temp} humidity={humidity} naptime={naptime} />
          <DataChart naps={naps} />
        </div>
      </div>
    );
  }
}

export default App;
