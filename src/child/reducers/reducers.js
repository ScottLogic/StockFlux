import { combineReducers } from 'redux';

import ACTION_TYPES from '../constants/actionTypes.js';
import deepFreeze from 'deep-freeze';

function selection(state = {}, action) {
    switch (action.type) {
    case ACTION_TYPES.SIDEBAR.SELECTION:
        return Object.assign({}, state, {
            code: action.code,
            name: action.name,
        });
    case ACTION_TYPES.SIDEBAR.UNSELECT:
        return {};
    default:
        return state;
    }
}

function sidebar(state = { showSearch: true }, action) {
    switch (action.type) {
    case ACTION_TYPES.SIDEBAR.FAV_CLICKED:
        return {
            showFavourites: true
        };
    case ACTION_TYPES.SIDEBAR.SEARCH_CLICKED:
        return {
            showSearch: true
        };
    default:
        return state;
    }
}

function search(state = { term: '' }, action) {
    switch (action.type) {
    case ACTION_TYPES.SIDEBAR.SEARCH_INPUT:
        return Object.assign({}, state, {
            term: action.term
        });
    case ACTION_TYPES.SIDEBAR.SEARCH_STARTED:
        return Object.assign({}, state, {
            isSearching: true,
            term: action.term
        });
    case ACTION_TYPES.SIDEBAR.SEARCH_FINISHED:
        return state.term === action.term ? Object.assign({}, state, {
            isSearching: false,
            results: action.results
        }) : state;
    case ACTION_TYPES.SIDEBAR.SEARCH_ERROR:
        return Object.assign({}, state, {
            isSearching: false,
            hasErrors: true
        });
    case ACTION_TYPES.SIDEBAR.CLEAR_SEARCH:
        return {};
    default:
        return state;
    }
}

// state is an array of codes
function favourites(state = { codes: [], move: {} }, action) {
    let codes;
    let index;
    let currentIndex;

    switch (action.type) {
    case ACTION_TYPES.SIDEBAR.TOGGLE_FAVOURITE:
        codes = [...state.codes];
        index = codes.indexOf(action.code);
        if (index >= 0) {
            codes.splice(index, 1);
        } else {
            codes.push(action.code);
        }
        return Object.assign({}, state, { codes });
    case ACTION_TYPES.SIDEBAR.INSERT_FAVOURITE_AT:
        codes = [...state.codes];
        currentIndex = codes.indexOf(action.code);
        if (currentIndex >= 0) {
            codes.splice(currentIndex, 1);
        }
        index = action.index;
        if (index >= 0) {
            codes.splice(index, 0, action.code);
        } else {
            codes.push(action.code);
        }
        return Object.assign({}, state, { codes, move: {} });
    default:
        return state;
    }
}

function windowState(state = {
    isCompact: false,
    isMaximised: false
}, action) {
    switch (action.type) {
    case ACTION_TYPES.WINDOW.TOGGLE_COMPACT:
        return Object.assign({}, state, {
            isCompact: action.state
        });
    case ACTION_TYPES.WINDOW.MAXIMIZE:
        return Object.assign({}, state, {
            isMaximised: true
        });
    case ACTION_TYPES.WINDOW.RESTORE:
        return Object.assign({}, state, {
            isMaximised: false
        });
    case ACTION_TYPES.WINDOW.CLOSE:
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

// Wrap the reducer in dev to freeze the state and action
const checkImmutable = (reducer) => {

    if (process.env.NODE_ENV === 'production') {
        return reducer;
    }
    return (state, action) => reducer(state !== undefined ? deepFreeze(state) : state,
                                        action !== undefined ? deepFreeze(action) : action);
};


export default checkImmutable(rootReducer);
