import { FetchState } from '../enums';
import * as actions from '../actions/inputForm';

export const initialState = {
  fetchStatus: FetchState.FETCHING,
  error: false,
  securities: []
};

export function inputFormReducer(state, action) {
  switch (action.type) {
    case actions.FETCHING:
      return {
        ...state,
        fetchStatus: FetchState.FETCHING,
        error: false
      };
    case actions.UPDATING:
      return {
        ...state,
        fetchStatus: FetchState.UPDATING,
        error: false
      };
    case actions.ERROR:
      return {
        ...state,
        fetchStatus: FetchState.ERROR,
        error: true
      };
    case actions.SUCCESS:
      return {
        ...state,
        fetchStatus: FetchState.SUCCESS,
        error: false
      };
    case actions.SET_NAME:
      return {
        ...state,
        security: { ...state.security, name: action.payload }
      };
    case actions.SET_EXCHANGE:
      return {
        ...state,
        security: { ...state.security, exchange: action.payload }
      };
    case actions.SET_SYMBOL:
      return {
        ...state,
        security: { ...state.security, symbol: action.payload }
      };
    case actions.SET_ENABLED:
      return {
        ...state,
        security: { ...state.security, enabled: action.payload }
      };
    case actions.SET_REDIRECT:
      return {
        ...state,
        redirect: action.payload
      };

    default:
      throw new Error('Action Not Defined');
  }
}
