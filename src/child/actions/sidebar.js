import { SIDEBAR as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const selectSearch = createActionCreator(() => ({
    type: ACTION_TYPES.SEARCH_CLICKED,
    analyticsEvent: {
        category: 'Show',
        action: 'Search'
    }
}));

export const selectFavourites = createActionCreator(() => ({
    type: ACTION_TYPES.FAV_CLICKED,
    analyticsEvent: {
        category: 'Show',
        action: 'Favourites'
    }
}));
