
import ACTION_TYPES from './actionTypes.js';

export function initialiseState() {
    return {
        type: ACTION_TYPES.INITIALISE_STATE
    };
}

export function childConnect(id) {
    return {
        type: ACTION_TYPES.CHILD_CONNECT,
        id
    };
}

export function childChange(state, id) {
    return {
        type: ACTION_TYPES.CHILD_CHANGE,
        state,
        id
    };
}

export function childClosed(id) {
    return {
        type: ACTION_TYPES.CHILD_CLOSED,
        id
    };
}
