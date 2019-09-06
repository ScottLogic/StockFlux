export const FETCHING = 'FETCHING';
export const UPDATING = 'UPDATING';
export const ERROR = 'ERROR';
export const SUCCESS = 'SUCCESS';
export const SET_NAME = 'SET_NAME';
export const SET_EXCHANGE = 'SET_EXCHANGE';
export const SET_SYMBOL = 'SET_SYMBOL';
export const SET_DISABLED = 'SET_DISABLED';
export const SET_REDIRECT = 'SET_REDIRECT';

export const fetching = () => ({
  type: FETCHING
});

export const updating = () => ({
  type: UPDATING
});

export const error = messages => ({
  type: ERROR,
  messages
});

export const success = messages => ({
  type: SUCCESS,
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

export const setDisabled = disabled => ({
  type: SET_DISABLED,
  payload: disabled
});

export const setRedirect = redirect => ({
  type: SET_REDIRECT,
  payload: redirect
});
