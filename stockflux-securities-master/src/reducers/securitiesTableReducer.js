import { TableState } from "../enums";

export const initialTableState = {
  fetchStatus: TableState.LOADING,
  hasErrors: false,
  messages: []
};

export function securitiesTableReducer(state, action) {
  switch (action.type) {
    case TableState.LOADING:
      return { ...state, fetchStatus: TableState.LOADING, messages: [] };
    case TableState.DELETING:
      return { ...state, fetchStatus: TableState.DELETING, messages: [] };
    case TableState.UPDATING:
      return { ...state, fetchStatus: TableState.UPDATING, messages: [] };
    case TableState.ERROR:
      return {
        ...state,
        fetchStatus: null,
        hasErrors: true,
        messages: action.messages
      };
    case TableState.SUCCESS:
      return {
        ...state,
        fetchStatus: null,
        hasErrors: false,
        messages: action.messages
      };
  }
}
