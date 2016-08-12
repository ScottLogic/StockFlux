import { WINDOW as ACTION_TYPES } from '../../shared/constants/actionTypes';
import configService from '../../shared/ConfigService';
import createActionCreator from '../utils/createActionCreator';
import currentWindowService from '../services/currentWindowService';

export const minimise = createActionCreator(() => ({
    type: ACTION_TYPES.MINIMIZE
}));

export const compact = createActionCreator(() => ({
    type: ACTION_TYPES.TOGGLE_COMPACT,
    state: true
}));

export const expand = createActionCreator(() => ({
    type: ACTION_TYPES.TOGGLE_COMPACT,
    state: false
}));

export const resizing = createActionCreator(() => ({
    type: ACTION_TYPES.RESIZING
}));

export const fullView = createActionCreator(() => ({
    type: ACTION_TYPES.STATE_FULL_VIEW
}));

export const maximize = createActionCreator(() => ({
    type: ACTION_TYPES.MAXIMIZE
}));

export const restore = createActionCreator(() => ({
    type: ACTION_TYPES.RESTORE
}));

export const open = createActionCreator(() => ({
    type: ACTION_TYPES.OPEN
}));

export const resizeError = createActionCreator(() => ({
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

function updateOptionsToCompact() {
    return dispatch => {
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
    return dispatch => {
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
    return dispatch => {
        dispatch(resizing());
        const [compactWindowWidth, compactWindowHeight] = configService.getCompactWindowDimensions();

        return new Promise((resolve, reject) => {
            currentWindowService.resizeTo(
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
            currentWindowService.resizeTo(
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
