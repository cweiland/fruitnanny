import React, { Component } from 'react';

const getDateString = date => (
  `${date.toDateString().replace(/ \d{4}/, '')}, ${date.toLocaleTimeString().replace(/(\d+:\d+):\d+ (.*)/, '$1 $2')}`
);

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ date: new Date() }), (60 * 1000));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="clock-container">
        {getDateString(this.state.date)}
      </div>
    )
  }
}
