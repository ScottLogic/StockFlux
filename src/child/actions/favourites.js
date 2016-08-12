import { FAVOURITES as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const insertFavouriteAt = createActionCreator((index, code) => ({
    type: ACTION_TYPES.INSERT_FAVOURITE_AT,
    index,
    code
}));

export const toggleFavourite = createActionCreator((code) => ({
    type: ACTION_TYPES.TOGGLE_FAVOURITE,
    code
}));

export const quandlResponse = createActionCreator((code, name) => ({
    type: ACTION_TYPES.QUANDL_RESPONSE,
    code,
    name
}));
