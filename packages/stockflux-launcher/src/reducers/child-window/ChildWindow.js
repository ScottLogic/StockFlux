import childWindowState from './State';

export const initialChildWindowState = childWindowState.initial;

export default (state, action) => {
  let errors;

  const addError = error => (errors += error);

  if (!Object.keys(childWindowState).indexOf(action.type))
    addError(`Invalid action type: ${action.type}. `);

  if (action.type === childWindowState.error) {
    console.error(action.error);
    addError(`Error occured while dispatching action: ${action.type}. `);
  }

  if (errors) {
    throw new Error(errors);
  }

  return action.type;
};
