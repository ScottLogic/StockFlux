import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function dragOut(state = {}, action) {
    switch (action.type) {
    case ACTION_TYPES.DRAG_OUT: {
        const newState = Object.assign({}, state);
        newState[action.windowName] = {
            code: action.code,
            name: action.name
        };
        return newState;
    }
    case ACTION_TYPES.DRAG_ACCEPT: {
        const newState = Object.assign({}, state);
        delete newState[action.windowName];
        return newState;
    }
    default:
        return state;
    }
}
