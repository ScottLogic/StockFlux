import { SEARCH as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function search(state = { term: '' }, action) {
    switch (action.type) {
    case ACTION_TYPES.SEARCH_INPUT:
        return Object.assign({}, state, {
            term: action.term
        });
    case ACTION_TYPES.SEARCH_STARTED:
        return Object.assign({}, state, {
            isSearching: true,
            term: action.term
        });
    case ACTION_TYPES.SEARCH_FINISHED:
        return state.term === action.term ? Object.assign({}, state, {
            isSearching: false,
            results: action.results
        }) : state;
    case ACTION_TYPES.SEARCH_ERROR:
        return Object.assign({}, state, {
            isSearching: false,
            hasErrors: true
        });
    case ACTION_TYPES.CLEAR_SEARCH:
        return { term: '' };
    default:
        return state;
    }
}
