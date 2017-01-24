import { FAVOURITES as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function favourites(state = { codes: [], names: {} }, action) {
    let newState;
    let codes;
    let index;
    let currentIndex;

    switch (action.type) {
    case ACTION_TYPES.TOGGLE_FAVOURITE:
        index = state.codes.indexOf(action.code);
        newState = Object.assign({}, state, {
            codes: [...state.codes],
            names: Object.assign({}, state.names)
        });
        if (index >= 0) {
            newState.codes.splice(index, 1);
            delete newState.names[action.code];
        } else {
            newState.codes.push(action.code);
        }
        return newState;
    case ACTION_TYPES.INSERT_FAVOURITE_AT:
        codes = [...state.codes];
        currentIndex = codes.indexOf(action.code);
        if (currentIndex >= 0) {
            codes.splice(currentIndex, 1);
        }
        index = action.index;
        if (index >= 0) {
            codes.splice(index, 0, action.code);
        } else {
            codes.push(action.code);
        }
        return Object.assign({}, state, { codes });
    case ACTION_TYPES.QUANDL_RESPONSE:
        newState = Object.assign({}, state, {
            names: Object.assign({}, state.names, {
                [action.code]: action.name
            })
        });
        return newState;
    default:
        return state;
    }
}
