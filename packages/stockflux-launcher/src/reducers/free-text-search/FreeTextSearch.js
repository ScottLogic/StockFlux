import actionType from './Action';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false,
  results: []
};

export default (state, { type, results = [] }) => {
  switch (type) {
    case actionType.SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true,
        results: []
      };
    case actionType.SUCCESS:
      return {
        ...state,
        isSearching: false,
        results
      };
    case actionType.ERROR:
      return {
        ...state,
        hasErrors: true,
        isSearching: false,
        results: []
      };
    case actionType.INITIALISE:
      return initialSearchState;
    default:
      throw new Error();
  }
};
