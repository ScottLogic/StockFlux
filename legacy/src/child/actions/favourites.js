import { FAVOURITES as ACTION_TYPES } from '../../shared/constants/actionTypes';
import { selectStock, unselectStock } from './selection';
import createActionCreator from '../utils/createActionCreator';
import currentWindowService from '../services/currentWindowService';

export const insertFavouriteAt = createActionCreator((index, code) => ({
    type: ACTION_TYPES.INSERT_FAVOURITE_AT,
    index,
    code
}));

export const quandlResponse = createActionCreator((code, name) => ({
    type: ACTION_TYPES.QUANDL_RESPONSE,
    code,
    name
}));

export function toggleFavouriteInWindow(code, windowName) {
    return {
        type: ACTION_TYPES.TOGGLE_FAVOURITE,
        windowName,
        code,
        analyticsEvent: {
            category: 'Toggle Favourite',
            action: code
        }
    };
}

export function toggleFavourite(code, windowName = currentWindowService.getCurrentWindowName()) {
    return (dispatch, getState) => {
        const { favourites, selection } = getState().childWindows[windowName];

        dispatch(toggleFavouriteInWindow(code, windowName));

        const isSelected = selection.code === code;
        const isFavourite = favourites.codes.some((favourite) => favourite === code);
        if (isSelected && isFavourite) {
            if (favourites.codes.length > 1) {
                const newSelectedCode = favourites.codes.find((favourite) => favourite !== code);
                dispatch(selectStock(newSelectedCode, favourites.names[newSelectedCode], windowName));
            } else {
                dispatch(unselectStock(windowName));
            }
        }
    };
}

export function moveFavouriteFromWindow(code, dragStartWindow) {
    return (dispatch, getState) => {
        const dragStartWindowFavouritesCount = getState().childWindows[dragStartWindow].favourites.codes.length;
        dispatch(toggleFavourite(code, dragStartWindow));
        if (dragStartWindowFavouritesCount <= 1) {
            const application = fin.desktop.Application.getCurrent();
            application.getChildWindows((children) => {
                children.find((childWindow) => childWindow.name === dragStartWindow).close();
            });
        }

        dispatch(toggleFavourite(code));
    };
}
