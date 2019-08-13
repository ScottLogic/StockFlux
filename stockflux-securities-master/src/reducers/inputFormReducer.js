import { InputFormState } from "../enums";

export function inputFormReducer(state, action) {
  switch (action.type) {
    case InputFormState.LOADING:
      return {
        ...state,
        fetchStatus: InputFormState.LOADING,
        hasErrors: false,
        messages: []
      };
    case InputFormState.SENDING:
      return {
        ...state,
        fetchStatus: InputFormState.SENDING,
        hasErrors: false,
        messages: []
      };
    case InputFormState.ERROR:
      return {
        ...state,
        fetchStatus: null,
        hasErrors: true,
        messages: action.messages
      };
    case InputFormState.SUCCESS:
      return {
        ...state,
        fetchStatus: null,
        hasErrors: false,
        messages: action.messages
      };
    default:
      throw new Error("Action Not Defined");
  }
}
