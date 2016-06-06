import { WINDOW as ACTION_TYPES } from '../constants/actionTypes.js';
import configService from '../../shared/ConfigService';

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

export function resizing() {
    return {
        type: ACTION_TYPES.RESIZING
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

export function resizeToCompact() {
    return dispatch => {
        dispatch(resizing());
        const compactWindowDimensions = configService.getCompactWindowDimensions();
        fin.desktop.Window.getCurrent().resizeTo(compactWindowDimensions[0], compactWindowDimensions[1], 'top-right', () => {
            dispatch(compact());
        });
    };
}

export function resizeToDefault() {
    return dispatch => {
        dispatch(resizing());
        const defaultWindowDimensions = configService.getDefaultWindowDimensions();
        fin.desktop.Window.getCurrent().resizeTo(defaultWindowDimensions[0], defaultWindowDimensions[1], 'top-right', () => {
            dispatch(expand());
        });
    };
}
