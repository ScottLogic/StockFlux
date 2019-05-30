export const SEARCHING = 'searching';
export const SUCCESS = 'success';
export const ERROR = 'error';
export const INITIALISE = 'initialise';

export const initialSearchState = {
  isSearching: false,
  hasErrors: false
};

export const searchReducer = (state, { type, results }) => {
  switch (type) {
    case SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true
      };
    case SUCCESS:
      return {
        ...state,
        isSearching: false,
        results
      };
    case ERROR:
      return {
        ...state,
        hasErrors: true,
        isSearching: false
      };
    case INITIALISE:
      return initialSearchState;
    default:
      throw new Error();
  }
};
