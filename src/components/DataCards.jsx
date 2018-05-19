import PropTypes from "prop-types";
import React from "react";
import DataCard from "./DataCard";

const DataCards = props => (
  <div className="card-container">
    <DataCard {...props.naptime} />
    <DataCard {...props.temperature} />
    <DataCard {...props.humidity} />
  </div>
);

DataCards.propTypes = {
  naptime: PropTypes.shape({
    type: PropTypes.string.isRequired,
    current: PropTypes.number,
    average: PropTypes.number
  }).isRequired,

  temperature: PropTypes.shape({
    type: PropTypes.string.isRequired,
    current: PropTypes.number,
    average: PropTypes.number
  }).isRequired,

  humidity: PropTypes.shape({
    type: PropTypes.string.isRequired,
    current: PropTypes.number,
    average: PropTypes.number
  }).isRequired
};

export default DataCards;
