// TODO: AS layout

import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function layout(state = {}, action) {

    switch (action.type) {
    case ACTION_TYPES.LAYOUT_UPDATED: {
        const newState = Object.assign({}, state);
        newState.layout = action.layout;
        return newState;
    }
    default:
        return state;
    }
}
