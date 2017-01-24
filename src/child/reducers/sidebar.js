import { SIDEBAR as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function sidebar(state = { showSearch: true }, action) {
    switch (action.type) {
    case ACTION_TYPES.FAV_CLICKED:
        return {
            showFavourites: true
        };
    case ACTION_TYPES.SEARCH_CLICKED:
        return {
            showSearch: true
        };
    default:
        return state;
    }
}
