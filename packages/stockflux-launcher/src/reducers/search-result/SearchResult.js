import ActionType from './Action';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false
};

export default (state, { type, results }) => {
  switch (type) {
    case ActionType.SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true
      };
    case ActionType.SUCCESS:
      return {
        ...state,
        isSearching: false,
        results
      };
    case ActionType.ERROR:
      return {
        ...state,
        hasErrors: true,
        isSearching: false
      };
    case ActionType.INITIALISE:
      return initialSearchState;
    default:
      throw new Error();
  }
};
