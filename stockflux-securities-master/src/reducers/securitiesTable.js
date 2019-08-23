import { FetchState } from "../enums";
import * as actions from "../actions/securitiesTable";

export const initialTableState = {
  fetchStatus: FetchState.LOADING,
  hasErrors: false,
  messages: [],
  securitiesData: []
};

export function securitiesTableReducer(state, action) {
  switch (action.type) {
    case actions.TABLE_LOADING:
      return {
        ...state,
        fetchStatus: FetchState.LOADING,
        hasErrors: false,
        messages: []
      };
    case actions.TABLE_UPDATING:
      return {
        ...state,
        fetchStatus: FetchState.UPDATING,
        hasErrors: false,
        messages: []
      };
    case actions.TABLE_ERROR:
      return {
        ...state,
        fetchStatus: FetchState.COMPLETED,
        hasErrors: true,
        messages: action.messages
      };
    case actions.TABLE_SUCCESS:
      return {
        ...state,
        fetchStatus: FetchState.COMPLETED,
        hasErrors: false,
        messages: action.messages
      };
    case actions.SET_SECURITIES_DATA:
      return {
        ...state,
        securitiesData: action.payload
      };

    default:
      throw new Error("Action Not Defined");
  }
}
