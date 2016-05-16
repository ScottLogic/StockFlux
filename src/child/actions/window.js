import { WINDOW as ACTION_TYPES } from '../constants/actionTypes.js';

export function minimise() {
    return {
        type: ACTION_TYPES.MINIMIZE
    };
}

export function compact() {
    return {
        type: ACTION_TYPES.TOGGLE_COMPACT,
        state: true
    };
}

export function expand() {
    return {
        type: ACTION_TYPES.TOGGLE_COMPACT,
        state: false
    };
}

export function fullView() {
    return {
        type: ACTION_TYPES.STATE_FULL_VIEW
    };
}

export function maximize() {
    return {
        type: ACTION_TYPES.MAXIMIZE
    };
}

export function restore() {
    return {
        type: ACTION_TYPES.RESTORE
    };
}

export function close() {
    return {
        type: ACTION_TYPES.CLOSE
    };
}
