import * as React from "react";
import { shallow } from "enzyme";
import App from "../App";

describe("updateTemp()", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it("should render", () => {
    expect(wrapper).toBeTruthy();
  });
});
