import { FetchState } from '../enums';

export const initialState = {
  fetchStatus: FetchState.FETCHING,
  error: false,
  securities: []
};

export default (state, action) => {
  switch (action.type) {
    case FetchState.FETCHING:
      return {
        fetchStatus: FetchState.FETCHING,
        error: false,
        securities: []
      };
    case FetchState.UPDATING:
      return {
        ...state,
        fetchStatus: FetchState.UPDATING,
        error: true
      };
    case FetchState.ERROR:
      return {
        ...state,
        fetchStatus: FetchState.ERROR,
        error: true
      };
    case FetchState.SUCCESS:
      return {
        fetchStatus: FetchState.SUCCESS,
        error: false,
        securities: action.payload
      };
    default:
      throw new Error('Action Not Defined', action);
  }
};
