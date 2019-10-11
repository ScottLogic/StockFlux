import stateType from './State';
import actionType from './Action';

export const initialChildWindowState = {
  window: null,
  state: stateType.INITIAL
};

export default (state, action) => {
  switch (action.type) {
    case actionType.CHANGE_STATE:
      if (!Object.keys(stateType).includes(action.payload))
        throw new Error(`Invalid window state: ${action.payload}.`);
      else if (action.payload === stateType.ERROR)
        throw new Error(
          `Error occured while window was in this state: ${action.payload}.`
        );
      return { ...state, state: action.payload };
    case actionType.SET_WINDOW:
      return { ...state, window: action.payload };
    case actionType.RESET:
      return initialChildWindowState;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};
