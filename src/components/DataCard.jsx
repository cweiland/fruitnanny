import React from "react";
import colors from "../styles/colors";

// TODO: proptypes
const DataCard = props => {
  let bgColor;
  switch (props.type) {
    case "Temperature":
      bgColor = colors.PRIMARY;
      break;

    case "Humidity":
      bgColor = colors.SECONDARY;
      break;

    case "Naptime":
      bgColor = colors.SUCCESS;
      break;
    default:
      bgColor = colors.NEUTRAL;
      break;
  }

  return (
    <div className="data-card" style={{ backgroundColor: bgColor }}>
      <span className="card-header">{props.type}</span>
      <span className="current">{props.cur}</span>
      <span className="avg">Avg: {props.avg}</span>
    </div>
  );
};

export default DataCard;
