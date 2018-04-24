import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import SleepTimer from './SleepTimer';


describe('calcTime()', () => {
  let wrapper;
  let calcTime;
  let now;
  beforeEach(() => {
    wrapper = shallow(<SleepTimer />);
    calcTime = wrapper.instance().calcTime;
    now = +new Date();
  });

  it('should return "01:00:00" when an hour has elapsed', () => {
    expect(calcTime(+new Date() - (1000 * 60 * 60))).toBe('01:00:00');
  });

  it('should return "00:01:00" when a minute has elapsed', () => {
    expect(calcTime(now - (1000 * 60))).toBe('00:01:00');
  });

  it('should return "00:00:01" when a second has elapsed', () => {
    expect(calcTime(now - 1000)).toBe('00:00:01');
  });

  it('should return "00:00:31" when 31 seconds have elapsed', () => {
    expect(calcTime(now - (31 * 1000))).toBe('00:00:31');
  });

  it('should return "01:59:59" when an hour, 59 minutes, and 59 seconds have elasped', () => {
    const elapsed = (1000 * 60 * 60) + (59 * 60 * 1000) + (59 * 1000);
    expect(calcTime(now - elapsed)).toBe('01:59:59');
  });
});
