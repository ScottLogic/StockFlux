import { WINDOW as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function windowState(state = {
    isCompact: false,
    isMaximised: false,
    isResizing: false
}, action) {
    switch (action.type) {
    case ACTION_TYPES.RESIZING:
        return Object.assign({}, state, {
            isResizing: true
        });
    case ACTION_TYPES.TOGGLE_COMPACT:
        return Object.assign({}, state, {
            isCompact: action.state,
            isResizing: false,
            hasErrors: false
        });
    case ACTION_TYPES.MAXIMIZE:
        return Object.assign({}, state, {
            isMaximised: true
        });
    case ACTION_TYPES.RESTORE:
        return Object.assign({}, state, {
            isMaximised: false
        });
    case ACTION_TYPES.RESIZE_ERROR:
        return Object.assign({}, state, {
            isResizing: false,
            hasErrors: true
        });
    default:
        return state;
    }
}
