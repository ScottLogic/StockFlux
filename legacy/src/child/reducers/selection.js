import { SELECTION as SELECTION_ACTION_TYPES, FAVOURITES as FAVOURITES_ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function selection(state = {}, action) {
    switch (action.type) {
    case SELECTION_ACTION_TYPES.SELECTION:
        return Object.assign({}, state, {
            code: action.code,
            name: action.name
        });
    case SELECTION_ACTION_TYPES.UNSELECT:
        return {};
    case FAVOURITES_ACTION_TYPES.QUANDL_RESPONSE:
        if (state.code === action.code) {
            return Object.assign({}, state, {
                name: action.name
            });
        }
        return state;
    default:
        return state;
    }
}
