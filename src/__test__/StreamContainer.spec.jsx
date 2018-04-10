import * as React from "react";
import { shallow, mount } from "enzyme";
import { WebSocket } from "mock-socket";
import StreamContainer from "../components/StreamContainer";

describe("StreamContainer", () => {
  beforeEach(() => {
    global.WebSocket = WebSocket;
  });

  describe("instantiation", () => {
    let component;
    beforeEach(() => {
      component = shallow(<StreamContainer />);
    });

    it("should set state.isStreaming to false", () => {
      expect(component.state().isStreaming).toBe(false);
    });

    it("should set janus session vars to null", () => {
      expect(component.instance().janus).toEqual({
        session: null,
        streamHandle: null
      });
    });
  });

  describe("createSession method", () => {
    let spy;
    let component;
    beforeEach(() => {
      spy = jest.spyOn(StreamContainer.prototype, "createSession");
      component = mount(<StreamContainer />);
    });

    afterEach(() => {
      spy.mockClear();
    });

    it("should be called after mounting", () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
