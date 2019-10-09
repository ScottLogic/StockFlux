import ACTION_TYPE from './Action';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false,
  results: []
};

export default (state, { type, results }) => {
  switch (type) {
    case ACTION_TYPE.SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true,
        results: []
      };
    case ACTION_TYPE.SUCCESS:
      return {
        ...state,
        isSearching: false,
        results
      };
    case ACTION_TYPE.ERROR:
      return {
        ...state,
        hasErrors: true,
        isSearching: false,
        results: []
      };
    case ACTION_TYPE.INITIALISE:
      return initialSearchState;
    default:
      throw new Error();
  }
};
