import * as actionType from '../actions/Security';

export const initialState = {
  name: '',
  exchange: '',
  symbol: '',
  disabled: false
};

export default (state, action) => {
  switch (action.type) {
    case actionType.SET_NAME:
      return {
        ...state,
        name: action.payload
      };
    case actionType.SET_EXCHANGE:
      return {
        ...state,
        exchange: action.payload
      };
    case actionType.SET_SYMBOL:
      return {
        ...state,
        symbol: action.payload
      };
    case actionType.SET_DISABLED:
      return {
        ...state,
        disabled: action.payload
      };
    default:
      throw new Error('Action Not Defined');
  }
};
