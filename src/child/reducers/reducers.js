import { combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

import selection from './selection';
import sidebar from './sidebar';
import favourites from './favourites';
import search from './search';
import windowState from './windowState';

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
    return (state, action) => reducer(
        state !== undefined ? deepFreeze(state) : state,
        action !== undefined ? deepFreeze(action) : action
    );
};

export default checkImmutable(rootReducer);
