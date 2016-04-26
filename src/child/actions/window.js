export const TOGGLE_MAXIMISE = 'TOGGLE_MAXIMISE';
export const TOGGLE_COMPACT = 'TOGGLE_COMPACT';
export const STATE_MINIMISE = 'STATE_MINIMISE';
export const STATE_EXPANDED = 'STATE_EXPANDED';
export const STATE_CLOSE = 'STATE_CLOSE';
export const STATE_FULL_VIEW = 'STATE_FULL_VIEW';

export function minimise() {
    return {
        type: STATE_MINIMISE
    };
}

export function compact() {
    return {
        type: TOGGLE_COMPACT,
        state: true
    };
}

export function expand() {
    return {
        type: TOGGLE_COMPACT,
        state: false
    };
}

export function fullView() {
    return {
        type: STATE_FULL_VIEW
    };
}

export function maximise() {
    return {
        type: TOGGLE_MAXIMISE,
        state: true
    };
}

export function unMaximise() {
    return {
        type: TOGGLE_MAXIMISE,
        state: false
    };
}

export function close() {
    return {
        type: STATE_CLOSE
    };
}
