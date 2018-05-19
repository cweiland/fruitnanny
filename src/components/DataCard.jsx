import PropTypes from "prop-types";
import React from "react";
import colors from "../styles/colors";

const DataCard = props => {
  let bgColor;
  let current;
  let average;
  switch (props.type) {
    case "Temperature":
      bgColor = colors.PRIMARY;
      current = props.current !== null ? `${props.current}°` : "--";
      average = props.average !== null ? `${props.average}°` : "--";
      break;

    case "Humidity":
      bgColor = colors.SECONDARY;
      current = props.current !== null ? `${props.current}%` : "--";
      average = props.average !== null ? `${props.average}%` : "--";
      break;

    case "Naptime":
      bgColor = colors.SUCCESS;
      current = props.current !== null ? `${props.current}m` : "--";
      average = props.average !== null ? `${props.average}m` : "--";
      break;
    default:
      bgColor = colors.NEUTRAL;
      break;
  }

  return (
    <div className="data-card" style={{ backgroundColor: bgColor }}>
      <span className="card-header">{props.type}</span>
      <span className="current">{current}</span>
      <span className="avg">Avg: {average}</span>
    </div>
  );
};

DataCard.propTypes = {
  type: PropTypes.oneOf(["Temperature", "Humidity", "Naptime"]).isRequired,
  current: PropTypes.number, // eslint-disable-line react/require-default-props
  average: PropTypes.number // eslint-disable-line react/require-default-props
};

export default DataCard;
