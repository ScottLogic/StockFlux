import action from './Action';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false
};

export default (state, { type, results }) => {
  switch (type) {
    case action.searching:
      return {
        ...state,
        hasErrors: false,
        isSearching: true
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
        isSearching: false
      };
    case action.initialise:
      return initialSearchState;
    default:
      throw new Error();
  }
};
