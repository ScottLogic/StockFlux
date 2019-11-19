import ActionType from './Action';

export const initialState = {
  isSearching: false,
  hasErrors: false,
  results: []
};

export default (state, { type, results = [] }) => {
  switch (type) {
    case ActionType.SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true,
        results: []
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
        isSearching: false,
        results: []
      };
    default:
      throw new Error();
  }
};
