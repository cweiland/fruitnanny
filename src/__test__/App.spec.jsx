import * as React from "react";
import { shallow } from "enzyme";
import App from "../App";

describe("after mounting", () => {
  let component;
  let fetchNaps;
  beforeEach(() => {
    component = shallow(<App />);
  });

  it("should fetch naps data from database", () => {
    // expect(global.fetch).toHaveBeenCalled();
  });
});
