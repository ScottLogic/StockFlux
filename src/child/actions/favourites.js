import { FAVOURITES as ACTION_TYPES } from '../../shared/constants/actionTypes';
import currentWindowService from '../services/currentWindowService';

export function insertFavouriteAt(index, code) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.INSERT_FAVOURITE_AT,
        index,
        code
    };
}

export function toggleFavourite(code) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.TOGGLE_FAVOURITE,
        code
    };
}

export function quandlResponse(code, name) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.QUANDL_RESPONSE,
        code,
        name
    };
}
