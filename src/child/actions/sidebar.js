export const SEARCH_CLICKED = 'SEARCH_CLICKED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const SEARCH_ERROR = 'SEARCH_ERROR';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SEARCH_FINISHED = 'SEARCH_FINISHED';
export const FAV_CLICKED = 'FAV_CLICKED';
export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE';
export const SELECTION = 'SELECTION';
export const UNSELECT = 'UNSELECT';

import QuandlService from '../services/QuandlService.js';
const quandlService = new QuandlService();

export function selectStock(code, name) {
    return {
        code,
        name,
        type: SELECTION
    };
}

export function unselectStock() {
    return {
        type: UNSELECT
    };
}

export function toggleFavourite(code) {
    return {
        code,
        type: TOGGLE_FAVOURITE
    };
}

export function clearSearch() {
    return {
        type: CLEAR_SEARCH
    };
}

function searchStarted(term) {
    return {
        type: SEARCH_STARTED,
        term
    };
}

export function searchFinished(term, results) {
    return {
        type: SEARCH_FINISHED,
        term,
        results
    };
}
export function searchError() {
    return {
        type: SEARCH_ERROR
    };
}

export function selectSearch() {
    return {
        type: SEARCH_CLICKED
    };
}

export function selectFavourites() {
    return {
        type: FAV_CLICKED
    };
}

export function search(term) {
    return dispatch => {
        if (term.trim() === '') {
            dispatch(searchFinished(term, []));
        } else {
            dispatch(searchStarted(term));
            quandlService.search(term,
                results => dispatch(searchFinished(term, results)),
                () => dispatch(searchError())
            );
        }
    };
}
