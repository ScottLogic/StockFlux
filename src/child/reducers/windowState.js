import { WINDOW as ACTION_TYPES } from '../constants/actionTypes';

export default function windowState(state = {
    isCompact: false,
    isMaximised: false
}, action) {
    switch (action.type) {
    case ACTION_TYPES.TOGGLE_COMPACT:
        return Object.assign({}, state, {
            isCompact: action.state
        });
    case ACTION_TYPES.MAXIMIZE:
        return Object.assign({}, state, {
            isMaximised: true
        });
    case ACTION_TYPES.RESTORE:
        return Object.assign({}, state, {
            isMaximised: false
        });
    case ACTION_TYPES.CLOSE:
        fin.desktop.InterApplicationBus.publish(
            'childClosing',
            { id: window.id }
        );
        window.close();
        return state;
    default:
        return state;
    }
}
