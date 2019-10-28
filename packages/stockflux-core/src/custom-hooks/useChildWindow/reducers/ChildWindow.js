import childWindowState from './State';
import actionType from './Actions';

export const initialChildWindowState = {
  window: null,
  state: childWindowState.initial
};

export default (state, action) => {
  switch (action.type) {
    case actionType.changeState:
      if (!Object.keys(childWindowState).indexOf(action.payload))
        throw new Error(`Invalid window state: ${action.payload}.`);
      else if (action.type === childWindowState.error)
        throw new Error(
          `Error occured while window was in this state: ${action.payload}.`
        );
      return { ...state, state: action.payload };
    case actionType.setWindow:
      return { ...state, window: action.payload };
    case actionType.reset:
      return initialChildWindowState;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};
