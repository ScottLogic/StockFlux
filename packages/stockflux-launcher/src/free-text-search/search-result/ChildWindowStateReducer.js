import ChildWindowState from './ChildWindowState';

export const initialState = ChildWindowState.initial;

export default (state, action) => {
  console.log('action', action);
  if (
    !Object.keys(ChildWindowState).indexOf(action.type) ||
    action.type === ChildWindowState.error
  ) {
    throw new Error('Something went wrong.');
  }

  return action.type;
};
