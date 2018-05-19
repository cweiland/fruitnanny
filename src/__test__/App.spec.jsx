import * as React from "react";
import { shallow } from "enzyme";
import App from "../App";

let data;
beforeAll(() => {
  data = {
    temperature: 37.1,
    humidity: 40.2
  };
});

describe("updateTemp()", () => {
  // let wrapper;
  // let instance;
  beforeEach(() => {
    fetch.resetMocks();
    // wrapper = shallow(<App />);
    // instance = wrapper.instance();
  });

  it("should recursively call itself if DHT22 sensor fails", () => {
    fetch
      .once(JSON.stringify({ ...data, temperature: "Failed" }))
      .once(JSON.stringify({ ...data, temperature: "Failed" }))
      .once(JSON.stringify(data));
    const app = new App();
    const spy = jest.spyOn(app, "updateTemp");
    app.setState = jest.fn();
    app.updateTemp();
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(3);
    }, 100);
  });
});
