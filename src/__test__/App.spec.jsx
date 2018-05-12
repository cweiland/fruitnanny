import * as React from "react";
import { shallow } from "enzyme";
import App from "../App";

describe("after mounting", () => {
  let component;
  let fetchNaps;
  beforeEach(() => {
    component = shallow(<App />);
    // global.fetch = jest.fn().mockImplementation(() =>
    //   Promise.resolve(
    //     new window.Response(
    //       JSON.stringify(
    //         { date: 1525190843956, length: 2030, temp: 73, humidity: 41 },
    //         { date: 1525205277543, length: 2908, temp: 78, humidity: 37 },
    //         { date: 1525616799765, length: 1771, temp: 76, humidity: 52 },
    //         { date: 1526004568734, length: 5, temp: 81, humidity: 52 }
    //       ),
    //       {
    //         status: 200,
    //         statusText: null,
    //         headers: {
    //           "Content-type": "application/json"
    //         }
    //       }
    //     )
    //   )
    // );
  });

  it("should fetch naps data from database", () => {
    // expect(global.fetch).toHaveBeenCalled();
  });
});
