import { InputFormState } from "../enums";

export function inputFormReducer(state, action) {
  switch (action.type) {
    case InputFormState.LOADING:
      return { ...state, fetchStatus: InputFormState.LOADING, messages: [] };
    case InputFormState.LOADING:
      return { ...state, fetchStatus: InputFormState.SENDING, messages: [] };
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
  }
}
