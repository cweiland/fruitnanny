const setData = (naps, dateObjs) => {
  const temps = [];
  const humids = [];
  const lengths = [];

  const dateFilter = date =>
    naps.filter(nap => {
      const napDate = new Date(date);
      const lo = Number(
        new Date(napDate.getFullYear(), napDate.getMonth(), napDate.getDate())
      );
      const hi = Number(new Date(lo + 24 * 60 * 60 * 1000 - 1));
      return nap.data.date >= lo && nap.data.date < hi;
    });

  if (naps.length > 0) {
    dateObjs.forEach(date => {
      const napsOnDate = dateFilter(date);
      const dayTemps = [];
      const dayHumids = [];
      const dayLengths = [];

      napsOnDate.forEach(nap => {
        dayTemps.push(nap.data.temp);
        dayHumids.push(nap.data.humidity);
        dayLengths.push(nap.data.length / 60);
      });

      lengths.push(
        dayLengths.length > 0
          ? Math.round(dayLengths.reduce((acc, cur) => acc + cur))
          : null
      );

      humids.push(
        dayHumids.length > 0
          ? Math.round(
              dayHumids.reduce((acc, cur) => acc + cur) / napsOnDate.length
            )
          : null
      );

      temps.push(
        dayTemps.length > 0
          ? Math.round(
              dayTemps.reduce((acc, cur) => acc + cur) / napsOnDate.length
            )
          : null
      );
    });
  }

  const data = [
    {
      label: "Avg Temp",
      fillColor: "rgba(254,250,192,0.2)",
      strokeColor: "rgba(254,250,192,1)",
      pointColor: "rgba(254,250,192,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(254,250,192,1)",
      data: temps
    },
    {
      label: "Avg Humidity",
      fillColor: "rgba(168,198,250,0.2)",
      strokeColor: "rgba(168,198,250,1)",
      pointColor: "rgba(168,198,250,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(168,198,250,1)",
      data: humids
    },
    {
      label: "Total Naptime (mins)",
      fillColor: "rgba(203,232,186,0.2)",
      strokeColor: "rgba(203,232,186,1)",
      pointColor: "rgba(203,232,186,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(203,232,186,1)",
      data: lengths
    }
  ];

  return data;
};

const setDayLabels = naps => {
  const dates = naps.map(nap => nap.data.date);
  const earliestDate = dates[0];
  const latestDate = Number(new Date());
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const DAYS_SPAN = Math.ceil((latestDate - earliestDate) / DAY_IN_MS);
  const dayLabels = [];
  const dateObjs = []; // A date object for each day in day span

  for (let i = 0; i <= DAYS_SPAN; i += 1) {
    const thisDate = new Date(earliestDate + i * DAY_IN_MS);
    const dateStr = `${thisDate.getMonth() + 1}/${thisDate.getDate()}`;
    dateObjs.push(thisDate);
    dayLabels.push(dateStr);
  }

  return [dayLabels, dateObjs];
};

export { setData, setDayLabels };
