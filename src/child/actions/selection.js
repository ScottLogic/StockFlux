import { SELECTION as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const selectStock = createActionCreator((code, name) => ({
    type: ACTION_TYPES.SELECTION,
    code,
    name
}));

export const unselectStock = createActionCreator(() => ({
    type: ACTION_TYPES.UNSELECT
}));
