import PropTypes from "prop-types";
import React from "react";
import DataCard from "./DataCard";

const DataCards = props => (
  <div className="card-container">
    <DataCard {...props.naptime} />
    <DataCard {...props.temp} />
    <DataCard {...props.humidity} />
  </div>
);

DataCards.propTypes = {
  naptime: PropTypes.shape({
    type: PropTypes.string.isRequired,
    cur: PropTypes.string.isRequired,
    avg: PropTypes.string.isRequired
  }).isRequired,

  temp: PropTypes.shape({
    type: PropTypes.string.isRequired,
    cur: PropTypes.number.isRequired,
    avg: PropTypes.string.isRequired
  }).isRequired,

  humidity: PropTypes.shape({
    type: PropTypes.string.isRequired,
    cur: PropTypes.number.isRequired,
    avg: PropTypes.string.isRequired
  }).isRequired
};

export default DataCards;
