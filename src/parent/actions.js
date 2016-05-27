export const CHILD_CONNECT = 'CHILD_CONNECT';
export const CHILD_CHANGE = 'CHILD_CHANGE';

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
