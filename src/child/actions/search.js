import { SEARCH as ACTION_TYPES } from '../../shared/constants/actionTypes';
import { search as quandlServiceSearch } from '../services/QuandlService';
import createActionCreator from '../utils/createActionCreator';

export const searchInput = createActionCreator((term) => ({
    type: ACTION_TYPES.SEARCH_INPUT,
    term
}));

const clearSearch = createActionCreator(() => ({
    type: ACTION_TYPES.CLEAR_SEARCH
}));

const searchStarted = createActionCreator((term) => ({
    type: ACTION_TYPES.SEARCH_STARTED,
    term,
    analyticsEvent: {
        category: 'Search',
        action: term
    }
}));

const searchFinished = createActionCreator((term, results) => ({
    type: ACTION_TYPES.SEARCH_FINISHED,
    term,
    results
}));

const searchError = createActionCreator(() => ({
    type: ACTION_TYPES.SEARCH_ERROR
}));

export function search(term) {
    return (dispatch) => {
        if (term.trim() === '') {
            return Promise.resolve(dispatch(clearSearch()));
        }
        dispatch(searchStarted(term));
        return quandlServiceSearch(term)
            .then((results) => dispatch(searchFinished(term, results)))
            .catch(() => dispatch(searchError()));
    };
}
