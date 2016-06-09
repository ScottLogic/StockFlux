import { combineReducers } from 'redux';

import selection from './selection';
import sidebar from './sidebar';
import favourites from './favourites';
import search from './search';
import windowState from './windowState';

import devReducers from './reducers.dev';
import prodReducers from './reducers.prod';

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
        return prodReducers(reducer);
    }
    return devReducers(reducer);
};

export default checkImmutable(rootReducer);
