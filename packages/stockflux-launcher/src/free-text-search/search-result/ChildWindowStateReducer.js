import ChildWindowState from './ChildWindowState';

export const initialState = ChildWindowState.initial;

export default (state, action) => {
  console.log('action', action);
  if (
    !Object.values(ChildWindowState).indexOf(action.type) ||
    action.type === ChildWindowState.error
  ) {
    // throw new Error('Something went wrong.');
    console.error(action.error);
  }

  return action.type;
};
