import React, { Component } from 'react'
import AudioSpectrum from './AudioSpectrum'

export default class AudioWidget extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <AudioSpectrum
        className="audio-spectrum"
        height={270}
        width={640}
        audioId={'video'}
        capColor={'violetred'}
        capHeight={2}
        meterWidth={2}
        meterCount={512}
        meterColor={[
          {stop: 0, color: '#f00'},
          {stop: 0.5, color: '#0CD7FD'},
          {stop: 1, color: 'red'}
        ]}
        gap={4}
      />
    )
  }
}
