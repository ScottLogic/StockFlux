import { combineReducers } from 'redux';

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
        return require('./reducers.prod').default(reducer);     // eslint-disable-line global-require
    }
    return require('./reducers.dev').default(reducer);          // eslint-disable-line global-require
};

export default checkImmutable(rootReducer);
