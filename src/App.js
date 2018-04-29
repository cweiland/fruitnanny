/* eslint-disable react/jsx-filename-extension */
// TODO: index.js for components
import React, { Component } from "react";
import SleepTimer from "./components//SleepTimer";
import StreamContainer from "./components/StreamContainer";
import Clock from "./components/Clock";
import DataCards from "./components/DataCards";
import DataChart from "./components/DataChart";
import * as cherub from "./assets/cherub.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Data cards
      temp: {
        type: "Temperature",
        cur: "--",
        avg: "--"
      },
      humidity: {
        type: "Humidity",
        cur: "--",
        avg: "--"
      },
      naptime: {
        type: "Naptime",
        cur: "--",
        avg: "--"
      },

      // From database
      naps: [],

      // Nap timer
      timer: {
        start: 0,
        isTiming: false,
        elapsed: "00:00:00",
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
  }

  componentDidMount() {
    // Update temperature once a minute
    this.fetchTemp();
    this.tempInterval = setInterval(() => {
      this.fetchTemp();
    }, 1 * 60 * 1000);

    this.fetchNapData();
  }

  componentWillUnmount() {
    clearInterval(this.tempInterval);
  }

  // TODO: refactor class's business logic into separate file
  fetchTemp() {
    fetch("/api/dht/current")
      .then(resp => resp.json())
      .then(data => {
        // DHT22 sensor may return {temperature: "Failed", humidity: "to"} if unsuccessful
        if (data.temperature === "Failed") {
          return this.fetchTemp();
        }

        // TODO: when settings page done, set temp accordingly
        const tempInC = data.temperature;
        const tempInF = Math.round(tempInC * (9 / 5) + 32);
        const h = Math.round(data.humidity);
        const { temp, humidity, temps, humids } = this.state;
        temps.push(tempInF);
        humids.push(h);
        this.setState({ 
          temps,
          humids,
          temp: {...temp, cur: `${tempInF}°`}, 
          humidity: {...humidity, cur: `${h}%`}
        });
      })
      .catch(err => {
        window.console.log(err);
      });
  }

  fetchNapData() {
    fetch("/api/naps")
    .then(resp => resp.json())
    .then(naps => {
      if (naps.length > 0) {
        const timesAll = [];
        const timesToday = [];
        const temps = [];
        const humids = [];
        naps.forEach(nap => {
          const { temp, humidity, length, date } = nap.data;
          temps.push(temp);
          humids.push(humidity);
          timesAll.push(length);
          const today = new Date();
          const todayStart = Number(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
          const todayEnd = todayStart + (24 * 60 * 60 * 1000);
          if (date >= todayStart && date < todayEnd) {
            timesToday.push(length);
          }
        });

        // TODO: present nap time in hours and minutes, or just mins as appropriate
        // TODO: repeated in saveTime, refactor
        const reducer = (acc, cur) => acc + cur;
        const avgTemp = Math.round(temps.reduce(reducer) / naps.length);
        const avgHumidity = Math.round(humids.reduce(reducer) / naps.length);
        const avgTime = Math.round(timesAll.reduce(reducer) / timesAll.length / 60);
        const totalToday = timesToday.length > 0 
          ? `${Math.round(timesToday.reduce(reducer) / 60)}m` 
          : "--";
        
        const { temp, humidity, naptime } = this.state;
        this.setState({ 
          naps,
          naptime: { ...naptime, cur: totalToday, avg: `${avgTime}m` },
          temp: { ...temp, avg: `${avgTemp}°` },
          humidity: { ...humidity, avg: `${avgHumidity}%` }
        });
      }
    });
  }

  toggleTimer() {
    let { timer } = this.state;
    let { start, isTiming } = timer;

    // Set start time and negate isTiming
    start = (Number(new Date()) - start) || Number(new Date());
    isTiming = !isTiming;
    timer = { ...timer, start, isTiming };
    this.setState({ timer });

    if (isTiming) {
      this.timerInterval = setInterval(() => {
        timer.elapsed = this.calcTime(start);
        this.setState({ timer });
      }, 1000);
    } else {
      clearInterval(this.timerInterval);
    }
  }

  saveTime() {
    // TODO: ensure all data points collected before saving (maybe setTimeout to give time to t/h)
    // TODO: reset elapsed after save
    // FIXME: if another quick start and save is execed after a save, temps and humids is empty
    const { temps, humids, timer } = this.state
    const { start } = timer;
    const reducer = (acc, cur) => acc + cur;
    const avgTemp = Math.round(temps.reduce(reducer) / temps.length);
    const avgHumidity = Math.round(humids.reduce(reducer) / humids.length);
    const elapsed = Math.round(start / 1000);
    fetch("/api/naps", {
      body: JSON.stringify({ 
        date: Number(new Date()), 
        length: elapsed, 
        temp: avgTemp, 
        humidity: avgHumidity 
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    })
    .then(response => response.json())
    .then(newNap => {
      let { naps, timer } = this.state;
      naps = [...naps, newNap];
      const resetTimer = { 
        ...timer,
        start: 0,
        isTiming: false,
        elapsed: "00:00:00",
      };
      this.setState({ naps, timer: resetTimer, temps: [], humids: [] });
    });
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
            saveTime={this.saveTime} />
        </div>
        <div className="data-pane">
          <Clock />
          <DataCards temp={temp} humidity={humidity} naptime={naptime} />
          <DataChart naps={naps}/>
        </div>
      </div>
    );
  }
}

export default App;
