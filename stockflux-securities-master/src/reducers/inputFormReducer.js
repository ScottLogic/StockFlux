import { TableState } from "../enums";

export function inputFormReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, fetchStatus: TableState.LOADING, messages: [] };
    case "sending":
      return { ...state, fetchStatus: TableState.SENDING, messages: [] };
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
