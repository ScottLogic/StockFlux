import ACTION_TYPES from '../constants/actionTypes.js';
import childReducers from '../../child/reducers/reducers.js';

import $ from 'jquery';

function parentReducer(state = {}, action) {

    switch (action.type) {

    case ACTION_TYPES.CLOSE: {
        const newState = Object.assign({}, state);
        delete newState[action.windowName];
        return newState;
    }

    case ACTION_TYPES.DRAG_START: {
        return Object.assign({}, state, {
            draggedFav: {
                code: action.code,
                windowName: action.windowName
            }
        });
    }

    case ACTION_TYPES.DRAG_END: {
        const newState = $.extend(true, {}, state);

        if (action.windowName !== newState.draggedFav.windowName) {
            const originWindowName = newState.draggedFav.windowName;
            const movedStockCode = newState.draggedFav.code;
            const movedStockName = newState[originWindowName].favourites.names[movedStockCode];

            // Remove the code and name from the origin window's favourites
            delete newState[originWindowName].favourites.names[movedStockCode];
            const codeIndex = newState[originWindowName].favourites.codes.indexOf(movedStockCode);
            newState[originWindowName].favourites.codes.splice(codeIndex, 1);

            // If it was the selected favourite, select another if available
            // deselect if none available
            if (newState[originWindowName].favourites.codes.length) {
                const newStockCode = newState[originWindowName].favourites.codes[0];
                newState[originWindowName].selection.code = newStockCode;
                newState[originWindowName].selection.name = newState[originWindowName].favourites.names[newStockCode];
            } else {
                delete newState[originWindowName].selection.code;
                delete newState[originWindowName].selection.name;
            }

            // If the new window doesn't have selection, select this new favourite
            if (!newState[action.windowName].selection.code) {
                newState[action.windowName].selection.code = movedStockCode;
                newState[action.windowName].selection.name = movedStockName;
            }
        }

        // Always remove the dragged favourite
        delete newState.draggedFav;

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
