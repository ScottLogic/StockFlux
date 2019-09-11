export const SET_NAME = 'SET_NAME';
export const SET_EXCHANGE = 'SET_EXCHANGE';
export const SET_SYMBOL = 'SET_SYMBOL';
export const SET_DISABLED = 'SET_DISABLED';

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
