/* eslint-disable prefer-destructuring */
import { setDayLabels } from "../lib/chartUtils";

const getTicks = dateStr => Number(new Date(dateStr));

const resetNaps = () => [
  {
    date: getTicks("May 8 2018 8:47 AM"),
    length: 2030,
    temp: 73,
    humidity: 41
  },
  {
    date: getTicks("May 11 2018 1:17 PM"),
    length: 2908,
    temp: 78,
    humidity: 37
  },
  {
    date: getTicks("May 12 2018 3:49 PM"),
    length: 1771,
    temp: 76,
    humidity: 52
  },
  {
    date: getTicks("May 12 2018 5:31 PM"),
    length: 3026,
    temp: 81,
    humidity: 52
  }
];

describe("setDayLabels()", () => {
  let returnData;
  let naps;
  beforeEach(() => {
    naps = resetNaps();
    returnData = setDayLabels(naps);
  });

  it("should return an array with two elements", () => {
    expect(returnData.length).toBe(2);
  });

  describe("dayLabels array", () => {
    let dayLabels;
    beforeEach(() => {
      dayLabels = returnData[0];
    });

    it("should have length matching the span of days from earliest nap date until today", () => {
      const daySpan = Math.ceil(
        (Number(new Date()) - Math.min(...naps.map(nap => nap.date))) /
          (24 * 60 * 60 * 1000)
      );
      expect(dayLabels.length).toBe(daySpan);
    });

    it("should consist of strings in the correct date format", () => {
      dayLabels.forEach(day => {
        expect(day).toMatch(/\d{1,2}\/\d{1,2}/);
      });
    });
  });

  describe("dateObjs array", () => {
    let dateObjs;
    beforeEach(() => {
      dateObjs = returnData[1];
    });

    it("should have length matching that of dayLabels", () => {
      const dayLabels = returnData[0];
      expect(dateObjs.length).toBe(dayLabels.length);
    });

    it("should consist of Date objects", () => {
      dateObjs.forEach(date => {
        expect(date).toBeInstanceOf(Date);
      });
    });
  });
});
