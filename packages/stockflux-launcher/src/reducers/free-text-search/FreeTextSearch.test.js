import reducer, { initialSearchState } from './FreeTextSearch';
import action from './Action';

describe('Action Reducer', () => {
  it('Should return inital state when given an unknown action', () => {
    expect(() => {
      reducer(initialSearchState, {});
    }).toThrow(Error);
  });

  it('Should return a valid state on SEARCHING action', () => {
    const newState = reducer({}, { type: action.SEARCHING });
    expect(newState).toEqual({
      hasErrors: false,
      isSearching: true,
      results: []
    });
  });

  it('Should return a empty list results with no payload on SUCCESS', () => {
    const newState = reducer({}, { type: action.SUCCESS });
    expect(newState).toEqual({
      isSearching: false,
      results: []
    });
  });

  it('Should return a valid state on SUCCESS action with empty list payload', () => {
    const payload = [];
    const newState = reducer({}, { type: action.SUCCESS, results: payload });
    expect(newState).toEqual({
      isSearching: false,
      results: payload
    });
  });

  it('Should return a valid state on SUCCESS action with populated list payload', () => {
    const payload = ['1', '2'];
    const newState = reducer({}, { type: action.SUCCESS, results: payload });
    expect(newState).toEqual({
      isSearching: false,
      results: payload
    });
  });

  it('Should set status to error on ERROR action', () => {
    const newState = reducer({}, { type: action.ERROR });
    expect(newState).toEqual({
      isSearching: false,
      hasErrors: true,
      results: []
    });
  });

  it('Should set to initial state on INITIALISE', () => {
    const newState = reducer({}, { type: action.INITIALISE });
    expect(newState).toEqual(initialSearchState);
  });
});
