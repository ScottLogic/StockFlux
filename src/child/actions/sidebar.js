import { SIDEBAR as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';
import configService from '../../shared/ConfigService';

export const selectSearch = createActionCreator(() => ({
    type: ACTION_TYPES.SEARCH_CLICKED,
    analyticsEvent: {
        category: 'Show',
        action: 'Search'
    }
}));

export const selectFavourites = createActionCreator(() => ({
    type: ACTION_TYPES.FAV_CLICKED,
    analyticsEvent: {
        category: 'Show',
        action: 'Favourites'
    }
}));

const windowReopened = createActionCreator((reopenWindowName) => ({
    type: ACTION_TYPES.REOPEN_WINDOW,
    reopenWindowName
}));

const openWindowError = createActionCreator(() => ({
    type: ACTION_TYPES.OPEN_WINDOW_ERROR
}));

export function reopenWindow(windowName) {
    return dispatch => {
        const childWindow = new fin.desktop.Window(
            configService.getWindowConfig(windowName),
            () => childWindow.show(
                false,
                () => dispatch(windowReopened(windowName)),
                () => dispatch(openWindowError())
            ),
            () => dispatch(openWindowError())
        );
    };
}
