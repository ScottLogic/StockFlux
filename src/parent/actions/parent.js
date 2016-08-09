import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

export function close(windowName) {
    return {
        windowName,
        type: ACTION_TYPES.CLOSE
    };
}
