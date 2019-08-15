import { TableState } from "../enums";
import * as actions from "../actions/securitiesTableActions";

export const initialTableState = {
  fetchStatus: TableState.LOADING,
  hasErrors: false,
  messages: [],
  securitiesData: []
};

export function securitiesTableReducer(state, action) {
  switch (action.type) {
    case actions.TABLE_LOADING:
      return {
        ...state,
        fetchStatus: TableState.LOADING,
        hasErrors: false,
        messages: []
      };
    case actions.TABLE_UPDATING:
      return {
        ...state,
        fetchStatus: TableState.UPDATING,
        hasErrors: false,
        messages: []
      };
    case actions.TABLE_ERROR:
      return {
        ...state,
        fetchStatus: TableState.COMPLETED,
        hasErrors: true,
        messages: action.messages
      };
    case actions.TABLE_SUCCESS:
      return {
        ...state,
        fetchStatus: TableState.COMPLETED,
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
