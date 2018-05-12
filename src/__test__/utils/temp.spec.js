import { processTemp, fetchTemp } from "../../lib/utils/temp";

let data;
beforeAll(() => {
  data = {
    temperature: 37.1,
    humidity: 40.2
  };
});

describe("fetchTemp()", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should attempt to fetch temperature data from the API", () => {
    fetch.mockResponseOnce(JSON.stringify(data));
    fetchTemp().then(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  describe("on success", () => {
    it("should return an object containing processed temp data", async () => {
      fetch.mockResponseOnce(JSON.stringify(data));
      const expected = processTemp(data);
      const result = await fetchTemp();
      expect(result).toEqual(expected);
    });
  });

  describe("on error", () => {
    it("should fail gracefully", async () => {
      fetch.mockReject(new Error("Network request failed"));
      let result;
      try {
        result = await fetchTemp();
      } catch (e) {
        expect(e).toBe("Network request failed");
        expect(result).toBeUndefined();
      }
    });

    it("should throw correct error if DHT22 sensor fails", async () => {
      const failedData = { ...data, temperature: "Failed"};
      fetch.mockResponseOnce(JSON.stringify(failedData));
      let result;
      try {
        result = await fetchTemp();
      } catch (e) {
        expect(e).toBe("DHT22 sensor failed.");
        expect(result).toBeUndefined();
      }
    });
  });
});

describe("processTemp()", () => {
  let returnData;
  beforeEach(() => {
    returnData = processTemp(data);
  });

  it("should convert rounded temperature from C to F", () => {
    expect(returnData.currentTemp).toBe(99);
  });

  it("should round the current humidity", () => {
    expect(returnData.currentHumidity).toBe(40);
  })
});
