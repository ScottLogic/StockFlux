import childWindowState from './State';

export const initialChildWindowState = childWindowState.initial;

export default (state, action) => {
  let errors;

  if (!Object.keys(childWindowState).indexOf(action.type))
    errors = addError(errors, `Invalid action type: ${action.type}. `);

  if (action.type === childWindowState.error)
    errors = addError(
      errors,
      `Error occured while dispatching action: ${action.type}. `
    );

  if (errors) {
    throw new Error('Something went wrong.');
  }

  return action.type;
};

const addError = (errors, error) => errors + error;
