import { SEARCH as ACTION_TYPES } from '../../shared/constants/actionTypes';
import { search as quandlServiceSearch } from '../services/QuandlService.js';
import currentWindowService from '../services/currentWindowService';

export function searchInput(term) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SEARCH_INPUT,
        term
    };
}

function clearSearch() {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.CLEAR_SEARCH
    };
}

function searchStarted(term) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SEARCH_STARTED,
        term
    };
}

function searchFinished(term, results) {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SEARCH_FINISHED,
        term,
        results
    };
}

function searchError() {
    return {
        windowName: currentWindowService.getCurrentWindowName(),
        type: ACTION_TYPES.SEARCH_ERROR
    };
}

export function search(term) {
    return dispatch => {
        if (term.trim() === '') {
            return Promise.resolve(dispatch(clearSearch()));
        }
        dispatch(searchStarted(term));
        return quandlServiceSearch(term)
            .then(results => dispatch(searchFinished(term, results)))
            .catch(() => dispatch(searchError()));
    };
}
