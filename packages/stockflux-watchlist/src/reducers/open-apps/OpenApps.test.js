import reducer, { initialState } from './OpenApps';
import actions from './Action';
describe('Action Reducer', () => {
  it('Should return inital state when given an unknown action', () => {
    const newState = reducer(initialState, {});
    expect(newState).toEqual(initialState);
  });

  it('Should return inital state when given a reset action', () => {
    const newState = reducer(initialState, { type: actions.RESET });
    expect(newState).toEqual(initialState);
  });

  it('Should update news value with payload', () => {
    const newState = reducer(initialState, {
      type: actions.SET_NEWS_WINDOW,
      payload: 'Window Payload'
    });
    const expectedState = {
      news: 'Window Payload',
      chart: false
    };
    expect(newState).toEqual(expectedState);
  });

  it('Should update chart value with payload', () => {
    const newState = reducer(initialState, {
      type: actions.SET_CHART_WINDOW,
      payload: 'Window Payload'
    });
    const expectedState = {
      chart: 'Window Payload',
      news: false
    };
    expect(newState).toEqual(expectedState);
  });
});
