import { SIDEBAR as ACTION_TYPES } from '../constants/actionTypes.js';

import { search as quandlServiceSearch } from '../services/QuandlService.js';

export function searchInput(term) {
    return {
        type: ACTION_TYPES.SEARCH_INPUT,
        term
    };
}

export function selectStock(code, name) {
    return {
        type: ACTION_TYPES.SELECTION,
        code,
        name
    };
}

export function unselectStock() {
    return {
        type: ACTION_TYPES.UNSELECT
    };
}

export function insertFavouriteAt(index, code) {
    return {
        type: ACTION_TYPES.INSERT_FAVOURITE_AT,
        index,
        code
    };
}

export function toggleFavourite(code) {
    return {
        type: ACTION_TYPES.TOGGLE_FAVOURITE,
        code
    };
}

export function selectSearch() {
    return {
        type: ACTION_TYPES.SEARCH_CLICKED
    };
}

export function selectFavourites() {
    return {
        type: ACTION_TYPES.FAV_CLICKED
    };
}

export function quandlResponse(code, name) {
    return {
        type: ACTION_TYPES.QUANDL_RESPONSE,
        code,
        name
    };
}

function clearSearch() {
    return {
        type: ACTION_TYPES.CLEAR_SEARCH
    };
}

function searchStarted(term) {
    return {
        type: ACTION_TYPES.SEARCH_STARTED,
        term
    };
}

function searchFinished(term, results) {
    return {
        type: ACTION_TYPES.SEARCH_FINISHED,
        term,
        results
    };
}

function searchError() {
    return {
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
