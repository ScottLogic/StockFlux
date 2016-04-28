export const MINIMIZE = 'MINIMIZE';
export const MAXIMIZE = 'MAXIMIZE';
export const RESTORE = 'RESTORE';
export const CLOSE = 'CLOSE';
export const TOGGLE_COMPACT = 'TOGGLE_COMPACT';
export const STATE_EXPANDED = 'STATE_EXPANDED';
export const STATE_FULL_VIEW = 'STATE_FULL_VIEW';

export function minimise() {
    return {
        type: MINIMIZE
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

export function maximize() {
    return {
        type: MAXIMIZE
    };
}

export function restore() {
    return {
        type: RESTORE
    };
}

export function close() {
    return {
        type: CLOSE
    };
}
