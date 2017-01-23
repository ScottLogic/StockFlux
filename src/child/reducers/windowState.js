import { WINDOW as ACTION_TYPES } from '../../shared/constants/actionTypes';
import configService from '../../shared/ConfigService';

export default function windowState(state = {
    isCompact: false,
    isChangingView: false,
    isMaximized: false,
    isResizing: false,
    previousExpandedDimensions: configService.getDefaultWindowDimensions(),
    previousMaximizedState: false
}, action) {
    switch (action.type) {
    case ACTION_TYPES.RESIZING:
        return Object.assign({}, state, {
            isResizing: true,
            isChangingView: action.isChangingView
        });
    case ACTION_TYPES.TOGGLE_COMPACT: {
        if (action.isCompact) {
            return Object.assign({}, state, {
                isCompact: action.isCompact,
                previousMaximizedState: action.previousMaximizedState
            });
        }

        return Object.assign({}, state, {
            isCompact: action.isCompact,
        });
    }
    case ACTION_TYPES.MAXIMIZE:
        return Object.assign({}, state, {
            isMaximized: true
        });
    case ACTION_TYPES.RESTORE:
        return Object.assign({}, state, {
            isMaximized: false
        });
    case ACTION_TYPES.RESIZE_SUCCESS:
        return Object.assign({}, state, {
            isResizing: false,
            isChangingView: false,
            hasErrors: false
        });
    case ACTION_TYPES.RESIZE_ERROR:
        return Object.assign({}, state, {
            isResizing: false,
            isChangingView: false,
            hasErrors: true
        });
    case ACTION_TYPES.WINDOW_RESIZED:
        return Object.assign({}, state, {
            previousExpandedDimensions: action.previousExpandedDimensions
        });
    case ACTION_TYPES.CLOSE:
    default:
        return state;
    }
}
