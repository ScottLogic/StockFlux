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

function toggleFavouriteInWindow(code, windowName) {
    return {
        type: ACTION_TYPES.TOGGLE_FAVOURITE,
        windowName,
        code
    };
}

export function toggleFavourite(code, windowName) {
    return (dispatch, getState) => {
        const windowToToggleFavouriteIn = windowName || currentWindowService.getCurrentWindowName();
        const { favourites, selection } = getState().childWindows[windowToToggleFavouriteIn];

        dispatch(toggleFavouriteInWindow(code, windowToToggleFavouriteIn));

        const isFavourite = favourites.codes.some(favourite => favourite === code);
        if (selection.code === code && isFavourite) {
            if (favourites.codes.length) {
                const newSelectedCode = favourites.codes.find(favourite => favourite !== code);
                dispatch(selectStock(newSelectedCode, favourites.names[newSelectedCode]));
            } else {
                dispatch(unselectStock());
            }
        }
    };
}

export function moveFavouriteFromWindow(code, dragStartWindow) {
    return (dispatch, getState) => {
        if (getState().childWindows[dragStartWindow].favourites.codes.length > 1) {
            dispatch(toggleFavourite(code, dragStartWindow));
        } else {
            const application = fin.desktop.Application.getCurrent();
            application.getChildWindows(children => {
                children.find(childWindow => childWindow.name === dragStartWindow).close();
            });
        }

        dispatch(toggleFavourite(code));
    };
}
