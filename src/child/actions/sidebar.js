import { SIDEBAR as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const selectSearch = createActionCreator(() => ({
    type: ACTION_TYPES.SEARCH_CLICKED
}));

export const selectFavourites = createActionCreator(() => ({
    type: ACTION_TYPES.FAV_CLICKED
}));
