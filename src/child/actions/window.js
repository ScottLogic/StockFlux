import { WINDOW as ACTION_TYPES } from '../constants/actionTypes.js';
import configService from '../../shared/ConfigService';
import currentWindowService from '../services/currentWindowService';

export function minimise() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.MINIMIZE
    };
}

export function compact() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.TOGGLE_COMPACT,
        state: true
    };
}

export function expand() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.TOGGLE_COMPACT,
        state: false
    };
}

export function resizing() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.RESIZING
    };
}

export function fullView() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.STATE_FULL_VIEW
    };
}

export function maximize() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.MAXIMIZE
    };
}

export function restore() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.RESTORE
    };
}

export function open() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.OPEN
    };
}

export function close() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.CLOSE
    };
}

export function resizeError() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.RESIZE_ERROR
    };
}

function updatingOptions() {
    return {
        type: ACTION_TYPES.UPDATING_OPTIONS
    };
}

function updatingOptionsSuccess() {
    return {
        type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS
    };
}

function updatingOptionsError() {
    return {
        type: ACTION_TYPES.UPDATING_OPTIONS_ERROR
    };
}

function updateOptionsToCompact() {
    return dispatch => {
        dispatch(updatingOptions());
        const [minWidth, minHeight] = configService.getCompactWindowDimensions();

        return new Promise((resolve, reject) => {
            fin.desktop.Window.getCurrent().updateOptions({
                resizable: false,
                maximizable: false,
                minWidth,
                minHeight
            },
            () => resolve(dispatch(updatingOptionsSuccess())),
            () => reject(dispatch(updatingOptionsError())));
        });
    };
}

function updateOptionsToDefault() {
    return dispatch => {
        dispatch(updatingOptions());
        const [minWidth, minHeight] = configService.getDefaultWindowMinDimensions();

        return new Promise((resolve, reject) => {
            fin.desktop.Window.getCurrent().updateOptions({
                resizable: true,
                maximizable: true,
                minWidth,
                minHeight
            },
            () => resolve(dispatch(updatingOptionsSuccess())),
            () => reject(dispatch(updatingOptionsError())));
        });
    };
}

function resizeCompact() {
    return dispatch => {
        dispatch(resizing());
        const [compactWindowWidth, compactWindowHeight] = configService.getCompactWindowDimensions();

        return new Promise((resolve, reject) => {
            fin.desktop.Window.getCurrent().resizeTo(
                compactWindowWidth,
                compactWindowHeight,
                'top-right',
                () => resolve(dispatch(compact())),
                () => reject(dispatch(resizeError()))
            );
        });
    };
}

function resizeDefault() {
    return dispatch => {
        dispatch(resizing());
        const [defaultWindowWidth, defaultWindowHeight] = configService.getDefaultWindowDimensions();

        return new Promise((resolve, reject) => {
            fin.desktop.Window.getCurrent().resizeTo(
                defaultWindowWidth,
                defaultWindowHeight,
                'top-right',
                () => resolve(dispatch(expand())),
                () => reject(dispatch(resizeError()))
            );
        });
    };
}

export function resizeToCompact() {
    return dispatch => Promise.all([
        dispatch(updateOptionsToCompact()),
        dispatch(resizeCompact())
    ]);
}

export function resizeToDefault() {
    return dispatch => Promise.all([
        dispatch(updateOptionsToDefault()),
        dispatch(resizeDefault())
    ]);
}
