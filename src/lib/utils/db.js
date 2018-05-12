/**
 * Parse naps data into returned arrays to store accumulated nap time overall,
 * total nap time today, and all temperature and humidity data during naps
 */
const parseNapsData = naps => {
  const temps = [];
  const humids = [];
  const napLengthsAll = []; // All nap lengths
  const napLengthsToday = [];

  const today = new Date();
  const todayStart = Number(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  naps.forEach(nap => {
    const { temp, humidity, length, date } = nap;
    temps.push(temp);
    humids.push(humidity);
    napLengthsAll.push(length);
    if (date >= todayStart && date < todayEnd) {
      napLengthsToday.push(length);
    }
  });

  return {
    temps,
    humids,
    napLengthsAll,
    napLengthsToday
  };
};

const calculateNapAverages = (naps, parsedNapData) => {
  // TODO: present nap time in hours and minutes, or just mins as appropriate
  // TODO: repeated in saveTime, refactor
  const { napLengthsAll, napLengthsToday, temps, humids } = parsedNapData;
  const totalNaps = naps.length;

  const reducer = (acc, cur) => acc + cur;
  const avgTemp = Math.round(temps.reduce(reducer) / totalNaps);
  const avgHumidity = Math.round(humids.reduce(reducer) / totalNaps);
  const avgNaptime = Math.round(
    napLengthsAll.reduce(reducer) / napLengthsAll.length / 60
  );

  const totalNaptimeToday =
    napLengthsToday.length > 0
      ? Math.round(napLengthsToday.reduce(reducer) / 60)
      : null;

  return {
    naps,
    totalNaptimeToday,
    avgNaptime,
    avgTemp,
    avgHumidity
  };
};

// TODO: error handling on caller
const processNaps = naps =>
  naps.length > 0 ? calculateNapAverages(naps, parseNapsData(naps)) : null;

export { parseNapsData, calculateNapAverages, processNaps };
