import React, { Component } from 'react';
import DataCard from './DataCard';

export default class DataCards extends Component {
  render() {
    return (
      <div className="card-container">
        <DataCard {...this.props.naptime} />
        <DataCard {...this.props.temp} />
        <DataCard {...this.props.humidity} />
      </div>
    );
  }
}
