import { combineReducers } from 'redux';

import { TOGGLE_COMPACT, TOGGLE_MAXIMISE, STATE_CLOSE } from '../actions/window.js';

import {
    CLEAR_SEARCH,
    SEARCH_STARTED,
    SEARCH_CLICKED,
    SEARCH_FINISHED,
    SEARCH_ERROR,
    TOGGLE_FAVOURITE,
    FAV_CLICKED,
    SELECTION
} from '../actions/sidebar.js';


function selection(state = {}, action) {
    switch (action.type) {
    case SELECTION:
        return Object.assign({}, state, {
            code: action.code,
            name: action.name,
        });
    default:
        return state;
    }
}

function sidebar(state = { showSeach: true }, action) {
    switch (action.type) {
    case FAV_CLICKED:
        return {
            showFavourites: true
        };
    case SEARCH_CLICKED:
        return {
            showSeach: true
        };
    default:
        return state;
    }
}

function getIndexOfValue(code, arr = []) {
    return arr.findIndex(res => res.code === code);
}

function search(state = { term: '' }, action) {
    switch (action.type) {
    case SEARCH_STARTED:
        return Object.assign({}, state, {
            isSearching: true,
            term: action.term
        });
    case SEARCH_FINISHED:
        // TODO: go through favs and toggle "favourite" flag as needed
        return Object.assign({}, state, {
            isSearching: false,
            results: action.results
        });
    case SEARCH_ERROR:
        return Object.assign({}, state, {
            isSearching: false,
            hasErrors: true
        });
    case CLEAR_SEARCH:
        return {};
    case TOGGLE_FAVOURITE: {
        const results = [...state.results];
        const indexOfValue = getIndexOfValue(action.code, state.results);
        if (indexOfValue >= 0) {
            results[indexOfValue] = Object.assign({}, results[indexOfValue], {
                favourite: !results[indexOfValue].favourite
            });
        }
        return Object.assign({}, state, {
            results
        });
    }
    default:
        return state;
    }
}

function favourites(state = [], action) {
    switch (action.type) {
    case SEARCH_FINISHED:
        // TODO update state
        return state;
    case TOGGLE_FAVOURITE: // eslint-disable-line no-case-declarations
        const found = getIndexOfValue(action.code, state);
        let newState;
        if (found < 0) {
            newState = [...state, Object.assign({}, action.data, {
                favourite: true
            })];
        } else {
            newState = [...state];
            newState.splice(found, 1);
        }
        return newState;
    default:
        return state;
    }
}

function windowState(state = {
    isCompact: false,
    isMaximised: false
}, action) {
    switch (action.type) {
    case TOGGLE_COMPACT:
        return Object.assign({}, state, {
            isCompact: action.state
        });
    case TOGGLE_MAXIMISE:
        return Object.assign({}, state, {
            isMaximised: action.state
        });
    case STATE_CLOSE:
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    selection,
    sidebar,
    favourites,
    search,
    windowState
});

export default rootReducer;
