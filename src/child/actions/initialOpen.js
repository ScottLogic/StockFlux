import { INITIAL_OPEN as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const opened = createActionCreator(() => ({
    type: ACTION_TYPES.OPENED
}));

export function willBeInitialOpen(windowName) {
    return {
        type: ACTION_TYPES.WILL_BE_INITIAL_OPEN,
        windowName
    };
}
