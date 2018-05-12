const fetchNaps = async () => {
  const naps = await (await fetch("/api/naps")).json();
  if (naps.length > 0) {
    const timesAll = [];
    const timesToday = [];
    const temps = [];
    const humids = [];
    naps.forEach(nap => {
      const { temp, humidity, length, date } = nap.data;
      temps.push(temp);
      humids.push(humidity);
      timesAll.push(length);
      const today = new Date();
      const todayStart = Number(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
      const todayEnd = todayStart + 24 * 60 * 60 * 1000;
      if (date >= todayStart && date < todayEnd) {
        timesToday.push(length);
      }
    });

    // TODO: present nap time in hours and minutes, or just mins as appropriate
    // TODO: repeated in saveTime, refactor
    const reducer = (acc, cur) => acc + cur;
    const avgTemp = Math.round(temps.reduce(reducer) / naps.length);
    const avgHumidity = Math.round(humids.reduce(reducer) / naps.length);
    const avgNaptime = Math.round(
      timesAll.reduce(reducer) / timesAll.length / 60
    );
    const totalNaptimeToday =
      timesToday.length > 0
        ? `${Math.round(timesToday.reduce(reducer) / 60)}m`
        : "--";

    return {
      naps,
      totalNaptimeToday,
      avgNaptime,
      avgTemp,
      avgHumidity
    };
  }

  // TODO: error handling on caller
  return null;
};

export default fetchNaps;
