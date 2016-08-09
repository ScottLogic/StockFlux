import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';
import childReducers from '../../child/reducers/reducers.js';

function parentReducer(state = {}, action) {

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
            const childState = state[action.windowName];
            let newState = {};

            if (childState) {
                newState = Object.assign({}, state, {
                    [action.windowName]: childReducers(childState, action)
                });
            } else {
                newState = Object.assign({}, state, {
                    [action.windowName]: childReducers({}, action)
                });
            }

            return newState;
        }

        return state;
    }

    }
}

export default parentReducer;
