import { INITIAL_OPEN as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function initalOpen(state = false, action) {
    switch (action.type) {
    case ACTION_TYPES.WILL_BE_INITIAL_OPEN:
        return true;
    case ACTION_TYPES.OPENED:
        return false;
    default:
        return state;
    }
}
