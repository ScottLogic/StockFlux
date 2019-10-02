import childWindowState from './State';

export const initialChildWindowState = childWindowState.initial;

export default (state, action) => {
  if (!Object.keys(childWindowState).indexOf(action.type))
    throw new Error(`Invalid action type: ${action.type}.`);
  else if (action.type === childWindowState.error) {
    console.error(action.error);
    throw new Error(`Error occured while dispatching action: ${action.type}.`);
  }
  return action.type;
};
