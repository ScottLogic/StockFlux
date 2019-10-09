import STATE_TYPE from './State';
import ACTION_TYPE from './Action';

export const initialChildWindowState = {
  window: null,
  state: STATE_TYPE.INITIAL
};

export default (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.CHANGE_STATE:
      if (!Object.keys(STATE_TYPE).includes(action.payload))
        throw new Error(`Invalid window state: ${action.payload}.`);
      else if (action.payload === STATE_TYPE.ERROR)
        throw new Error(
          `Error occured while window was in this state: ${action.payload}.`
        );
      return { ...state, state: action.payload };
    case ACTION_TYPE.SET_WINDOW:
      return { ...state, window: action.payload };
    case ACTION_TYPE.RESET:
      return initialChildWindowState;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};
