import action from './Action';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false,
  results: []
};

export default (state, { type, results }) => {
  switch (type) {
    case action.searching:
      return {
        ...state,
        hasErrors: false,
        isSearching: true,
        results: []
      };
    case action.success:
      return {
        ...state,
        isSearching: false,
        results
      };
    case action.error:
      return {
        ...state,
        hasErrors: true,
        isSearching: false,
        results: []
      };
    case action.initialise:
      return initialSearchState;
    default:
      throw new Error();
  }
};
