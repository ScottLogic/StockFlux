import deepFreeze from 'deep-freeze';

function freeze(stateOrAction) {
    return stateOrAction !== undefined ? deepFreeze(stateOrAction) : stateOrAction;
}

export default (reducer) => (state, action) => reducer(freeze(state), freeze(action));
