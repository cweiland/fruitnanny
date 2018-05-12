import React from "react";
import DataCard from "./DataCard";

const DataCards = props => (
  <div className="card-container">
    <DataCard {...props.naptime} />
    <DataCard {...props.temp} />
    <DataCard {...props.humidity} />
  </div>
);

export default DataCards;
