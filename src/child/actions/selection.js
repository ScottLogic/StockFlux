import { SELECTION as ACTION_TYPES } from '../../shared/constants/actionTypes';
import currentWindowService from '../services/currentWindowService';

export function selectStock(code, name) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SELECTION,
        code,
        name
    };
}

export function unselectStock() {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.UNSELECT
    };
}
