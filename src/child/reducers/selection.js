import { SELECTION as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function selection(state = {}, action) {
    switch (action.type) {
    case ACTION_TYPES.SELECTION:
        return Object.assign({}, state, {
            code: action.code,
            name: action.name,
        });
    case ACTION_TYPES.UNSELECT:
        return {};
    default:
        return state;
    }
}
