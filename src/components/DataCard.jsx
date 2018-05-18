import PropTypes from "prop-types";
import React from "react";
import colors from "../styles/colors";

const DataCard = props => {
  let bgColor;
  let current;
  switch (props.type) {
    case "Temperature":
      bgColor = colors.PRIMARY;
      current = `${props.cur}°`;
      break;

    case "Humidity":
      bgColor = colors.SECONDARY;
      current = `${props.cur}%`;
      break;

    case "Naptime":
      bgColor = colors.SUCCESS;
      current = props.cur;
      break;
    default:
      bgColor = colors.NEUTRAL;
      break;
  }

  return (
    <div className="data-card" style={{ backgroundColor: bgColor }}>
      <span className="card-header">{props.type}</span>
      <span className="current">{current}</span>
      <span className="avg">Avg: {props.avg}</span>
    </div>
  );
};

DataCard.propTypes = {
  type: PropTypes.oneOf(["Temperature", "Humidity", "Naptime"]).isRequired,
  cur: PropTypes.number.isRequired,
  avg: PropTypes.number.isRequired
};

export default DataCard;
