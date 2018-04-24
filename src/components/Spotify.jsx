import React, { Component } from 'react';
import * as overlay from '../assets/spotify-overlay.png';

export default class Spotify extends Component {
  render() {
    return (
      <div className="spotify-container">
        <iframe
          src="https://open.spotify.com/embed?uri=spotify:user:1292740458:playlist:78NnQsFsLWjwuEEoxP4b6I&theme=white"
          width="640"
          height="80"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
          title="spotify">
        </iframe>
        <br />
        <a className="spotify-overlay" href="javascript:void(0)">
          <img alt="Play on Raspbaby Spy" src={overlay} />
        </a>
        <span style={{ fontSize: '20px'}}>Now playing on: Raspbaby Spy</span>
      </div >
    )
  }
}
