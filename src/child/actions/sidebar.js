import { SIDEBAR as ACTION_TYPES } from '../constants/actionTypes.js';
import { search as quandlServiceSearch } from '../services/QuandlService.js';
import currentWindowService from '../services/currentWindowService';

export function searchInput(term) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.SEARCH_INPUT,
        term
    };
}

export function selectStock(code, name) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.SELECTION,
        code,
        name
    };
}

export function unselectStock() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.UNSELECT
    };
}

export function insertFavouriteAt(index, code) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.INSERT_FAVOURITE_AT,
        index,
        code
    };
}

export function toggleFavourite(code) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.TOGGLE_FAVOURITE,
        code
    };
}

export function selectSearch() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.SEARCH_CLICKED
    };
}

export function selectFavourites() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.FAV_CLICKED
    };
}

export function quandlResponse(code, name) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.QUANDL_RESPONSE,
        code,
        name
    };
}

function clearSearch() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.CLEAR_SEARCH
    };
}

function searchStarted(term) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.SEARCH_STARTED,
        term
    };
}

function searchFinished(term, results) {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
        type: ACTION_TYPES.SEARCH_FINISHED,
        term,
        results
    };
}

function searchError() {
    return {
        windowName: currentWindowService.getCurrentWindow().name,
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
