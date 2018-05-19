/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import * as cherub from "./assets/cherub.png";
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
      temperature: { type: "Temperature", current: null, average: null },
      humidity: { type: "Humidity", current: null, average: null },
      naptime: { type: "Naptime", current: null, average: null },

      // From database
      savedNaps: [],

      // Nap timer
      timer: {
        start: 0,
        isTiming: false,
        elapsed: "00:00:00"
      },

      // Readings while nap timer is running
      napTemperatures: [],
      napHumidities: []
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
        if (e.message.includes("DHT22 sensor failed")) {
          // Happens occasionally. Try again.
          this.updateTemp();
        }
      });
  }

  setTempState({ currentTemp, currentHumidity }) {
    const {
      temperature,
      humidity,
      napTemperatures,
      napHumidities,
      timer
    } = this.state;
    if (timer.isTiming) {
      // Begin building temperature data arrays if a nap is underway
      const newTemps = [...napTemperatures, currentTemp];
      const newHumidities = [...napHumidities, currentHumidity];
      this.setState({
        napTemperatures: newTemps,
        napHumidities: newHumidities,
        temperature: { ...temperature, current: currentTemp },
        humidity: { ...humidity, current: currentHumidity }
      });
    } else {
      this.setState({
        temperature: { ...temperature, current: currentTemp },
        humidity: { ...humidity, current: currentHumidity }
      });
    }
  }

  setNapState(napsData) {
    const {
      savedNaps,
      totalNaptimeToday,
      avgNaptime,
      avgTemp,
      avgHumidity
    } = napsData;
    const { temperature, humidity, naptime } = this.state;
    this.setState({
      savedNaps,
      naptime: {
        ...naptime,
        current: totalNaptimeToday,
        average: avgNaptime
      },
      temperature: { ...temperature, average: avgTemp },
      humidity: { ...humidity, average: avgHumidity }
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
    const { napTemperatures, napHumidities, timer, savedNaps } = this.state;
    const { start } = timer;

    const reducer = (acc, cur) => acc + cur;
    const avgTemp =
      napTemperatures.length > 0
        ? Math.round(napTemperatures.reduce(reducer) / napTemperatures.length)
        : this.state.temperature.current;
    const avgHumidity =
      napHumidities.length > 0
        ? Math.round(napHumidities.reduce(reducer) / napHumidities.length)
        : this.state.humidity.current;
    const napLength = Math.round(start / 1000);

    try {
      const newNap = await saveNapData(avgTemp, avgHumidity, napLength);
      const updatedNaps = [...savedNaps, newNap.data];

      const resetTimer = {
        ...timer,
        start: 0,
        isTiming: false,
        elapsed: "00:00:00"
      };

      this.setState({
        savedNaps: updatedNaps,
        timer: resetTimer,
        napTemperatures: [],
        napHumidities: []
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
    const { temperature, humidity, naptime, timer, savedNaps } = this.state;
    return (
      <div className="app">
        <div>
          <div className="monitor-feed">
            <span className="feed-header">Lily Evelyn Marrero</span>
            <img alt="cherub" className="cherub-image" src={cherub} />
            <StreamContainer
              timer={timer}
              toggleTimer={this.toggleTimer}
              resetTimer={this.resetTimer}
              saveTime={this.saveTime}
            />
          </div>
        </div>
        <div className="data-pane">
          <Clock />
          <DataCards
            temperature={temperature}
            humidity={humidity}
            naptime={naptime}
          />
          <DataChart naps={savedNaps} />
        </div>
      </div>
    );
  }
}

export default App;
