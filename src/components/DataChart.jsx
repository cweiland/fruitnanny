import React, { Component } from 'react';

const LineChart = require('react-chartjs').Line;

const testData = [
  {
    label: 'Temperature',
    fillColor: 'rgba(254,250,192,0.2)',
    strokeColor: 'rgba(254,250,192,1)',
    pointColor: 'rgba(254,250,192,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(254,250,192,1)',
    data: [65, 59, 80, 81, 56, 55, 40, 71, 92, 10, 65, 59, 80, 81, 56,
      65, 59, 80, 81, 56, 55, 40, 71, 92, 10, 55, 40, 71, 92, 10],
  },
  {
    label: 'Humidity',
    fillColor: 'rgba(168,198,250,0.2)',
    strokeColor: 'rgba(168,198,250,1)',
    pointColor: 'rgba(168,198,250,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(168,198,250,1)',
    data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 27, 90, 28, 48, 40,
      28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 27, 90, 28, 48, 40]
      .map(n => n + 20),
  },
  {
    label: 'Naptime',
    fillColor: 'rgba(203,232,186,0.2)',
    strokeColor: 'rgba(203,232,186,1)',
    pointColor: 'rgba(203,232,186,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(203,232,186,1)',
    data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 27, 90, 28, 48, 40,
      65, 59, 80, 81, 56, 55, 40, 71, 92, 10, 55, 40, 71, 92, 10],
  },
];

const options = {
  // /Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines: true,

  // String - Colour of the grid lines
  scaleGridLineColor: 'rgba(0,0,0,.05)',

  // Number - Width of the grid lines
  scaleGridLineWidth: 1,

  // Boolean - Whether to show horizontal lines (except X axis)
  scaleShowHorizontalLines: true,

  // Boolean - Whether to show vertical lines (except Y axis)
  scaleShowVerticalLines: true,

  // Boolean - Whether the line is curved between points
  bezierCurve: true,

  // Number - Tension of the bezier curve between points
  bezierCurveTension: 0.3,

  // Boolean - Whether to show a dot for each point
  pointDot: true,

  // Number - Radius of each point dot in pixels
  // pointDotRadius: 4,

  // Number - Pixel width of point dot stroke
  // pointDotStrokeWidth: 1,

  // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
  // pointHitDetectionRadius: 20,

  // Boolean - Whether to show a stroke for datasets
  datasetStroke: true,

  // Number - Pixel width of dataset stroke
  datasetStrokeWidth: 3,

  // Boolean - Whether to fill the dataset with a colour
  datasetFill: true,

  // String - A legend template
  // legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>">' +
  // '<%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>',
};

const setDayLabels = () => {
  const DAYS_SPAN = 14;
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  const now = +new Date();
  const start = +new Date(now - (DAYS_SPAN * DAY_IN_MS));

  const dayLabels = [];
  for (let i = 0; i <= DAYS_SPAN; i += 1) {
    const thisDate = new Date(start + (i * DAY_IN_MS));
    const dateStr = `${thisDate.getMonth() + 1}/${thisDate.getDate()}`;
    dayLabels.push(dateStr);
  }

  return dayLabels;
};

export default class DataChart extends Component {
  render() {
    const data = {
      labels: setDayLabels(),
      datasets: testData,
    };

    return (
      <div className="data-chart">
        <LineChart data={data} options={options} width="640" height="474" />
      </div>
    );
  }
}
