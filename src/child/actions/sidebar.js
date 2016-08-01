import { SIDEBAR as ACTION_TYPES } from '../../shared/constants/actionTypes';
import currentWindowService from '../services/currentWindowService';

export function selectSearch() {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SEARCH_CLICKED
    };
}

export function selectFavourites() {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.FAV_CLICKED
    };
}
