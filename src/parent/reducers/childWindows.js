import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';
import childReducers from '../../child/reducers/reducers.js';

export default function childWindows(state = {}, action) {

    switch (action.type) {

    case ACTION_TYPES.CLOSE: {
        const newState = Object.assign({}, state);
        delete newState[action.windowName];
        return newState;
    }

    default: {
        const subString = action.type.substring(0, 5);

        // All child actions are prefaced with 'CHILD'; if the incoming
        // action is for the child, let the child reducers handle the action
        if (subString === 'CHILD') {
            return Object.assign({}, state, {
                [action.windowName]: childReducers(state[action.windowName], action)
            });
        }

        return state;
    }

    }
}
