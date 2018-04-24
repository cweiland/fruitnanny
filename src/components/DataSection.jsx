import React from "react";
import Clock from "./Clock";
import DataCards from "./DataCards";
import DataChart from "./DataChart";

const DataPane = props => (
  <div className="data-pane">
    <Clock />
    <DataCards {...props} />
    <DataChart />
  </div>
);

export default DataPane;
