import { WINDOW as ACTION_TYPES } from '../../shared/constants/actionTypes';
import configService from '../../shared/ConfigService';
import createActionCreator from '../utils/createActionCreator';
import currentWindowService from '../services/currentWindowService';

export const minimize = createActionCreator(() => ({
    type: ACTION_TYPES.MINIMIZE,
    analyticsEvent: {
        category: 'Window change',
        action: 'Minimised'
    }
}));

export const compact = createActionCreator((isMaximized) => ({
    type: ACTION_TYPES.TOGGLE_COMPACT,
    isCompact: true,
    previousMaximizedState: isMaximized,
    analyticsEvent: {
        category: 'Window change',
        action: 'Compact'
    }
}));

export const expand = createActionCreator(() => ({
    type: ACTION_TYPES.TOGGLE_COMPACT,
    isCompact: false,
    analyticsEvent: {
        category: 'Window change',
        action: 'Standard'
    }
}));

export const resizing = createActionCreator((isChangingView = false) => ({
    type: ACTION_TYPES.RESIZING,
    isChangingView
}));

export const maximize = createActionCreator(() => ({
    type: ACTION_TYPES.MAXIMIZE,
    analyticsEvent: {
        category: 'Window change',
        action: 'Maximised'
    }
}));

export const restore = createActionCreator(() => ({
    type: ACTION_TYPES.RESTORE
}));

export const open = createActionCreator(() => ({
    type: ACTION_TYPES.OPEN
}));

const resizeSuccess = createActionCreator(() => ({
    type: ACTION_TYPES.RESIZE_SUCCESS
}));

const resizeError = createActionCreator(() => ({
    type: ACTION_TYPES.RESIZE_ERROR
}));

const updatingOptions = createActionCreator(() => ({
    type: ACTION_TYPES.UPDATING_OPTIONS
}));

const updatingOptionsSuccess = createActionCreator(() => ({
    type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS
}));

const updatingOptionsError = createActionCreator(() => ({
    type: ACTION_TYPES.UPDATING_OPTIONS_ERROR
}));

export const windowResized = createActionCreator((dimensions) => ({
    type: ACTION_TYPES.WINDOW_RESIZED,
    previousExpandedDimensions: dimensions
}));

function getWindowStateForCurrentWindow(getState) {
    return getState().childWindows[currentWindowService.getCurrentWindowName()].windowState;
}

export function minimizeWindow() {
    return (dispatch) => {
        dispatch(resizing());
        fin.desktop.Window.getCurrent().minimize(
            () => dispatch(resizeSuccess()),
            () => dispatch(resizeError())
        );
    };
}

export function maximizeWindow() {
    return (dispatch) => {
        dispatch(resizing());
        fin.desktop.Window.getCurrent().maximize(
            () => dispatch(resizeSuccess()),
            () => dispatch(resizeError())
        );
    };
}

export function restoreWindow() {
    return (dispatch) => {
        dispatch(resizing());
        fin.desktop.Window.getCurrent().restore(
            () => dispatch(resizeSuccess()),
            () => dispatch(resizeError())
        );
    };
}

function resizeCompactSuccess() {
    return (dispatch, getState) => {
        const { isMaximized } = getWindowStateForCurrentWindow(getState);

        dispatch(resizeSuccess());
        dispatch(compact(isMaximized));
    };
}

function resizePreviousSuccess() {
    return (dispatch, getState) => {
        const { previousMaximizedState } = getWindowStateForCurrentWindow(getState);

        if (previousMaximizedState) {
            dispatch(maximizeWindow());
        } else {
            dispatch(resizeSuccess());
        }
        dispatch(expand());
    };
}

function updateOptionsToCompact() {
    return (dispatch) => {
        dispatch(updatingOptions());
        const [minWidth, minHeight] = configService.getCompactWindowDimensions();

        return new Promise((resolve, reject) => {
            currentWindowService.updateOptions({
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
    return (dispatch) => {
        dispatch(updatingOptions());
        const [minWidth, minHeight] = configService.getDefaultWindowMinDimensions();

        return new Promise((resolve, reject) => {
            currentWindowService.updateOptions({
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
    return (dispatch) => {
        dispatch(resizing(true));
        const [compactWindowWidth, compactWindowHeight] = configService.getCompactWindowDimensions();

        return new Promise((resolve, reject) => {
            currentWindowService.resizeTo(
                compactWindowWidth,
                compactWindowHeight,
                'top-right',
                () => resolve(dispatch(resizeCompactSuccess())),
                () => reject(dispatch(resizeError()))
            );
        });
    };
}

function resizePrevious() {
    return (dispatch, getState) => {
        dispatch(resizing(true));
        const [previousWindowWidth, previousWindowHeight] = getWindowStateForCurrentWindow(getState).previousExpandedDimensions;

        return new Promise((resolve, reject) => {
            currentWindowService.resizeTo(
                previousWindowWidth,
                previousWindowHeight,
                'top-right',
                () => resolve(dispatch(resizePreviousSuccess())),
                () => reject(dispatch(resizeError()))
            );
        });
    };
}

export function resizeToCompact() {
    return (dispatch) => Promise.all([
        dispatch(updateOptionsToCompact()),
        dispatch(resizeCompact())
    ]);
}

export function resizeToPrevious() {
    return (dispatch) => Promise.all([
        dispatch(updateOptionsToDefault()),
        dispatch(resizePrevious())
    ]);
}
