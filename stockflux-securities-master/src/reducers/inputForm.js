import { FetchState } from "../enums";
import * as actions from "../actions/inputForm";

export function inputFormReducer(state, action) {
  switch (action.type) {
    case actions.FORM_LOADING:
      return {
        ...state,
        fetchStatus: FetchState.LOADING,
        hasErrors: false,
        messages: []
      };
    case actions.FORM_SENDING:
      return {
        ...state,
        fetchStatus: FetchState.UPDATING,
        hasErrors: false,
        messages: []
      };
    case actions.FORM_ERROR:
      return {
        ...state,
        fetchStatus: FetchState.COMPLETED,
        hasErrors: true,
        messages: action.messages
      };
    case actions.FORM_SUCCESS:
      return {
        ...state,
        fetchStatus: FetchState.COMPLETED,
        hasErrors: false,
        messages: action.messages
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
    case actions.SET_VISIBLE:
      return {
        ...state,
        security: { ...state.security, visible: action.payload }
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
      throw new Error("Action Not Defined");
  }
}
