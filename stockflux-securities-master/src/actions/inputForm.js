export const FORM_LOADING = "FORM_LOADING";
export const FORM_SENDING = "FORM_SENDING";
export const FORM_ERROR = "FORM_ERROR";
export const FORM_SUCCESS = "FORM_SUCCESS";
export const SET_NAME = "SET_NAME";
export const SET_EXCHANGE = "SET_EXCHANGE";
export const SET_SYMBOL = "SET_SYMBOL";
export const SET_VISIBLE = "SET_VISIBLE";
export const SET_ENABLED = "SET_ENABLED";
export const SET_REDIRECT = "SET_REDIRECT";

export const formLoading = () => ({
  type: FORM_LOADING
});

export const formSending = () => ({
  type: FORM_SENDING
});

export const formError = messages => ({
  type: FORM_ERROR,
  messages
});

export const formSuccess = messages => ({
  type: FORM_SUCCESS,
  messages
});

export const setName = name => ({
  type: SET_NAME,
  payload: name
});

export const setExchange = exchange => ({
  type: SET_EXCHANGE,
  payload: exchange
});

export const setSymbol = symbol => ({
  type: SET_SYMBOL,
  payload: symbol
});

export const setVisible = visible => ({
  type: SET_VISIBLE,
  payload: visible
});

export const setEnabled = enabled => ({
  type: SET_ENABLED,
  payload: enabled
});

export const setRedirect = redirect => ({
  type: SET_REDIRECT,
  payload: redirect
});
