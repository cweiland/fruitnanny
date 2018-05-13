import PropTypes from "prop-types";
import React, { Component } from "react";

// TODO: refactor to audioSpectrumUtils.js
const prepareAPIs = () => {
  // fix browser vender for AudioContext and requestAnimationFrame
  window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.msAudioContext;
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame;

  if (typeof window.AudioContext !== "function") {
    throw new Error("Your browser does not support AudioContext API!");
  } else if (typeof window.requestAnimationFrame !== "function") {
    throw new Error("Your browser does not support requestAnimationFrame API!");
  }
};

const getRandomId = len => {
  const str = "1234567890-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  const strLen = str.length;
  let res = "";
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * strLen);
    res += str[randomIndex];
  }

  return res;
};

class AudioSpectrum extends Component {
  constructor(props) {
    super(props);

    this.animationId = null;
    this.audioContext = null;
    this.audioEle = null;
    this.audioCanvas = null;
    this.playStatus = null;
    this.canvasId = this.props.id;
  }

  componentDidMount() {
    try {
      prepareAPIs();
      this.audioContext = new window.AudioContext();
    } catch (e) {
      console.error(e);
    }

    this.audioCanvas = document.getElementById(this.canvasId);
    this.audioEle = document.getElementById(this.props.audioId);

    const analyser = this.setupAudioNode(this.audioEle);
    this.initAudioEvents(analyser);
  }

  setupAudioNode(audioEle) {
    const analyser = this.audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 2048;

    const mediaEleSource = this.audioContext.createMediaElementSource(audioEle);
    mediaEleSource.connect(analyser);
    mediaEleSource.connect(this.audioContext.destination);

    return analyser;
  }

  initAudioEvents(analyser) {
    this.audioEle.onpause = () => {
      this.playStatus = "PAUSED";
    };

    this.audioEle.onplay = () => {
      this.playStatus = "PLAYING";
      this.drawSpectrum(analyser);
    };
  }

  drawSpectrum(/* analyser */) {
    const cwidth = this.audioCanvas.width;
    const cheight = this.audioCanvas.height - this.props.capHeight;
    const capYPositionArray = []; // store the vertical position of hte caps for the preivous frame
    const ctx = this.audioCanvas.getContext("2d");
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);

    if (this.props.meterColor.constructor === Array) {
      const stops = this.props.meterColor;
      const len = stops.length;
      for (let i = 0; i < len; i++) {
        gradient.addColorStop(stops[i].stop, stops[i].color);
      }
    } else if (typeof this.props.meterColor === "string") {
      gradient = this.props.meterColor;
    }

    const drawMeter = () => {
      // TODO: sort out this dependency on StreamContext
      const array = window.StreamContext.audioByteFrequencyData().full;
      // let array = new Uint8Array(analyser.frequencyBinCount); // item value of array: 0 - 255
      // analyser.getByteFrequencyData(array);
      if (this.playStatus === "PAUSED") {
        for (let i = array.length - 1; i >= 0; i -= 1) {
          array[i] = 0;
        }
        const allCapsReachBottom = !capYPositionArray.some(cap => cap > 0);
        if (allCapsReachBottom) {
          ctx.clearRect(0, 0, cwidth, cheight + this.props.capHeight);
          cancelAnimationFrame(this.animationId); // since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
          return;
        }
      }

      const step = Math.round(array.length / this.props.meterCount); // sample limited data from the total array
      ctx.clearRect(0, 0, cwidth, cheight + this.props.capHeight);
      for (let i = 0; i < this.props.meterCount; i++) {
        const value = array[i * step];
        if (capYPositionArray.length < Math.round(this.props.meterCount)) {
          capYPositionArray.push(value);
        }

        ctx.fillStyle = this.props.capColor;

        // draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
          // let y = cheight - (--capYPositionArray[i])
          const preValue = --capYPositionArray[i];
          const y = (270 - preValue) * cheight / 270;
          ctx.fillRect(
            i * (this.props.meterWidth + this.props.gap),
            y,
            this.props.meterWidth,
            this.props.capHeight
          );
        } else {
          // let y = cheight - value
          const y = (270 - value) * cheight / 270;
          ctx.fillRect(
            i * (this.props.meterWidth + this.props.gap),
            y,
            this.props.meterWidth,
            this.props.capHeight
          );
          capYPositionArray[i] = value;
        }

        // set the filllStyle to gradient for a better look
        ctx.fillStyle = gradient;

        // let y = cheight - value + this.props.capHeight
        const y = (270 - value) * cheight / 270 + this.props.capHeight;

        // the meter
        ctx.fillRect(
          i * (this.props.meterWidth + this.props.gap),
          y,
          this.props.meterWidth,
          cheight
        );
      }

      this.animationId = requestAnimationFrame(drawMeter);
    };

    this.animationId = requestAnimationFrame(drawMeter);
  }

  render() {
    return (
      <canvas
        id={this.canvasId}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

AudioSpectrum.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number,
  height: PropTypes.number,
  audioId: PropTypes.string.isRequired,
  capColor: PropTypes.string,
  capHeight: PropTypes.number,
  meterWidth: PropTypes.number,
  meterCount: PropTypes.number,
  meterColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        stop: PropTypes.number,
        color: PropTypes.string
      })
    )
  ]),
  gap: PropTypes.number
};

AudioSpectrum.defaultProps = {
  id: getRandomId(50),
  width: 300,
  height: 200,
  capColor: "#FFF",
  capHeight: 2,
  meterWidth: 2,
  meterCount: 40 * (2 + 2),
  meterColor: [
    { stop: 0, color: "#f00" },
    { stop: 0.5, color: "#0CD7FD" },
    { stop: 1, color: "red" }
  ],
  gap: 10 // gap between meters
};

export default AudioSpectrum;
