import ChildWindowState from './ChildWindowState';

export const initialState = ChildWindowState.initial;

export default (state, actionType) => {
  if (
    !Object.values(ChildWindowState).indexOf(actionType) ||
    actionType === ChildWindowState.error
  )
    throw new Error('Something went wrong.');

  return actionType;
};
