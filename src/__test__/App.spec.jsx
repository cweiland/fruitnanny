import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";
import { shallow } from "enzyme";
import App from "../App";

describe("App", () => {
  it("should render without crashing", () => {
    shallow(<App />);
  });
});
