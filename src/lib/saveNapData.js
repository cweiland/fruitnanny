const saveNapData = async (avgTemp, avgHumidity, napLength) => {
  const body = JSON.stringify({
    date: Number(new Date()),
    length: napLength,
    temp: avgTemp,
    humidity: avgHumidity
  });

  const newNap = await fetch("/api/naps", {
    body,
    headers: { "content-type": "application/json" },
    method: "POST"
  }).then(resp => resp.json());

  return newNap;
};

export default saveNapData;
