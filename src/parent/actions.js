
export const INITIALISE_STATE = 'INITIALISE_STATE';
export const CHILD_CONNECT = 'CHILD_CONNECT';
export const CHILD_CHANGE = 'CHILD_CHANGE';
export const CHILD_CLOSED = 'CHILD_CLOSED';

export function initialiseState() {
    return {
        type: INITIALISE_STATE
    };
}

export function childConnect(id) {
    return {
        type: CHILD_CONNECT,
        id
    };
}

export function childChange(state, id) {
    return {
        type: CHILD_CHANGE,
        state,
        id
    };
}

export function childClosed(id) {
    return {
        type: CHILD_CLOSED,
        id
    };
}
