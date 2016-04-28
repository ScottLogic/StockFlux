import { combineReducers } from 'redux';

import { TOGGLE_COMPACT, TOGGLE_MAXIMISE, STATE_CLOSE } from '../actions/window.js';

import {
    CLEAR_SEARCH,
    SEARCH_CLICKED,
    SEARCH_INPUT,
    SEARCH_STARTED,
    SEARCH_FINISHED,
    SEARCH_ERROR,
    TOGGLE_FAVOURITE,
    FAV_CLICKED,
    UNSELECT,
    SELECTION
} from '../actions/sidebar.js';
import deepFreeze from 'deep-freeze';

function selection(state = {}, action) {
    switch (action.type) {
    case SELECTION:
        return Object.assign({}, state, {
            code: action.code,
            name: action.name,
        });
    case UNSELECT:
        return {};
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

function search(state = { term: '' }, action) {
    switch (action.type) {
    case SEARCH_INPUT:
        return Object.assign({}, state, {
            term: action.term
        });
    case SEARCH_STARTED:
        return Object.assign({}, state, {
            isSearching: true,
            term: action.term
        });
    case SEARCH_FINISHED:
        return state.term === action.term ? Object.assign({}, state, {
            isSearching: false,
            results: action.results
        }) : state;
    case SEARCH_ERROR:
        return Object.assign({}, state, {
            isSearching: false,
            hasErrors: true
        });
    case CLEAR_SEARCH:
        return {};
    default:
        return state;
    }
}

// state is an array of codes
function favourites(state = [], action) {
    let newState;
    let index;

    switch (action.type) {
    case TOGGLE_FAVOURITE:
        index = state.indexOf(action.code);
        newState = [...state];
        if (index >= 0) {
            newState.splice(index, 1);
        } else {
            newState.push(action.code);
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

// Wrap the reducer in dev to freeze the state and action
const checkImmutable = (reducer) => {

    if (process.env.NODE_ENV === 'production') {
        return reducer;
    }
    return (state, action) => reducer(state !== undefined ? deepFreeze(state) : state,
                                        action !== undefined ? deepFreeze(action) : action);
};


export default checkImmutable(rootReducer);
