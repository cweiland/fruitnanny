import {
  calculateNapAverages,
  parseNapsData,
  processNaps,
  fetchNaps
} from "../../lib/utils/db";

const DAY = 24 * 60 * 60 * 1000;
const DATE = new Date();
const TODAY = Number(DATE);

let naps;
beforeAll(() => {
  naps = [
    { date: TODAY - 1 * DAY, length: 2030, temp: 73, humidity: 41 },
    { date: TODAY - 1 * DAY, length: 2908, temp: 78, humidity: 37 },
    { date: TODAY, length: 1771, temp: 76, humidity: 52 },
    { date: TODAY, length: 3026, temp: 81, humidity: 52 }
  ];
});

describe("fetchNaps()", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should attempt to fetch data from API", () => {
    fetch.mockResponseOnce(JSON.stringify(naps));
    fetchNaps().then(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  describe("on success", () => {
    it("should return an object containing processed naps data", async () => {
      fetch.mockResponseOnce(JSON.stringify(naps));
      const expected = processNaps(naps);
      const result = await fetchNaps();
      expect(result).toEqual(expected);
    });
  });

  describe("on error", () => {
    it("should fail gracefully", async () => {
      fetch.mockReject(new Error("Network request failed"));
      let result;
      try {
        result = await fetchNaps();
      } catch (e) {
        expect(e).toBe("Network request failed");
        expect(result).toBeUndefined();
      }
    });
  });
});

describe("parseNapsData()", () => {
  let returnData;
  beforeEach(() => {
    returnData = parseNapsData(naps);
  });

  it("should return an 'object'", () => {
    expect(typeof returnData).toBe("object");
  });

  describe("temps property", () => {
    it("should be an array", () => {
      expect(typeof returnData.temps).toBe("object");
      expect(returnData.temps.length).toBeDefined();
    });

    it("should contain each temp in naps array", () => {
      const expected = naps.map(nap => nap.temp);
      expect(returnData.temps).toEqual(expected);
    });
  });

  describe("humids property", () => {
    it("should be an array", () => {
      expect(typeof returnData.temps).toBe("object");
      expect(returnData.humids.length).toBeDefined();
    });

    it("should contain each humidity in naps array", () => {
      const expected = naps.map(nap => nap.humidity);
      expect(returnData.humids).toEqual(expected);
    });
  });

  describe("napLengthsAll property", () => {
    it("should be an array", () => {
      expect(typeof returnData.napLengthsAll).toBe("object");
      expect(returnData.napLengthsAll.length).toBeDefined();
    });

    it("should contain each length in naps array", () => {
      const expected = naps.map(nap => nap.length);
      expect(returnData.napLengthsAll).toEqual(expected);
    });
  });

  describe("napLengthsToday property", () => {
    it("should be an array", () => {
      expect(typeof returnData.napLengthsToday).toBe("object");
      expect(returnData.napLengthsToday.length).toBeDefined();
    });

    it("should contain each of today's lengths in naps array", () => {
      const today = DATE.getDate();
      const expected = naps
        .filter(nap => new Date(nap.date).getDate() === today)
        .map(nap => nap.length);
      expect(returnData.napLengthsToday).toEqual(expected);
    });
  });
});

describe("calculateNapAverages()", () => {
  let parsedNapsData;
  let returnData;
  beforeEach(() => {
    parsedNapsData = parseNapsData(naps);
    returnData = calculateNapAverages(naps, parsedNapsData);
  });

  it("should return an 'object'", () => {
    expect(typeof returnData).toBe("object");
  });

  describe("naps property", () => {
    it("should equal naps argument sent into function (to be passed to component)", () => {
      expect(returnData.naps).toEqual(naps);
    });
  });

  describe("totalNaptimeToday property", () => {
    it("should store the sum of today's naps", () => {
      const today = DATE.getDate();
      const totalInSecs = naps
        .filter(nap => new Date(nap.date).getDate() === today)
        .map(nap => nap.length)
        .reduce((acc, cur) => acc + cur);
      const expected = Math.round(totalInSecs / 60);
      expect(returnData.totalNaptimeToday).toEqual(expected);
    });

    it("should be null when there are no naps today", () => {
      const today = DATE.getDate();
      const napsNotToday = naps.filter(
        nap => new Date(nap.date).getDate() !== today
      );
      returnData = calculateNapAverages(
        napsNotToday,
        parseNapsData(napsNotToday)
      );
      expect(returnData.totalNaptimeToday).toBeNull();
    });
  });

  describe("avgNaptime property", () => {
    it("should store the average length (in minutes) of all naps", () => {
      const totalInSecs = naps
        .map(nap => nap.length)
        .reduce((acc, cur) => acc + cur);
      const expected = Math.round(totalInSecs / naps.length / 60);
      expect(returnData.avgNaptime).toEqual(expected);
    });
  });

  describe("avgTemp property", () => {
    it("should store the average temperature over all naps", () => {
      const sum = naps.map(nap => nap.temp).reduce((acc, cur) => acc + cur);
      const expected = Math.round(sum / naps.length);
      expect(returnData.avgTemp).toEqual(expected);
    });
  });

  describe("avgHumidity property", () => {
    it("should store the average humidity over all naps", () => {
      const sum = naps.map(nap => nap.humidity).reduce((acc, cur) => acc + cur);
      const expected = Math.round(sum / naps.length);
      expect(returnData.avgHumidity).toEqual(expected);
    });
  });
});

describe("processNaps()", () => {
  // let returnData;
  // beforeEach(() => {
  //   spy = jest.fn(parseNapsData);
  //   returnData = processNaps(naps, spy(naps));
  // });

  it("should return output of calculateNapAverages when naps.length is greater than zero", () => {
    const returnData = processNaps(naps);
    const expected = calculateNapAverages(naps, parseNapsData(naps));
    expect(returnData).toEqual(expected);
  });

  it("should return null when the naps.length is not greater than zero", () => {
    const returnData = processNaps([]);
    expect(returnData).toBeNull();
  });
});
