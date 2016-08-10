import { combineReducers } from 'redux';

import selection from './selection';
import sidebar from './sidebar';
import favourites from './favourites';
import search from './search';
import windowState from './windowState';

export default combineReducers({
    selection,
    sidebar,
    favourites,
    search,
    windowState
});
