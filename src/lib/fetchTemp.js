const fetchTemp = async () => {
  const data = await (await fetch("/api/dht/current")).json();

  // DHT22 sensor may return {temperature: "Failed", humidity: "to"} if unsuccessful
  // Try again
  if (data.temperature === "Failed") {
    return fetchTemp();
  }

  // TODO: when settings page done, set temp unit accordingly
  const tempInC = data.temperature;
  const currentTemp = Math.round(tempInC * (9 / 5) + 32);
  const currentHumidity = Math.round(data.humidity);

  return {
    currentTemp,
    currentHumidity
  };
};

export default fetchTemp;
