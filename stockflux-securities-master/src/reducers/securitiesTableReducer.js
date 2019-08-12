import { TableState } from "../enums";

export const initialTableState = {
  fetchStatus: TableState.LOADING,
  hasErrors: false,
  messages: []
};

export function securitiesTableReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, fetchStatus: TableState.LOADING, messages: [] };
    case "deleting":
      return { ...state, fetchStatus: TableState.DELETING, messages: [] };
    case "updating":
      return { ...state, fetchStatus: TableState.UPDATING, messages: [] };
    case "error":
      return {
        ...state,
        fetchStatus: null,
        hasErrors: true,
        messages: action.messages
      };
    case "success":
      return {
        ...state,
        fetchStatus: null,
        hasErrors: false,
        messages: action.messages
      };
  }
}
